# PixelateBanana portfolio

Open `index.html` in a browser, or serve the folder (for example `npx serve .`). GSAP is bundled in `vendor/`. Fonts (Anybody, Geist, IBM Plex Mono) load from Google Fonts, so they need an internet connection.

## Add your projects and screenshots
Open `index.html` and find `const PROJECTS=[` near the top of the script. For each project set:
- `image`: path or URL of the cover screenshot (replaces the generated placeholder)
- `gallery`: array of screenshot paths for the case-study gallery
- `outcome`: a real result, or leave `null` to show the "To add" note

Put images in an `assets/` folder next to `index.html`, for example `image:'assets/husn-cover.jpg'`.

## Settings (`CONFIG`, same place)
- `email`: where the brief should be sent
- `endpoint`: URL that receives the brief as JSON (POST). Empty means the form only shows a copyable brief.
- `availability`: text for the status line in the hero

## Next step
This is a standalone page. A Next.js + TypeScript + Tailwind + Framer Motion version can be built from it.
