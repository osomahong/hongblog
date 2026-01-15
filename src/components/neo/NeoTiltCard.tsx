"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeoTiltCardProps {
    children: ReactNode;
    className?: string;
    intensity?: number; // 회전 강도 (기본값: 25로 상향)
    shadowIntensity?: number; // 그림자 이동 강도 (기본값: 6으로 하향)
}

export function NeoTiltCard({ children, className, intensity = 25, shadowIntensity = 6 }: NeoTiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !contentRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // 카드 내 X 좌표
        const y = e.clientY - rect.top;  // 카드 내 Y 좌표

        // 중심점 계산
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 회전 각도 계산
        // intensity가 클수록 더 많이 회전
        const rotateX = ((y - centerY) / centerY) * -1 * (intensity / 2); // 위아래 반전
        const rotateY = ((x - centerX) / centerX) * (intensity / 2);

        // 그림자 이동 계산 (광원 효과)
        const shadowX = ((x - centerX) / centerX) * -shadowIntensity + 8;
        const shadowY = ((y - centerY) / centerY) * -shadowIntensity + 8;

        // 반응형 움직임을 위해 짧은 트랜지션 적용
        contentRef.current.style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";
        contentRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        contentRef.current.style.boxShadow = `${shadowX}px ${shadowY}px 0px rgba(0,0,0,1)`;
    };

    const handleMouseLeave = () => {
        if (!contentRef.current) return;

        // 원상복구 시에만 긴 트랜지션 적용
        contentRef.current.style.transition = "all 1s ease-out";
        contentRef.current.style.transform = `rotateX(0) rotateY(0)`;
        contentRef.current.style.boxShadow = `8px 8px 0px rgba(0,0,0,1)`;
    };

    return (
        <div
            ref={cardRef}
            className="relative perspective-1000 cursor-pointer" // Tailwind에서 perspective-1000 지원 필요 (혹은 style로 직접)
            style={{ perspective: "1000px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={contentRef}
                className={cn(
                    "bg-white border-3 sm:border-4 border-black p-3 sm:p-6",
                    className
                )}
                style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "8px 8px 0px rgba(0,0,0,1)" // 기본 그림자
                }}
            >
                {children}
            </div>
        </div>
    );
}
