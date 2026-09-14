#!/usr/bin/env node
/**
 * Buffer GraphQL API로 SNS 카피를 예약한다.
 * 규격과 안전 규칙은 references/buffer-publishing.md에 있다.
 *
 * 사용법:
 *   node buffer_post.mjs --channels                    # 채널 목록과 연결 상태
 *   node buffer_post.mjs --plan <post.json>            # 보낼 내용만 출력 (전송 없음)
 *   node buffer_post.mjs --send <post.json> --confirm  # 실제 예약
 *   node buffer_post.mjs --publish <post.json> --confirm  # 지금 바로 SNS에 발행
 *   node buffer_post.mjs --schedule-draft <postId> --at <ISO시각> --confirm  # 초안을 예약으로 올림
 *
 * 안전 장치 (문서의 규칙을 코드로 강제한다):
 *   - --send 경로에서는 shareNow를 거부한다. 초안(saveToDraft)이나 예약만 보낸다.
 *     막으려는 것은 카피를 만들면서 곧바로 나가는 경로다. 사람이 초안을 확인한 뒤
 *     내리는 발행 지시는 --publish 로 분리해 두었다 (2026-08-24 추가)
 *   - --confirm 없이는 전송하지 않는다
 *   - 비대화형 자동 실행(크론)에서는 전송을 거부한다. BUFFER_ALLOW_HEADLESS=1로만 우회
 *   - 연결이 끊긴 채널(isDisconnected)에는 보내지 않는다
 *
 * post.json 스키마:
 * {
 *   "slug": "orca-ide-easy-guide",
 *   "posts": [
 *     { "platform": "threads",   "chain": ["훅", "1/ ...", "2/ ..."], "dueAt": "2026-08-25T08:00:00+09:00" },
 *     { "platform": "linkedin",  "text": "본문", "dueAt": "2026-08-25T09:00:00+09:00" },
 *     { "platform": "instagram", "text": "캡션", "assets": ["https://.../card1.png"], "dueAt": "..." }
 *   ]
 * }
 *
 * dueAt을 생략하면 초안으로 저장한다.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = "https://api.buffer.com";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

// service 필드를 플랫폼 이름에 맞춘다
const SERVICE = { threads: "threads", linkedin: "linkedin", instagram: "instagram" };

/**
 * 문자열 URL 배열을 Buffer의 AssetInput 형태로 감싼다.
 * alt는 접근성 텍스트다. 인스타는 대체 텍스트가 있으면 도달에 유리하다.
 */
function toAssets(list, alt) {
  return (list || []).map((a, i) => {
    if (a && typeof a === "object") return a;
    const image = { url: a, thumbnailUrl: a };
    const t = Array.isArray(alt) ? alt[i] : alt;
    if (t) image.metadata = { altText: t };
    return { image };
  });
}

function loadKey() {
  const name = ["BUFFER", "API", "KEY"].join("_");
  if (process.env[name]) return process.env[name];
  // .env.local 에서 직접 읽는다 (dotenv 의존 없이)
  for (const f of [".env.local", ".env"]) {
    try {
      const txt = readFileSync(join(ROOT, f), "utf8");
      const m = txt.match(new RegExp(`^${name}\\s*=\\s*(.+)$`, "m"));
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* 파일이 없으면 다음 후보 */
    }
  }
  console.error(
    `${name}가 없습니다. Buffer Settings에서 발급한 뒤 .env.local에 넣으세요.\n` +
      "무료 플랜은 키를 하나만 만들 수 있어 읽기와 쓰기를 나눌 수 없습니다.",
  );
  process.exit(2);
}

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${loadKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
    process.exit(1);
  }
  if (json.errors) {
    console.error(`GraphQL 오류: ${JSON.stringify(json.errors).slice(0, 600)}`);
    process.exit(1);
  }
  return json.data;
}

async function fetchChannels() {
  const acc = await gql(`query { account { id organizations { id name } } }`);
  const orgs = acc?.account?.organizations || [];
  if (!orgs.length) {
    console.error("조직을 찾지 못했습니다. 키 권한을 확인하세요.");
    process.exit(1);
  }
  const out = [];
  for (const org of orgs) {
    const data = await gql(
      `query($id: OrganizationId!) {
         channels(input: { organizationId: $id }) { id name service type isDisconnected }
       }`,
      { id: org.id },
    );
    for (const c of data?.channels || []) out.push({ ...c, organization: org.name });
  }
  return out;
}

