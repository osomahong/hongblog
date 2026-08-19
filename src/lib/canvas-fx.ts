// HTML in Canvas 실험 API(drawElementImage) 기반 장식 효과.
// 크롬이 플래그/오리진 트라이얼로만 여는 API라, 미지원 브라우저에서는
// 모든 함수가 조용히 아무 일도 하지 않고 기존 동작이 그대로 유지된다.
//
// 구현 메모 두 가지.
// 1) DPR>1 환경에서 drawElementImage는 물리 픽셀 기준으로 그리므로
//    캔버스 버퍼를 css크기*dpr로 잡고 ctx에는 별도 scale 보정을 하지 않는다.
// 2) 캡처용 캔버스를 화면 밖(-12000px)에 두면 실제 창에서는 브라우저가
//    렌더링을 건너뛰어 빈 이미지가 잡힌다. 그래서 요소 바로 위에 겹친
//    화면 안 캔버스에서 캡처하고, 그 캔버스를 그대로 애니메이션 오버레이로 쓴다.
//    캡처가 비어 있으면(전 픽셀 투명) 효과를 포기하고 원본을 건드리지 않는다.

type DrawElementCtx = CanvasRenderingContext2D & {
  drawElementImage?: (el: Element, x: number, y: number) => unknown;
};

interface CaptureResult {
  /** 요소 위에 겹쳐 둔 오버레이 캔버스. 애니메이션이 이 위에서 돈다 */
  overlay: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** 캡처된 픽셀을 담은 소스 캔버스 (오버레이와 같은 크기, pad 오프셋 포함) */
  src: HTMLCanvasElement;
  dpr: number;
  pad: number;
}

/** rAF가 멈춘 상태(백그라운드 창 등)에서도 흐름이 막히지 않게 하는 상한 */
function raceTimeout(p: Promise<void>, ms: number): Promise<void> {
  return Promise.race([p, new Promise<void>((r) => setTimeout(r, ms))]);
}


/** 재 날림 파편 하나. 크기가 제각각이고 위로 떠오르며 하늘거리다 작아져 사라진다 */
interface AshCell {
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  drift: number;
  phase: number;
  delay: number;
}

function buildAshCells(
  src: HTMLCanvasElement,
  dpr: number,
  block: number,
  delayFn: (x: number, y: number) => number
): AshCell[] {
  const cells: AshCell[] = [];
  for (let y = 0; y < src.height; y += block) {
    for (let x = 0; x < src.width; x += block) {
      cells.push({
        x,
        y,
        // 파편 크기를 제각각으로 (0.7배에서 1.4배)
        size: block * (0.7 + Math.random() * 0.7),
        dx: (Math.random() - 0.5) * 150 * dpr,
        // 재가 상승 기류에 실리듯 위쪽으로 뜬다
        dy: -(30 + Math.random() * 170) * dpr,
        drift: (6 + Math.random() * 16) * dpr,
        phase: Math.random() * Math.PI * 2,
        delay: Math.min(0.75, delayFn(x, y)),
      });
    }
  }
  return cells;
}

function drawAshFrame(
  ctx: CanvasRenderingContext2D,
  overlay: HTMLCanvasElement,
  src: HTMLCanvasElement,
  cells: AshCell[],
  block: number,
  p: number
): void {
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  for (const c of cells) {
    const lp = Math.min(1, Math.max(0, (p - c.delay) / (1 - c.delay)));
    if (lp === 0) {
      // 아직 제자리인 파편은 원본 그대로
      ctx.globalAlpha = 1;
      ctx.drawImage(src, c.x, c.y, block, block, c.x, c.y, block, block);
      continue;
    }
    if (lp >= 1) continue;
    // 초반에 살짝 번졌다가 점점 작아진다
    const spread = 1 + 0.5 * Math.min(lp * 3, 1);
    const size = c.size * spread * (1 - lp);
    if (size < 0.6) continue;
    const wobble = Math.sin(c.phase + lp * 8) * c.drift * lp;
    ctx.globalAlpha = Math.pow(1 - lp, 0.8);
    ctx.drawImage(
      src,
      c.x,
      c.y,
      block,
      block,
      c.x + c.dx * lp + wobble + (block - size) / 2,
      c.y + c.dy * lp * lp + (block - size) / 2,
      size,
      size
    );
  }
  ctx.globalAlpha = 1;
}


