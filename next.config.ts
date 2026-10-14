import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 사이트로 내보냅니다. `npm run build` 뒤 `out/` 폴더를 그대로 Netlify에 올리면 됩니다.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
