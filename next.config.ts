import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Legacy redirects는 src/middleware.ts에서 통합 처리 (리디렉트 hop 수 최소화)
};

export default nextConfig;