/** 크롬 Network Information API의 필요한 부분만 */
interface NetworkInfo {
  saveData?: boolean;
  effectiveType?: string;
  type?: string;
}

/**
 * 접속 환경상 장식 효과를 돌려도 되는지 판단한다.
 * 애니메이션 자체는 네트워크를 쓰지 않지만, 모바일 회선 사용자는
 * 배터리와 성능을 아끼는 쪽을 기본값으로 둔다.
 * - 데이터 절약 모드(saveData)면 생략
 * - 모바일 통신망(type이 cellular로 보고되는 안드로이드 크롬)이면 생략
 * - 실측 회선 품질(effectiveType)이 4g 미만이면 생략
 * - 시스템의 동작 줄이기(prefers-reduced-motion)를 켠 사용자면 생략
 */
function environmentAllowsFx(): boolean {
  if (typeof navigator === "undefined") return false;
  // 소유자 테스트용 강제 스위치. 콘솔에서 localStorage.setItem("canvas-fx-force", "1")
  // 을 실행하면 그 브라우저에서만 아래 게이트를 전부 무시한다.
  try {
    if (window.localStorage.getItem("canvas-fx-force") === "1") return true;
  } catch {
    // 저장소가 막힌 환경이면 일반 게이트로 진행한다
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as { connection?: NetworkInfo }).connection;
  if (conn) {
    if (conn.saveData) return false;
    if (conn.type === "cellular") return false;
    if (conn.effectiveType && conn.effectiveType !== "4g") return false;
  }
  return true;
}

export function supportsHtmlInCanvas(): boolean {
  if (typeof document === "undefined") return false;
  const ctx = document.createElement("canvas").getContext("2d");
  return typeof (ctx as DrawElementCtx | null)?.drawElementImage === "function";
}

/** ImageData가 전부 투명하면 true. 캡처 실패 감지용 (알파 채널만 성기게 훑는다) */
function isBlank(data: ImageData): boolean {
  const a = data.data;
  for (let i = 3; i < a.length; i += 64) {
    if (a[i] !== 0) return false;
  }
  return true;
}

/**
 * 요소 위에 캔버스를 겹치고, layoutsubtree 복제본을 한 번 그려 픽셀을 뜬다.
 * 성공하면 복제본만 제거하고 캔버스는 오버레이로 재사용하도록 돌려준다.
 * 실패(미지원, 빈 캡처)하면 전부 정리하고 null을 반환하므로 화면 변화가 없다.
 */
