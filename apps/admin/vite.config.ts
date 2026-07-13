import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())], // 👈 allow the monorepo root
    },
    port: 5174,  // (admin — keep a distinct port from user)
  },
});