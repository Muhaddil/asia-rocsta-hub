export const CURRENT_VERSION = "1.4.6";

export type Localized = { es: string; en: string; fr?: string; pt?: string; de?: string };

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: Localized[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.4.6",
    date: "2026-07-06",
    changes: [
      {
        es: "Se han actualizado diversas dependencias de la web",
        en: "Update several web dependencies",
      },
      {
        es: "Se mejoró la ruta raíz con datos estructurados para SEO, incluyendo el esquema de sitio web y organización.",
        en: "Enhanced the root route with structured data for SEO, including WebSite and Organization schema.",
      },
      {
        es: "Se han mejorado las rutas de página individuales (índice, acerca de, registro de cambios, próximamente, comunidad, compatibilidad).",
        en: "Improved individual page routes (index, about, changelog, coming soon, community, compatibility).",
      },
      {
        es: "Se ha actualizado la versión del proyecto a la 1.4.6",
        en: "Bump project version to 1.4.6",
      },
    ],
  },
  {
    version: "1.4.5",
    date: "2026-06-24",
    changes: [
      {
        es: "Se han añadido guías detalladas de RPM para Asia Rocsta 1.8 gasolina y 2.2 diésel en about.ts, incluyendo rangos de RPM óptimos, zonas de par y riesgos asociados.",
        en: "Added detailed RPM guides for Asia Rocsta 1.8 Petrol and 2.2 Diesel in about.ts, including optimal RPM ranges, torque zones, and associated risks.",
      },
      {
        es: "Se ha modificado el componente de diálogo en el apartado de Acerca de para mejorar el diseño y el manejo de desbordamientos.",
        en: "Modified dialog component in the About section for improved layout and overflow handling.",
      },
      {
        es: "Se ha actualizado la versión del proyecto a la 1.4.5",
        en: "Bump project version to 1.4.5",
      },
    ],
  },
  {
    version: "1.4.41",
    date: "2026-06-24",
    changes: [
      {
        es: "Se han actualizado diversas dependencias de la web",
        en: "Update several web dependencies",
      },
      {
        es: "Se ha actualizado la versión del proyecto a la 1.4.41",
        en: "Bump project version to 1.4.4",
      },
    ],
  },
  {
    version: "1.4.4",
    date: "2026-06-09",
    changes: [
      {
        es: "Se han arreglado unos datos incorrectos sobre las motorizaciones del Rocsta",
        en: "Fix incorrect data about Rocsta engine options",
      },
      {
        es: "Se han actualizado diversas dependencias de la web",
        en: "Update several web dependencies",
      },
      {
        es: "Se ha actualizado la versión del proyecto a la 1.4.4",
        en: "Bump project version to 1.4.4",
      },
    ],
  },
  {
    version: "1.4.3",
    date: "2026-06-09",
    changes: [
      {
        es: "Se ha añadido una galería comunitaria con vista previa en la página principal y soporte para visualización ampliada de imágenes",
        en: "Add community gallery with homepage preview and lightbox support",
      },
      {
        es: "Se ha añadido una página completa de galería con paginación y traducciones multilingües",
        en: "Add full gallery page with pagination and multi-language localization",
      },
      {
        es: "Se han localizado los enlaces de navegación y las etiquetas SEO de la galería",
        en: "Localize gallery navigation links and SEO meta tags",
      },
      {
        es: "Se ha actualizado el sitemap para incluir las nuevas rutas de la galería",
        en: "Update sitemap to include new gallery routes",
      },
      {
        es: "Se ha actualizado la versión del proyecto a la 1.4.3",
        en: "Bump project version to 1.4.3",
      },
    ],
  },
  {
    version: "1.4.2",
    date: "2026-06-09",
    changes: [
      {
        es: "Se ha corregido el rol de accesibilidad de los elementos del diagrama de sistemas, cambiándolo de enlace a botón",
        en: "Fix accessibility role from link to button on system diagram elements",
      },
      {
        es: "Se ha actualizado una dependencia de la web",
        en: "Web dependency has been updated",
      },
      {
        es: "Se ha reestructurado el sistema de rutas para utilizar localePath en todas las páginas en lugar de rutas codificadas",
        en: "Rework routing to use localePath across all pages instead of hardcoded paths",
      },
      {
        es: "Se han añadido etiquetas localizadas para los prefijos de búsqueda en todos los idiomas compatibles",
        en: "Add localized search prefix labels for all supported locales",
      },
      {
        es: "Se han eliminado los dos puntos finales redundantes en los textos de la interfaz de los archivos de idioma",
        en: "Clean up redundant trailing colons from UI text in locale files",
      },
      {
        es: "Se ha eliminado un elemento span vacío que no se utilizaba en el componente SiteFooter",
        en: "Remove unused empty span in SiteFooter component",
      },
    ],
  },
  {
    version: "1.4.1",
    date: "2026-06-08",
    changes: [
      {
        es: "Se han eliminado las guías estáticas",
        en: "Static guides have been removed",
      },
      {
        es: "Se han actualizado las dependencias de la web",
        en: "Web dependencies have been updated",
      },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-06-05",
    changes: [
      {
        es: "Añadido sistema de versiones y página de changelog",
        en: "Added version and changelog page & system",
      },
      {
        es: "Foro de comunidad añadido con soporte i18n completo",
        en: "Community forum added with full i18n support",
      },
      {
        es: "Añadido componente tooltip y varias correcciones de localización",
        en: "Added tooltip component and various localization fixes",
      },
      {
        es: "Tests completos para datos del proyecto y utilidades",
        en: "Comprehensive test suites for project data and utilities",
      },
      {
        es: "Corregido enrutamiento de enlaces y fallbacks para rutas localizadas",
        en: "Fixed link routing and fallbacks for localized paths",
      },
      {
        es: "Corregidos filtros de idioma portugués y problemas de tipos i18n",
        en: "Fixed Portuguese language filters and i18n type issues",
      },
      {
        es: "Corregido enlace del gallery de comunidad a la página de comunidad",
        en: "Fixed community gallery link target to community page",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-06-01",
    changes: [
      {
        es: "Guías de reparación estructuradas con listas de herramientas, imágenes de pasos y flujo de envío",
        en: "Structured repair guides with tool lists, step images and submission flow",
      },
      {
        es: "Soporte de idioma portugués (PT) añadido",
        en: "Portuguese (PT) language support added",
      },
      {
        es: "Service worker y optimizaciones de rendimiento CSS",
        en: "Service worker and CSS performance optimizations",
      },
      {
        es: "Página Coming Soon con traducciones y enrutamiento",
        en: "Coming Soon page with translations and routing",
      },
      {
        es: "Soporte de variable de entorno BASE_URL para despliegues en subpath",
        en: "BASE_URL environment variable support for subpath deployments",
      },
      {
        es: "Refactor del sistema de localización mejorado",
        en: "Improved localization system refactor",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-05-31",
    changes: [
      {
        es: "Soporte completo de sitio multi-idioma (ES/EN/PT)",
        en: "Full multi-language site support (ES/EN/PT)",
      },
      {
        es: "Meta tags SEO sensibles al idioma en todas las rutas",
        en: "Language-aware SEO meta tags across all routes",
      },
      {
        es: "Google Fonts cargados de forma asíncrona con fallback para no-script",
        en: "Google Fonts loaded asynchronously with no-script fallback",
      },
      {
        es: "Plugin de optimización de imágenes y mejor control de caché de assets",
        en: "Image optimization plugin and improved asset cache control",
      },
      {
        es: "Generación de sitemap y meta tag de verificación de Google",
        en: "Sitemap generation and Google site verification meta tag",
      },
      {
        es: "Mejoras de SEO y accesibilidad en todas las rutas",
        en: "SEO and accessibility improvements across all routes",
      },
      {
        es: "Detalles de manuales de taller y catálogo de piezas actualizados",
        en: "Workshop manual details and parts catalog information updated",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-05-28",
    changes: [
      {
        es: "Página de problemas con búsqueda y filtros",
        en: "Problems page with search and filter functionality",
      },
      {
        es: "Reporte de problemas con integración API y feedback de usuarios",
        en: "Problem reporting with API integration and user feedback",
      },
      {
        es: "Soporte de localización del campo OEM en datos de piezas y API",
        en: "OEM field localization support in parts data and API",
      },
      {
        es: "Configuración de despliegue en GitHub Pages y setup de Vite",
        en: "GitHub Pages deployment configuration and Vite setup",
      },
      {
        es: "Mejoras en el manejo de errores para envíos a la API",
        en: "Error handling improvements for API submissions",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-05-27",
    changes: [
      {
        es: "Lanzamiento inicial de Asia Rocsta Archive",
        en: "Initial release of Asia Rocsta Archive",
      },
      {
        es: "Catálogo de piezas con referencias cruzadas OEM",
        en: "Parts catalog with OEM cross-references",
      },
      {
        es: "Base de datos de compatibilidad (motores Mazda F8/R2)",
        en: "Compatibility swaps database (Mazda F8/R2 engines)",
      },
      {
        es: "Manuales de taller y procedimientos de reparación",
        en: "Workshop manuals and repair procedures",
      },
      {
        es: "Base de datos de problemas típicos y diagnósticos",
        en: "Typical issues and troubleshooting database",
      },
      {
        es: "Soporte multi-idioma base (ES/EN)",
        en: "Base multi-language support (ES/EN)",
      },
    ],
  },
];
