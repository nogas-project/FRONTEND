import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env:{
        BE_URL: process.env.BE_URL || "https://nogas.ddns.net/api",
    }
};

export default nextConfig;