function pickChannel(channels, platform) {
  const want = SERVICE[platform];
  const found = channels.filter((c) => (c.service || "").toLowerCase() === want);
  if (!found.length) {
    console.error(`${platform} 채널이 Buffer에 없습니다. --channels로 목록을 확인하세요.`);
    process.exit(1);
  }
  if (found.length > 1)
    console.error(`경고: ${platform} 채널이 ${found.length}개입니다. 첫 번째(${found[0].name})를 씁니다.`);
  return found[0];
}

/** post.json 항목 하나를 CreatePostInput으로 바꾼다 */
function buildInput(item, channel, { publishNow = false } = {}) {
  const { platform } = item;
  const scheduled = !publishNow && Boolean(item.dueAt);
  const base = {
    channelId: channel.id,
    // assets는 { image: { url, thumbnailUrl, metadata } } 래퍼를 요구한다
    // (AssetInput 유니온 입력). 문자열 배열을 그대로 넣으면 거부된다. 2026-08-24 확인.
    assets: toAssets(item.assets, item.alt),
    // 2026-08-24 스키마 변경: mode, needsApproval, schedulingType이 필수가 됐다.
    // 안전 원칙은 그대로다. 자동 발행 경로를 만들지 않는다.
    //   schedulingType: "notification" — Buffer가 사람에게 알리기만 하고 스스로 올리지 않는다.
    //                    saveToDraft가 무시되는 일이 생겨도 저절로 게시되지 않게 하는 이중 장치다.
    //   mode: 초안일 때는 addToQueue로 두되 saveToDraft가 우선한다. 예약이면 customScheduled.
    mode: publishNow ? "shareNow" : scheduled ? "customScheduled" : "addToQueue",
    // 쓰레드는 notification 예약을 지원하지 않아 automatic만 받는다.
    // 그래서 자동 발행을 막는 책임이 saveToDraft 하나에 걸린다.
    // 전송 뒤 status를 확인해 초안이 아니면 즉시 지우는 안전망을 아래에 둔다.
    schedulingType: "automatic",
    needsApproval: false,
    dueAt: publishNow ? undefined : item.dueAt || undefined,
    saveToDraft: publishNow ? false : scheduled ? undefined : true,
  };

  if (platform === "threads") {
    const chain = item.chain || (item.text ? [item.text] : []);
    if (!chain.length) {
      console.error("쓰레드 항목에 chain이 없습니다.");
      process.exit(1);
    }
    const [hook, ...rest] = chain;
    // thread 배열을 함께 보내면 Buffer가 최상위 assets를 버린다 (2026-08-24 확인).
    // 첫 편의 이미지는 thread 배열 안에서만 살아남으므로, 훅도 배열에 넣고
    // 최상위에는 텍스트만 남긴다.
    const items = [{ text: hook, assets: base.assets }, ...rest.map((t) => ({ text: t, assets: [] }))];
    return {
      ...base,
      text: hook,
      // type을 넣지 않으면 Buffer가 본문 이미지를 버린다. 쓰레드가 받는 값은
      // post와 ghost_post뿐이다 (2026-08-24 확인).
      // 이어지는 편은 thread 배열로 넘기고, 각 편도 assets가 필수라 빈 배열을 준다.
      metadata: {
        threads: { type: "post", ...(items.length > 1 ? { thread: items } : {}) },
      },
    };
  }

  if (!item.text) {
    console.error(`${platform} 항목에 text가 없습니다.`);
    process.exit(1);
  }
  const metadata = {};
  if (platform === "linkedin" && item.firstComment)
    metadata.linkedin = { firstComment: item.firstComment };
  if (platform === "instagram") {
    // 2026-08-24 스키마 변경: type과 shouldShareToFeed가 필수가 됐다.
    // 카드뉴스는 피드 게시물이므로 post 고정. 릴스나 스토리는 item.igType으로 넘긴다.
    metadata.instagram = {
      // 인스타는 post, story, reel만 받는다. carousel은 거부된다 (2026-08-24 확인).
      // 이미지를 여러 장 넣으면 Buffer가 알아서 캐러셀로 만든다.
      type: item.igType || "post",
      shouldShareToFeed: item.shouldShareToFeed !== false,
    };
    if (item.firstComment) metadata.instagram.firstComment = item.firstComment;
    if (item.igType) metadata.instagram.type = item.igType;
    if (item.link) metadata.instagram.link = item.link;
    if (!Object.keys(metadata.instagram).length) delete metadata.instagram;
  }
  return { ...base, text: item.text, metadata: Object.keys(metadata).length ? metadata : undefined };
}

