import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@gblockparty/shared", "@gblockparty/core"],
};

export default nextConfig;
