import { NextConfig } from "next";

let userConfig: Partial<NextConfig> | undefined;

try {
  userConfig = require("./v0-user-next.config").default;
} catch (e) {
  // Ignore error
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

// Merge userConfig into nextConfig if it exists
const mergeConfig = (
  baseConfig: NextConfig,
  customConfig?: Partial<NextConfig>
) => {
  if (!customConfig) return baseConfig;

  for (const key in customConfig) {
    if (
      typeof baseConfig[key] === "object" &&
      !Array.isArray(baseConfig[key])
    ) {
      baseConfig[key] = {
        ...baseConfig[key],
        ...customConfig[key],
      };
    } else {
      baseConfig[key] = customConfig[key] as any;
    }
  }
  return baseConfig;
};

export default mergeConfig(nextConfig, userConfig);