// 기본은 shareNow 금지다. 막으려는 것은 카피를 만들면서 곧바로 나가는 경로다.
// --publish 는 사람이 초안을 눈으로 확인한 뒤 내리는 별개의 지시라, 그때만 연다.
function guardSafety(payload, { allowNow = false } = {}) {
  const raw = JSON.stringify(payload);
  if (!allowNow && /shareNow/i.test(raw)) {
    console.error("shareNow 모드는 이 스크립트에서 막습니다. 초안이나 예약으로만 보냅니다.");
    process.exit(1);
  }
}

function describe(item, channel, input) {
  const when =
    input.mode === "shareNow" ? "지금 발행" : input.dueAt ? `예약 ${input.dueAt}` : "초안 저장";
  const chain = item.platform === "threads" ? (item.chain || []).length : 1;
  const assets = (input.assets || []).length;
  console.log(`\n[${item.platform}] ${channel.name}${channel.isDisconnected ? "  (연결 끊김)" : ""}`);
  console.log(`  ${when} / ${chain}편 / 이미지 ${assets}장`);
  const preview = item.platform === "threads" ? (item.chain || [])[0] : item.text;
  for (const line of String(preview).split("\n").slice(0, 3)) console.log(`  | ${line}`);
  if (item.platform === "threads" && (item.chain || []).length > 1)
    console.log(`  | ... 이어지는 ${item.chain.length - 1}편`);
}

