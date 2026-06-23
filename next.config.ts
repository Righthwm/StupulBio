import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (local-dev database) must not be bundled by Turbopack — it relies on
  // native filesystem/WASM access that breaks when bundled. No effect on the
  // production Neon path.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