async function captureInOverlay(
  el: HTMLElement,
  pad: number
): Promise<CaptureResult | null> {
  if (!supportsHtmlInCanvas() || !environmentAllowsFx()) return null;
  const rect = el.getBoundingClientRect();
  const w = Math.ceil(rect.width);
  const h = Math.ceil(rect.height);
  if (!w || !h) return null;
  const dpr = window.devicePixelRatio || 1;

  const overlay = document.createElement("canvas");
  overlay.setAttribute("layoutsubtree", "");
  overlay.width = Math.ceil((w + pad * 2) * dpr);
  overlay.height = Math.ceil((h + pad * 2) * dpr);
  overlay.style.cssText = [
    "position:fixed",
    `left:${rect.left - pad}px`,
    `top:${rect.top - pad}px`,
    `width:${w + pad * 2}px`,
    `height:${h + pad * 2}px`,
    "pointer-events:none",
    "z-index:9999",
  ].join(";");

  const clone = el.cloneNode(true) as HTMLElement;
  // 부모에게 물려받던 서체와 색을 잃지 않도록 계산값을 박아 둔다
  const cs = getComputedStyle(el);
  clone.style.width = `${w}px`;
  clone.style.margin = "0";
  clone.style.visibility = "visible"; // 원본이 숨겨진 상태여도 캡처되도록
  clone.style.font = cs.font;
  clone.style.color = cs.color;
  clone.style.letterSpacing = cs.letterSpacing;
  clone.style.textTransform = cs.textTransform;
  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  // 내부 스크롤이 있는 요소(팝업 본문 등)는 복제 시 스크롤이 0으로 돌아가므로
  // 원본의 스크롤 위치를 같은 순서의 복제 노드에 복사한다.
  const origAll = el.querySelectorAll<HTMLElement>("*");
  const cloneAll = clone.querySelectorAll<HTMLElement>("*");
  origAll.forEach((node, i) => {
    if ((node.scrollTop || node.scrollLeft) && cloneAll[i]) {
      cloneAll[i].scrollTop = node.scrollTop;
      cloneAll[i].scrollLeft = node.scrollLeft;
    }
  });

  // 복제본이 캔버스 서브트리 안에서 레이아웃, 래스터될 시간을 준다.
  // layoutsubtree 자식은 화면에 직접 그려지지 않으므로 이 동안 겹침 잔상은 없다.
  // 창이 백그라운드라 rAF가 멈춰 있으면 150ms 후에 그냥 진행한다.
  await raceTimeout(
    new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    ),
    150
  );

  const ctx = overlay.getContext("2d") as DrawElementCtx | null;
  if (!ctx || typeof ctx.drawElementImage !== "function") {
    overlay.remove();
    return null;
  }
  try {
    // drawElementImage 좌표는 캔버스 버퍼(물리 픽셀) 기준이라 pad에 dpr을 곱한다.
    // 곱하지 않으면 DPR 2 화면에서 캡처가 왼쪽 위로 절반씩 어긋난다.
    ctx.drawElementImage(clone, pad * dpr, pad * dpr);
  } catch {
    overlay.remove();
    return null;
  }
  const data = ctx.getImageData(0, 0, overlay.width, overlay.height);
  clone.remove();
  if (isBlank(data)) {
    overlay.remove();
    return null;
  }

  const src = document.createElement("canvas");
  src.width = data.width;
  src.height = data.height;
  src.getContext("2d")?.putImageData(data, 0, 0);
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  return { overlay, ctx, src, dpr, pad };
}

/**
 * 요소를 픽셀 블록으로 흩어뜨린다. 성공하면 true.
 * 애니메이션이 끝나도 원본 visibility는 hidden으로 남으므로,
 * 호출부에서 상태 전환(언마운트/재조립)을 이어서 처리한다.
 */
export async function dissolveElement(el: HTMLElement): Promise<boolean> {
  const cap = await captureInOverlay(el, 70);
  if (!cap) return false;
  const { overlay, ctx, src, dpr } = cap;
  el.style.visibility = "hidden";

  const block = Math.max(4, Math.round(6 * dpr));
  // 왼쪽부터 차례로 재가 되어 날아간다
  const cells = buildAshCells(src, dpr, block, (x) => (x / src.width) * 0.5 + Math.random() * 0.2);

  // 흩어지는 여운이 남도록 넉넉하게 잡는다 (요청으로 850ms에서 연장)
  const dur = 1250;
  await raceTimeout(new Promise<void>((resolve) => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      drawAshFrame(ctx, overlay, src, cells, block, p);
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  }), dur + 600);
  overlay.remove();
  return true;
}

/**
 * 요소를 젤리처럼 출렁이게 한다. 애니메이션 동안만 원본을 숨기고
 * 끝나면 원상 복구하므로 호출부는 이벤트만 걸면 된다.
 */
export async function jellyElement(el: HTMLElement): Promise<void> {
  if (el.dataset.jellyRunning === "1") return;
  el.dataset.jellyRunning = "1";
  try {
    const cap = await captureInOverlay(el, 26);
    if (!cap) return;
    const { overlay, ctx, src, dpr } = cap;
    // visibility:hidden은 클릭 판정까지 없애 애니메이션 동안 링크가 눌리지 않는다.
    // opacity:0은 보이지만 않을 뿐 클릭이 그대로 동작한다.
    const prevOpacity = el.style.opacity;
    el.style.opacity = "0";

    const band = Math.max(2, Math.round(2 * dpr));
    const dur = 680;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const decay = (1 - p) * (1 - p);
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        for (let x = 0; x < src.width; x += band) {
          const dy = Math.sin(x / (10 * dpr) + p * 16) * 9 * dpr * decay;
          ctx.drawImage(src, x, 0, band, src.height, x, dy, band, src.height);
        }
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    el.style.opacity = prevOpacity;
    overlay.remove();
  } finally {
    delete el.dataset.jellyRunning;
  }
}

