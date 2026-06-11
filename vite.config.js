import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = (env.VITE_ADMIN_API_URL || "http://localhost:8081").replace(/\/+$/, "");
  const webTarget = (env.VITE_WEB_PORTAL_ORIGIN || "http://localhost:5173").replace(/\/+$/, "");

  const proxy = {
    "/uploads": {
      target: apiTarget,
      changeOrigin: true,
    },
    // Same static paths as Web portal (FeaturedPickles fallbacks: /images/...)
    "/images": {
      target: webTarget,
      changeOrigin: true,
    },
  };

  /** Production build is deployed at https://yourdomain.com/admin/ on shared hosts (e.g. Hostinger). Dev stays at /. */
  const base = mode === "production" ? "/admin/" : "/";

  return {
    base,
    plugins: [react()],
    server: {
      port: 5174,
      proxy,
    },
    preview: {
      proxy,
    },
  };
});
