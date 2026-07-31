# Room Design Assistant

A browser-based room planning app that generates design concepts, furniture suggestions, color palettes, shopping checklists, and simple 2D/3D room models.

Live site: https://room-design-assistant.timmyrow.chatgpt.site

## Features

- Generate room plans from room type, style, colors, budget, dimensions, and must-have items
- Preset styles: cozy, modern, minimalist, luxury, and gaming
- Room templates for bedrooms, offices, gaming setups, rentals, dining rooms, studios, and kids rooms
- Add doors, windows, outlets, ceiling lights, and extra room spaces
- Add furniture you already own with width, depth, and height
- Paste furniture links and optional 3D model links
- Interactive 2D floor plan and 3D room model
- Drag furniture, rotate it, resize it, snap it to a grid, or place it with typed commands
- Save, load, rename, duplicate, delete, and export room projects in browser storage
- Export room images, PDFs, and shopping lists
- Runs fully in the browser with no required backend

## Tech Stack

- HTML and React page markup in `app/page.tsx`
- CSS in `app/globals.css`
- Browser JavaScript in `public/room-design.js`
- Three.js for the 3D room model
- Vinext / Sites deployment

## Local Setup

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Notes

Product prices and links are planning aids. The app can create shopping search links, but users should always confirm exact product details, dimensions, availability, shipping, and cost before buying.

Saved rooms are stored in the browser's local storage on the current device.

## Roadmap Ideas

- Custom domain
- Cloud saved accounts
- More realistic built-in 3D furniture models
- Better product data through approved shopping APIs
- Shareable room links
- More export formats