/**
 * 흩어져 있던 픽셀이 모여들며 요소가 나타나는 재조립. dissolve의 역방향.
 * 성공하면 애니메이션 후 원본을 표시하고 true를 반환한다.
 * 실패하면 원본 표시만 복구하고 false를 반환하므로 호출부 분기가 필요 없다.
 */
export async function assembleElement(el: HTMLElement): Promise<boolean> {
  const cap = await captureInOverlay(el, 70);
  if (!cap) {
    el.style.visibility = "";
    return false;
  }
  const { overlay, ctx, src, dpr } = cap;
  el.style.visibility = "hidden";

  const block = Math.max(4, Math.round(6 * dpr));
  const cells: { x: number; y: number; dx: number; dy: number; delay: number }[] = [];
  for (let y = 0; y < src.height; y += block) {
    for (let x = 0; x < src.width; x += block) {
      cells.push({
        x,
        y,
        dx: (Math.random() - 0.35) * 150 * dpr,
        dy: (Math.random() - 0.7) * 130 * dpr,
        delay: (1 - x / src.width) * 0.4 + Math.random() * 0.2,
      });
    }
  }

  const dur = 900;
  await raceTimeout(new Promise<void>((resolve) => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      for (const c of cells) {
        const lp = Math.min(1, Math.max(0, (p - c.delay) / (1 - c.delay)));
        const back = 1 - lp; // 남은 흩어짐 정도
        ctx.globalAlpha = lp;
        ctx.drawImage(
          src,
          c.x,
          c.y,
          block,
          block,
          c.x + c.dx * back,
          c.y + c.dy * back,
          block,
          block
        );
      }
      ctx.globalAlpha = 1;
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  }), dur + 600);
  el.style.visibility = "";
  overlay.remove();
  return true;
}

/**
 * 짧은 글리치 플래시. 색이 어긋난 잔상과 가로 슬라이스가 튀었다가 원상 복구된다.
 * 퀴즈 정답처럼 순간 피드백에 쓴다.
 */
export async function glitchElement(el: HTMLElement): Promise<void> {
  if (el.dataset.fxRunning === "1") return;
  el.dataset.fxRunning = "1";
  try {
    const cap = await captureInOverlay(el, 24);
    if (!cap) return;
    const { overlay, ctx, src, dpr } = cap;
    const prevVisibility = el.style.visibility;
    el.style.visibility = "hidden";

    const dur = 460;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const strength = Math.sin(p * Math.PI); // 중간에 가장 세게
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        // 색 어긋난 잔상 두 겹
        ctx.globalAlpha = 0.35 * strength;
        ctx.filter = "hue-rotate(300deg)";
        ctx.drawImage(src, -6 * dpr * strength, 0);
        ctx.filter = "hue-rotate(160deg)";
        ctx.drawImage(src, 6 * dpr * strength, 0);
        ctx.filter = "none";
        ctx.globalAlpha = 1;
        ctx.drawImage(src, 0, 0);
        // 가로 슬라이스 몇 줄을 어긋나게
        for (let k = 0; k < 3; k++) {
          const sy = Math.floor(Math.random() * src.height * 0.9);
          const sh = Math.max(4, Math.floor(src.height * 0.06));
          const dx = (Math.random() - 0.5) * 26 * dpr * strength;
          ctx.drawImage(src, 0, sy, src.width, sh, dx, sy, src.width, sh);
        }
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    el.style.visibility = prevVisibility;
    overlay.remove();
  } finally {
    delete el.dataset.fxRunning;
  }
}

