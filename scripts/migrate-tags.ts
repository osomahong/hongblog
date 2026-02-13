#!/usr/bin/env npx tsx --tsconfig tsconfig.json

/**
 * 태그 마이그레이션 스크립트
 *
 * 기존 태그를 정규 태그(CANONICAL_TAGS)로 매핑/변환하고,
 * 사용되지 않는 고아 태그를 삭제합니다.
 *
 * 사용법:
 *   npx tsx scripts/migrate-tags.ts              # dry-run (기본)
 *   npx tsx scripts/migrate-tags.ts --execute     # 실제 실행
 */

import { db } from "../src/lib/db";
import {
  tags,
  postsToTags,
  faqsToTags,
  classesToTags,
  logsToTags,
} from "../src/lib/schema";
import { CANONICAL_TAGS_FLAT } from "../src/lib/constants";
import { eq, sql, notInArray, inArray } from "drizzle-orm";

// ============================================
// 매핑 테이블: 현재 태그 → 정규 태그(들)
// ============================================

const TAG_MAPPING: Record<string, string[]> = {
  // 제거 (빈 배열 = 삭제)
  "디지털마케팅": [],
  "마케터": [],
  "비개발자": [],
  "마케터 코딩": [],
  "성과분석": [],

  // 어트리뷰션 통합
  "Attribution": ["어트리뷰션"],
  "기여분석": ["어트리뷰션"],
  "메타 어트리뷰션": ["어트리뷰션"],
  "CTA": ["어트리뷰션"],
  "VTA": ["어트리뷰션"],
  "클릭 후 7일": ["어트리뷰션"],
  "조회 후 1일": ["어트리뷰션"],

  // 전환 통합
  "Conversion": ["전환"],
  "컨버전": ["전환"],
  "전환캠페인": ["전환"],
  "전환 추적": ["전환"],

  // 광고 통합
  "광고성과": ["광고"],
  "광고 성과 측정": ["광고"],
  "광고비용": ["광고"],
  "광고수익률": ["광고"],

  // 영어 약어 치환
  "고객획득비용": ["CAC"],
  "고객생애가치": ["LTV"],
  "전환율": ["CVR"],
  "클릭율": ["CTR"],
  "클릭": ["CTR"],
  "투자수익률": ["ROI"],

  // 명칭 업데이트
  "Facebook 광고": ["Meta 광고"],

  // 약어 통일
  "Google Tag Manager": ["GTM"],
  "Google Analytics 4": ["GA4"],
  "analytics": ["GA4"],

  // 자동화 통합
  "n8n": ["자동화"],
  "업무자동화": ["자동화"],
  "마케팅 자동화": ["자동화"],

  // AI 통합
  "AI 코딩 도구": ["AI"],
  "AI FOMO": ["AI"],

  // 도구명 제거
  "Claude Code": [],
  "Gemini CLI": [],
  "Kiro": [],
  "Antigravity": [],
  "Codex CLI": [],

  // SEO 통합
  "검색엔진최적화": ["SEO"],
  "URL 리디렉션": ["SEO"],
  "리디렉션": ["SEO"],
  "301 302 차이": ["SEO"],

  // 마케팅 실무 통합
  "마케팅전략": ["마케팅 실무"],
  "마케팅지표": ["마케팅 실무"],

  // 퍼널 통합
  "TOFU": ["퍼널"],
  "MOFU": ["퍼널"],
  "BOFU": ["퍼널"],

  // 웹 기술
  "JS": ["JavaScript"],
  "Element": ["DOM"],
  "Attribute": ["DOM"],
  "Selector": ["DOM"],

  // 데이터 통합
  "웹 분석": ["데이터 분석"],
  "트래픽 분석": ["데이터 분석"],
  "데이터": ["데이터 분석"],
  "데이터 전처리": ["데이터 분석"],
  "데이터 파이프라인": ["데이터 분석"],

  // 데이터 추적
  "Cookie": ["데이터 추적"],
  "개인정보": ["데이터 추적"],

  // API 통합
  "REST API": ["API"],
  "마케팅": ["마케팅 실무"],

  // SPA 등 제거
  "SPA": [],
  "Firebase": [],
  "Flutter": [],
  "IOS": [],

  // dry-run에서 발견된 추가 비정규 태그
  "분석": ["데이터 분석"],
  "비즈니스": [],
  "콘텐츠": [],
  "도구": [],
  "입문": [],
  "Direct/None 트래픽": ["GA4"],
  "UTM 파라미터": ["GA4"],
  "디지털": [],
  "iOS": [],
  "Javascript": ["JavaScript"],
  "크롬 확장 프로그램": [],
  "배포": [],
  "BOM": ["DOM"],
  "클릭률": ["CTR"],
  "웰 분석": ["데이터 분석"],
};

