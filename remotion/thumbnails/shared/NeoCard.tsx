import React from "react";
import { NEO, THUMBNAIL } from "./tokens";

interface NeoCardProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  accentColor = NEO.RED,
}) => {
  return (
    <div
      style={{
        width: THUMBNAIL.WIDTH,
        height: THUMBNAIL.HEIGHT,
        backgroundColor: NEO.BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: NEO.FONT,
      }}
    >
      {/* 장식: 좌상단 사각형 */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 40,
          width: 90,
          height: 90,
          backgroundColor: NEO.YELLOW,
          border: `3px solid ${NEO.BLACK}`,
          transform: "rotate(-3deg)",
        }}
      />
      {/* 장식: 우상단 사각형 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          width: 70,
          height: 70,
          backgroundColor: accentColor,
          border: `3px solid ${NEO.BLACK}`,
          transform: "rotate(5deg)",
        }}
      />
      {/* 장식: 좌하단 사각형 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          width: 60,
          height: 60,
          backgroundColor: accentColor,
          border: `3px solid ${NEO.BLACK}`,
          transform: "rotate(4deg)",
        }}
      />
      {/* 장식: 우하단 사각형 */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 50,
          width: 80,
          height: 80,
          backgroundColor: NEO.YELLOW,
          border: `3px solid ${NEO.BLACK}`,
          transform: "rotate(-2deg)",
        }}
      />

      {/* 메인 카드 (그림자 + 본체) */}
      <div style={{ position: "relative" }}>
        {/* 그림자 */}
        <div
          style={{
            position: "absolute",
            top: NEO.SHADOW,
            left: NEO.SHADOW,
            width: 900,
            height: 420,
            backgroundColor: NEO.BLACK,
          }}
        />
        {/* 카드 본체 */}
        <div
          style={{
            position: "relative",
            width: 900,
            height: 420,
            backgroundColor: NEO.WHITE,
            border: `${NEO.BORDER}px solid ${NEO.BLACK}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* 상단 액센트 바 */}
          <div
            style={{
              width: "100%",
              height: 12,
              backgroundColor: accentColor,
              borderBottom: `${NEO.BORDER}px solid ${NEO.BLACK}`,
              flexShrink: 0,
            }}
          />
          {/* 콘텐츠 영역 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px 50px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