/**
 * 홀로그램 스캔. 원본 요소는 그대로 둔 채, 카드 실루엣에 맞춰 잘라 낸
 * 스캔라인과 밝은 띠를 위에 얹기만 한다. 원본을 숨기지 않으므로
 * hover 이동이나 틸트 같은 기존 CSS 효과와 겹쳐도 크기, 위치가 튀지 않는다.
 */
export async function hologramElement(el: HTMLElement): Promise<void> {
  if (el.dataset.fxRunning === "1") return;
  // 작은 텍스트 링크에서 오발동하지 않도록 카드 크기에서만 동작
  if (el.getBoundingClientRect().height < 60) return;
  el.dataset.fxRunning = "1";
  try {
    const cap = await captureInOverlay(el, 10);
    if (!cap) return;
    const { overlay, ctx, src, dpr } = cap;

    const dur = 750;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const fade = Math.sin(p * Math.PI);
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        // 스캔라인
        ctx.globalAlpha = 0.28 * fade;
        ctx.fillStyle = "#00c896";
        for (let y = 0; y < overlay.height; y += 7 * dpr) {
          ctx.fillRect(0, y, overlay.width, 2.5 * dpr);
        }
        // 위에서 아래로 지나가는 밝은 띠
        const bandY = overlay.height * p;
        const bandH = 46 * dpr;
        const grad = ctx.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
        grad.addColorStop(0, "rgba(0,255,190,0)");
        grad.addColorStop(0.5, "rgba(190,255,235,0.65)");
        grad.addColorStop(1, "rgba(0,255,190,0)");
        ctx.globalAlpha = fade;
        ctx.fillStyle = grad;
        ctx.fillRect(0, bandY - bandH, overlay.width, bandH * 2);
        ctx.globalAlpha = 1;
        // 카드 실루엣 밖으로 새어 나가지 않게 잘라 낸다
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(src, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    overlay.remove();
  } finally {
    delete el.dataset.fxRunning;
  }
}

/**
 * 화면에 보이는 페이지 전체를 픽셀로 흩어뜨린 뒤 이동한다.
 * 추천 콘텐츠처럼 다음 글로 넘어가는 링크의 전환 연출용.
 * 미지원, 캡처 실패 시에는 즉시 navigate만 호출하므로 이동이 막히지 않는다.
 */
export async function dissolvePageAndNavigate(navigate: () => void): Promise<void> {
  if (!supportsHtmlInCanvas() || !environmentAllowsFx()) {
    navigate();
    return;
  }
  const dpr = window.devicePixelRatio || 1;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const overlay = document.createElement("canvas");
  overlay.setAttribute("layoutsubtree", "");
  overlay.width = Math.ceil(vw * dpr);
  overlay.height = Math.ceil(vh * dpr);
  // body를 숨겨도 오버레이는 보여야 하므로 visibility를 직접 고정한다
  overlay.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;visibility:visible;";

  const clone = document.body.cloneNode(true) as HTMLElement;
  // 복제본에서 실행, 렌더 문제를 일으키는 노드는 그리기 전에 걷어 낸다
  clone
    .querySelectorAll("script, iframe, noscript, canvas, video")
    .forEach((n) => n.remove());
  clone.style.width = `${vw}px`;
  clone.style.margin = "0";
  clone.style.visibility = "visible";
  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  await raceTimeout(
    new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r()))
    ),
    200
  );

  const ctx = overlay.getContext("2d") as DrawElementCtx | null;
  let src: HTMLCanvasElement | null = null;
  if (ctx && typeof ctx.drawElementImage === "function") {
    try {
      // 스크롤 위치만큼 올려 그려 현재 화면과 같은 부분을 뜬다
      ctx.drawElementImage(clone, 0, -window.scrollY * dpr);
      const data = ctx.getImageData(0, 0, overlay.width, overlay.height);
      if (!isBlank(data)) {
        src = document.createElement("canvas");
        src.width = data.width;
        src.height = data.height;
        src.getContext("2d")?.putImageData(data, 0, 0);
      }
    } catch {
      src = null;
    }
  }
  clone.remove();
  if (!src || !ctx) {
    overlay.remove();
    navigate();
    return;
  }
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  document.body.style.visibility = "hidden";

  try {
    // 라우트 로딩이 연출과 겹치도록 이동은 디졸브 시작과 동시에 건다.
    // 새 페이지가 먼저 그려져도 body가 숨겨져 있어 연출이 끝날 때까지 보이지 않는다.
    const before = location.pathname + location.search;
    navigate();

    const block = Math.max(6, Math.round(9 * dpr));
    // 클릭한 순간부터 화면 아래에서 위로 차례로 재가 되어 날아간다
    const cells = buildAshCells(
      src,
      dpr,
      block,
      (x, y) => (1 - y / src.height) * 0.35 + Math.random() * 0.25
    );
    const dur = 700;
    const srcCanvas = src;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        drawAshFrame(ctx, overlay, srcCanvas, cells, block, p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);

    // 새 경로가 그려질 때까지만 잠깐 기다린다 (이미 이동돼 있으면 바로 통과)
    const t0 = performance.now();
    while (
      location.pathname + location.search === before &&
      performance.now() - t0 < 2500
    ) {
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 80));
  } finally {
    document.body.style.visibility = "";
    overlay.remove();
  }
}

