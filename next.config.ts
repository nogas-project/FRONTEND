import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env:{
        BE_URL: process.env.BE_URL || "https://nogas.ddns.net/api",
    }
  /* config options here */
};

export default nextConfig;
