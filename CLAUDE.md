# Nordic Portfolio - Claude Code Instructions

## Quick Reference

| Item | Value |
|------|-------|
| **Live Site** | https://nordic-portfolio.vercel.app |
| **GitHub** | https://github.com/keeltekool/nordic-portfolio |
| **Project Path** | `C:\Users\Kasutaja\Claude_Projects\nordic-portfolio` |
| **Owner** | Egert Väinaste |
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
  "github": "https://github.com/keeltekool/repo-name"
}
```
3. Commit and push - Vercel auto-deploys

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
│   └── globals.css       # Tailwind + CSS variables
├── components/
│   ├── Header.tsx        # Name + LinkedIn + theme toggle
│   ├── Intro.tsx         # Author bio
│   ├── ProjectCard.tsx   # Single project card
│   ├── ProjectGrid.tsx   # Grid container
│   ├── Footer.tsx        # Footer
│   ├── ThemeProvider.tsx # Dark/light mode wrapper
│   └── ThemeToggle.tsx   # Theme switch button
├── data/
│   └── projects.json     # ⭐ MAIN CONFIG FILE
├── lib/
│   └── types.ts          # TypeScript interfaces
└── package.json
```

---

## Current Projects (in projects.json)

1. **Pocket Clone** - Link-saving app
2. **Spotify Artist Browser** - Discover artists by genre
3. **PicMachine Web** - Cloud image viewer
4. **Estonian Rap Generator** - Lyrics from keywords
5. **Wordporn** - Estonian slang collection

---

## Design Notes

- **Style**: Nordic minimal (inspired by leerob.io)
- **Colors**: Light (#fafafa bg) / Dark (#0a0a0a bg)
- **Layout**: Max-width 672px, 2-column card grid on desktop
- **Theme**: System preference default, toggle in header

---

## Deployment

- **Auto-deploy**: Push to `master` branch → Vercel deploys automatically
- **Manual deploy**: `vercel --prod` from project directory

---

## Development

```bash
cd C:\Users\Kasutaja\Claude_Projects\nordic-portfolio
npm run dev     # Start dev server at localhost:3000
npm run build   # Build for production
```
