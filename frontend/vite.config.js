import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      "/api": {
        target: "https://music-yt-spotify-rc.onrender.com/",
      },
    },
  },
});
