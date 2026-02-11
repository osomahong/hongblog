/**
 * 브랜드 에셋 생성 스크립트
 * - 파비콘: public/profile-illustration.png → 정사각형 크롭 + 리사이즈
 * - OG 이미지: 네오 브루탈리즘 SVG → sharp PNG 변환
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const APP = path.join(ROOT, "src", "app");
const PROFILE_SRC = path.join(PUBLIC, "profile-illustration.png");

// ─── 1. 파비콘 생성 (프로필 이미지 기반) ────────────────────────────

interface FaviconSpec {
  size: number;
  filename: string;
  outputDir: string;
}

const FAVICON_SPECS: FaviconSpec[] = [
  { size: 32, filename: "favicon.ico", outputDir: APP },
  { size: 180, filename: "apple-icon.png", outputDir: APP },
  { size: 192, filename: "icon.png", outputDir: APP },
  { size: 512, filename: "icon-512.png", outputDir: PUBLIC },
];

async function generateFavicons() {
  console.log("\n🎨 파비콘 생성 시작...");

  const metadata = await sharp(PROFILE_SRC).metadata();
  const w = metadata.width!;
  const h = metadata.height!;

  // 중앙 기준 정사각형 크롭 (500x500 from 534x500)
  const cropSize = Math.min(w, h);
  const left = Math.floor((w - cropSize) / 2);
  const top = Math.floor((h - cropSize) / 2);

  const cropped = sharp(PROFILE_SRC).extract({
    left,
    top,
    width: cropSize,
    height: cropSize,
  });

  // 크롭된 버퍼를 한번만 생성
  const croppedBuffer = await cropped.png().toBuffer();

  for (const spec of FAVICON_SPECS) {
    const outputPath = path.join(spec.outputDir, spec.filename);
    await sharp(croppedBuffer).resize(spec.size, spec.size).png().toFile(outputPath);
    console.log(`  ✅ ${spec.filename} (${spec.size}x${spec.size}) → ${path.relative(ROOT, outputPath)}`);
  }

  console.log("✅ 파비콘 생성 완료!\n");
}

// ─── 2. OG 이미지 생성 (네오 브루탈리즘 SVG) ────────────────────────

function generateHalftonePattern(): string {
  // 우하단 코너에 하프톤 도트 패턴 (globals.css .halftone-corner 재현)
  const dots: string[] = [];
  for (let x = 950; x <= 1180; x += 8) {
    for (let y = 480; y <= 610; y += 8) {
      const opacity = ((x - 950) / 230) * ((y - 480) / 130) * 0.25;
      if (opacity > 0.03) {
        dots.push(`<circle cx="${x}" cy="${y}" r="1.5" fill="rgba(0,0,0,${opacity.toFixed(2)})" />`);
      }
    }
  }
  return dots.join("\n    ");
}

function generateNeoBrutalistOgSvg(): string {
  // 디자인 시스템 토큰
  const BG = "#F3F3F3";
  const BLACK = "#000000";
  const WHITE = "#FFFFFF";
  const RED = "#FF0000";
  const YELLOW = "#FFD700";
  const BORDER = 4;
  const SHADOW = 6;
  const FONT = "'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 -->
  <rect width="1200" height="630" fill="${BG}" />

  <!-- 장식: 배경 사각형들 (살짝 기울어진 네오 브루탈리즘 장식) -->
  <rect x="40" y="30" width="90" height="90" fill="${YELLOW}" stroke="${BLACK}" stroke-width="3" transform="rotate(-3 85 75)" />
  <rect x="1060" y="40" width="70" height="70" fill="${RED}" stroke="${BLACK}" stroke-width="3" transform="rotate(5 1095 75)" />
  <rect x="80" y="500" width="60" height="60" fill="${RED}" stroke="${BLACK}" stroke-width="3" transform="rotate(4 110 530)" />
  <rect x="1080" y="510" width="80" height="80" fill="${YELLOW}" stroke="${BLACK}" stroke-width="3" transform="rotate(-2 1120 550)" />

  <!-- 펑크 버스트 별 (globals.css .punk-burst 재현) -->
  <polygon points="170,55 176,70 192,70 179,79 184,94 170,85 156,94 161,79 148,70 164,70"
           fill="${YELLOW}" stroke="${BLACK}" stroke-width="1.5" />
  <polygon points="1020,520 1026,535 1042,535 1029,544 1034,559 1020,550 1006,559 1011,544 998,535 1014,535"
           fill="${RED}" stroke="${BLACK}" stroke-width="1.5" />

  <!-- 메인 카드 (neo-shadow-lg: 6px 6px 0px #000) -->
  <rect x="${150 + SHADOW}" y="${115 + SHADOW}" width="900" height="400" fill="${BLACK}" />
  <rect x="150" y="115" width="900" height="400" fill="${WHITE}" stroke="${BLACK}" stroke-width="${BORDER}" />

  <!-- 카드 상단 액센트 바 -->
  <rect x="150" y="115" width="900" height="12" fill="${RED}" stroke="${BLACK}" stroke-width="${BORDER}" />

  <!-- 타이틀: 준이아빠블로그 -->
  <text x="600" y="255" text-anchor="middle"
        font-family="${FONT}" font-size="64" font-weight="900" fill="${BLACK}"
        letter-spacing="-2">
    준이아빠블로그
  </text>

  <!-- 서브타이틀 배지 (NeoBadge 스타일) -->
  <rect x="${600 - 195 + 3}" y="${283 + 3}" width="390" height="48" fill="${BLACK}" />
  <rect x="${600 - 195}" y="283" width="390" height="48" fill="${YELLOW}" stroke="${BLACK}" stroke-width="3" />
  <text x="600" y="316" text-anchor="middle"
        font-family="${FONT}" font-size="22" font-weight="800" fill="${BLACK}"
        letter-spacing="3" text-transform="uppercase">
    AI-ENHANCED TECH WIKI
  </text>

  <!-- 구분선 -->
  <line x1="250" y1="360" x2="950" y2="360" stroke="${BLACK}" stroke-width="3" />

  <!-- 카테고리 태그들 (NeoTagBadge 스타일) -->
  <!-- 디지털 마케팅 -->
  <rect x="${360 + 2}" y="${382 + 2}" width="210" height="40" fill="${BLACK}" />
  <rect x="360" y="382" width="210" height="40" fill="${RED}" stroke="${BLACK}" stroke-width="2" />
  <text x="465" y="409" text-anchor="middle"
        font-family="${FONT}" font-size="16" font-weight="700" fill="${WHITE}">
    DIGITAL MARKETING
  </text>

  <!-- AI -->
  <rect x="${590 + 2}" y="${382 + 2}" width="60" height="40" fill="${BLACK}" />
  <rect x="590" y="382" width="60" height="40" fill="${YELLOW}" stroke="${BLACK}" stroke-width="2" />
  <text x="620" y="409" text-anchor="middle"
        font-family="${FONT}" font-size="16" font-weight="700" fill="${BLACK}">
    AI
  </text>

  <!-- 데이터 분석 -->
  <rect x="${670 + 2}" y="${382 + 2}" width="170" height="40" fill="${BLACK}" />
  <rect x="670" y="382" width="170" height="40" fill="${WHITE}" stroke="${BLACK}" stroke-width="2" />
  <text x="755" y="409" text-anchor="middle"
        font-family="${FONT}" font-size="16" font-weight="700" fill="${BLACK}">
    DATA ANALYTICS
  </text>

  <!-- 하단 텍스트 -->
  <text x="600" y="485" text-anchor="middle"
        font-family="${FONT}" font-size="18" font-weight="500" fill="#666666">
    digitalmarketer.co.kr
  </text>

  <!-- 하프톤 도트 패턴 (우하단 코너) -->
  <g>
    ${generateHalftonePattern()}
  </g>
</svg>`;
}

async function generateOgImage() {
  console.log("🖼️  OG 이미지 생성 시작 (네오 브루탈리즘)...");

  const svg = generateNeoBrutalistOgSvg();

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PUBLIC, "og-default.png"));

  console.log("  ✅ og-default.png (1200x630) → public/og-default.png");
  console.log("✅ OG 이미지 생성 완료!\n");
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 브랜드 에셋 생성 스크립트 시작\n");

  // 디렉토리 확인
  if (!fs.existsSync(PROFILE_SRC)) {
    console.error(`❌ 프로필 이미지를 찾을 수 없습니다: ${PROFILE_SRC}`);
    process.exit(1);
  }

  await generateFavicons();
  await generateOgImage();

  console.log("🎉 모든 브랜드 에셋 생성 완료!");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
