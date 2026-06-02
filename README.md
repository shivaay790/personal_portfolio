# Shivaay Dhondiyal – Immersive Portfolio

An interactive, cinematic portfolio that blends polished UI, 3D storytelling, and systems automation. It opens with a wormhole splash, transitions into a responsive single-page experience, and lets visitors launch supporting AI projects through a 3D control room. The site is built with Vite + React, enhanced by React Three Fiber, Tailwind, shadcn/ui, and optional Tauri desktop capabilities.

## Live Demo

| Environment | URL / Notes |
|-------------|-------------|
| Production  | _Add your deployed URL once available_ |
| Preview     | `npm run preview` serves the latest build locally on port 4173 |

## Highlights

- **Cinematic intro** – Neon cursor, snake trail toggle, and wormhole splash sequence lead into the hero section.
- **3D project explorer** – React Three Fiber scene that orbits portfolio projects and can trigger local launchers.
- **Playable playground** – Project controls bridge to external VITON (Virtual Try-On) services via custom middleware.
- **Contact automation** – Resend-backed email workflow sends notifications to you and confirmations to visitors.
- **Desktop-ready** – Tauri scaffolding provides a path to a native portfolio app with deeper OS integrations.
- **Modern theming** – Tailwind CSS with shadcn/ui components, animated gradients, and responsive layout.

## Tech Stack

- **Core**: Vite, React 18, TypeScript, React Router
- **UI & Styling**: Tailwind CSS, shadcn/ui, clsx, tailwind-merge, Lucide icons
- **3D & Animation**: React Three Fiber, Drei, Three.js, GSAP, custom shader effects
- **State & Data**: TanStack Query, React Hook Form, Zod validation
- **Tooling**: ESLint (flat config), PostCSS, Tauri 2, Netlify deployment config
- **APIs & Services**: Resend email API, Express-based VITON process orchestrator, custom Vite middleware

## Project Structure

```
.
├── public/                 # Static assets (images, robots.txt, etc.)
├── src/
│   ├── components/         # UI sections, 3D explorer, effects, shadcn wrappers
│   ├── api/                # Resend email helper + VITON process spawner
│   ├── hooks/              # Custom hooks (scroll reveal, toasts, mobile)
│   ├── data/               # Structured data powering project sections
│   ├── fx/                 # Text effects and animation helpers
│   ├── pages/              # SPA routes (`Index`, `NotFound`)
│   └── main.tsx            # App bootstrap (React Router root)
├── src-tauri/              # Tauri-specific config and Rust entry point
├── dist/                   # Production build output (`npm run build`)
├── server.js               # Express + Vite middleware server with VITON routes
├── vite-plugin-viton-api.js# Dev-only plugin exposing `/api/*` endpoints
├── netlify.toml            # Netlify SPA + Node version config
└── tailwind.config.ts      # Tailwind setup with shadcn presets
```

## Getting Started

### 1. Prerequisites

- Node.js 18+ (Netlify build targets 18.x)
- npm 9+ (ships with Node 18)
- (Optional) Rust toolchain + Tauri CLI 2.x for desktop builds
- (Optional) Resend account for transactional email

### 2. Install dependencies

```sh
git clone <your-fork-url>
cd 7_personal_portfolio
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```
RESEND_API_KEY=your_resend_api_key
```

Then update the sender addresses in `src/api/email-service.js` to match a verified domain:

```js
from: 'Portfolio Contact <contact@yourdomain.com>'
```

If you are not using Resend, replace the implementation in `sendContactEmail` with your preferred provider (SendGrid, Mailgun, EmailJS, etc.).

### 4. Development workflows

- `npm run dev` – Vite dev server with hot reload at `http://localhost:8080`.  
  The custom `vitonApiPlugin` runs only in development and exposes `/api/*` endpoints for starting/stopping VITON processes and handling contact emails.

- `npm run dev:express` – Starts the standalone Express middleware server defined in `server.js`. Use this when you want to test the VITON process orchestration outside of Vite’s middleware mode.

- `npm run tauri:dev` – Boots the Tauri desktop shell (requires the Rust toolchain, Tauri CLI, and platform-specific prerequisites).

> **Note:** The VITON integration expects local directories pointing to separate frontend/backend repos. Update the paths in `vite.config.ts`, `server.js`, and `src/api/viton-spawner.js` to match your machine.

### 5. Useful scripts

| Script             | Description |
|--------------------|-------------|
| `npm run build`    | Generates an optimized production build in `dist/` |
| `npm run build:dev`| Build using development mode (faster, less optimized) |
| `npm run preview`  | Serves the production build locally on port 4173 |
| `npm run lint`     | Runs ESLint across the project |
| `npm run tauri:build` | Produces a distributable desktop application (platform-dependent) |

## Deployment

- **Static hosting**: Run `npm run build` and upload the `dist/` folder to Netlify, Vercel, GitHub Pages, or any static host. The included `netlify.toml` sets up a SPA redirect and pins Node 18.
- **Custom domain**: Configure via your hosting provider (for Netlify: Dashboard → Domain Management → Add domain).
- **Desktop app**: Use `npm run tauri:build` once your Tauri prerequisites are installed. This bundles the web assets with the Rust backend into native binaries.

## Integrations & Configuration Notes

- **Contact form**: The UI submits to `/api/send-contact-email`. In production, host this endpoint yourself (Cloudflare Workers, AWS Lambda, Express, etc.) or wire it to your preferred email provider. Running without a valid API key will log errors but fail gracefully in the UI.
- **VITON controls**: The Playground section can start or stop external processes (for the Virtual Try-On system) by hitting `/api/start-viton-frontend`, `/api/start-viton-backend`, `/api/viton-status`, and `/api/stop-viton`. These endpoints are development-only; restrict or remove them before deploying to the public web.
- **Tauri mode**: Components such as `TauriStatus` detect the Tauri environment and adjust behavior (e.g., project launcher permissions). Desktop builds unlock deeper OS integrations compared to the web demo.

## Contributing / Customizing

1. Fork the repository and create a feature branch.
2. Make your updates (animations, data, assets, integration tweaks).
3. Run `npm run lint` and `npm run build` to ensure quality.
4. Open a Pull Request or merge internally.

Feel free to adapt the copy, imagery, and project data in `src/data/projectData.ts` to reflect your own portfolio content.

---

_Crafted by Shivaay Dhondiyal. Reach out via the contact form or at shivaaydhondiyal23@gmail.com if you build on this project._
