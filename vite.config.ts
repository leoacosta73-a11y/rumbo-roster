import vinext from "vinext";
import { defineConfig } from "vite";

// Rumbo is exported as a static GitHub Pages site. Cloudflare worker bindings
// are intentionally omitted from this build because the app is browser-only.
export default defineConfig({
  plugins: [vinext()],
});
