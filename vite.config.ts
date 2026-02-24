import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    mkcert({
      hosts: ["tiktok.local.pl"],
      autoUpgrade: true,
      certFileName: "tiktok.local",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
