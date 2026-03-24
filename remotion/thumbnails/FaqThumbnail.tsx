import React from "react";
import { AbsoluteFill } from "remotion";
import { NeoCard } from "./shared/NeoCard";
import { NEO } from "./shared/tokens";

export interface FaqThumbnailProps {
  title: string;
  category: string;
}

export const FaqThumbnail: React.FC<FaqThumbnailProps> = ({
  title,
  category,
}) => {
  const fontSize = title.length > 40 ? 32 : title.length > 25 ? 38 : 44;

  return (
    <AbsoluteFill>
      <NeoCard accentColor={NEO.YELLOW}>
        {/* FAQ 배지 */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div
            style={{
              position: "absolute",
              top: NEO.SHADOW_SM,
              left: NEO.SHADOW_SM,
              padding: "8px 24px",
              backgroundColor: NEO.BLACK,
            }}
          >
            <span style={{ visibility: "hidden", fontSize: 18, fontWeight: 800 }}>FAQ</span>
          </div>
          <div
            style={{
              position: "relative",
              padding: "8px 24px",
              backgroundColor: NEO.YELLOW,
              border: `2px solid ${NEO.BLACK}`,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: NEO.BLACK,
                letterSpacing: 3,
                fontFamily: NEO.FONT,
              }}
            >
              FAQ
            </span>
          </div>
        </div>

        {/* 물음표 + 질문 텍스트 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            maxWidth: 780,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: NEO.RED,
              fontFamily: NEO.FONT,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ?
          </span>
          <span
            style={{
              fontSize,
              fontWeight: 800,
              color: NEO.BLACK,
              fontFamily: NEO.FONT,
              lineHeight: 1.35,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </span>
        </div>

        {/* 블로그명 */}
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#666666",
            fontFamily: NEO.FONT,
            marginTop: 30,
          }}
        >
          digitalmarketer.co.kr
        </span>
      </NeoCard>
    </AbsoluteFill>
  );
};
