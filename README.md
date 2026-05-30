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

El servidor API corre en Express 5 con SQLite. Ver `server/` para instrucciones.

## 🤝 Contribuir

Aporta equivalencias OEM, guías, reportes de problemas o fotos desde la página [Comunidad](https://muhaddil.github.io/asia-rocsta-hub/community).
