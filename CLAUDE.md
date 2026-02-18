# Egertv Portfolio - Claude Code Instructions

## Quick Reference

| Item | Value |
|------|-------|
| **Live Site** | https://egertv.vercel.app |
| **GitHub** | https://github.com/keeltekool/nordic-portfolio |
| **Project Path** | `C:\Users\Kasutaja\Claude_Projects\nordic-portfolio` |
| **Owner** | Egert Väinaste |
| **LinkedIn** | https://www.linkedin.com/in/egert-vainaste/ |
| **Stack** | Next.js 16 + Tailwind CSS v4 + TypeScript |

---

## Common Tasks

### Add a New Project

1. Edit `data/projects.json`
2. Add new object to the `projects` array:
```json
{
  "id": "unique-kebab-case-id",
  "title": "Project Title",
  "description": "Short description (1-2 sentences max).",
  "url": "https://live-app-url.com",
  "github": "https://github.com/keeltekool/repo-name",
  "image": "/screenshots/unique-kebab-case-id.webp",
  "updatedAt": "YYYY-MM-DD",
  "stack": {
    "builtWith": "Next.js, React, Tailwind CSS",
    "services": "Vercel (hosting), ServiceName (purpose)",
    "howItWorks": "One sentence explaining the core mechanism."
  }
}
```
3. **Capture a screenshot** (MANDATORY — see Screenshot Rules below)
4. Commit and push — Vercel auto-deploys

**Note**: To find live URLs for projects, run:
```bash
gh repo list keeltekool --json name,homepageUrl -L 20
```

### Screenshot Rules (MANDATORY for every project)

Every project card MUST have a screenshot. Follow these rules exactly:

**Capture settings:**
- **Viewport:** 600px wide (mobile-ish, so content fills the frame)
- **Scale factor:** 2x (retina quality)
- **Color scheme:** light
- **Region:** Crop to hero/branding area only (~600x380px). NO full-page captures.
- **Wait:** 2s after load for animations to settle

**Image specs:**
- **Format:** WebP, quality 85
- **Filename:** `public/screenshots/{project-id}.webp` (must match `id` in projects.json)
- **What to capture:** Logo, headline, key UI — the visually distinctive part. Zoom in. NOT a tiny full-page overview.

**Card display rules (enforced in ProjectCard.tsx):**
- All images render at **fixed height `h-48`** with `object-cover object-top`
- This ensures all cards align evenly side by side — NEVER use `h-auto`
- A `border-t-2` separates the image from the text content below

**Quick capture script** (install playwright temporarily, then remove):
```bash
npm install --no-save playwright
npx playwright install chromium
```
```js
// Then in a .mjs script:
const context = await browser.newContext({
  viewport: { width: 600, height: 500 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({
  path: `public/screenshots/${id}.webp`,
  type: "png",
  clip: { x: 0, y: 0, width: 600, height: 380 },
});
// Then convert to WebP with sharp (already in Next.js):
// sharp(input).webp({ quality: 85 }).toFile(output)
```
```bash
npm uninstall playwright  # Clean up after
```

### Remove a Project

1. Edit `data/projects.json` — delete the project object
2. Delete its screenshot from `public/screenshots/`
3. Commit and push

### Reorder Projects

1. Edit `data/projects.json`
2. Change the order of objects in the array (first = top-left)
3. Commit and push

### Update Intro Text

Edit `components/Intro.tsx`

### Update Header (Name/Links)

Edit `components/Header.tsx`

---

## Project Structure

```
nordic-portfolio/
├── app/
│   ├── layout.tsx        # Root layout + theme provider (max-w-4xl)
│   ├── page.tsx          # Main page (sorts by updatedAt)
│   └── globals.css       # Tailwind + CSS variables + stack-details animation
├── components/
│   ├── Header.tsx        # Name + LinkedIn + theme toggle
│   ├── Intro.tsx         # Author bio
│   ├── ProjectCard.tsx   # Card: screenshot + title + desc + links + stack
│   ├── ProjectGrid.tsx   # 2-column grid container
│   ├── Footer.tsx        # Footer
│   ├── ThemeProvider.tsx  # Dark/light mode wrapper
│   └── ThemeToggle.tsx   # Theme switch button
├── data/
│   └── projects.json     # ⭐ MAIN CONFIG FILE (all projects + stack + image)
├── lib/
│   └── types.ts          # TypeScript interfaces (Project, Stack)
├── public/
│   └── screenshots/      # ⭐ Project screenshots (WebP, ~15-70KB each)
└── package.json
```

