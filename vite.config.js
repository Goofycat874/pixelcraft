import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Absolute site URL for social previews (WhatsApp/Facebook need absolute og:image URLs).
// Set SITE_URL for a custom domain; on Vercel it falls back to the project's production URL.
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/$/, "");

const siteMeta = {
  name: "site-meta",
  transformIndexHtml(html, ctx) {
    if (ctx.path !== "/index.html") return html; // demo pages keep their own head
    const canonical = siteUrl ? `\n    <link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />` : "";
    return html.replaceAll("%SITE_URL%", siteUrl).replace("</title>", `</title>${canonical}`);
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta],
  build: {
    rollupOptions: {
      // the main site plus three concept demo sites, each its own page
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        velorra: resolve(import.meta.dirname, "demos/velorra/index.html"),
        monsoon: resolve(import.meta.dirname, "demos/monsoon/index.html"),
        crumb: resolve(import.meta.dirname, "demos/crumb/index.html"),
      },
    },
  },
});
