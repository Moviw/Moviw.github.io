// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { unified } from "@astrojs/markdown-remark";

export default defineConfig({
  site: "https://moviw.github.io",
  integrations: [icon()],
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
  vite: { plugins: [tailwindcss()] },
});