---

## Current Projects (in projects.json)

1. **QuoteKit** - AI quoting/invoicing for Estonian tradespeople | [App](https://quote-kit.vercel.app)
2. **Lead Radar** - AI lead generation for consultants | [App](https://lead-radar-two.vercel.app)
3. **Prop-Radar** - Estonian real estate search + AI analysis | [App](https://prop-radar-one.vercel.app)
4. **ApplyKit** - Full-stack AI job application platform | [App](https://cv-tailor-plus.vercel.app)
5. **Skrift-CV** - Nordic CV/cover letter builder | [App](https://skrift-cv.vercel.app)
6. **Feedboard** - Track topics across News/Reddit | [App](https://data-tracker-alpha.vercel.app/)
7. **Personal Finance Tracker** - Bank statement analyzer with AI | [App](https://personal-finance-tracker-iota-dusky.vercel.app)
8. **CV Tailor** - AI-powered resume tailoring | [App](https://cv-tailor-omega.vercel.app)
9. **Allekirjoitus.fi** - E-signature design system | [App](https://allekirjoitus-design-system.vercel.app/website/en/index.html)
10. **Pocket Clone** - Link-saving with AI categorization | [App](https://pocket-clone-virid.vercel.app)
11. **Spotify Artist Browser** - Browse 5,800+ artists by genre | [App](https://spotify-artist-browser-gamma.vercel.app)
12. **Spotify Genre Browser** - Browse Spotify genre tree | [App](https://keeltekool.github.io/spotify-discovery/)
13. **PicMachine Web** - Cloud image viewer | [App](https://picmachine.vercel.app)
14. **DJ Portfolio** - Interactive 3D DJ portfolio | [App](https://dj-portfolio-omega.vercel.app)

---

## Project Card Format

Each card displays:
- **Screenshot** (fixed height, cropped hero/branding — links to live app)
- **Title** (project name)
- **Description** (1-2 sentences)
- **"Open App"** link → `url` field (opens live app)
- **"GitHub"** link → `github` field (opens repo)
- **"Stack details"** toggle → expandable section showing:
  - **Built with** — frameworks and libraries
  - **Services** — external services with their purpose
  - **How it works** — one-sentence core mechanism

The stack details section is collapsed by default. Click to expand/collapse with smooth animation.

---

## Design Notes

- **Style**: Minimal, clean (inspired by leerob.io)
- **Colors Light**: bg #fafafa, text #171717, border #e5e5e5
- **Colors Dark**: bg #0a0a0a, text #ededed, border #262626
- **Layout**: Max-width 896px (max-w-4xl), 2-column card grid on desktop, 1-column on mobile
- **Card images**: Fixed `h-48`, `object-cover object-top`, border-t-2 separator
- **Theme**: System preference default, toggle in header
- **Stack details**: CSS grid transition (grid-template-rows 0fr → 1fr) + opacity

---

## Deployment

- **Live URL**: https://egertv.vercel.app
- **Auto-deploy**: Push to `master` branch → Vercel deploys automatically
- **Manual deploy**: `vercel --prod` from project directory
- **Change domain**: `vercel alias set <deployment-url> <new-alias>.vercel.app`

---

## Development

```bash
cd C:\Users\Kasutaja\Claude_Projects\nordic-portfolio
npm run dev     # Start dev server at localhost:3000
npm run build   # Build for production
```

---

## Useful Commands

```bash
# Check git status
git status

# Deploy changes
git add -A && git commit -m "Message" && git push

# List all Vercel projects with URLs
gh repo list keeltekool --json name,homepageUrl -L 20

# Add Vercel alias
vercel alias set <deployment> <alias>.vercel.app
```
