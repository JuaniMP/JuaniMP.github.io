// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://JuaniMP.github.io",
  output: 'static',
  integrations: [mdx(), sitemap(), icon()],
  adapter: netlify(),
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
