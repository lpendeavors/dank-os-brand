# DankOS — Premium Cannabis Brand Site

A modern, premium web experience for DankOS, built with Next.js 14, Tailwind CSS, and TypeScript.

## Setup

```bash
cd web
npm install
npm run dev
# → http://localhost:3000
```

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout, fonts, metadata
│   │   ├── page.tsx          # Landing page (all sections)
│   │   └── globals.css       # Tailwind directives + design tokens
│   └── components/
│       ├── Header.tsx        # Sticky header + mobile drawer
│       ├── Footer.tsx        # Dark footer with nav + socials
│       └── Logo.tsx          # SVG leaf icon + wordmark
├── tailwind.config.ts        # Custom color palette, fonts, shadows
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `forest-700` | `#1B5E20` | Primary deep forest green (brand core) |
| `emerald-500` | `#10B981` | Primary action / accent (buttons, links) |
| `gold-400` | `#D4AF37` | Premium accent (gradients, highlights) |
| `forest-900` | `#0d3311` | Page background |
| `white` | `#ffffff` | Text on dark backgrounds |
| `white/60` | — | Secondary text |

### Typography

- **Sans-serif (body):** Inter (`--font-sans`)
- **Display (headings):** Playfair Display (`--font-display`)
- Headings use `font-display` class + `font-display` CSS variable
- Subtle letter-spacing on CTAs and labels via `tracking-widest`

### Buttons

- `.btn-primary` — Emerald gradient, rounded-full, uppercase tracking
- `.btn-gold` — Gold background, forest text, rounded-full
- `.btn-outline` — Emerald border, transparent fill, rounded-full

### Shadows

- `shadow-glow` — Emerald soft glow (primary buttons)
- `shadow-gold` — Gold subtle shadow (gold buttons)

## Tailwind Custom Classes

```bash
# Extended colors
bg-forest-700, text-emerald-500, bg-gold-400

# Fonts
font-sans, font-display

# Utilities
text-gold-gradient, text-emerald-gradient

# Components
.btn-primary, .btn-gold, .btn-outline
```

## Scripts

```bash
npm run dev      # Development server (HMR)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Brand Notes

- **Tone:** Premium, confident, scientific yet approachable
- **Aesthetic:** Dark backgrounds, clean lines, gold accents sparingly used
- **Photography direction:** High-end product shots on dark, moody backgrounds; botanical macro photography; clean lifestyle imagery
