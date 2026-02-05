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
  "stack": {
    "builtWith": "Next.js, React, Tailwind CSS",
    "services": "Vercel (hosting), ServiceName (purpose)",
    "howItWorks": "One sentence explaining the core mechanism."
  }
}
```
3. Commit and push - Vercel auto-deploys

**Note**: To find live URLs for projects, run:
```bash
gh repo list keeltekool --json name,homepageUrl -L 20
```

### Remove a Project

1. Edit `data/projects.json`
2. Delete the project object from the array
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
│   ├── layout.tsx        # Root layout + theme provider
│   ├── page.tsx          # Main page
│   └── globals.css       # Tailwind + CSS variables + stack-details animation
├── components/
│   ├── Header.tsx        # Name + LinkedIn + theme toggle
│   ├── Intro.tsx         # Author bio
│   ├── ProjectCard.tsx   # Single project card (links + expandable stack details)
│   ├── ProjectGrid.tsx   # Grid container
│   ├── Footer.tsx        # Footer
│   ├── ThemeProvider.tsx # Dark/light mode wrapper
│   └── ThemeToggle.tsx   # Theme switch button
├── data/
│   └── projects.json     # ⭐ MAIN CONFIG FILE (all projects + stack data)
├── lib/
│   └── types.ts          # TypeScript interfaces (Project, Stack)
└── package.json
```

---

## Current Projects (in projects.json)

1. **Feedboard** - Track topics across News/Reddit | [App](https://data-tracker-alpha.vercel.app/)
2. **Personal Finance Tracker** - Bank statement analyzer with AI | [App](https://personal-finance-tracker-iota-dusky.vercel.app)
3. **CV Tailor** - AI-powered resume tailoring | [App](https://cv-tailor-omega.vercel.app)
4. **Allekirjoitus.fi** - E-signature design system | [App](https://allekirjoitus-design-system.vercel.app/website/en/index.html)
5. **Pocket Clone** - Link-saving with AI categorization | [App](https://pocket-clone-virid.vercel.app)
6. **Spotify Artist Browser** - Browse 5,800+ artists by genre | [App](https://spotify-artist-browser-gamma.vercel.app)
7. **Spotify Genre Browser** - Browse Spotify genre tree | [App](https://keeltekool.github.io/spotify-discovery/)
8. **PicMachine Web** - Cloud image viewer | [App](https://picmachine.vercel.app)
9. **DJ Portfolio** - Interactive 3D DJ portfolio | [App](https://dj-portfolio-omega.vercel.app)

---

## Project Card Format

Each card displays:
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
- **Layout**: Max-width 672px, 2-column card grid on desktop, 1-column on mobile
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
