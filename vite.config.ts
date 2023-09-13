import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@common", replacement: "/src/common" },
      { find: "@modules", replacement: "/src/modules" },
    ],
  },
  optimizeDeps: {
    exclude: ["react-hook-form"],
  },
});
