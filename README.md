[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Muhaddil/asia-rocsta-hub)
[![Build](https://github.com/Muhaddil/asia-rocsta-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/Muhaddil/asia-rocsta-hub/actions/workflows/deploy.yml)
[![pages-build-deployment](https://github.com/Muhaddil/asia-rocsta-hub/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Muhaddil/asia-rocsta-hub/actions/workflows/pages/pages-build-deployment)

# Asia Rocsta Archive

Wiki técnica, catálogo de piezas y comunidad para el Asia Rocsta — el 4x4 clásico coreano fabricado por Asia Motors (KIA) entre 1990 y 1997, con motores Mazda F8 (1.8 gasolina) y R2 (2.2 diésel).

## 🚀 Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (SSR/SSG)
- **Router**: [TanStack Router](https://tanstack.com/router)
- **UI**: React 19 + Tailwind CSS v4 + shadcn/ui
- **Datos**: TanStack Query + API Express + SQLite
- **Build**: Vite 8
- **Deploy**: GitHub Pages

## 🏗️ Desarrollo

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm build       # Build estático
pnpm preview     # Preview del build
pnpm lint        # ESLint
pnpm format      # Prettier
```

## 📁 Estructura

```
src/
├── routes/          # Páginas (file-based routing)
├── components/      # Componentes UI compartidos
├── data/            # Datos estáticos y tipos
├── lib/             # Utilidades y API client
├── assets/          # Imágenes
└── server.ts        # Entry point SSR

public/              # Archivos estáticos (manifest, SW, robots.txt)
server/              # API server (Express + SQLite)
```

## 🌐 API

El servidor API corre en Express 5 con SQLite. La API no está en este repositorio, y no es pública.

## 🤝 Contribuir

Aporta equivalencias OEM, guías, reportes de problemas o fotos desde la página [Comunidad](https://muhaddil.github.io/asia-rocsta-hub/community).

## SEO — Palabras clave / Keywords

**ES:** Asia Rocsta, Rocsta, KIA KM410, Asia Motors, 4x4 coreano, recambios Rocsta,
piezas Asia Rocsta, equivalencias OEM, Mazda F8, Mazda R2, B2200, 626,
manuales taller Rocsta, guías reparación, foro Asia Rocsta, comunidad 4x4,
todoterreno clásico, vehículo militar KIA, descapotable 4x4, propietarios Rocsta,
restauración, mecánica, taller, despiece.

**EN:** Asia Rocsta, Rocsta, KIA KM410, Asia Motors, Korean 4x4, Rocsta parts,
OEM equivalents, Mazda F8, Mazda R2, B2200, 626, Rocsta workshop manuals,
repair guides, Rocsta forum, 4x4 community, classic off-road, KIA military vehicle,
convertible 4x4, Rocsta owners, restoration, mechanics, workshop, exploded diagrams.
