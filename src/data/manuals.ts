import type { Manual } from "./types";

export const manuals: Manual[] = [
  {
    id: "m-001",
    title: {
      es: "Manual de Taller y Reparación de Chasis (Workshop Manual)",
      en: "Chassis Workshop & Repair Manual (Workshop Manual)",
    },
    description: {
      es: "Manual oficial de servicio para Asia Rocsta. Incluye procedimientos detallados de reparación del chasis, suspensiones, ejes, frenos, carrocería y sistemas de acoplamiento 4x4.",
      en: "Official service manual for Asia Rocsta. Includes detailed repair procedures for chassis, suspensions, axles, brakes, bodywork and 4x4 coupling systems.",
    },
    type: "workshop",
    format: "pdf",
    language: "en",
    motor: "ambos",
    url: "https://archive.org/details/asia-rocsta-chassis-workshop-manual",
    year: "1994",
    pages: 412,
  },
  {
    id: "m-002",
    title: {
      es: "Manual de Servicio del Motor Mazda R2 (2.2 Litros Diésel)",
      en: "Mazda R2 Engine Service Manual (2.2 Liter Diesel)",
    },
    description: {
      es: "Documentación técnica de servicio dedicada en exclusiva al motor Mazda R2 diésel de aspiración natural y turbo. Contiene pares de apriete, tolerancias de pistones y puesta a punto de bomba rotativa.",
      en: "Technical service documentation exclusively dedicated to the naturally aspirated and turbo Mazda R2 diesel engine. Contains torque specifications, piston tolerances and rotary pump adjustment.",
    },
    type: "workshop",
    format: "pdf",
    language: "en",
    motor: "R2",
    url: "https://archive.org/details/mazda-r2-diesel-engine-manual",
    year: "1991",
    pages: 189,
  },
  {
    id: "m-003",
    title: {
      es: "Manual de Servicio del Motor Mazda F8 SOHC (1.8 Gasolina)",
      en: "Mazda F8 SOHC Engine Service Manual (1.8 Gasoline)",
    },
    description: {
      es: "Manual de taller oficial para la gama de motores Mazda F-Series SOHC de 8V y 12V. Diagramas de distribución, ajuste de taqués mecánicos y sistema de carburación Nikki.",
      en: "Official workshop manual for the Mazda F-Series SOHC 8V and 12V engine range. Timing diagrams, mechanical tappet adjustment and Nikki carburetion system.",
    },
    type: "workshop",
    format: "pdf",
    language: "es",
    motor: "F8",
    url: "https://archive.org/details/mazda-f8-engine-manual-es",
    year: "1990",
    pages: 145,
  },
  {
    id: "m-004",
    title: {
      es: "Esquema y Diagrama Eléctrico Completo (Wiring Diagram)",
      en: "Complete Electrical Schematic and Wiring Diagram",
    },
    description: {
      es: "Esquemas eléctricos completos del vehículo por secciones: luces, motor de arranque, sistema de precalentamiento rápido QOS (Quick Glow System), cuadro de mandos e indicadores.",
      en: "Complete vehicle electrical diagrams by section: lights, starter motor, QOS (Quick Glow System) preheating system, dashboard and indicators.",
    },
    type: "electrical",
    format: "image",
    language: "en",
    motor: "ambos",
    url: "https://archive.org/details/asia-rocsta-electrical-wiring",
    year: "1993",
    pages: 18,
  },
  {
    id: "m-005",
    title: {
      es: "Catálogo de Despiece y Referencias de Piezas (Parts Catalog)",
      en: "Parts Breakdown Catalog and Part Numbers (Parts Catalog)",
    },
    description: {
      es: "Microfichas y catálogo oficial de repuestos del Asia Rocsta. Vital para buscar el código de pieza original OEM antes de realizar cualquier pedido.",
      en: "Microfiche and official spare parts catalog for Asia Rocsta. Essential for finding the original OEM part number before placing any order.",
    },
    type: "catalog",
    format: "pdf",
    language: "ko",
    motor: "ambos",
    url: "https://archive.org/details/asia-rocsta-parts-catalog",
    year: "1996",
    pages: 350,
  },
  {
    id: "m-006",
    title: {
      es: "Ficha Técnica de Homologación e Inspección ITV",
      en: "Technical Homologation Sheet and ITV Inspection",
    },
    description: {
      es: "Documento de ficha técnica reducida y dimensiones oficiales del Asia Rocsta. Útil para homologaciones de reformas (suspensión, llantas, cabrestante) y paso por estación de inspección técnica.",
      en: "Reduced technical data sheet document and official dimensions of the Asia Rocsta. Useful for modification approvals (suspension, wheels, winch) and passing the technical inspection station.",
    },
    type: "datasheet",
    format: "pdf",
    language: "es",
    motor: "ambos",
    url: "https://archive.org/details/asia-rocsta-ficha-reducida",
    year: "1998",
    pages: 6,
  },
];
