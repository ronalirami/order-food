import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hindari inferensi root salah jika ada package-lock.json di folder induk (mis. home)
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
