import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // Ya lo comprobamos localmente, omitir en Docker ahorra mucha RAM
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ya lo comprobamos localmente, omitir en Docker acelera el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
