import React from "react";
import { AbsoluteFill } from "remotion";
import { NeoCard } from "./shared/NeoCard";
import { NEO, CATEGORY_COLORS } from "./shared/tokens";

export interface PostThumbnailProps {
  title: string;
  category: string;
}

export const PostThumbnail: React.FC<PostThumbnailProps> = ({
  title,
  category,
}) => {
  const cat = CATEGORY_COLORS[category] || CATEGORY_COLORS.AI_TECH;

  // 제목 길이에 따라 폰트 크기 조정
  const fontSize = title.length > 30 ? 38 : title.length > 20 ? 44 : 52;

  return (
    <AbsoluteFill>
      <NeoCard accentColor={cat.bg}>
        {/* 카테고리 배지 */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          {/* 배지 그림자 */}
          <div
            style={{
              position: "absolute",
              top: NEO.SHADOW_SM,
              left: NEO.SHADOW_SM,
              padding: "8px 24px",
              backgroundColor: NEO.BLACK,
            }}
          >
            <span style={{ visibility: "hidden", fontSize: 16, fontWeight: 800 }}>
              {cat.label}
            </span>
          </div>
          {/* 배지 본체 */}
          <div
            style={{
              position: "relative",
              padding: "8px 24px",
              backgroundColor: cat.bg,
              border: `2px solid ${NEO.BLACK}`,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: cat.text,
                letterSpacing: 2,
                fontFamily: NEO.FONT,
              }}
            >
              {cat.label}
            </span>
          </div>
        </div>

        {/* 제목 */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.4,
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 900,
              color: NEO.BLACK,
              fontFamily: NEO.FONT,
              letterSpacing: -1,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </span>
        </div>

        {/* 구분선 */}
        <div
          style={{
            width: 700,
            height: 3,
            backgroundColor: NEO.BLACK,
            marginTop: 24,
            marginBottom: 16,
          }}
        />

        {/* 블로그명 */}
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#666666",
            fontFamily: NEO.FONT,
          }}
        >
          digitalmarketer.co.kr
        </span>
      </NeoCard>
    </AbsoluteFill>
  );
};
