/**
 * 시나리오 데이터 무결성 검사. 빌드/테스트 타임에 챕터 전체를 검증한다.
 * 저작 실수(id 중복, 함정 태그에 필수 텍스트 누락, 폭탄 참조 오타 등)를 잡는다.
 */

import type { ChapterSpec, TaskCard } from "./schema";

export function validateChapter(chapter: ChapterSpec): string[] {
  const errors: string[] = [];
  const taskIds = new Set<string>();

  const allTasks: TaskCard[] = chapter.days.flatMap((day) => [
    ...day.tasks,
    ...(day.surprisePool ?? []),
  ]);

  allTasks.forEach((task) => {
    if (taskIds.has(task.id)) {
      errors.push(`업무 id 중복: ${task.id}`);
    }
    taskIds.add(task.id);

    if (task.kind === "standard") {
      if (task.tags.includes("hallucination")) {
        if (!task.aiPreview.hallucinated) {
          errors.push(`${task.id}: hallucination 태그인데 aiPreview.hallucinated 없음`);
        }
        if (!task.hallucinationDetail) {
          errors.push(`${task.id}: hallucination 태그인데 hallucinationDetail 없음`);
        }
        if (typeof task.bombTrustHit !== "number") {
          errors.push(`${task.id}: hallucination 태그인데 bombTrustHit 없음`);
        }
      }
      if (task.tags.includes("confidential") && !task.securityText) {
        errors.push(`${task.id}: confidential 태그인데 securityText 없음`);
      }
      if (task.tags.includes("trivial") && !task.delegatePenaltyText) {
        errors.push(`${task.id}: trivial 태그인데 delegatePenaltyText 없음`);
      }
      if (task.directCost.time < 1) {
        errors.push(`${task.id}: directCost.time은 1 이상이어야 함`);
      }
    }

    if (task.kind === "choice" && task.options.length < 2) {
      errors.push(`${task.id}: choice 업무는 선택지 2개 이상 필요`);
    }
  });

  // Day 검사
  const dayNumbers = new Set<number>();
  chapter.days.forEach((day) => {
    if (dayNumbers.has(day.day)) errors.push(`Day 번호 중복: ${day.day}`);
    dayNumbers.add(day.day);
    if (day.timeBudget < 1) errors.push(`Day ${day.day}: timeBudget < 1`);

    day.coaching.forEach((event) => {
      if (
        event.grantConcept &&
        !chapter.concepts.some((c) => c.id === event.grantConcept)
      ) {
        errors.push(`Day ${day.day} 코칭 ${event.id}: 정의 안 된 개념 ${event.grantConcept}`);
      }
    });
    day.fallbackConcepts.forEach((id) => {
      if (!chapter.concepts.some((c) => c.id === id)) {
        errors.push(`Day ${day.day}: 정의 안 된 fallback 개념 ${id}`);
      }
    });
  });

  // 보스 검사
  chapter.boss.rounds.forEach((round) => {
    if (round.bombTaskId) {
      if (!taskIds.has(round.bombTaskId)) {
        errors.push(`보스 라운드 ${round.id}: 존재하지 않는 bombTaskId ${round.bombTaskId}`);
      }
      if (!round.bombReveal || round.bombReveal.length === 0) {
        errors.push(`보스 라운드 ${round.id}: bombTaskId 있는데 bombReveal 없음`);
      }
    }
    if (round.options.length < 2) {
      errors.push(`보스 라운드 ${round.id}: 선택지 2개 이상 필요`);
    }
    round.options.forEach((option) => {
      if (option.score < 0 || option.score > 5) {
        errors.push(`보스 선택지 ${option.id}: score는 0~5`);
      }
      if (
        option.requiresConcept &&
        !chapter.concepts.some((c) => c.id === option.requiresConcept)
      ) {
        errors.push(`보스 선택지 ${option.id}: 정의 안 된 개념 ${option.requiresConcept}`);
      }
    });
  });

  // 엔딩 검사: 마지막은 catch-all
  if (chapter.endings.length === 0) {
    errors.push("엔딩이 최소 1개 필요");
  } else {
    const last = chapter.endings[chapter.endings.length - 1];
    if (last.minTrust !== undefined || last.minKpi !== undefined) {
      errors.push(`마지막 엔딩 ${last.id}은 조건 없는 catch-all이어야 함`);
    }
  }

  // 개념 검사
  const conceptIds = new Set<string>();
  chapter.concepts.forEach((concept) => {
    if (conceptIds.has(concept.id)) errors.push(`개념 id 중복: ${concept.id}`);
    conceptIds.add(concept.id);
    if (!concept.classSlug) errors.push(`개념 ${concept.id}: classSlug 없음`);
  });

  return errors;
}
