import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 개발 환경에서는 next/image 최적화를 끔 → 브라우저가 직접 localhost:8080에서 로드
    // (최적화 ON 상태에서는 Next.js 서버가 localhost를 private IP로 간주해 차단)
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/static/**",
      },
    ],
  },
};

export default nextConfig;
