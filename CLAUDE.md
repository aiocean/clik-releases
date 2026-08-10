# clik-releases

Landing page for Clik

**URL:** https://clik.aiocean.io (Cloudflare Pages)

**Separate git repo:** `github.com/aiocean/clik-releases`

**Tauri app:** `/Users/firegroup/projects/clik/clik` - the main Tauri app source code (React + Rust)

## Product: Clik - AI-First Screenshot Tool

Clik là macOS screenshot tool được xây dựng cho AI workflows. Khác với các tool truyền thống (Shottr, CleanShot X), Clik được thiết kế riêng cho việc chia sẻ screenshots với AI assistants như ChatGPT, Claude, và Gemini.

### Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| AI-first workflow | Capture → Annotate → Send to AI (one click) |
| Minimal tools | Chỉ 5 annotation tools (không phải 16+ như Shottr) |
| Numbered markers | Auto-increment counters cho precise AI reference |
| One-click AI sharing | Direct share to ChatGPT, Claude, Gemini |
| Native performance | Rust backend, Tauri, <50ms capture speed |

### Target Users

**Primary:** AI Power Users - Developers, designers, product managers dùng AI assistants hàng ngày

**Use cases:**
- Code review với AI debugging assistance
- UI feedback iteration với AI visual analysis
- Bug reports với AI context
- Documentation với AI input

### Core Features

| Feature | Hotkey | Description |
|---------|--------|-------------|
| Area Capture | `Cmd+Shift+4` | Drag to select, pre-capture preserves hover states |
| Quick Capture | Configurable | Direct to clipboard, no editor |
| Box Tool | `B` | Highlight areas (hollow rectangle) |
| Arrow Tool | `A` | Point to elements (bendable) |
| Text Tool | `T` | Add notes (auto text color) |
| Blur Tool | `U` | Hide sensitive info |
| Counter Tool | `C` | Step numbers 1,2,3... (auto-increment) |

**Counter Tool là killer feature:** Cho phép AI reference chính xác ("fix issue at marker 1", "check marker 2")

### Advanced Features

- **Multi-capture session:** Capture nhiều screenshots, switch qua thumbnails
- **Image editing:** Crop, aspect ratio (16:9, 4:3, 1:1), border radius, background colors
- **Import:** Paste images, drag onto canvas, paste text as annotation
- **Export:** Drag annotated image from canvas, clipboard, save to disk

### AI Sharing (v0.16.0+)

**Workflow:**
```
[Share] → Upload to iili.io → Copy Link → Open AI Chat (image pre-loaded)
```

**Supported platforms:**
- ChatGPT (chat.openai.com)
- Claude (claude.ai/new)
- Gemini (gemini.google.com/app)

**Note:** Images are public and cannot be deleted. Private cloud storage planned for future.

### Monetization Model

| Tier | Features |
|------|----------|
| Free | Full feature access (không gating) |
| Paid | Supporter status + badge only |

Checkout qua Polar (buy.polar.sh)

### Tech Stack

```
Tauri 2.0
├─ Frontend: React 19, Tailwind, Tldraw (headless)
├─ Backend:  Rust, screencapturekit-rs, image
├─ Build:    Vite 7, Bun
└─ Release:  GitHub Actions
```

### Performance

| Metric | Target | Status |
|--------|--------|--------|
| Capture speed | <50ms | ✅ Met |
| Display speed | <300ms | ✅ Met |
| App size | <15MB | ✅ Met |
| Memory | <100MB | ✅ Met |

### Distribution

- **Platform:** macOS only (Arm64, Intel deprecated)
- **Format:** DMG
- **Hosting:** GitHub Releases (aiocean/clik-releases)
- **Auto-update:** In-app với Tauri updater
- **Signing:** Ad-hoc signing với Tauri signer

## Tech Stack

- **Build:** Vite 7
- **Styling:** Tailwind CSS v4 (new @theme syntax)
- **JS:** Vanilla TypeScript (no framework)
- **Fonts:** Space Grotesk, JetBrains Mono, Material Symbols
- **Package Manager:** Bun

## Development

```bash
bun install
bun run dev      # Dev server
bun run build    # Build to dist/
bun run preview  # Preview build
```

## Structure

```
clik-releases/
├── index.html       # Landing page (entry point)
├── src/
│   ├── main.ts      # JS interactions (mobile menu, card animations, copy button)
│   └── style.css    # Tailwind config + custom animations
├── public/images/   # Marketing images, favicons — copied verbatim to dist/images/
├── docs/screenshot/ # App screenshots
├── dist/            # Build output (git-ignored)
└── vite.config.ts   # Builds to dist/
```

## Key Details

**Build output:** `bun run build` writes to `dist/`, which is git-ignored. `index.html` at the repo root is the source entry: it references `/src/main.ts` and `/images/*` and is never overwritten by a build.

**Static files:** anything under `public/` is copied to `dist/` untouched, so `/images/favicon-32x32.png` keeps a stable URL. Referencing a hashed build artifact from `index.html` instead would make each build re-hash it, growing the filename one layer per build.

**Version updates:** Download URL in `index.html` line 817 needs manual update on release:
```html
curl -L https://github.com/aiocean/clik-releases/releases/download/v0.16.25/clik_0.16.25_aarch64.dmg ...
```

**Tailwind v4:** Uses `@theme` block in style.css for custom colors/animations - different from v3 config.

**Animations:**
- `animate-marquee` - Tools/testimonials scroll
- `animate-pulse-slow` - Hero center node
- FLIP animation - Floating cards expand/collapse

## Deployment

Cloudflare Pages, deployed manually from the local build:

```bash
bun run build
wrangler pages deploy dist --project-name=clik-releases
```

**URLs:**
- Production: https://clik.aiocean.io
- Preview: https://<hash>.clik-releases.pages.dev

`git push` publishes source only — the live site changes when `wrangler pages deploy` runs.

### Base Path

`base: "/"` in vite.config.ts, matching both the root of the custom domain and the dev server.

### Other

- DMG files hosted on GitHub Releases (not in repo)
