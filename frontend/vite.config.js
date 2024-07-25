import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      "/api": {
        target: "https://music-yt-spotify-rc.onrender.com", // Removed trailing slash
        changeOrigin: true, // Optional: Ensure the host header is correctly set
        secure: false, // Optional: Set to true if the target URL uses HTTPS and you want to validate the SSL certificate
      },
    },
  },
});
