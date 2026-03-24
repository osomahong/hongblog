import React from "react";
import { AbsoluteFill } from "remotion";
import { NeoCard } from "./shared/NeoCard";
import { NEO } from "./shared/tokens";

export interface ClassThumbnailProps {
  title: string;
  courseName?: string;
}

export const ClassThumbnail: React.FC<ClassThumbnailProps> = ({
  title,
  courseName,
}) => {
  const fontSize = title.length > 20 ? 40 : 52;

  return (
    <AbsoluteFill>
      <NeoCard accentColor={NEO.BLUE}>
        {/* 사전 배지 */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <div
            style={{
              position: "absolute",
              top: NEO.SHADOW_SM,
              left: NEO.SHADOW_SM,
              padding: "8px 24px",
              backgroundColor: NEO.BLACK,
            }}
          >
            <span style={{ visibility: "hidden", fontSize: 16, fontWeight: 800 }}>CLASS</span>
          </div>
          <div
            style={{
              position: "relative",
              padding: "8px 24px",
              backgroundColor: NEO.BLUE,
              border: `2px solid ${NEO.BLACK}`,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: NEO.WHITE,
                letterSpacing: 3,
                fontFamily: NEO.FONT,
              }}
            >
              CLASS
            </span>
          </div>
        </div>

        {/* 용어명 */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 780,
            lineHeight: 1.3,
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

        {/* 코스명 (있을 경우) */}
        {courseName && (
          <div
            style={{
              marginTop: 16,
              padding: "6px 20px",
              backgroundColor: NEO.BG,
              border: `2px solid ${NEO.BLACK}`,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: NEO.BLACK,
                fontFamily: NEO.FONT,
              }}
            >
              {courseName}
            </span>
          </div>
        )}

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
