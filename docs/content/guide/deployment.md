# Production Deployment & Hosting Guide

How to deploy CairnJS applications, documentation, and standalone components to cloud platforms with maximum performance, security, and global edge caching.

---

## 1. Deploying to Vercel (Recommended)

CairnJS is optimized for zero-config Vercel edge deployment with the included [`vercel.json`](file:///c:/Users/Eldrex/Downloads/classhost/Needs/PapyrusJS/vercel.json).

### `vercel.json` Configuration:
```json
{
  "version": 2,
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)\\.wasm",
      "headers": [{ "key": "Content-Type", "value": "application/wasm" }]
    },
    {
      "source": "/(.*)\\.(woff2|woff|ttf)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ],
  "routes": [
    { "src": "^/docs/(.*)", "dest": "/docs/$1" },
    { "src": "^/examples/(.*)", "dest": "/examples/$1" },
    { "src": "^/dist/(.*)", "dest": "/dist/$1" },
    { "src": "^/src/(.*)", "dest": "/src/$1" },
    { "src": "^/$", "dest": "/docs/index.html" }
  ]
}
```

### Deploying via Vercel CLI:
```bash
npm i -g vercel
vercel deploy --prod
```

---

## 2. Deploying to Cloudflare Pages & Netlify

### Cloudflare Pages:
1. Connect your GitHub repository: `https://github.com/EldrexDelosReyesBula/CairnJS`.
2. Build command: `node build.js`
3. Output directory: `.` (or `/docs`)

### Netlify (`netlify.toml`):
```toml
[build]
  publish = "."
  command = "node build.js"

[[headers]]
  for = "/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
```

---

## 3. Bundling with Vite, Rollup & esbuild

While CairnJS requires zero build tools for development, you can create optimized production bundles:

### Vite Configuration (`vite.config.js`):
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});
```

---

## 4. Production Performance Checklist

- [x] **Enable Gzip / Brotli compression** on all `.js`, `.css`, and `.json` responses.
- [x] **Set immutable Cache-Control headers** on `/dist/` bundles and `/cairn-font/` font files.
- [x] **Serve WASM with `application/wasm` MIME type** to allow streaming compilation (`WebAssembly.instantiateStreaming`).
- [x] **Use HTTP/2 or HTTP/3** for parallel module resolution without bundling bottlenecks.
