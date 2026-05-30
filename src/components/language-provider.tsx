import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.parts": { es: "Piezas", en: "Parts" },
  "nav.compatibility": { es: "Compatibilidades", en: "Compatibility" },
  "nav.guides": { es: "Guías", en: "Guides" },
  "nav.problems": { es: "Problemas", en: "Problems" },
  "nav.manuals": { es: "Manuales", en: "Manuals" },
  "nav.community": { es: "Comunidad", en: "Community" },
  "nav.home": { es: "Inicio", en: "Home" },

  // General Sidebar
  "sidebar.systems": { es: "Sistemas", en: "Mechanical Systems" },
  "sidebar.community": { es: "Comunidad", en: "Community Area" },
  "sidebar.missingPart": { es: "¿Te falta una pieza?", en: "Missing a part?" },
  "sidebar.missingPartDesc": {
    es: "Aporta una equivalencia OEM o una guía. La base de datos crece con la comunidad.",
    en: "Contribute an OEM cross-reference or a guide. The archive grows with the community.",
  },
  "sidebar.contribute": { es: "Contribuir →", en: "Contribute →" },

  // Sidebar Systems Categories
  "cat.engine": { es: "Motor y refrigeración", en: "Engine & Cooling" },
  "cat.transmission": { es: "Transmisión y 4x4", en: "Transmission & 4WD" },
  "cat.suspension": { es: "Suspensión y dirección", en: "Suspension & Steering" },
  "cat.electrical": { es: "Sistema eléctrico", en: "Electrical System" },
  "cat.brakes": { es: "Frenos", en: "Brakes" },
  "cat.tires": { es: "Neumáticos y ruedas", en: "Tires & Wheels" },
  "cat.body": { es: "Carrocería e interiores", en: "Body & Interiors" },

  // Community Sidebar links
  "comm.contrib": { es: "Aportar Equivalencia", en: "Submit Equivalence" },
  "comm.part": { es: "Sugerir Nueva Pieza", en: "Suggest New Part" },
  "comm.guide": { es: "Proponer Nueva Guía", en: "Suggest New Guide" },
  "comm.problem": { es: "Reportar Avería", en: "Report an Issue" },
  "comm.bug": { es: "Reportar Error Web", en: "Report Website Bug" },
  "comm.partwrong": { es: "Corregir Pieza Errónea", en: "Fix Wrong Part Data" },

  // Header and Search bar
  "search.placeholder": { es: "Buscar piezas, OEM, guías...", en: "Search parts, OEM, guides..." },
  "search.heroPlaceholder": {
    es: "Buscar por OEM, nombre de pieza, síntoma o vehículo equivalente...",
    en: "Search by OEM, part name, symptom, or equivalent vehicle...",
  },
  "search.suggested": { es: "Búsquedas sugeridas", en: "Suggested searches" },
  "search.results": { es: "Resultados del Archivo", en: "Archive Results" },
  "search.noMatches": { es: "No se encontraron coincidencias para", en: "No matches found for" },
  "search.info": {
    es: "Búsqueda estática instantánea sin bases de datos",
    en: "Static search instant query, no database required",
  },
  "search.esc": { es: "ESC para cerrar", en: "ESC to close" },

  // Homepage
  "home.title": { es: "La referencia técnica del", en: "The Technical Hub for the" },
  "home.noPopularParts": { es: "No hay piezas populares disponibles en este momento", en: "No popular parts" },
  "home.desc": {
    es: "Piezas, equivalencias con la gama Mazda (motores F8 y R2), manuales y problemas comunes — todo centrado en el 4x4 coreano de Asia Motors (KIA), derivado del vehículo militar KIA KM410.",
    en: "Parts, crossover compatibility with Mazda (F8 and R2 engines), workshop manuals, and typical issues — all centered on the iconic classic 4x4 from Asia Motors (KIA), derived from the military KIA KM410.",
  },
  "home.stats.years": { es: "Años de producción", en: "Production Years" },
  "home.stats.engines": { es: "Motores documentados", en: "Documented Engines" },
  "home.stats.markets": { es: "Mercados de venta", en: "Global Markets" },
  "home.stats.units": { es: "Unidades estimadas", en: "Estimated Units" },
  "home.quickAccess": { es: "Accesos rápidos", en: "Quick Access" },
  "home.quick.parts": { es: "Base de datos de piezas", en: "Parts Catalog" },
  "home.quick.partsDesc": {
    es: "Catálogo con OEM, medidas y compatibilidades.",
    en: "Crossover catalog with OEMs, specs, and fits.",
  },
  "home.quick.comp": { es: "Compatibilidades", en: "Crossover Swaps" },
  "home.quick.compDesc": {
    es: "Qué piezas de otros coches sirven y cómo.",
    en: "Which donor parts fit from other brands and how.",
  },
  "home.quick.guides": { es: "Guías y tutoriales", en: "Guides & Repairs" },
  "home.quick.guidesDesc": {
    es: "Reparación paso a paso con imágenes.",
    en: "Step-by-step procedures with loaded images.",
  },
  "home.quick.problems": { es: "Problemas comunes", en: "Typical Issues" },
  "home.quick.problemsDesc": {
    es: "Síntomas, causas y soluciones.",
    en: "Alert symptoms, root causes, and fixes.",
  },
  "home.quick.manuals": { es: "Manuales y PDFs", en: "Manuals & PDFs" },
  "home.quick.manualsDesc": {
    es: "Workshop, eléctricos y fichas técnicas.",
    en: "Workshop, wiring diagrams, and homologations.",
  },
  "home.quick.community": { es: "Comunidad", en: "Contributors Hub" },
  "home.quick.communityDesc": {
    es: "Foro, perfiles y aportaciones.",
    en: "Hall of fame, stats, and tech submissions.",
  },
  "home.popular": { es: "Piezas populares y equivalencias", en: "Popular Parts & Swaps" },
  "home.popular.viewAll": { es: "Ver catálogo completo →", en: "View full catalog →" },
  "home.popular.part": { es: "Pieza", en: "Component" },
  "home.popular.oem": { es: "OEM", en: "OEM Code" },
  "home.popular.equiv": { es: "Equivalente", en: "Donor Brand" },
  "home.popular.status": { es: "Estado", en: "Status" },
  "home.popular.verified": { es: "Verificado", en: "Verified" },
  "home.popular.requiresMod": { es: "Requiere mod.", en: "Requires mod" },
  "home.guides.recent": { es: "Guías destacadas", en: "Featured Guides" },
  "home.guides.all": { es: "Todas las guías →", en: "All guides →" },
  "home.guides.read": { es: "Ver paso a paso →", en: "View step-by-step →" },
  "home.guides.contribs": { es: "contribuciones", en: "contributions" },
  "home.issues.timeline": { es: "Registro de problemas comunes", en: "Common Issues Timeline" },
  "home.issues.desc": {
    es: "Síntomas y averías frecuentes reportadas por la comunidad Rocsta.",
    en: "Frequented alert symptoms reported by Rocsta owners.",
  },
  "home.issues.viewAll": { es: "Ver base de problemas →", en: "View issues database →" },

  // Parts Catalog Route
  "parts.title": { es: "Catálogo de piezas y repuestos", en: "Component & Spare Parts Catalog" },
  "parts.desc": {
    es: "Explora la base de datos de referencias OEM de Asia Motors. Filtra por sistema mecánico para encontrar equivalentes directos de Mazda, Kia y marcas aftermarket.",
    en: "Explore the official Asia Motors OEM parts index. Filter by mechanical system to locate direct crossover parts from Mazda, Kia, and aftermarket brands.",
  },
  "parts.searchPlaceholder": {
    es: "Buscar repuesto por nombre, OEM o equivalente...",
    en: "Search spares by name, OEM, or donor...",
  },
  "parts.verificationStatus": {
    es: "Verificación",
    en: "Verification",
  },
  "parts.filter.allCategories": { es: "Cualquier categoría", en: "All Categories" },
  "parts.filter.allEngines": { es: "Cualquier motor", en: "All Engines" },
  "parts.filter.engineGas": { es: "Mazda F8 Gasolina", en: "Mazda F8 Petrol" },
  "parts.filter.engineDiesel": { es: "Mazda R2 Diésel", en: "Mazda R2 Diesel" },
  "parts.filter.engineBoth": { es: "Ambos motores", en: "Both Engines" },
  "parts.filter.allStatus": { es: "Cualquier verificación", en: "All Verifications" },
  "parts.filter.statusVerified": { es: "Solo verificado", en: "Verified Fit" },
  "parts.filter.statusMod": { es: "Requiere modificación", en: "Requires Modification" },
  "parts.filter.statusUnverified": { es: "Sin verificar", en: "Unverified / Unknown" },
  "parts.results.count": { es: "piezas coinciden", en: "parts match" },
  "parts.table.name": { es: "Repuesto / Sistema", en: "Spare Part / System" },
  "parts.table.oem": { es: "OEM Asia Motors", en: "Asia Motors OEM" },
  "parts.table.crossover": { es: "Cruces de Marcas", en: "Brand Crossovers" },
  "parts.table.engine": { es: "Motor", en: "Engine" },
  "parts.table.status": { es: "Estado", en: "Status" },
  "parts.table.actions": { es: "Acciones", en: "Actions" },
  "parts.table.details": { es: "Detalles", en: "Specs" },
  "parts.dialog.title": { es: "Ficha técnica del repuesto", en: "Spare Part Technical Sheet" },
  "parts.dialog.category": { es: "Categoría del sistema", en: "System Category" },
  "parts.dialog.oem": { es: "Referencia OEM original", en: "Original OEM Reference" },
  "parts.dialog.alternatives": {
    es: "Referencias cruzadas equivalentes",
    en: "Equivalent Crossover References",
  },
  "parts.dialog.notes": { es: "Notas de montaje y consejos", en: "Fitting Notes & Advice" },
  "parts.dialog.emptyNotes": {
    es: "Sin notas especiales para este repuesto.",
    en: "No special fitting notes for this spare part.",
  },
  "parts.dialog.engine": { es: "Compatibilidad de motor", en: "Engine Compatibility" },
  "parts.dialog.verification": {
    es: "Verificación de compatibilidad",
    en: "Compatibility Verification",
  },
  "parts.dialog.close": { es: "Cerrar ficha", en: "Close Sheet" },
  "parts.noResults": { es: "Sin repuestos", en: "No spare parts" },
  "parts.noResultsDesc": {
    es: "Ninguno de los repuestos archivados coincide con tu búsqueda.",
    en: "None of our archived spare parts match your search.",
  },
  "parts.reset": { es: "Resetear filtros", en: "Reset Filters" },

  // Compatibility Route
  "comp.title": { es: "Buscador de equivalencias y swaps", en: "Crossover Swaps & Fitting Index" },
  "comp.desc": {
    es: "Consulta la base de datos de repuestos donantes de desguace y aftermarket. Descubre qué modelos de Mazda (B2200, 626, E2200) comparten órganos con el Rocsta.",
    en: "Query our database of donor scrap yard parts and aftermarket upgrades. Find out which Mazda (B2200, 626, E2200) models share organs with the Rocsta.",
  },
  "comp.searchPlaceholder": {
    es: "Buscar por pieza Rocsta, vehículo donante...",
    en: "Search by Rocsta component, donor car...",
  },
  "comp.filter.allDonors": { es: "Cualquier donante", en: "All Donors" },
  "comp.filter.allFits": { es: "Cualquier ajuste", en: "All Adjustments" },
  "comp.fit.direct": { es: "Directo (Plug & Play)", en: "Direct Fit (Plug & Play)" },
  "comp.fit.mod": { es: "Requiere adaptación", en: "Requires Adaptation" },
  "comp.filter.allDifficulty": { es: "Cualquier dificultad", en: "All Difficulties" },
  "comp.diff.easy": { es: "Fácil", en: "Easy" },
  "comp.diff.medium": { es: "Media", en: "Medium" },
  "comp.diff.hard": { es: "Alta", en: "Hard" },
  "comp.results.count": { es: "compatibilidades encontradas", en: "compatibilities found" },
  "comp.table.part": { es: "Pieza Rocsta", en: "Rocsta Part" },
  "comp.table.donor": { es: "Vehículo donante", en: "Donor Vehicle" },
  "comp.table.ref": { es: "Referencia Donante", en: "Donor Reference" },
  "comp.table.fit": { es: "Ajuste", en: "Fitting" },
  "comp.table.confirmations": { es: "Confirmaciones", en: "Confirmations" },
  "comp.table.confirmed": { es: "usuarios confirman", en: "users confirmed" },
  "comp.noResults": { es: "Sin compatibilidades", en: "No crossovers found" },
  "comp.noResultsDesc": {
    es: "No hay compatibilidades registradas para los términos de búsqueda seleccionados.",
    en: "There are no crossovers registered for the selected search terms.",
  },

  // Guides Route
  "guides.title": {
    es: "Guías de reparación y mantenimiento",
    en: "Repair Guides & Maintenance Tutorials",
  },
  "guides.desc": {
    es: "Aprende a mantener y reparar tu Asia Rocsta paso a paso. Guías ilustradas creadas y validadas por mecánicos aficionados y propietarios.",
    en: "Learn to maintain and service your Asia Rocsta step-by-step. Illustrated brico guides created and validated by amateur mechanics and enthusiasts.",
  },
  "guides.searchPlaceholder": {
    es: "Buscar guías por palabra clave, herramienta...",
    en: "Search guides by keyword, tools...",
  },
  "guides.filter.allLevels": { es: "Cualquier nivel", en: "All Skill Levels" },
  "guides.level.beginner": { es: "Principiante", en: "Beginner" },
  "guides.level.intermediate": { es: "Intermedio", en: "Intermediate" },
  "guides.level.advanced": { es: "Avanzado", en: "Advanced" },
  "guides.results.count": { es: "guías disponibles", en: "guides available" },
  "guides.card.time": { es: "Duración", en: "Duration" },
  "guides.card.difficulty": { es: "Dificultad", en: "Difficulty" },
  "guides.card.view": { es: "Ver procedimiento paso a paso", en: "View step-by-step guide" },
  "guides.dialog.tools": { es: "Herramientas necesarias", en: "Required Tools" },
  "guides.dialog.steps": { es: "Procedimiento paso a paso", en: "Step-by-Step Procedure" },
  "guides.dialog.safety": { es: "Advertencia de seguridad", en: "Safety Disclaimer" },
  "guides.dialog.safetyDesc": {
    es: "Trabajar debajo o dentro de un vehículo 4x4 clásico entraña riesgos. Utiliza siempre borriquetas de seguridad y herramientas homologadas.",
    en: "Working inside or underneath classic 4x4 vehicles involves risks. Always secure your vehicle with safety stands and use rated tools.",
  },
  "guides.noResults": { es: "Sin guías", en: "No guides found" },
  "guides.noResultsDesc": {
    es: "Ningún tutorial coincide con tus criterios.",
    en: "No tutorials match your criteria.",
  },

  // Problems Route
  "problems.title": {
    es: "Historial de averías y diagnósticos",
    en: "Diagnostics Registry & Common Faults",
  },
  "problems.desc": {
    es: "Consulta el log histórico de averías reportadas por propietarios del Asia Rocsta. Diagnostica fallos en transmisiones, culatas o sistemas de frenos.",
    en: "Consult the historical log of common issues reported by Asia Rocsta owners. Diagnose faults in transmissions, cylinder heads, or brake circuits.",
  },
  "problems.searchPlaceholder": {
    es: "Buscar averías por síntoma, componente...",
    en: "Search issues by symptom, component...",
  },
  "problems.filter.allSeverity": { es: "Cualquier severidad", en: "All Severities" },
  "problems.severity.critical": { es: "Crítico (Reparar ya)", en: "Critical (Fix ASAP)" },
  "problems.severity.warn": { es: "Advertencia (Atención)", en: "Warning (Pay Attention)" },
  "problems.severity.info": { es: "Información (Molesto)", en: "Info (Annoyance)" },
  "problems.results.count": { es: "averías registradas", en: "issues registered" },
  "problems.card.miles": { es: "Kilometraje típico", en: "Typical Mileage" },
  "problems.card.cost": { es: "Coste piezas", en: "Spares Cost" },
  "problems.card.reports": { es: "casos en el club", en: "club reports" },
  "problems.card.diagnose": { es: "Ver ficha de diagnóstico", en: "View Diagnostic Sheet" },
  "problems.dialog.symptoms": { es: "Síntomas de alerta", en: "Warning Symptoms" },
  "problems.dialog.causes": { es: "Causas principales", en: "Root Causes" },
  "problems.dialog.fix": { es: "Procedimiento de reparación", en: "Repair Procedure" },
  "problems.noResults": { es: "Sin averías", en: "No issues found" },
  "problems.noResultsDesc": {
    es: "No hay averías catalogadas con esos términos.",
    en: "No issues cataloged with those terms.",
  },

  // Manuals Route
  "manuals.title": {
    es: "Biblioteca de manuales y esquemas",
    en: "Technical Manuals & Wiring Diagrams",
  },
  "manuals.desc": {
    es: "Descarga documentación técnica oficial para tu Asia Rocsta. Incluye manuales de servicio de motores Mazda, diagramas eléctricos detallados, microfichas de despiece original y fichas de homologación para la ITV.",
    en: "Download official technical documentation for your Asia Rocsta. Includes Mazda engine service manuals, detailed electrical wiring schematics, parts catalog microfiches, and homologation sheets.",
  },
  "manuals.searchPlaceholder": {
    es: "Buscar por título de manual, año...",
    en: "Search by manual title, year...",
  },
  "manuals.filter.allTypes": { es: "Cualquier tipo", en: "All Types" },
  "manuals.type.workshop": { es: "Manuales de Taller", en: "Workshop Manuals" },
  "manuals.type.electrical": { es: "Esquemas Eléctricos", en: "Wiring Schematics" },
  "manuals.type.catalog": { es: "Catálogos de Piezas", en: "Parts Microfiches" },
  "manuals.type.datasheet": { es: "Fichas Técnicas ITV", en: "Homologations" },
  "manuals.filter.allLanguages": { es: "Cualquier idioma", en: "All Languages" },
  "manuals.lang.es": { es: "Español", en: "Spanish" },
  "manuals.lang.en": { es: "Inglés", en: "English" },
  "manuals.lang.ko": { es: "Coreano", en: "Korean" },
  "manuals.lang.fr": { es: "Francés", en: "French" },
  "manuals.lang.de": { es: "Alemán", en: "German" },
  "manuals.results.count": { es: "documentos disponibles", en: "documents available" },
  "manuals.card.download": { es: "Descargar", en: "Download" },
  "manuals.noResults": { es: "Sin documentos", en: "No manuals found" },
  "manuals.noResultsDesc": {
    es: "Ninguno de los manuales archivados coincide con tus criterios.",
    en: "None of our archived manuals match your criteria.",
  },

  // Community Route
  "comm.title": {
    es: "Comunidad de propietarios Asia Rocsta",
    en: "Asia Rocsta Global Owners Club",
  },
  "comm.desc": {
    es: "El Asia Rocsta es un todoterreno clásico único y escaso. Este archivo estático es mantenido por aficionados de todo el mundo. ¡Aporta tus conocimientos para mantener estos 4x4 en la carretera!",
    en: "The Asia Rocsta is a rare and unique classic 4x4. This static registry is curated by owners worldwide. Contribute your knowledge to keep these 4x4s rolling!",
  },
  "comm.stats.parts": { es: "Piezas Documentadas", en: "Parts Catalogued" },
  "comm.stats.swaps": { es: "Equivalencias Verificadas", en: "Verified Swaps" },
  "comm.stats.guides": { es: "Guías Técnicas", en: "Repair Guides" },
  "comm.stats.logs": { es: "Aportaciones Globales", en: "Total Contributions" },
  "comm.form.title": { es: "Envía tu aportación", en: "Submit Your Contribution" },
  "comm.form.desc": {
    es: "Elige el tipo de aportación y rellena los campos específicos. Tus datos ayudan a mantener viva la comunidad Rocsta.",
    en: "Choose the contribution type and fill in the specific fields. Your data helps keep the Rocsta community alive.",
  },
  "comm.form.tab.comp": { es: "Equivalencia OEM", en: "OEM Crossover" },
  "comm.form.tab.part": { es: "Nueva Pieza", en: "New Part" },
  "comm.form.tab.guide": { es: "Nueva Guía", en: "New Repair Guide" },
  "comm.form.tab.problem": { es: "Reportar Avería", en: "Report an Issue" },
  "comm.form.tab.bug": { es: "Error Web", en: "Website Bug" },
  "comm.form.tab.partwrong": { es: "Pieza Incorrecta", en: "Wrong Part Data" },
  "comm.form.tab.photo": { es: "Foto del Rocsta", en: "Rocsta Photo" },
  "comm.form.photo.year": { es: "Año del vehículo", en: "Vehicle year" },
  "comm.form.photo.yearPlaceholder": { es: "Ej: 1995", en: "e.g. 1995" },
  "comm.form.photo.motor": { es: "Motor", en: "Engine" },
  "comm.form.photo.country": { es: "País", en: "Country" },
  "comm.form.photo.countryPlaceholder": { es: "Ej: 🇪🇸 España", en: "e.g. 🇪🇸 Spain" },
  "comm.form.photo.photo": { es: "Seleccionar foto", en: "Select photo" },
  "comm.form.submitted": { es: "¡Aportación registrada!", en: "Contribution Registered!" },
  "comm.form.submittedDesc": {
    es: "Muchas gracias por colaborar. El equipo de administración revisará los detalles antes de procesarlo.",
    en: "Thank you for collaborating! Our admin team will review the details before processing.",
  },
  "comm.form.name": { es: "Tu Nombre / Alias", en: "Your Name / Handle" },
  "comm.form.namePlaceholder": { es: "Ej. Rocstero_4x4", en: "e.g. Rocstero_4x4" },
  "comm.form.email": { es: "Email de contacto", en: "Contact Email" },
  "comm.form.error": { es: "Error al enviar la propuesta", en: "Error submitting proposal" },
  "comm.noMembers": { es: "No hay miembros", en: "No members" },

  // -- comp (OEM Crossover) fields --
  "comm.form.comp.title": { es: "Componente Rocsta", en: "Rocsta Component" },
  "comm.form.comp.titlePlaceholder": { es: "Ej. Filtro de combustible diésel", en: "e.g. Diesel fuel filter" },
  "comm.form.comp.donorVehicle": { es: "Vehículo donante", en: "Donor Vehicle" },
  "comm.form.comp.donorVehiclePlaceholder": { es: "Ej. Mazda 323 1.7D 1990", en: "e.g. Mazda 323 1.7D 1990" },
  "comm.form.comp.donorRef": { es: "Referencia OEM donante", en: "Donor OEM Ref" },
  "comm.form.comp.donorRefPlaceholder": { es: "Ej. B6S7-13-Z40", en: "e.g. B6S7-13-Z40" },
  "comm.form.comp.swapType": { es: "Tipo de montaje", en: "Swap Type" },
  "comm.form.comp.swapType.directo": { es: "Directo (plug & play)", en: "Direct (plug & play)" },
  "comm.form.comp.swapType.adaptacion": { es: "Adaptación (requiere mods)", en: "Adaptation (needs mods)" },
  "comm.form.comp.motor": { es: "Motor compatible", en: "Compatible Engine" },
  "comm.form.comp.notes": { es: "Notas de montaje", en: "Fitting Notes" },
  "comm.form.comp.notesPlaceholder": { es: "Indica adaptaciones, medidas, marcas aftermarket...", en: "State adapters, dimensions, aftermarket brands..." },

  // -- part (New Part) fields --
  "comm.form.part.title": { es: "Nombre de la pieza", en: "Part Name" },
  "comm.form.part.titlePlaceholder": { es: "Ej. Bomba inyectora diésel", en: "e.g. Diesel injection pump" },
  "comm.form.part.oem": { es: "Referencia OEM", en: "OEM Reference" },
  "comm.form.part.oemPlaceholder": { es: "Ej. 0 445 110 217", en: "e.g. 0 445 110 217" },
  "comm.form.part.category": { es: "Categoría", en: "Category" },
  "comm.form.part.motor": { es: "Motor", en: "Engine" },
  "comm.form.part.description": { es: "Descripción", en: "Description" },
  "comm.form.part.descriptionPlaceholder": { es: "Describe la pieza, sistema al que pertenece y notas relevantes...", en: "Describe the part, system it belongs to, and relevant notes..." },

  // -- guide (New Guide) fields --
  "comm.form.guide.title": { es: "Título del brico / manual", en: "Repair / Manual Title" },
  "comm.form.guide.titlePlaceholder": { es: "Ej. Tensado del cable de freno de mano", en: "e.g. Handbrake cable tightening" },
  "comm.form.guide.category": { es: "Tipo de guía", en: "Guide Type" },
  "comm.form.guide.tools": { es: "Herramientas necesarias", en: "Required Tools" },
  "comm.form.guide.toolsPlaceholder": { es: "Ej. Llave de 10mm, destornillador plano...", en: "e.g. 10mm wrench, flat screwdriver..." },
  "comm.form.guide.content": { es: "Contenido paso a paso", en: "Step-by-Step Content" },
  "comm.form.guide.contentPlaceholder": { es: "Describe el proceso paso a paso con detalles y consejos...", en: "Describe the process step by step with details and tips..." },

  // -- problem (Report Issue) fields --
  "comm.form.problem.title": { es: "Descripción corta del fallo", en: "Short Issue Description" },
  "comm.form.problem.titlePlaceholder": { es: "Ej. Rotura del cable de embrague", en: "e.g. Snapped clutch cable" },
  "comm.form.problem.motor": { es: "Motor afectado", en: "Affected Engine" },
  "comm.form.problem.mileage": { es: "Kilometraje aproximado (km)", en: "Approximate Mileage (km)" },
  "comm.form.problem.mileagePlaceholder": { es: "Ej. 120000", en: "e.g. 120000" },
  "comm.form.problem.symptoms": { es: "Síntomas", en: "Symptoms" },
  "comm.form.problem.symptomsPlaceholder": { es: "Describe los síntomas y cómo se manifiestan...", en: "Describe the symptoms and how they manifest..." },
  "comm.form.problem.solution": { es: "Solución aplicada", en: "Applied Solution" },
  "comm.form.problem.solutionPlaceholder": { es: "Explica cómo se solucionó y las piezas necesarias...", en: "Explain how it was fixed and the parts needed..." },

  // -- bug (Website Bug) fields --
  "comm.form.bug.title": { es: "Título del error", en: "Bug Title" },
  "comm.form.bug.titlePlaceholder": { es: "Ej. Enlace roto en página de piezas", en: "e.g. Broken link on parts page" },
  "comm.form.bug.url": { es: "URL de la página", en: "Page URL" },
  "comm.form.bug.urlPlaceholder": { es: "Ej. /parts/p-001", en: "e.g. /parts/p-001" },
  "comm.form.bug.browser": { es: "Navegador / SO", en: "Browser / OS" },
  "comm.form.bug.browserPlaceholder": { es: "Ej. Chrome 120 / Windows 11", en: "e.g. Chrome 120 / Windows 11" },
  "comm.form.bug.description": { es: "¿Qué ocurre?", en: "What happens?" },
  "comm.form.bug.descriptionPlaceholder": { es: "Describe el error, qué esperabas ver y qué viste realmente...", en: "Describe the bug, what you expected and what actually happened..." },

  // -- partwrong (Wrong Part Data) fields --
  "comm.form.partwrong.title": { es: "Pieza con datos incorrectos", en: "Part with Wrong Data" },
  "comm.form.partwrong.titlePlaceholder": { es: "Ej. Filtro de aceite (OEM: B6S7-14-302)", en: "e.g. Oil filter (OEM: B6S7-14-302)" },
  "comm.form.partwrong.currentInfo": { es: "Información actual incorrecta", en: "Current Wrong Info" },
  "comm.form.partwrong.currentInfoPlaceholder": { es: "Indica qué dato está mal actualmente...", en: "State what info is currently wrong..." },
  "comm.form.partwrong.correction": { es: "Corrección propuesta", en: "Proposed Correction" },
  "comm.form.partwrong.correctionPlaceholder": { es: "Indica cuál debería ser el valor correcto...", en: "State what the correct value should be..." },
  "comm.form.partwrong.source": { es: "Fuente de verificación", en: "Verification Source" },
  "comm.form.partwrong.sourcePlaceholder": { es: "Ej. Catálogo Mazda 1992, manual original...", en: "e.g. Mazda 1992 catalog, original manual..." },

  "comm.form.submit": { es: "Enviar propuesta", en: "Submit Proposal" },
  "comm.leaders.title": { es: "Top Colaboradores", en: "Top Tech Contributors" },
  "comm.leaders.desc": {
    es: "Usuarios que han compartido más referencias o guías técnicas del coche.",
    en: "Members who have logged the most crossover refs and guides.",
  },
  "comm.pr.title": {
    es: "¿Quieres contribuir al proyecto?",
    en: "Want to contribute to the project?"
  },
  "comm.pr.desc": {
    es: "Este proyecto combina una base de datos SQLite con datos semilla en JSON. Puedes mejorar la información corrigiendo errores, añadiendo compatibilidades o piezas nuevas. Abre un Pull Request en el repositorio y tus cambios serán revisados e integrados en la base de datos.",
    en: "This project combines a SQLite database with JSON seed data. You can improve the dataset by fixing errors, adding new compatibilities or parts. Open a Pull Request in the repository and your changes will be reviewed and merged into the database."
  },
  // Error / Not Found Pages
  "error.404": { es: "Error 404", en: "Error 404" },
  "notFound.title": { es: "Página no encontrada", en: "Page Not Found" },
  "notFound.desc": {
    es: "La ruta que buscas no existe en el archivo del Asia Rocsta.",
    en: "The path you are looking for does not exist in the Asia Rocsta archive.",
  },
  "notFound.back": { es: "Volver al inicio", en: "Back to home" },
  "error.title": { es: "Esta página no cargó", en: "This page didn't load" },
  "error.desc": {
    es: "Algo falló por nuestro lado.",
    en: "Something went wrong on our end.",
  },
  "error.retry": { es: "Reintentar", en: "Retry" },

  // Header
  "header.sections": { es: "Secciones principales", en: "Main Sections" },
  "header.systems": { es: "Sistemas Mecánicos", en: "Mechanical Systems" },
  "header.searchDialogPlaceholder": {
    es: "Escribe para buscar piezas, OEM, bricos, averías...",
    en: "Type to search parts, OEM, guides, issues...",
  },
  "header.tagline": {
    es: "Compilado 100% Estático y Seguro",
    en: "100% Static and Secure Build",
  },
  "header.ariaSearch": { es: "Abrir búsqueda", en: "Open search" },
  "header.ariaTheme": { es: "Cambiar tema", en: "Toggle theme" },
  "header.ariaMenu": { es: "Menú", en: "Menu" },
  "header.badgePart": { es: "Pieza", en: "Part" },
  "header.badgeSwap": { es: "Swap", en: "Swap" },
  "header.badgeGuide": { es: "Guía", en: "Guide" },
  "header.badgeIssue": { es: "Avería", en: "Issue" },
  "header.badgeManual": { es: "Manual", en: "Manual" },
  "header.mobileHome": { es: "Inicio", en: "Home" },
  "header.mobileParts": { es: "Piezas", en: "Parts" },
  "header.mobileCompat": { es: "Compatibilidades", en: "Compatibility" },
  "header.mobileGuides": { es: "Guías", en: "Guides" },
  "header.mobileProblems": { es: "Problemas", en: "Problems" },
  "header.mobileManuals": { es: "Manuales", en: "Manuals" },
  "header.mobileCommunity": { es: "Comunidad", en: "Community" },

  // Footer
  "footer.tagline": {
    es: "Construido por y para entusiastas.",
    en: "Built by and for enthusiasts.",
  },
  "footer.docs": { es: "Documentación", en: "Documentation" },
  "footer.api": { es: "API", en: "API" },
  "footer.contribute": { es: "Contribuir", en: "Contribute" },

  // Generic UI
  "ui.archive": { es: "Archivo", en: "Archive" },
  "ui.filters": { es: "Filtros activos:", en: "Active filters:" },
  "ui.clearFilters": { es: "Limpiar filtros", en: "Clear Filters" },
  "ui.noResults": { es: "Sin resultados", en: "No results" },
  "ui.resetFilters": { es: "Resetear filtros", en: "Reset Filters" },
  "ui.loading": { es: "Cargando...", en: "Loading..." },
  "ui.showing": { es: "Mostrando", en: "Showing" },
  "ui.of": { es: "de", en: "of" },
  "ui.partsDocumented": { es: "piezas documentadas", en: "parts documented" },
  "ui.viewAll": { es: "Ver todas", en: "View all" },
  "ui.close": { es: "Cerrar", en: "Close" },
  "ui.search": { es: "Busca:", en: "Search:" },
  "ui.category": { es: "Categoría:", en: "Category:" },
  "ui.motor": { es: "Motor:", en: "Engine:" },
  "ui.status": { es: "Estado:", en: "Status:" },
  "ui.type": { es: "Tipo:", en: "Type:" },
  "ui.language": { es: "Idioma:", en: "Language:" },
  "ui.difficulty": { es: "Dificultad:", en: "Difficulty:" },
  "ui.severity": { es: "Severidad:", en: "Severity:" },
  "ui.contains": { es: "Contiene:", en: "Contains:" },

  // Parts - additional labels
  "parts.filter.allEnginesLabel": { es: "Todos los motores", en: "All Engines" },
  "parts.filter.allStatusLabel": { es: "Cualquier estado", en: "All Status" },
  "parts.filter.verified100": { es: "Verificado al 100%", en: "100% Verified" },
  "parts.filter.requiresMod": { es: "Requiere adaptación", en: "Requires Adaptation" },
  "parts.filter.unverified": { es: "Sin verificar", en: "Unverified" },
  "parts.filter.engineF8": { es: "Gasolina SOHC 1.8 (Mazda F8)", en: "Petrol SOHC 1.8 (Mazda F8)" },
  "parts.filter.engineR2": {
    es: "Diésel 2.2 / Turbo (Mazda R2)",
    en: "Diesel 2.2 / Turbo (Mazda R2)",
  },
  "parts.filter.engineBothOption": { es: "Común a ambos motores", en: "Common to both engines" },
  "parts.searchPartsPlaceholder": {
    es: "Buscar por nombre, OEM, equivalencia, marca...",
    en: "Search by name, OEM, brand, equivalent...",
  },
  "parts.showingXofY": {
    es: "Mostrando {count} de {total} piezas documentadas.",
    en: "Showing {count} of {total} parts documented.",
  },
  "parts.viewAllCats": { es: "Ver todas las categorías", en: "View all categories" },
  "parts.statusVerifiedDesc": {
    es: "Verificado y compatible de manera directa sin cambios.",
    en: "Verified and directly compatible without modifications.",
  },
  "parts.statusModDesc": {
    es: "Encaja modificando o adaptando algún anclaje o soporte.",
    en: "Fits with bracket or support modifications.",
  },
  "parts.statusUnverifiedDesc": {
    es: "Referenciado en catálogo pero sin validación física.",
    en: "Listed in catalog but not physically verified.",
  },
  "parts.categoryLabel": { es: "Categoría del sistema", en: "System Category" },
  "parts.engineCompat": { es: "Compatibilidad Motor", en: "Engine Compatibility" },
  "parts.crossRefs": { es: "Referencias cruzadas aftermarket", en: "Aftermarket Cross References" },
  "parts.equivVehicles": { es: "Vehículos equivalentes donantes", en: "Equivalent Donor Vehicles" },
  "parts.installNotes": {
    es: "Notas de instalación y montaje",
    en: "Installation & Fitting Notes",
  },
  "parts.noDonors": {
    es: "No hay donantes registrados comunes.",
    en: "No common donor vehicles registered.",
  },
  "parts.noNotes": {
    es: "No se dispone de notas técnicas de instalación específicas para esta pieza. Si la has montado o adaptado en tu coche, ¡puedes compartir tu experiencia en la sección de Comunidad!",
    en: "No specific installation notes available for this part. If you've fitted or adapted it on your vehicle, share your experience in the Community section!",
  },
  "parts.classicParts": { es: "Recambios mecánicos clásicos", en: "Classic Mechanical Spares" },

  // Parts - Status badge labels
  "parts.badge.verified": { es: "Verificado", en: "Verified" },
  "parts.badge.mod": { es: "Requiere mod.", en: "Requires mod" },
  "parts.badge.unverified": { es: "Sin verificar", en: "Unverified" },
  "parts.badge.common": { es: "Común", en: "Common" },
  "parts.badge.engineF8": { es: "Mazda F8 1.8 Gasolina", en: "Mazda F8 1.8 Petrol" },
  "parts.badge.engineR2": { es: "Mazda R2 2.2 Diésel", en: "Mazda R2 2.2 Diesel" },
  "parts.badge.engineBoth": { es: "Común (Ambos Motores)", en: "Common (Both Engines)" },

  // Compatibility - additional labels
  "comp.searchCompatPlaceholder": {
    es: "Buscar pieza Rocsta, donante, referencia...",
    en: "Search Rocsta part, donor, reference...",
  },
  "comp.filter.allFitTypes": { es: "Cualquier tipo de ajuste", en: "All Fit Types" },
  "comp.fitDirectOption": { es: "Ajuste directo (Plug & Play)", en: "Direct Fit (Plug & Play)" },
  "comp.fitAdaptOption": {
    es: "Requiere adaptación mecánica",
    en: "Requires Mechanical Adaptation",
  },
  "comp.filter.allDifficultyLabel": { es: "Cualquier dificultad", en: "All Difficulties" },
  "comp.diffEasyOption": { es: "Dificultad: Fácil", en: "Difficulty: Easy" },
  "comp.diffMediumOption": { es: "Dificultad: Media", en: "Difficulty: Medium" },
  "comp.diffHardOption": { es: "Dificultad: Alta", en: "Difficulty: Hard" },
  "comp.resultsFound": {
    es: "Encontradas {count} equivalencias cruzadas.",
    en: "Found {count} cross-reference equivalences.",
  },
  "comp.table.category": { es: "Categoría", en: "Category" },
  "comp.table.confirmedCount": { es: "usuarios", en: "users" },
  "comp.swapVerified": { es: "Swap Verificado por la Comunidad", en: "Community-Verified Swap" },
  "comp.swapCaution": { es: "Requiere Precaución / Adaptable", en: "Requires Caution / Adaptable" },
  "comp.confirmedBy": {
    es: "Confirmado y utilizado físicamente por {count} miembros del club.",
    en: "Physically confirmed and used by {count} club members.",
  },
  "comp.installInstr": { es: "Instrucciones del montaje", en: "Fitting Instructions" },
  "comp.noNotes": {
    es: "No se dispone de guías de montaje específicas para esta equivalencia.",
    en: "No specific fitting guides available for this swap.",
  },
  "comp.swapsLabel": { es: "Swaps Mecánicos", en: "Mechanical Swaps" },
  "comp.dialog.donorVehicle": { es: "Vehículo Donante", en: "Donor Vehicle" },
  "comp.dialog.donorRef": { es: "Referencia Donante", en: "Donor Reference" },
  "comp.dialog.fitType": { es: "Tipo de ajuste", en: "Fit Type" },
  "comp.dialog.difficultyLabel": { es: "Dificultad de montaje", en: "Assembly Difficulty" },
  "comp.dialog.directFit": { es: "Directo (Plug & Play)", en: "Direct Fit (Plug & Play)" },
  "comp.dialog.requiresAdapt": { es: "Requiere Adaptación", en: "Requires Adaptation" },
  "comp.confirm": { es: "Confirmar", en: "Confirm" },
  "comp.confirmed": { es: "Confirmado", en: "Confirmed" },
  "comp.confirmDialog.title": { es: "¿Confirmar equivalencia?", en: "Confirm crossover?" },
  "comp.confirmDialog.desc": { es: "¿Estás seguro de que esta equivalencia funciona en tu Rocsta? Esto incrementará las confirmaciones públicas.", en: "Are you sure this crossover works on your Rocsta? This will increase public confirmations." },
  "comp.confirmDialog.yes": { es: "Sí, confirmar", en: "Yes, confirm" },
  "comp.confirmDialog.no": { es: "Cancelar", en: "Cancel" },

  // Guides - additional labels
  "guides.searchGuidesPlaceholder": {
    es: "Buscar por título, herramientas o etiquetas...",
    en: "Search by title, tools or tags...",
  },
  "guides.filter.allMotorsLabel": { es: "Cualquier motor", en: "All Engines" },
  "guides.filter.motorF8": { es: "Gasolina 1.8 (F8)", en: "Petrol 1.8 (F8)" },
  "guides.filter.motorR2": { es: "Diésel 2.2 / Turbo (R2)", en: "Diesel 2.2 / Turbo (R2)" },
  "guides.filter.motorBoth": { es: "Común a ambos", en: "Common to both" },
  "guides.filter.allLevelsLabel": { es: "Cualquier dificultad", en: "All Skill Levels" },
  "guides.filter.levelBeginner": { es: "Principiante", en: "Beginner" },
  "guides.filter.levelIntermediate": { es: "Intermedio", en: "Intermediate" },
  "guides.filter.levelAdvanced": { es: "Avanzado", en: "Advanced" },
  "guides.resultsFound": {
    es: "Encontradas {count} guías técnicas.",
    en: "Found {count} technical guides.",
  },
  "guides.contributions": { es: "aportaciones", en: "contributions" },
  "guides.dialog.toolsLabel": {
    es: "Herramientas y materiales necesarios",
    en: "Required Tools & Materials",
  },
  "guides.dialog.stepsLabel": {
    es: "Pasos detallados del procedimiento",
    en: "Detailed Procedure Steps",
  },
  "guides.dialog.time": { es: "Tiempo", en: "Time" },
  "guides.dialog.difficultyLabel": { es: "Dificultad:", en: "Difficulty:" },
  "guides.safetyTip": { es: "Consejo de seguridad", en: "Safety Tip" },
  "guides.safetyDesc": {
    es: "Asegura siempre el vehículo con borriquetas rígidas antes de trabajar debajo. Retira las llaves del contacto y desconecta el borne negativo de la batería si manipulas componentes eléctricos o de la distribución.",
    en: "Always secure the vehicle with rigid jack stands before working underneath. Remove the ignition key and disconnect the negative battery terminal when handling electrical or timing components.",
  },
  "guides.wikiLabel": { es: "Wiki del Asia Rocsta", en: "Asia Rocsta Wiki" },
  "guides.categoryLabel": { es: "Categoría", en: "Category" },

  // Problems - additional labels
  "problems.searchProblemsPlaceholder": {
    es: "Buscar por síntoma, avería o solución...",
    en: "Search by symptom, issue or solution...",
  },
  "problems.filter.allSeverityLabel": { es: "Cualquier severidad", en: "All Severities" },
  "problems.severityCriticalOption": {
    es: "Crítico (Peligro de rotura)",
    en: "Critical (Breakage Risk)",
  },
  "problems.severityWarnOption": {
    es: "Advertencia (Fallo operativo)",
    en: "Warning (Operational Failure)",
  },
  "problems.severityInfoOption": {
    es: "Información (Holguras y ruidos)",
    en: "Info (Clearances & Noise)",
  },
  "problems.filter.allMotorsLabel": { es: "Cualquier motor", en: "All Engines" },
  "problems.filter.motorF8": { es: "Gasolina 1.8 (F8)", en: "Petrol 1.8 (F8)" },
  "problems.filter.motorR2": { es: "Diésel 2.2 (R2)", en: "Diesel 2.2 (R2)" },
  "problems.filter.motorBoth": { es: "Común a ambos", en: "Common to both" },
  "problems.resultsFound": {
    es: "Listando {count} fallos registrados.",
    en: "Listing {count} registered issues.",
  },
  "problems.typicalMileage": { es: "Aparición común:", en: "Typical onset:" },
  "problems.symptomLabel": { es: "Síntoma:", en: "Symptom:" },
  "problems.reportsCount": { es: "casos", en: "cases" },
  "problems.dialog.cost": { es: "Coste estimado de piezas", en: "Estimated Parts Cost" },
  "problems.dialog.difficulty": { es: "Dificultad de la reparación", en: "Repair Difficulty" },
  "problems.dialog.mileage": {
    es: "Kilometraje habitual de aparición",
    en: "Typical Onset Mileage",
  },
  "problems.dialog.symptomsTitle": { es: "Síntomas del fallo", en: "Fault Symptoms" },
  "problems.dialog.causesTitle": {
    es: "Causas comunes identificadas",
    en: "Identified Common Causes",
  },
  "problems.dialog.solutionTitle": { es: "Procedimiento de solución", en: "Solution Procedure" },
  "problems.registryLabel": { es: "Registro Técnico Rocsta", en: "Rocsta Technical Registry" },

  // Manuals - additional labels
  "manuals.searchManualsPlaceholder": {
    es: "Buscar por título de manual, año...",
    en: "Search by manual title, year...",
  },
  "manuals.filter.allTypesLabel": { es: "Cualquier tipo", en: "All Types" },
  "manuals.labelWorkshop": { es: "Manuales de Taller", en: "Workshop Manuals" },
  "manuals.labelElectrical": { es: "Esquemas Eléctricos", en: "Wiring Schematics" },
  "manuals.labelCatalog": { es: "Catálogos de Piezas", en: "Parts Catalogs" },
  "manuals.labelDatasheet": { es: "Fichas Técnicas ITV", en: "Homologation Sheets" },
  "manuals.filter.allLangs": { es: "Cualquier idioma", en: "All Languages" },
  "manuals.labelSpanish": { es: "Español 🇪🇸", en: "Spanish 🇪🇸" },
  "manuals.labelEnglish": { es: "Inglés 🇬🇧", en: "English 🇬🇧" },
  "manuals.labelKorean": { es: "Coreano 🇰🇷", en: "Korean 🇰🇷" },
  "manuals.labelFrench": { es: "Francés 🇫🇷", en: "French 🇫🇷" },
  "manuals.labelGerman": { es: "Alemán 🇩🇪", en: "German 🇩🇪" },
  "manuals.libraryCount": {
    es: "Biblioteca: {count} documentos disponibles.",
    en: "Library: {count} documents available.",
  },
  "manuals.pages": { es: "págs.", en: "pages" },
  "manuals.year": { es: "Año:", en: "Year:" },
  "manuals.engineLabel": { es: "Motor:", en: "Engine:" },
  "manuals.bothEngines": { es: "Ambos", en: "Both" },
  "manuals.idLabel": { es: "ID:", en: "ID:" },

  // Community - additional labels
  "comm.statsItems": { es: "items", en: "items" },
  "comm.statsSwaps": { es: "swaps", en: "swaps" },
  "comm.statsBricos": { es: "bricos", en: "guides" },
  "comm.statsLogs": { es: "logs", en: "logs" },
  "comm.leadersLogs": { es: "logs", en: "logs" },
  "comm.form.emailPlaceholder": { es: "correo@ejemplo.com", en: "email@example.com" },

  // Problems dialog
  "problems.dialog.desc": {
    es: "Ficha técnica de diagnóstico de averías para Asia Rocsta.",
    en: "Fault diagnosis technical sheet for Asia Rocsta.",
  },

  // Problems confirmations
  "problems.confirm": {
    es: "Reportar caso",
    en: "Report case",
  },
  "problems.confirmed": {
    es: "Reportado",
    en: "Reported",
  },
  "problems.confirmDialog.title": {
    es: "¿Reportar este fallo?",
    en: "Report this issue?",
  },
  "problems.confirmDialog.desc": {
    es: "¿Has experimentado este problema en tu Asia Rocsta? Al confirmar, ayudas a la comunidad a conocer qué averías son más frecuentes y a priorizar soluciones.",
    en: "Have you experienced this issue on your Asia Rocsta? By confirming, you help the community understand which faults are most common and prioritize solutions.",
  },
  "problems.confirmDialog.yes": {
    es: "Sí, reportar caso",
    en: "Yes, report case",
  },
  "problems.confirmDialog.no": {
    es: "Cancelar",
    en: "Cancel",
  },

  // About page
  "nav.about": { es: "Acerca de", en: "About" },
  "about.crumb": { es: "Acerca de", en: "About" },
  "about.title": { es: "Acerca del Asia Rocsta", en: "About the Asia Rocsta" },
  "about.lead": {
    es: "Todoterreno coreano fabricado por Asia Motors (filial de KIA) entre 1990 y 1999, derivado del vehículo militar KIA KM410 y equipado con mecánica Mazda. Un 4x4 sencillo, robusto y fácil de reparar — exactamente lo que esta plataforma quiere documentar.",
    en: "Korean off-roader built by Asia Motors (a KIA subsidiary) between 1990 and 1999, derived from the KIA KM410 military vehicle and powered by Mazda mechanics. A simple, rugged, easy-to-repair 4x4 — exactly what this archive is here to document.",
  },
  "about.identity": { es: "Identidad del vehículo", en: "Vehicle identity" },
  "about.facts.maker": { es: "Fabricante", en: "Manufacturer" },
  "about.facts.production": { es: "Producción", en: "Production" },
  "about.facts.plant": { es: "Planta", en: "Plant" },
  "about.facts.plantValue": { es: "Gwangju, Corea del Sur", en: "Gwangju, South Korea" },
  "about.facts.base": { es: "Plataforma base", en: "Base platform" },
  "about.facts.bodies": { es: "Carrocerías", en: "Body styles" },
  "about.facts.bodiesValue": {
    es: "SWB 3p / LWB 5p · lona o techo duro",
    en: "SWB 3-door / LWB 5-door · soft or hard top",
  },
  "about.facts.drivetrain": { es: "Transmisión", en: "Drivetrain" },
  "about.facts.drivetrainValue": {
    es: "4x4 a tiempo parcial · cubos manuales",
    en: "Part-time 4WD · manual locking hubs",
  },
  "about.engines": { es: "Motorizaciones", en: "Engines" },
  "about.engine.petrol": { es: "Gasolina", en: "Petrol" },
  "about.engine.diesel": { es: "Diésel", en: "Diesel" },
  "about.engine.disp": { es: "Cilindrada", en: "Displacement" },
  "about.engine.power": { es: "Potencia", en: "Power" },
  "about.engine.torque": { es: "Par", en: "Torque" },
  "about.engine.f8.notes": {
    es: "SOHC 8v, carburador, mismo bloque que el Mazda 626 (GC/GD) y B1800. Fácil de mantener, conocido por consumir aceite a partir de los 150.000 km.",
    en: "SOHC 8v, carburetor, same block as the Mazda 626 (GC/GD) and B1800. Easy to service, known for burning oil after ~150,000 km.",
  },
  "about.engine.r2.notes": {
    es: "SOHC 8v atmosférico, derivado de la pickup Mazda B2200 / E2200 / Bongo. Correa de distribución crítica cada 80.000 km.",
    en: "SOHC 8v naturally aspirated, derived from the Mazda B2200 / E2200 / Bongo pickups. Critical timing belt every 80,000 km.",
  },
  "about.history": { es: "Línea temporal", en: "Timeline" },
  "about.tl.1990": {
    es: "Lanzamiento del Asia Rocsta en Corea del Sur, basado en el chasis militar KM410.",
    en: "Asia Rocsta launches in South Korea, based on the KM410 military chassis.",
  },
  "about.tl.1993": {
    es: "Llegada a España importado por Aresa Motor; se convierte en una alternativa accesible al Suzuki Samurai.",
    en: "Arrives in Spain imported by Aresa Motor; becomes an accessible alternative to the Suzuki Samurai.",
  },
  "about.tl.1994": {
    es: "Actualización mecánica menor y mejoras de equipamiento.",
    en: "Minor mechanical update and equipment improvements.",
  },
  "about.tl.1997": {
    es: "La crisis financiera asiática golpea a Asia Motors.",
    en: "The Asian financial crisis hits Asia Motors hard.",
  },
  "about.tl.1999": {
    es: "KIA absorbe definitivamente la marca; fin de la producción del Rocsta.",
    en: "KIA fully absorbs the brand; Rocsta production ends.",
  },
  "about.tl.2020": {
    es: "Auge de la comunidad de restauradores en España, Italia y Corea.",
    en: "Rise of the restorer community in Spain, Italy and Korea.",
  },
  "about.mission.title": { es: "Por qué existe este archivo", en: "Why this archive exists" },
  "about.mission.desc": {
    es: "El Rocsta es un coche escaso, sin red oficial de recambios y con documentación dispersa. Este proyecto reúne piezas, equivalencias, guías y fallos comunes en un único lugar abierto, para que cualquier propietario pueda mantener vivo su vehículo.",
    en: "The Rocsta is a rare vehicle with no official spares network and scattered documentation. This project gathers parts, cross-references, guides and common faults in one open place so any owner can keep their vehicle alive.",
  },
  "about.mission.cta": { es: "Únete a la comunidad", en: "Join the community" },
  "about.mission.cta2": { es: "Explorar piezas", en: "Browse parts" },

  // Home — system diagram
  "home.diagram.title": { es: "Sistemas mecánicos", en: "Mechanical systems" },
  "home.diagram.desc": {
    es: "Pulsa sobre un sistema para ver las piezas y compatibilidades catalogadas.",
    en: "Tap a system to see catalogued parts and compatibilities.",
  },
  "home.diagram.hint": {
    es: "Click en cualquier punto para abrir el catálogo filtrado",
    en: "Click any point to open the filtered catalog",
  },

  // Home — maintenance
  "home.maint.title": { es: "Mantenimiento programado", en: "Maintenance schedule" },
  "home.maint.desc": {
    es: "Intervalos de servicio según manual Mazda para los motores F8 (gasolina) y R2 (diésel).",
    en: "Service intervals from the Mazda manuals for the F8 (petrol) and R2 (diesel) engines.",
  },
  "home.maint.all": { es: "Todos", en: "All" },
  "home.maint.item": { es: "Operación", en: "Operation" },
  "home.maint.interval": { es: "Intervalo", en: "Interval" },
  "home.maint.motor": { es: "Motor", en: "Engine" },
  "home.maint.severity": { es: "Criticidad", en: "Severity" },
  "home.maint.critical": { es: "Crítico", en: "Critical" },
  "home.maint.routine": { es: "Rutinario", en: "Routine" },
  "home.maint.years": { es: "años", en: "yrs" },
  "maint.oil": { es: "Cambio de aceite del motor", en: "Engine oil change" },
  "maint.oilFilter": { es: "Filtro de aceite", en: "Oil filter" },
  "maint.airFilter": { es: "Filtro de aire", en: "Air filter" },
  "maint.fuelFilter": { es: "Filtro de combustible (diésel)", en: "Fuel filter (diesel)" },
  "maint.timingBelt": { es: "Correa de distribución (R2)", en: "Timing belt (R2)" },
  "maint.coolant": { es: "Líquido refrigerante", en: "Coolant" },
  "maint.gearbox": { es: "Aceite caja de cambios y transfer", en: "Gearbox & transfer oil" },
  "maint.diff": { es: "Aceite diferenciales delantero y trasero", en: "Front & rear diff oil" },
  "maint.grease": { es: "Engrase de crucetas y cubos manuales", en: "Greasing U-joints & manual hubs" },
  "maint.brakeFluid": { es: "Líquido de frenos", en: "Brake fluid" },
  "maint.spark": { es: "Bujías (F8)", en: "Spark plugs (F8)" },

  // Home — community gallery
  "home.gallery.title": { es: "Galería de la comunidad", en: "Community gallery" },
  "home.gallery.desc": {
    es: "Rocstas reales fotografiados por sus propietarios. Envía el tuyo para aparecer aquí.",
    en: "Real Rocstas photographed by their owners. Submit yours to appear here.",
  },
  "home.gallery.cta": { es: "Envía tu Rocsta →", en: "Submit your Rocsta →" },
  "home.gallery.placeholder": { es: "Demo", en: "Demo" },
  "home.gallery.empty": { es: "Aún no hay fotos. ¡Sé el primero en enviar la tuya!", en: "No photos yet. Be the first to submit yours!" },

  // Header — about link
  "header.mobileAbout": { es: "Acerca de", en: "About" },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rocsta-lang") as Language | null;
      if (saved === "es" || saved === "en") {
        setLanguageState(saved);
        return;
      }
      const browserLang = navigator.language.split("-")[0];
      setLanguageState(browserLang === "en" ? "en" : "es");
    } catch {
      /* Malo */
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("rocsta-lang", lang);
    } catch {
      /* Malo */
    }
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return key;
    let text = entry[language] || entry["es"] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
