# Production Deployment & Hosting Guide

How to deploy CairnJS applications, documentation, and standalone components to modern hosting platforms.

---

## 1. Deploying to Vercel

CairnJS is structured for straightforward Vercel deployment with the included [`vercel.json`](vercel.json).

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
1. Connect your GitHub repository.
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

While CairnJS requires zero build tools for development, you can create bundled output if desired:

### Vite Configuration (`vite.config.js`):
```javascript static
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

## 4. Production Checklist

- [x] **Enable Compression**: Use Gzip or Brotli compression on text assets (`.js`, `.css`, `.json`).
- [x] **Cache Headers**: Set long-lived caching headers on `/dist/` build artifacts.
- [x] **WASM MIME Type**: Serve `.wasm` files with `application/wasm` headers.
- [x] **Modern HTTP**: Use HTTP/2 or HTTP/3 for parallel module delivery.