// ============================================
// 타입
// ============================================

interface TagRecord {
  id: number;
  name: string;
}

interface JunctionRecord {
  contentId: number;
  tagId: number;
}

interface MigrationAction {
  type: "rename" | "delete" | "add_junction" | "remove_junction" | "delete_orphan";
  description: string;
}

// ============================================
// 메인 로직
// ============================================

async function migrateAllTags(dryRun: boolean) {
  const actions: MigrationAction[] = [];

  // 1. 모든 태그 조회
  const allTags: TagRecord[] = await db.select().from(tags);
  console.log(`\n📋 현재 태그 수: ${allTags.length}개\n`);

  const tagByName = new Map(allTags.map((t) => [t.name, t]));
  const tagById = new Map(allTags.map((t) => [t.id, t]));

  // 2. 모든 junction 조회
  const allPostTags: JunctionRecord[] = (await db.select().from(postsToTags)).map((r) => ({
    contentId: r.postId,
    tagId: r.tagId,
  }));
  const allFaqTags: JunctionRecord[] = (await db.select().from(faqsToTags)).map((r) => ({
    contentId: r.faqId,
    tagId: r.tagId,
  }));
  const allClassTags: JunctionRecord[] = (await db.select().from(classesToTags)).map((r) => ({
    contentId: r.classId,
    tagId: r.tagId,
  }));
  const allLogTags: JunctionRecord[] = (await db.select().from(logsToTags)).map((r) => ({
    contentId: r.logId,
    tagId: r.tagId,
  }));

  // 3. 매핑 테이블에 따른 변환 작업 수집
  const junctionsToAdd: { table: string; contentId: number; tagId: number }[] = [];
  const junctionsToRemove: { table: string; contentId: number; tagId: number }[] = [];
  const tagsToDelete: number[] = [];

  for (const [oldName, newNames] of Object.entries(TAG_MAPPING)) {
    const oldTag = tagByName.get(oldName);
    if (!oldTag) continue; // DB에 없는 태그는 스킵

    // 이 태그를 사용하는 모든 junction 찾기
    const usages = [
      ...allPostTags.filter((j) => j.tagId === oldTag.id).map((j) => ({ ...j, table: "posts_to_tags" as const })),
      ...allFaqTags.filter((j) => j.tagId === oldTag.id).map((j) => ({ ...j, table: "faqs_to_tags" as const })),
      ...allClassTags.filter((j) => j.tagId === oldTag.id).map((j) => ({ ...j, table: "classes_to_tags" as const })),
      ...allLogTags.filter((j) => j.tagId === oldTag.id).map((j) => ({ ...j, table: "logs_to_tags" as const })),
    ];

    if (newNames.length === 0) {
      // 태그 삭제
      actions.push({
        type: "delete",
        description: `"${oldName}" 삭제 (${usages.length}개 콘텐츠에서 제거)`,
      });
      for (const usage of usages) {
        junctionsToRemove.push({ table: usage.table, contentId: usage.contentId, tagId: oldTag.id });
      }
      tagsToDelete.push(oldTag.id);
    } else {
      // 태그 변환
      for (const newName of newNames) {
        let newTag = tagByName.get(newName);

        if (!newTag) {
          // 정규 태그가 아직 DB에 없으면 생성 필요
          actions.push({
            type: "rename",
            description: `새 태그 "${newName}" 생성 필요`,
          });
        }

        for (const usage of usages) {
          // 이미 해당 콘텐츠에 새 태그가 연결되어 있는지 확인
          const allJunctions = [
            ...(usage.table === "posts_to_tags" ? allPostTags : []),
            ...(usage.table === "faqs_to_tags" ? allFaqTags : []),
            ...(usage.table === "classes_to_tags" ? allClassTags : []),
            ...(usage.table === "logs_to_tags" ? allLogTags : []),
          ];
          const alreadyLinked = newTag && allJunctions.some(
            (j) => j.contentId === usage.contentId && j.tagId === newTag!.id
          );

          if (!alreadyLinked) {
            actions.push({
              type: "add_junction",
              description: `[${usage.table}] 콘텐츠 ${usage.contentId}: "${oldName}" → "${newName}"`,
            });
            if (newTag) {
              junctionsToAdd.push({ table: usage.table, contentId: usage.contentId, tagId: newTag.id });
            }
          }
        }

        // 구 태그의 junction 제거
        for (const usage of usages) {
          junctionsToRemove.push({ table: usage.table, contentId: usage.contentId, tagId: oldTag.id });
        }
        if (!tagsToDelete.includes(oldTag.id)) {
          tagsToDelete.push(oldTag.id);
        }
      }

      actions.push({
        type: "remove_junction",
        description: `"${oldName}" → [${newNames.join(", ")}] (${usages.length}개 콘텐츠 업데이트)`,
      });
    }
  }

  // 4. 정규 목록에 없고 매핑 테이블에도 없는 태그 식별
  const unmappedNonCanonical = allTags.filter(
    (t) => !CANONICAL_TAGS_FLAT.includes(t.name) && !(t.name in TAG_MAPPING)
  );

  if (unmappedNonCanonical.length > 0) {
    console.log("⚠️  매핑 테이블에 없는 비정규 태그:");
    for (const t of unmappedNonCanonical) {
      const usageCount =
        allPostTags.filter((j) => j.tagId === t.id).length +
        allFaqTags.filter((j) => j.tagId === t.id).length +
        allClassTags.filter((j) => j.tagId === t.id).length +
        allLogTags.filter((j) => j.tagId === t.id).length;
      console.log(`   - "${t.name}" (사용: ${usageCount}건)`);
    }
    console.log("");
  }

  // 5. 고아 태그 식별 (어떤 콘텐츠에도 연결되지 않은 태그)
  const allJunctionTagIds = new Set([
    ...allPostTags.map((j) => j.tagId),
    ...allFaqTags.map((j) => j.tagId),
    ...allClassTags.map((j) => j.tagId),
    ...allLogTags.map((j) => j.tagId),
  ]);

  const orphanTags = allTags.filter((t) => !allJunctionTagIds.has(t.id));
  for (const t of orphanTags) {
    if (!tagsToDelete.includes(t.id)) {
      actions.push({
        type: "delete_orphan",
        description: `고아 태그 "${t.name}" 삭제`,
      });
      tagsToDelete.push(t.id);
    }
  }

  // 6. 글당 태그 5개 초과 체크
  console.log("📊 글당 태그 수 점검:");
  const contentTagCounts = new Map<string, number>();
  for (const j of allPostTags) {
    const key = `post:${j.contentId}`;
    contentTagCounts.set(key, (contentTagCounts.get(key) || 0) + 1);
  }
  for (const j of allFaqTags) {
    const key = `faq:${j.contentId}`;
    contentTagCounts.set(key, (contentTagCounts.get(key) || 0) + 1);
  }
  for (const j of allClassTags) {
    const key = `class:${j.contentId}`;
    contentTagCounts.set(key, (contentTagCounts.get(key) || 0) + 1);
  }
  for (const j of allLogTags) {
    const key = `log:${j.contentId}`;
    contentTagCounts.set(key, (contentTagCounts.get(key) || 0) + 1);
  }

  const overLimit = [...contentTagCounts.entries()].filter(([, count]) => count > 5);
  if (overLimit.length > 0) {
    for (const [key, count] of overLimit) {
      console.log(`   ⚠️  ${key}: ${count}개 태그 (5개 초과)`);
    }
  } else {
    console.log("   ✅ 모든 콘텐츠가 5개 이하 태그를 사용 중\n");
  }

  // 7. 결과 보고
  console.log("=" .repeat(60));
  console.log("📋 마이그레이션 변경 내역\n");

  const deleteActions = actions.filter((a) => a.type === "delete");
  const renameActions = actions.filter((a) => a.type === "rename" || a.type === "remove_junction");
  const orphanActions = actions.filter((a) => a.type === "delete_orphan");

  if (deleteActions.length > 0) {
    console.log("🗑️  삭제할 태그:");
    for (const a of deleteActions) console.log(`   ${a.description}`);
    console.log("");
  }

  if (renameActions.length > 0) {
    console.log("🔄 변환할 태그:");
    for (const a of renameActions) console.log(`   ${a.description}`);
    console.log("");
  }

  if (orphanActions.length > 0) {
    console.log("🧹 고아 태그 정리:");
    for (const a of orphanActions) console.log(`   ${a.description}`);
    console.log("");
  }

  console.log(`총 변경 사항: ${actions.length}건`);
  console.log(`삭제 예정 태그: ${tagsToDelete.length}개`);
  console.log(`추가 예정 junction: ${junctionsToAdd.length}개`);
  console.log(`제거 예정 junction: ${junctionsToRemove.length}개\n`);

  // 8. 실행
  if (dryRun) {
    console.log("🔍 DRY-RUN 모드: 실제 변경 없음");
    console.log("   실제 실행하려면: npx tsx scripts/migrate-tags.ts --execute\n");
    return;
  }

  console.log("🚀 마이그레이션 실행 중...\n");

  // 8-1. 아직 DB에 없는 정규 태그 생성
  const existingTagNames = new Set(allTags.map((t) => t.name));
  const newTagsNeeded = new Set<string>();
  for (const [, newNames] of Object.entries(TAG_MAPPING)) {
    for (const name of newNames) {
      if (!existingTagNames.has(name)) {
        newTagsNeeded.add(name);
      }
    }
  }

  const newTagMap = new Map<string, number>();
  for (const name of newTagsNeeded) {
    const [created] = await db.insert(tags).values({ name }).returning();
    newTagMap.set(name, created.id);
    console.log(`   ✅ 태그 생성: "${name}" (id: ${created.id})`);
  }

  // 태그 맵 갱신
  const refreshedTags = await db.select().from(tags);
  const refreshedByName = new Map(refreshedTags.map((t) => [t.name, t]));

  // 8-2. 새 junction 추가
  for (const item of junctionsToAdd) {
    // newTagMap에서 ID 확인 (기존 or 신규)
    try {
      if (item.table === "posts_to_tags") {
        await db.insert(postsToTags).values({ postId: item.contentId, tagId: item.tagId }).onConflictDoNothing();
      } else if (item.table === "faqs_to_tags") {
        await db.insert(faqsToTags).values({ faqId: item.contentId, tagId: item.tagId }).onConflictDoNothing();
      } else if (item.table === "classes_to_tags") {
        await db.insert(classesToTags).values({ classId: item.contentId, tagId: item.tagId }).onConflictDoNothing();
      } else if (item.table === "logs_to_tags") {
        await db.insert(logsToTags).values({ logId: item.contentId, tagId: item.tagId }).onConflictDoNothing();
      }
    } catch (err) {
      // 중복 무시
    }
  }

  // 매핑된 태그 중 newTagMap에 있는 것들 (아직 junctionsToAdd에 tagId가 0인 것들 처리)
  for (const [oldName, newNames] of Object.entries(TAG_MAPPING)) {
    if (newNames.length === 0) continue;
    const oldTag = tagByName.get(oldName);
    if (!oldTag) continue;

    for (const newName of newNames) {
      const newTag = refreshedByName.get(newName);
      if (!newTag) continue;

      // 구 태그의 모든 사용처를 새 태그로 연결
      const tables = [
        { junctions: allPostTags, table: postsToTags, idField: "postId" as const },
        { junctions: allFaqTags, table: faqsToTags, idField: "faqId" as const },
        { junctions: allClassTags, table: classesToTags, idField: "classId" as const },
        { junctions: allLogTags, table: logsToTags, idField: "logId" as const },
      ];

      for (const { junctions, table, idField } of tables) {
        const usages = junctions.filter((j) => j.tagId === oldTag.id);
        for (const usage of usages) {
          try {
            await db.insert(table).values({ [idField]: usage.contentId, tagId: newTag.id } as any).onConflictDoNothing();
          } catch {
            // 중복 무시
          }
        }
      }
    }
  }

  // 8-3. 구 태그의 junction 제거 + 태그 삭제
  if (tagsToDelete.length > 0) {
    // junction 제거 (cascade로 자동 처리되지만 명시적으로)
    await db.delete(postsToTags).where(inArray(postsToTags.tagId, tagsToDelete));
    await db.delete(faqsToTags).where(inArray(faqsToTags.tagId, tagsToDelete));
    await db.delete(classesToTags).where(inArray(classesToTags.tagId, tagsToDelete));
    await db.delete(logsToTags).where(inArray(logsToTags.tagId, tagsToDelete));

    // 태그 삭제
    await db.delete(tags).where(inArray(tags.id, tagsToDelete));
    console.log(`   🗑️  ${tagsToDelete.length}개 태그 삭제 완료`);
  }

  // 9. 최종 상태 출력
  const finalTags = await db.select().from(tags);
  console.log(`\n✅ 마이그레이션 완료!`);
  console.log(`   변경 전 태그 수: ${allTags.length}개`);
  console.log(`   변경 후 태그 수: ${finalTags.length}개\n`);

  const nonCanonicalRemaining = finalTags.filter((t) => !CANONICAL_TAGS_FLAT.includes(t.name));
  if (nonCanonicalRemaining.length > 0) {
    console.log("⚠️  아직 정규 목록에 없는 태그:");
    for (const t of nonCanonicalRemaining) {
      console.log(`   - "${t.name}"`);
    }
  } else {
    console.log("🎉 모든 태그가 정규 목록과 일치합니다!");
  }
}

// ============================================
// 실행
// ============================================

const isExecute = process.argv.includes("--execute");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

console.log(`\n🏷️  태그 마이그레이션 ${isExecute ? "(실행 모드)" : "(DRY-RUN 모드)"}`);
console.log("=" .repeat(60));

migrateAllTags(!isExecute)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ 마이그레이션 실패:", err);
    process.exit(1);
  });