/**
 * DOM 노드 하나를 화면에 보이지 않게 렌더해 PNG dataURL로 뜬다.
 * 인용 카드처럼 HTML/CSS로 디자인한 결과물을 이미지로 내보내는 기능용이라
 * 통신 환경 게이트는 타지 않는다 (사용자가 직접 요청한 기능이므로).
 */
export async function renderNodeToPngDataUrl(
  node: HTMLElement,
  cssWidth: number
): Promise<string | null> {
  if (!supportsHtmlInCanvas()) return null;
  const dpr = Math.max(2, window.devicePixelRatio || 1); // 공유 이미지는 최소 2배 해상도
  const cv = document.createElement("canvas");
  cv.setAttribute("layoutsubtree", "");
  // 화면 밖에 두면 렌더링이 생략되므로 화면 안에 두되, 그리기 전까지 투명이라 보이지 않는다
  cv.style.cssText = `position:fixed;right:0;bottom:0;width:${cssWidth}px;height:10px;pointer-events:none;z-index:-1;`;
  node.style.width = `${cssWidth}px`;
  cv.appendChild(node);
  document.body.appendChild(cv);
  try {
    await raceTimeout(
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      ),
      300
    );
    const h = Math.ceil(node.getBoundingClientRect().height);
    if (!h) return null;
    cv.width = Math.ceil(cssWidth * dpr);
    cv.height = Math.ceil(h * dpr);
    cv.style.height = `${h}px`;
    await raceTimeout(
      new Promise<void>((r) => requestAnimationFrame(() => r())),
      150
    );
    const ctx = cv.getContext("2d") as DrawElementCtx | null;
    if (!ctx || typeof ctx.drawElementImage !== "function") return null;
    ctx.drawElementImage(node, 0, 0);
    const data = ctx.getImageData(0, 0, cv.width, cv.height);
    if (isBlank(data)) return null;
    return cv.toDataURL("image/png");
  } catch {
    return null;
  } finally {
    cv.remove();
  }
}

/**
 * 요소의 잔상이 목표 지점으로 빨려 들어가며 사라진다. 원본은 그대로 둔다.
 * 코드 복사처럼 "어디로 갔는지" 보여 주는 확인 연출용.
 */
export async function suckElement(el: HTMLElement, target: HTMLElement): Promise<void> {
  if (el.dataset.fxRunning === "1") return;
  el.dataset.fxRunning = "1";
  try {
    const cap = await captureInOverlay(el, 10);
    if (!cap) return;
    const { overlay, ctx, src, dpr, pad } = cap;
    const elRect = el.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    // 오버레이 좌표계(물리 픽셀)에서의 목표 중심
    const tx = (tRect.left + tRect.width / 2 - (elRect.left - pad)) * dpr;
    const ty = (tRect.top + tRect.height / 2 - (elRect.top - pad)) * dpr;

    const dur = 520;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const ease = p * p; // 갈수록 빨라진다
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        const scale = 1 - ease * 0.92;
        const w = src.width * scale;
        const h = src.height * scale;
        // 원래 자리에서 목표 중심으로 옮겨 가며 줄어든다
        const x = (1 - ease) * 0 + ease * (tx - w / 2);
        const y = (1 - ease) * 0 + ease * (ty - h / 2);
        ctx.globalAlpha = (1 - p) * 0.9;
        ctx.drawImage(src, x, y, w, h);
        ctx.globalAlpha = 1;
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    overlay.remove();
  } finally {
    delete el.dataset.fxRunning;
  }
}

