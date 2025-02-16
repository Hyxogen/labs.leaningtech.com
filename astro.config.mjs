import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import pagefind from "astro-pagefind";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import astroExpressiveCode from "astro-expressive-code";
const prod = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
	integrations: [
		astroExpressiveCode(),
		mdx(),
		sitemap(),
		tailwind(),
		robotsTxt(),
		pagefind(),
		svelte(),
		prefetch({
			// Prefetch hovered internal links
			intentSelector: ["a[href^='/']"],
		}),
	],
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
	},
	compressHTML: prod,
	build: {
		format: "file",
		inlineStylesheets: "auto",
	},
	trailingSlash: "never",
});
