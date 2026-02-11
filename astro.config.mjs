// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// ❌ Eliminamos el import de Netlify

export default defineConfig({
  site: "https://JuaniMP.github.io",
  // base: '/nombre-de-tu-repo', // 👈 Descomenta esto si tu repo NO se llama "JuaniMP.github.io"
  output: 'static',
  integrations: [mdx(), sitemap(), icon()],
  // ❌ Eliminamos la línea de adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
});