/**
 * 요소가 중심에서 사방으로 짧게 터지는 파편 연출. 원본은 그대로 둔다.
 * 클릭 직후 상태가 바뀌는 버튼(피드백 등)의 확인 피드백용.
 */
export async function burstElement(el: HTMLElement): Promise<void> {
  if (el.dataset.fxRunning === "1") return;
  el.dataset.fxRunning = "1";
  try {
    const cap = await captureInOverlay(el, 60);
    if (!cap) return;
    const { overlay, ctx, src, dpr } = cap;
    const cx = src.width / 2;
    const cy = src.height / 2;
    const block = Math.max(4, Math.round(5 * dpr));
    const cells: { x: number; y: number; vx: number; vy: number; spin: number }[] = [];
    for (let y = 0; y < src.height; y += block) {
      for (let x = 0; x < src.width; x += block) {
        const ang = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 0.9;
        const speed = (40 + Math.random() * 120) * dpr;
        cells.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 30 * dpr,
          spin: Math.random(),
        });
      }
    }
    const dur = 480;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        for (const c of cells) {
          const size = block * (1 - p);
          if (size < 0.6) continue;
          ctx.globalAlpha = 1 - p;
          ctx.drawImage(
            src,
            c.x,
            c.y,
            block,
            block,
            c.x + c.vx * p,
            c.y + c.vy * p + 60 * dpr * p * p, // 중력
            size,
            size
          );
        }
        ctx.globalAlpha = 1;
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    overlay.remove();
  } finally {
    delete el.dataset.fxRunning;
  }
}

/**
 * 요소가 위에서 아래로 스캔 띠와 함께 드러난다. 검색 결과 목록 등장용.
 */
export async function scanInElement(el: HTMLElement): Promise<void> {
  if (el.dataset.fxRunning === "1") return;
  el.dataset.fxRunning = "1";
  try {
    const cap = await captureInOverlay(el, 6);
    if (!cap) return;
    const { overlay, ctx, src, dpr } = cap;
    // 등장 연출 중에도 결과를 바로 클릭할 수 있어야 하므로 opacity로 숨긴다
    const prevOpacity = el.style.opacity;
    el.style.opacity = "0";

    const dur = 450;
    await raceTimeout(new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const revealY = src.height * p;
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        // 드러난 부분
        ctx.drawImage(src, 0, 0, src.width, revealY, 0, 0, src.width, revealY);
        // 경계의 스캔 띠
        if (p < 1) {
          const bandH = 14 * dpr;
          const grad = ctx.createLinearGradient(0, revealY - bandH, 0, revealY + bandH);
          grad.addColorStop(0, "rgba(0,200,150,0)");
          grad.addColorStop(0.5, "rgba(0,220,170,0.5)");
          grad.addColorStop(1, "rgba(0,200,150,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, revealY - bandH, overlay.width, bandH * 2);
        }
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), dur + 600);
    el.style.opacity = prevOpacity;
    overlay.remove();
  } finally {
    delete el.dataset.fxRunning;
  }
}

/**
 * 링크 클릭을 재 날림 전환으로 바꾸는 공용 핸들러.
 * 수정키(새 탭)와 보조 버튼은 브라우저 기본 동작을 그대로 둔다.
 */
export function ashNavigate(
  e: {
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    button: number;
    defaultPrevented: boolean;
    preventDefault: () => void;
  },
  navigate: () => void
): void {
  if (e.defaultPrevented) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  void dissolvePageAndNavigate(navigate);
}
