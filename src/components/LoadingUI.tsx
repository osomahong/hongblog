"use client";

import { useEffect, useMemo, useState } from "react";

interface Quote {
    text: string;
    author: string;
}

const QUOTES: Quote[] = [
    { text: "희망은 깨어 있는 자의 꿈이다.", author: "아리스토텔레스" },
    { text: "가장 큰 영광은 넘어지지 않는 것이 아니라, 매번 일어서는 것이다.", author: "공자" },
    { text: "천 리 길도 한 걸음부터 시작된다.", author: "노자" },
    { text: "삶이 있는 한, 희망은 있다.", author: "키케로" },
    { text: "네 자신을 알라.", author: "소크라테스" },
    { text: "인내는 쓰지만 그 열매는 달다.", author: "장자크 루소" },
    { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤저민 프랭클린" },
    { text: "행복은 습관이다. 그것을 몸에 지니라.", author: "엘버트 허버드" },
    { text: "사랑만이 사랑을 불러온다.", author: "소포클레스" },
    { text: "슬픔의 유일한 치료제는 행동이다.", author: "토머스 칼라일" },
    { text: "삶이란 가까이서 보면 비극이고, 멀리서 보면 희극이다.", author: "찰리 채플린" },
    { text: "용기란 두려움이 없는 것이 아니라, 두려움을 이기는 것이다.", author: "넬슨 만델라" },
    { text: "세상에서 가장 용감한 행위는 스스로 생각하는 것이다.", author: "코코 샤넬" },
    { text: "작은 기회로부터 위대한 업적이 시작된다.", author: "데모스테네스" },
    { text: "실패는 성공의 어머니다.", author: "토머스 에디슨" },
    { text: "배움에는 왕도가 없다.", author: "유클리드" },
    { text: "마음이 가난한 자는 복이 있나니.", author: "예수" },
    { text: "어둠은 어둠으로 몰아낼 수 없다. 오직 빛만이 할 수 있다.", author: "마틴 루터 킹" },
    { text: "사람의 아름다움은 마음속에 있다.", author: "석가모니" },
    { text: "뜻이 있는 곳에 길이 있다.", author: "링컨" },
    { text: "삶을 사랑하라, 그러면 삶도 너를 사랑할 것이다.", author: "괴테" },
    { text: "최선을 다하라. 그것이 당신이 할 수 있는 전부다.", author: "마더 테레사" },
    { text: "한 사람에게 친절한 것이 세상을 바꾸는 시작이다.", author: "간디" },
    { text: "겨울이 오면 봄이 멀지 않으리.", author: "퍼시 비시 셸리" },
    { text: "위대한 일은 작은 일들이 모여 이루어진다.", author: "빈센트 반 고흐" },
    { text: "인생에서 가장 큰 행복은 사랑받고 있다는 확신이다.", author: "빅토르 위고" },
    { text: "오늘이 인생에서 가장 젊은 날이다.", author: "탈무드" },
    { text: "웃음은 마음의 조깅이다.", author: "노먼 커즌스" },
    { text: "고통이 남기고 간 뒤를 보라. 고통이 지나면 반드시 기쁨이 온다.", author: "괴테" },
    { text: "사람은 누구나 자기 운명의 개척자다.", author: "살루스티우스" },
    { text: "진정한 지혜는 자신이 무지하다는 것을 아는 것이다.", author: "소크라테스" },
    { text: "남에게 대접을 받고자 하는 대로 남을 대접하라.", author: "예수" },
    { text: "물은 너무 맑으면 물고기가 없고, 사람은 너무 살피면 벗이 없다.", author: "공자" },
    { text: "아는 것이 힘이다.", author: "프랜시스 베이컨" },
    { text: "상상력은 지식보다 중요하다.", author: "알베르트 아인슈타인" },
    { text: "가장 어두운 밤도 끝나고 해는 뜬다.", author: "빅토르 위고" },
    { text: "자기 자신에 대한 신뢰가 성공의 첫 번째 비결이다.", author: "에머슨" },
    { text: "오래 참으면 큰 뜻을 이룬다.", author: "맹자" },
    { text: "고난의 시기에 동요하지 않는 것, 이것이 진정 칭찬받을 만한 뛰어난 인물의 증거다.", author: "베토벤" },
    { text: "모든 불행은 미래에 대한 디딤돌에 지나지 않는다.", author: "헨리 데이비드 소로" },
    { text: "세상에서 가장 아름다운 것은 눈에 보이지 않는다. 마음으로 느끼는 것이다.", author: "생텍쥐페리" },
    { text: "진정한 벗은 하나의 영혼이 두 육체에 깃든 것이다.", author: "아리스토텔레스" },
    { text: "사랑은 많이 가진 자가 주는 것이 아니라, 가진 것을 나누는 자가 주는 것이다.", author: "마더 테레사" },
    { text: "넘어진 곳에서 다시 일어서면 그것이 곧 성공이다.", author: "퇴계 이황" },
    { text: "온 세상이 당신을 포기해도, 당신만은 당신을 포기하지 마라.", author: "정약용" },
    { text: "진심은 반드시 통한다.", author: "장자" },
    { text: "결코 어제를 후회하지 마라. 인생은 오늘의 나 안에 있다.", author: "톨스토이" },
    { text: "우리 자신을 믿으면 할 수 없는 일은 없다.", author: "헬렌 켈러" },
    { text: "사람을 귀하게 여기는 것이 세상의 근본이다.", author: "세종대왕" },
    { text: "행복의 한쪽 문이 닫히면 다른 쪽 문이 열린다.", author: "헬렌 켈러" },
];

/**
 * Fisher-Yates 셔플로 배열을 무작위로 섞어 반환한다.
 * 단순 Math.random()과 달리 모든 항목이 고르게 순환된다.
 */
function shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** 셔플된 큐에서 하나씩 꺼내며, 소진되면 재셔플하여 고르게 분배한다. */
let queue: Quote[] = [];
function pickQuote(): Quote {
    if (queue.length === 0) queue = shuffle(QUOTES);
    return queue.pop()!;
}

/**
 * 경량 로딩 인디케이터 — "Identity Card" 방식.
 * - 200ms 이내에 렌더링이 완료되면 아예 표시하지 않아 깜빡임을 방지한다.
 * - 200ms 이후에도 로딩 중이면 불투명 배경 + 브랜드 카드를 표시한다.
 * - Next.js App Router의 Suspense 경계가 해제되면 즉시 언마운트된다.
 */
export function LoadingUI() {
    const [visible, setVisible] = useState(false);
    const quote = useMemo(() => pickQuote(), []);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <>
            {/* 상단 프로그레스 바 */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100 overflow-hidden">
                <div
                    className="h-full w-full bg-primary"
                    style={{ animation: "progress-bar 1s ease-in-out infinite" }}
                />
            </div>

            {/* 불투명 배경 + 중앙 브랜드 카드 */}
            <div className="fixed inset-0 z-[9998] bg-[#F3F3F3] flex items-center justify-center px-6">
                <div
                    className="bg-white border-4 border-black neo-shadow px-10 py-10 sm:px-14 sm:py-12 flex flex-col items-center gap-5 max-w-md w-full"
                    style={{ animation: "loading-fade-in 0.3s ease-out" }}
                >
                    {/* 프로필 일러스트 */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-black overflow-hidden neo-shadow-sm">
                        <img
                            src="/profile-illustration.png"
                            alt="Logo"
                            className="w-full h-full object-cover object-top scale-125"
                        />
                    </div>

                    {/* 블로그 이름 */}
                    <span className="text-xl sm:text-2xl font-black tracking-tighter">
                        준이아빠<span className="text-primary">블로그</span>
                    </span>

                    {/* 구분선 */}
                    <div className="w-full border-t-2 border-black" />

                    {/* 명언 */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground">
                            &ldquo;{quote.text}&rdquo;
                        </p>
                        <span className="text-xs sm:text-sm text-muted-foreground font-bold">
                            — {quote.author}
                        </span>
                    </div>

                    {/* 바운싱 도트 */}
                    <div className="flex gap-2 mt-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 border-2 border-black bg-primary"
                                style={{
                                    animation: "loading-bounce 0.6s ease-in-out infinite",
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
