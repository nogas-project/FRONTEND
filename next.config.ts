import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env:{
        BE_URL: process.env.BE_URL || "http://nogas.ddns.net:5000",
    }
};

export default nextConfig;
