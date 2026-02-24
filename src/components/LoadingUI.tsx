"use client";

import { useEffect, useMemo, useState } from "react";

interface Quote {
    text: string;
    author: string;
}

const QUOTES: Quote[] = [
    { text: "희망은\n깨어 있는 자의 꿈이다.", author: "아리스토텔레스" },
    { text: "가장 큰 영광은\n넘어지지 않는 것이 아니라,\n매번 일어서는 것이다.", author: "공자" },
    { text: "천 리 길도\n한 걸음부터 시작된다.", author: "노자" },
    { text: "삶이 있는 한,\n희망은 있다.", author: "키케로" },
    { text: "네 자신을 알라.", author: "소크라테스" },
    { text: "인내는 쓰지만\n그 열매는 달다.", author: "장자크 루소" },
    { text: "오늘 할 수 있는 일을\n내일로 미루지 마라.", author: "벤저민 프랭클린" },
    { text: "행복은 습관이다.\n그것을 몸에 지니라.", author: "엘버트 허버드" },
    { text: "사랑만이\n사랑을 불러온다.", author: "소포클레스" },
    { text: "슬픔의 유일한 치료제는\n행동이다.", author: "토머스 칼라일" },
    { text: "삶이란\n가까이서 보면 비극이고,\n멀리서 보면 희극이다.", author: "찰리 채플린" },
    { text: "용기란\n두려움이 없는 것이 아니라,\n두려움을 이기는 것이다.", author: "넬슨 만델라" },
    { text: "세상에서 가장 용감한 행위는\n스스로 생각하는 것이다.", author: "코코 샤넬" },
    { text: "작은 기회로부터\n위대한 업적이 시작된다.", author: "데모스테네스" },
    { text: "실패는\n성공의 어머니다.", author: "토머스 에디슨" },
    { text: "배움에는\n왕도가 없다.", author: "유클리드" },
    { text: "마음이 가난한 자는\n복이 있나니.", author: "예수" },
    { text: "어둠은 어둠으로\n몰아낼 수 없다.\n오직 빛만이 할 수 있다.", author: "마틴 루터 킹" },
    { text: "사람의 아름다움은\n마음속에 있다.", author: "석가모니" },
    { text: "뜻이 있는 곳에\n길이 있다.", author: "링컨" },
    { text: "삶을 사랑하라,\n그러면 삶도\n너를 사랑할 것이다.", author: "괴테" },
    { text: "최선을 다하라.\n그것이 당신이 할 수 있는\n전부다.", author: "마더 테레사" },
    { text: "한 사람에게 친절한 것이\n세상을 바꾸는 시작이다.", author: "간디" },
    { text: "겨울이 오면\n봄이 멀지 않으리.", author: "퍼시 비시 셸리" },
    { text: "위대한 일은\n작은 일들이 모여 이루어진다.", author: "빈센트 반 고흐" },
    { text: "인생에서 가장 큰 행복은\n사랑받고 있다는 확신이다.", author: "빅토르 위고" },
    { text: "오늘이 인생에서\n가장 젊은 날이다.", author: "탈무드" },
    { text: "웃음은\n마음의 조깅이다.", author: "노먼 커즌스" },
    { text: "고통이 남기고 간 뒤를 보라.\n고통이 지나면\n반드시 기쁨이 온다.", author: "괴테" },
    { text: "사람은 누구나\n자기 운명의 개척자다.", author: "살루스티우스" },
    { text: "진정한 지혜는\n자신이 무지하다는 것을\n아는 것이다.", author: "소크라테스" },
    { text: "남에게 대접을\n받고자 하는 대로\n남을 대접하라.", author: "예수" },
    { text: "물은 너무 맑으면\n물고기가 없고,\n사람은 너무 살피면\n벗이 없다.", author: "공자" },
    { text: "아는 것이 힘이다.", author: "프랜시스 베이컨" },
    { text: "상상력은\n지식보다 중요하다.", author: "알베르트 아인슈타인" },
    { text: "가장 어두운 밤도\n끝나고 해는 뜬다.", author: "빅토르 위고" },
    { text: "자기 자신에 대한 신뢰가\n성공의 첫 번째 비결이다.", author: "에머슨" },
    { text: "오래 참으면\n큰 뜻을 이룬다.", author: "맹자" },
    { text: "고난의 시기에\n동요하지 않는 것,\n이것이 뛰어난 인물의\n증거다.", author: "베토벤" },
    { text: "모든 불행은\n미래에 대한 디딤돌에\n지나지 않는다.", author: "헨리 데이비드 소로" },
    { text: "세상에서 가장 아름다운 것은\n눈에 보이지 않는다.\n마음으로 느끼는 것이다.", author: "생텍쥐페리" },
    { text: "진정한 벗은\n하나의 영혼이\n두 육체에 깃든 것이다.", author: "아리스토텔레스" },
    { text: "사랑은\n많이 가진 자가 주는 것이 아니라,\n가진 것을 나누는 자가\n주는 것이다.", author: "마더 테레사" },
    { text: "넘어진 곳에서 다시 일어서면\n그것이 곧 성공이다.", author: "퇴계 이황" },
    { text: "온 세상이 당신을 포기해도,\n당신만은\n당신을 포기하지 마라.", author: "정약용" },
    { text: "진심은\n반드시 통한다.", author: "장자" },
    { text: "결코 어제를 후회하지 마라.\n인생은\n오늘의 나 안에 있다.", author: "톨스토이" },
    { text: "우리 자신을 믿으면\n할 수 없는 일은 없다.", author: "헬렌 켈러" },
    { text: "사람을 귀하게 여기는 것이\n세상의 근본이다.", author: "세종대왕" },
    { text: "행복의 한쪽 문이 닫히면\n다른 쪽 문이 열린다.", author: "헬렌 켈러" },
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
                        <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground whitespace-pre-line">
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