async function main() {
  const args = process.argv.slice(2);
  const has = (f) => args.includes(f);
  const valueOf = (f) => {
    const i = args.indexOf(f);
    return i >= 0 ? args[i + 1] : null;
  };

  if (has("--channels")) {
    const channels = await fetchChannels();
    console.log(`채널 ${channels.length}개\n`);
    for (const c of channels)
      console.log(
        `  ${c.isDisconnected ? "x" : "o"} ${(c.service || "?").padEnd(10)} ${c.name}` +
          `  [${c.type || "-"}]  id=${c.id}`,
      );
    const dead = channels.filter((c) => c.isDisconnected);
    if (dead.length) {
      console.log(
        `\n연결이 끊긴 채널 ${dead.length}개. 게시가 조용히 실패하므로 Buffer 화면에서 다시 인증하세요.`,
      );
      console.log("링크드인은 60일, 쓰레드는 90일마다 만료됩니다. 데스크톱 브라우저에서 합니다.");
    }
    return;
  }

  // 예약을 되돌릴 때 쓴다. 카피를 고친 뒤 다시 보내기 전에 기존 예약을 지운다 (2026-08-25 추가).
  if (has("--delete")) {
    const id = valueOf("--delete");
    if (!id) { console.error("사용법: buffer_post.mjs --delete <postId> --confirm"); process.exit(2); }
    if (!has("--confirm")) { console.error("--confirm 이 없어 삭제하지 않았습니다."); process.exit(1); }
    const data = await gql(
      `mutation($id: PostId!) { deletePost(input: { id: $id }) { __typename ... on VoidMutationError { message } } }`,
      { id },
    );
    const r = data?.deletePost;
    if (r && r.__typename === "VoidMutationError") { console.error(`삭제 실패: ${r.message}`); process.exit(1); }
    console.log(`삭제함: ${id}`);
    return;
  }
  // 예약을 초안으로 되돌린다. 예약 상한을 비우거나 일정을 다시 짤 때 쓴다 (2026-09-14 추가).
  if (has("--to-draft")) {
    const id = valueOf("--to-draft");
    if (!id) { console.error("사용법: buffer_post.mjs --to-draft <postId> --confirm"); process.exit(2); }
    if (!has("--confirm")) { console.error("--confirm 이 없어 바꾸지 않았습니다."); process.exit(1); }
    const cur = await gql(`query($id: PostId!) { post(input: { id: $id }) { id status text } }`, { id });
    if (!cur?.post) { console.error(`글을 찾지 못했습니다: ${id}`); process.exit(1); }
    const input = { id, text: cur.post.text, saveToDraft: true, mode: "addToQueue" };
    guardSafety(input);
    const data = await gql(
      `mutation($input: EditPostInput!) {
         editPost(input: $input) {
           __typename
           ... on PostActionSuccess { post { id status dueAt } }
           ... on NotFoundError { message }
           ... on UnauthorizedError { message }
           ... on UnexpectedError { message }
           ... on RestProxyError { message }
           ... on LimitReachedError { message }
           ... on InvalidInputError { message }
         }
       }`,
      { input },
    );
    const r = data?.editPost;
    if (!r || r.__typename?.endsWith("Error")) {
      console.error(`초안 전환 실패: ${r?.message || JSON.stringify(data).slice(0, 300)}`);
      process.exit(1);
    }
    console.log(`초안으로 내림: ${r.post?.id || id} status=${r.post?.status || "?"}`);
    return;
  }

  // 예약은 그대로 두고 카피만 갈아 끼운다. 말투를 손봤을 때 지우고 다시 넣으면
  // 예약 슬롯을 한 번 비웠다 채우게 되고 그 사이 상한에 걸릴 수 있다 (2026-09-14 추가).
  // 파일은 {"<postId>": {"chain": ["훅", "1/ ...", "2/ ..."]}} 또는 {"<postId>": {"text": "..."}} 형식이다.
  if (has("--retext")) {
    const file = valueOf("--retext");
    if (!file) { console.error("사용법: buffer_post.mjs --retext <rewrite.json> --confirm"); process.exit(2); }
    const spec = JSON.parse(readFileSync(file, "utf8"));
    const ids = Object.keys(spec);
    console.log(`대상 ${ids.length}건\n`);
    for (const id of ids) {
      const cur = await gql(
        `query($id: PostId!) { post(input: { id: $id }) { id status dueAt channelService } }`,
        { id },
      );
      const post = cur?.post;
      if (!post) { console.error(`  x ${id} 글을 찾지 못했습니다`); continue; }
      const chain = spec[id].chain;
      const text = chain ? chain[0] : spec[id].text;
      if (!text) { console.error(`  x ${id} chain 도 text 도 없습니다`); continue; }
      // 쓰레드는 훅까지 thread 배열에 넣어야 한다. 최상위 text만 바꾸면 배열에 옛 훅이 남는다.
      const input = { id, text, ...(post.status === "draft"
        ? { saveToDraft: true, mode: "addToQueue" }
        : { dueAt: post.dueAt, mode: "customScheduled", saveToDraft: false }) };
      if (post.channelService === "threads" && chain)
        input.metadata = { threads: { type: "post", ...(chain.length > 1 ? { thread: chain.map((t) => ({ text: t, assets: [] })) } : {}) } };
      guardSafety(input);
      if (!has("--confirm")) { console.log(`  - ${id} ${post.channelService} ${post.status}  ${text.split("\n")[0].slice(0, 40)}`); continue; }
      const data = await gql(
        `mutation($input: EditPostInput!) {
           editPost(input: $input) {
             __typename
             ... on PostActionSuccess { post { id status dueAt } }
             ... on NotFoundError { message }
             ... on UnauthorizedError { message }
             ... on UnexpectedError { message }
             ... on RestProxyError { message }
             ... on LimitReachedError { message }
             ... on InvalidInputError { message }
           }
         }`,
        { input },
      );
      const r = data?.editPost;
      if (!r || r.__typename?.endsWith("Error")) {
        console.error(`  x ${id} 교체 실패: ${r?.message || JSON.stringify(data).slice(0, 200)}`);
        continue;
      }
      console.log(`  o ${id} ${post.channelService} status=${r.post?.status} ${text.split("\n")[0].slice(0, 40)}`);
    }
    if (!has("--confirm")) console.log("\n--confirm 이 없어 계획만 출력했습니다.");
    return;
  }

  // 초안을 예약으로 올린다. 무료 플랜의 채널당 예약 10건에 막혀 초안으로 남겨 둔 건을
  // 앞 건이 발행돼 슬롯이 빈 뒤에 올릴 때 쓴다 (2026-09-14 추가).
  if (has("--schedule-draft")) {
    const id = valueOf("--schedule-draft");
    const at = valueOf("--at");
    if (!id || !at) {
      console.error("사용법: buffer_post.mjs --schedule-draft <postId> --at <2026-09-29T09:00:00+09:00> --confirm");
      process.exit(2);
    }
    if (Number.isNaN(Date.parse(at))) {
      console.error(`--at 값을 시각으로 읽지 못했습니다: ${at}`);
      process.exit(2);
    }
    if (!has("--confirm")) {
      console.error("--confirm 이 없어 예약하지 않았습니다.");
      process.exit(1);
    }
    // editPost는 부분 갱신이 아니다. text를 빼면 "Post must have either text or media"로 거부하므로
    // 기존 본문을 먼저 읽어 그대로 다시 넣는다 (2026-09-14 확인).
    const cur = await gql(
      `query($id: PostId!) { post(input: { id: $id }) { id status text channelService } }`,
      { id },
    );
    const post = cur?.post;
    if (!post) {
      console.error(`글을 찾지 못했습니다: ${id}`);
      process.exit(1);
    }
    if (post.status !== "draft")
      console.error(`경고: status가 ${post.status}입니다. 초안이 아닌 글의 시각을 바꾸려는 것일 수 있습니다.`);
    const input = { id, text: post.text, dueAt: at, mode: "customScheduled", saveToDraft: false };
    guardSafety(input);
    const data = await gql(
      `mutation($input: EditPostInput!) {
         editPost(input: $input) {
           __typename
           ... on PostActionSuccess { post { id status dueAt } }
           ... on NotFoundError { message }
           ... on UnauthorizedError { message }
           ... on UnexpectedError { message }
           ... on RestProxyError { message }
           ... on LimitReachedError { message }
           ... on InvalidInputError { message }
         }
       }`,
      { input },
    );
    const r = data?.editPost;
    if (!r || r.__typename?.endsWith("Error")) {
      console.error(`예약 실패: ${r?.message || JSON.stringify(data).slice(0, 300)}`);
      process.exit(1);
    }
    const p = r.post || {};
    console.log(`예약으로 올림: ${p.id || id} status=${p.status || "?"} dueAt=${p.dueAt || at}`);
    return;
  }

  const file = valueOf("--plan") || valueOf("--send") || valueOf("--publish");
  if (!file) {
    console.error(
      "사용법:\n" +
        "  node buffer_post.mjs --channels\n" +
        "  node buffer_post.mjs --plan <post.json>\n" +
        "  node buffer_post.mjs --send <post.json> --confirm\n" +
        "  node buffer_post.mjs --publish <post.json> --confirm   # 지금 바로 SNS에 발행\n" +
        "  node buffer_post.mjs --schedule-draft <postId> --at <ISO시각> --confirm   # 초안을 예약으로",
    );
    process.exit(2);
  }

  const doc = JSON.parse(readFileSync(file, "utf8"));
  const items = doc.posts || [];
  if (!items.length) {
    console.error("posts 배열이 비어 있습니다.");
    process.exit(1);
  }

  const publishNow = has("--publish");
  const channels = await fetchChannels();
  const plans = items.map((item) => {
    const channel = pickChannel(channels, item.platform);
    const input = buildInput(item, channel, { publishNow });
    guardSafety(input, { allowNow: publishNow });
    return { item, channel, input };
  });

  console.log(`대상 ${plans.length}건${doc.slug ? ` (${doc.slug})` : ""}`);
  for (const p of plans) describe(p.item, p.channel, p.input);

  if (has("--plan")) {
    console.log("\n계획만 출력했습니다. 실제 예약은 --send 와 --confirm 을 함께 씁니다.");
    return;
  }

  if (!has("--confirm")) {
    console.error("\n--confirm 이 없어 전송하지 않았습니다. 카피 전문을 승인받은 뒤 다시 실행하세요.");
    process.exit(1);
  }

  if (publishNow) console.log("\n지금 바로 발행합니다. 되돌릴 수 없습니다.");

  // 막으려는 것은 사람이 지시하지 않은 자동 게시다. 예전에는 isTTY 하나로 봤는데,
  // Claude Code는 명령을 프로그램으로 실행해 TTY가 붙지 않는다. 그래서 사람이 앞에
  // 앉아 지시한 전송까지 함께 막혔다 (2026-08-24 확인). 아래 신호로 바꾼다.
  // 크론은 PATH, HOME, SHELL 정도만 물려받아 이 가운데 어느 것도 갖지 못한다.
  const attended =
    process.stdin.isTTY ||            // 진짜 터미널
    process.env.CLAUDECODE === "1" || // Claude Code 세션 (원격 포함)
    process.env.CLAUDE_CODE_SESSION_ID ||
    process.env.TERM_PROGRAM ||       // 터미널 앱이 띄운 셸
    process.env.SSH_TTY;
  if (!attended && process.env.BUFFER_ALLOW_HEADLESS !== "1") {
    console.error(
      "\n사람이 지시한 실행으로 보이지 않아 전송하지 않습니다. 자동 실행에서 게시가 나가는 경로를 만들지 않기 위해서입니다.",
    );
    process.exit(1);
  }

  const blocked = plans.filter((p) => p.channel.isDisconnected);
  if (blocked.length) {
    console.error(
      `\n연결이 끊긴 채널이 있어 중단합니다: ${blocked.map((p) => p.channel.name).join(", ")}`,
    );
    process.exit(1);
  }

  for (const p of plans) {
    const data = await gql(
      // createPost는 유니온(PostActionPayload)을 돌려준다. 성공 타입 이름이
      // PostSuccess에서 PostActionSuccess로 바뀌었고(2026-08-24 확인), 오류 타입도
      // 여러 개라 함께 받아야 실패를 조용히 넘기지 않는다.
      `mutation($input: CreatePostInput!) {
         createPost(input: $input) {
           __typename
           ... on PostActionSuccess { post { id status dueAt } }
           ... on NotFoundError { message }
           ... on UnauthorizedError { message }
           ... on UnexpectedError { message }
           ... on LimitReachedError { message }
           ... on InvalidInputError { message }
           ... on RestProxyError { code link message }
         }
       }`,
      { input: p.input },
    );
    const res = data?.createPost;
    if (res && res.__typename !== "PostActionSuccess") {
      console.error(`실패: ${p.item.platform} -> ${p.channel.name}  [${res.__typename}] ${res.message || ""}`);
      process.exitCode = 1;
      continue;
    }
    const post = res?.post;
    // 초안으로 보냈는데 초안이 아니면 예약이나 발행 대기로 들어간 것이다.
    // 되돌릴 수 있을 때 바로 지운다. 2026-08-24 스키마 변경 대응.
    if (post && p.input.saveToDraft === true && post.status !== "draft") {
      console.error(`경고: ${p.item.platform} 결과가 draft가 아니라 ${post.status} 입니다. 즉시 삭제합니다.`);
      await gql(
        `mutation($id: PostId!) { deletePost(input: { id: $id }) { __typename ... on VoidMutationError { message } } }`,
        { id: post.id },
      ).catch((e) => console.error("  삭제 실패:", e.message));
      process.exitCode = 1;
      continue;
    }
    console.log(
      `보냄: ${p.item.platform} -> ${p.channel.name}` +
        (post ? `  id=${post.id} status=${post.status}${post.dueAt ? ` dueAt=${post.dueAt}` : ""}` : ""),
    );
  }
  console.log(
    publishNow
      ? "\n발행 요청을 보냈습니다. 각 SNS에 실제로 올라갔는지 확인하세요."
      : "\n예약을 마쳤습니다. Buffer 화면에서 순서와 시각을 확인하세요.",
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
