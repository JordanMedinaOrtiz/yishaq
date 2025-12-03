// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  // Habilitar SSR (Server-Side Rendering)
  output: "server",

  // Adaptador de Vercel para producción serverless
  adapter: vercel(),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
