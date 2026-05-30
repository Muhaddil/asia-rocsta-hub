// Para añadir o traducir contenido nuevo basta con editar este archivo:
//   1. Cada texto es un objeto Localized { es, en }.
//   2. Para añadir un idioma nuevo, extiende el tipo Localized y rellena
//      las claves; la página About leerá automáticamente el idioma
//      activo via useLanguage().
//   3. Para añadir una sección nueva, empújala dentro de
//      `aboutSections` con el tipo `AboutSection` apropiado.
// =====================================================================

export type Localized = { es: string; en: string };

export type AboutFact = { label: Localized; value: Localized };

export type AboutEngine = {
  code: string;
  fuel: Localized;
  specs: AboutFact[];
  notes: Localized;
};

export type AboutDimensionSet = {
  id: string;
  name: Localized;
  tagline: Localized;
  rows: AboutFact[];
};

export type AboutSection =
  | {
      kind: "prose";
      id: string;
      title: Localized;
      paragraphs: Localized[];
    }
  | {
      kind: "facts";
      id: string;
      title: Localized;
      intro?: Localized;
      facts: AboutFact[];
    }
  | {
      kind: "engines";
      id: string;
      title: Localized;
      intro?: Localized;
      engines: AboutEngine[];
    }
  | {
      kind: "dimensions";
      id: string;
      title: Localized;
      intro?: Localized;
      sets: AboutDimensionSet[];
    }
  | {
      kind: "list";
      id: string;
      title: Localized;
      intro?: Localized;
      items: { title: Localized; description: Localized }[];
    }
  | {
      kind: "timeline";
      id: string;
      title: Localized;
      entries: { year: string; text: Localized }[];
    };

export const aboutHero = {
  crumb: { es: "Acerca de", en: "About" } satisfies Localized,
  title: {
    es: "Asia Rocsta — análisis técnico en profundidad",
    en: "Asia Rocsta — in-depth technical analysis",
  } satisfies Localized,
  lead: {
    es:
      "El Rocsta es un todoterreno coreano fabricado por Asia Motors (filial de KIA) entre 1990 y 1997, " +
      "inspirado abiertamente en la filosofía del Jeep CJ y construido sobre el chasis militar KIA KM410. " +
      "Sus entrañas son japonesas: motores y cajas Mazda fabricados bajo licencia que hoy garantizan " +
      "fiabilidad y disponibilidad de recambios.",
    en:
      "The Rocsta is a Korean off-roader built by Asia Motors (a KIA subsidiary) between 1990 and 1997, " +
      "openly inspired by the Jeep CJ philosophy and built on the KIA KM410 military chassis. " +
      "Its mechanicals are Japanese: Mazda engines and gearboxes manufactured under licence, which today " +
      "guarantee reliability and spare-part availability.",
  } satisfies Localized,
};

export const aboutSections: AboutSection[] = [
  // 1 — Identidad / Identity
  {
    kind: "facts",
    id: "identity",
    title: { es: "Identidad del vehículo", en: "Vehicle identity" },
    facts: [
      {
        label: { es: "Fabricante", en: "Manufacturer" },
        value: { es: "Asia Motors Corporation (KIA)", en: "Asia Motors Corporation (KIA)" },
      },
      {
        label: { es: "Producción", en: "Production" },
        value: { es: "1990 – 1997", en: "1990 – 1997" },
      },
      {
        label: { es: "Planta", en: "Plant" },
        value: { es: "Gwangju, Corea del Sur", en: "Gwangju, South Korea" },
      },
      {
        label: { es: "Plataforma base", en: "Base platform" },
        value: { es: "KIA KM410 (vehículo militar)", en: "KIA KM410 (military vehicle)" },
      },
      {
        label: { es: "Inspiración", en: "Inspiration" },
        value: { es: "Filosofía Jeep CJ", en: "Jeep CJ philosophy" },
      },
      {
        label: { es: "Tipo", en: "Type" },
        value: {
          es: "4x4 con chasis de largueros (body-on-frame)",
          en: "Body-on-frame 4x4",
        },
      },
    ],
  },

  // 2 — Arquitectura / Architecture
  {
    kind: "prose",
    id: "architecture",
    title: { es: "Arquitectura y chasis", en: "Architecture & chassis" },
    paragraphs: [
      {
        es:
          "El Rocsta no es un SUV de aspecto robusto: es un todoterreno puro. Su construcción se basa en " +
          "un chasis de largueros y travesaños (body-on-frame), el estándar para vehículos que deben " +
          "soportar torsiones severas fuera del asfalto.",
        en:
          "The Rocsta is not a rugged-looking SUV — it is a pure off-roader. It uses a ladder-frame, " +
          "body-on-frame construction, the industry standard for vehicles that must absorb severe twisting " +
          "loads off-road.",
      },
      {
        es:
          "Esto le da una rigidez estructural excepcional y permite que la carrocería sea casi un elemento " +
          "decorativo, separable del bastidor. Se ofrecieron dos familias dimensionales: batalla larga " +
          "(Country / Country Classic) y batalla corta (Deluxe / Softtop / “Stubby”).",
        en:
          "This grants exceptional structural rigidity and means the body is almost a cosmetic shell, " +
          "removable from the chassis. Two dimensional families were offered: long-wheelbase " +
          "(Country / Country Classic) and short-wheelbase (Deluxe / Softtop / “Stubby”).",
      },
    ],
  },

  // 3 — Dimensiones / Dimensions
  {
    kind: "dimensions",
    id: "dimensions",
    title: { es: "Dimensiones y batalla", en: "Dimensions & wheelbase" },
    intro: {
      es:
        "La versión larga ofrece más estabilidad y espacio de carga; la corta es una cabra para terrenos " +
        "cerrados y bosques.",
      en:
        "The long version offers more stability and load space; the short one is a goat for tight terrain " +
        "and forest tracks.",
    },
    sets: [
      {
        id: "lwb",
        name: {
          es: "Batalla larga · Country / Country Classic",
          en: "Long wheelbase · Country / Country Classic",
        },
        tagline: { es: "Más estable, más carga.", en: "More stable, more payload." },
        rows: [
          {
            label: { es: "Longitud total", en: "Overall length" },
            value: { es: "3.835 mm", en: "3,835 mm" },
          },
          {
            label: { es: "Anchura total", en: "Overall width" },
            value: { es: "1.688 mm", en: "1,688 mm" },
          },
          {
            label: { es: "Altura total", en: "Overall height" },
            value: {
              es: "1.960 mm (1.900 mm en algunas variantes)",
              en: "1,960 mm (1,900 mm on some variants)",
            },
          },
          { label: { es: "Batalla", en: "Wheelbase" }, value: { es: "2.632 mm", en: "2,632 mm" } },
          {
            label: { es: "Vía del./tras.", en: "Front/rear track" },
            value: { es: "1.310 mm", en: "1,310 mm" },
          },
          {
            label: { es: "Peso en orden de marcha", en: "Kerb weight" },
            value: { es: "≈ 1.200 – 1.250 kg", en: "≈ 1,200 – 1,250 kg" },
          },
          {
            label: { es: "Carga útil (pick-up)", en: "Payload (pick-up)" },
            value: { es: "Hasta 1.000 kg", en: "Up to 1,000 kg" },
          },
          {
            label: { es: "Círculo de giro", en: "Turning circle" },
            value: { es: "13,40 m", en: "13.40 m" },
          },
        ],
      },
      {
        id: "swb",
        name: {
          es: "Batalla corta · Deluxe / Softtop / “Stubby”",
          en: "Short wheelbase · Deluxe / Softtop / “Stubby”",
        },
        tagline: { es: "Maniobrable en terreno cerrado.", en: "Nimble in tight terrain." },
        rows: [
          {
            label: { es: "Longitud total", en: "Overall length" },
            value: { es: "3.460 mm", en: "3,460 mm" },
          },
          {
            label: { es: "Anchura total", en: "Overall width" },
            value: { es: "1.680 mm", en: "1,680 mm" },
          },
          {
            label: { es: "Altura total", en: "Overall height" },
            value: { es: "1.855 mm", en: "1,855 mm" },
          },
          { label: { es: "Batalla", en: "Wheelbase" }, value: { es: "2.132 mm", en: "2,132 mm" } },
          {
            label: { es: "Peso en orden de marcha", en: "Kerb weight" },
            value: { es: "≈ 1.220 – 1.270 kg", en: "≈ 1,220 – 1,270 kg" },
          },
          {
            label: { es: "Círculo de giro", en: "Turning circle" },
            value: { es: "9,60 m", en: "9.60 m" },
          },
        ],
      },
    ],
  },

  // 4 — Motorizaciones / Engines
  {
    kind: "engines",
    id: "engines",
    title: { es: "Tren motriz — corazón Mazda", en: "Powertrain — Mazda heart" },
    intro: {
      es:
        "Asia Motors recurrió a Mazda bajo licencia. Ambas opciones se asocian a una caja manual de 5 " +
        "velocidades y a una tracción total conectable (part-time 4WD) sin diferencial central: en " +
        "asfalto seco hay que circular en 2WD para no dañar la transmisión.",
      en:
        "Asia Motors relied on Mazda under licence. Both options use a 5-speed manual gearbox and a " +
        "part-time 4WD system without a centre differential: on dry tarmac you must drive in 2WD to " +
        "avoid damaging the transmission.",
    },
    engines: [
      {
        code: "Mazda F8 — 1.8 Gasolina",
        fuel: { es: "Gasolina", en: "Petrol" },
        specs: [
          {
            label: { es: "Cilindrada", en: "Displacement" },
            value: { es: "1.789 cc · 4 cil. en línea", en: "1,789 cc · 4-cyl inline" },
          },
          {
            label: { es: "Distribución", en: "Valvetrain" },
            value: { es: "SOHC 8v", en: "SOHC 8v" },
          },
          {
            label: { es: "Alimentación", en: "Fueling" },
            value: { es: "Carburador / inyección posterior", en: "Carburetor / later EFI" },
          },
          {
            label: { es: "Potencia", en: "Power" },
            value: { es: "≈ 70 kW (95 CV) a 5.000 rpm", en: "≈ 70 kW (95 hp) @ 5,000 rpm" },
          },
          {
            label: { es: "Par", en: "Torque" },
            value: { es: "159 Nm a 2.500 rpm", en: "159 Nm @ 2,500 rpm" },
          },
          { label: { es: "Depósito", en: "Fuel tank" }, value: { es: "62 L", en: "62 L" } },
        ],
        notes: {
          es:
            "Más suave y silencioso que el diésel, ideal para uso mixto. Consumo elevado (puede superar " +
            "15 L/100 km en ciudad). Mismo bloque que Mazda 626 (GC/GD) y B1800.",
          en:
            "Smoother and quieter than the diesel, ideal for mixed use. High fuel consumption (can exceed " +
            "15 L/100 km in town). Same block as the Mazda 626 (GC/GD) and B1800.",
        },
      },
      {
        code: "Mazda R2 / RF — 2.2 Diésel",
        fuel: { es: "Diésel", en: "Diesel" },
        specs: [
          {
            label: { es: "Cilindrada", en: "Displacement" },
            value: { es: "2.184 cc · 4 cil. en línea", en: "2,184 cc · 4-cyl inline" },
          },
          {
            label: { es: "Distribución", en: "Valvetrain" },
            value: { es: "OHV / SOHC 8v", en: "OHV / SOHC 8v" },
          },
          {
            label: { es: "Alimentación", en: "Fueling" },
            value: { es: "Inyección indirecta mecánica", en: "Mechanical indirect injection" },
          },
          {
            label: { es: "Compresión", en: "Compression ratio" },
            value: { es: "22,9 : 1", en: "22.9 : 1" },
          },
          {
            label: { es: "Potencia", en: "Power" },
            value: { es: "≈ 53 kW (72 CV) a 4.050 rpm", en: "≈ 53 kW (72 hp) @ 4,050 rpm" },
          },
          {
            label: { es: "Par", en: "Torque" },
            value: { es: "142 Nm a 2.500 rpm", en: "142 Nm @ 2,500 rpm" },
          },
          {
            label: { es: "Relación pot./peso", en: "Power/weight" },
            value: { es: "≈ 42,4 kW/t", en: "≈ 42.4 kW/t" },
          },
        ],
        notes: {
          es:
            "La elección lógica para off-road puro: par a bajas revoluciones ideal para escalar rocas o " +
            "salir del barro. Consumo notablemente más bajo. Correa de distribución crítica cada 80.000 km. " +
            "Derivado de las pickups Mazda B2200 / E2200 / Bongo.",
          en:
            "The logical choice for pure off-road: low-rpm torque ideal for crawling rocks or escaping " +
            "mud. Significantly lower fuel consumption. Critical timing belt every 80,000 km. Derived " +
            "from the Mazda B2200 / E2200 / Bongo pickups.",
        },
      },
    ],
  },

  // 5 — Suspensión, frenos y ruedas
  {
    kind: "facts",
    id: "chassis-spec",
    title: { es: "Suspensión, frenos y ruedas", en: "Suspension, brakes & wheels" },
    intro: {
      es:
        "No esperes confort de sedán: el Rocsta fue diseñado para trabajar. Configuración antigua, " +
        "simple e indestructible, con gran capacidad de carga a costa del confort y la estabilidad en curva.",
      en:
        "Don't expect sedan-like comfort: the Rocsta was built to work. An old-school, simple and " +
        "indestructible setup with great load capacity at the expense of ride comfort and cornering stability.",
    },
    facts: [
      {
        label: { es: "Suspensión delantera", en: "Front suspension" },
        value: {
          es: "Eje rígido con ballestas y amortiguadores hidráulicos",
          en: "Live axle with leaf springs and hydraulic dampers",
        },
      },
      {
        label: { es: "Suspensión trasera", en: "Rear suspension" },
        value: {
          es: "Eje rígido con ballestas y amortiguadores hidráulicos",
          en: "Live axle with leaf springs and hydraulic dampers",
        },
      },
      {
        label: { es: "Frenos delanteros", en: "Front brakes" },
        value: { es: "Discos", en: "Discs" },
      },
      {
        label: { es: "Frenos traseros", en: "Rear brakes" },
        value: { es: "Tambores", en: "Drums" },
      },
      {
        label: { es: "Neumáticos", en: "Tires" },
        value: {
          es: "215/75 R15 (versiones de trabajo) · 235/75 R15 (Deluxe)",
          en: "215/75 R15 (work versions) · 235/75 R15 (Deluxe)",
        },
      },
      {
        label: { es: "Altura libre al suelo", en: "Ground clearance" },
        value: { es: "205 – 230 mm", en: "205 – 230 mm" },
      },
    ],
  },

  // 6 — Off-road & remolque
  {
    kind: "facts",
    id: "offroad",
    title: { es: "Capacidades off-road y remolque", en: "Off-road & towing capability" },
    facts: [
      {
        label: { es: "Ángulo de ataque", en: "Approach angle" },
        value: {
          es: "Excelente — voladizo delantero muy corto",
          en: "Excellent — very short front overhang",
        },
      },
      {
        label: { es: "Vadeo", en: "Wading" },
        value: {
          es: "Suficiente para cruces de ríos moderados (limitado por la admisión)",
          en: "Suitable for moderate river crossings (intake-limited)",
        },
      },
      {
        label: { es: "Remolque con freno", en: "Braked towing" },
        value: { es: "1.000 kg", en: "1,000 kg" },
      },
      {
        label: { es: "Remolque sin freno", en: "Unbraked towing" },
        value: { es: "450 kg", en: "450 kg" },
      },
      {
        label: { es: "Caja de cambios", en: "Gearbox" },
        value: { es: "Manual de 5 velocidades", en: "5-speed manual" },
      },
      {
        label: { es: "Tracción", en: "Drivetrain" },
        value: {
          es: "4x4 conectable (part-time), cubos manuales",
          en: "Part-time 4WD with manual locking hubs",
        },
      },
    ],
  },

  // 7 — Variantes
  {
    kind: "list",
    id: "variants",
    title: { es: "Variantes y carrocerías", en: "Variants & body styles" },
    intro: {
      es: "Asia Motors ofreció un abanico de versiones para cubrir todas las necesidades.",
      en: "Asia Motors offered a range of versions to cover every need.",
    },
    items: [
      {
        title: { es: "SUV techo rígido (Hard Top)", en: "Hard-top SUV" },
        description: {
          es: "La versión más común, con techo de metal o fibra, ideal para el día a día.",
          en: "The most common version, with metal or fibreglass roof — ideal for daily use.",
        },
      },
      {
        title: { es: "SUV descapotable (Soft Top)", en: "Soft-top SUV" },
        description: {
          es: "Techo de lona, para puristas y días soleados.",
          en: "Canvas top, for purists and sunny days.",
        },
      },
      {
        title: { es: "Pick-up (chasis con cabina)", en: "Pick-up (chassis cab)" },
        description: {
          es:
            "Versión con caja de carga abierta, popular en entornos agrícolas y de construcción. " +
            "Carga útil sustancialmente mayor.",
          en: "Open-bed version, popular in agriculture and construction. Substantially higher payload.",
        },
      },
    ],
  },

  // 8 — Timeline
  {
    kind: "timeline",
    id: "history",
    title: { es: "Línea temporal", en: "Timeline" },
    entries: [
      {
        year: "1990",
        text: {
          es: "Lanzamiento del Asia Rocsta en Corea del Sur, basado en el chasis militar KM410.",
          en: "Asia Rocsta launches in South Korea, based on the KM410 military chassis.",
        },
      },
      {
        year: "1993",
        text: {
          es: "Llegada a España importado por Aresa Motor; alternativa accesible al Suzuki Samurai.",
          en: "Arrives in Spain imported by Aresa Motor; an accessible alternative to the Suzuki Samurai.",
        },
      },
      {
        year: "1994",
        text: {
          es: "Actualización mecánica menor y mejoras de equipamiento.",
          en: "Minor mechanical update and equipment improvements.",
        },
      },
      {
        year: "1997",
        text: {
          es: "Fin de producción tras la crisis financiera asiática que golpea a Asia Motors.",
          en: "Production ends after the Asian financial crisis hits Asia Motors hard.",
        },
      },
      {
        year: "1999",
        text: {
          es: "KIA absorbe definitivamente la marca Asia Motors.",
          en: "KIA fully absorbs the Asia Motors brand.",
        },
      },
      {
        year: "2020+",
        text: {
          es:
            "Auge de la comunidad de restauradores en España, Italia y Corea. El Rocsta se consolida como " +
            "clásico moderno de culto.",
          en:
            "Rise of the restorer community in Spain, Italy and Korea. The Rocsta consolidates as a " +
            "modern cult classic.",
        },
      },
    ],
  },

  // 9 — Legado / Legacy
  {
    kind: "prose",
    id: "legacy",
    title: { es: "Legado", en: "Legacy" },
    paragraphs: [
      {
        es:
          "Hoy el Asia Rocsta es un clásico moderno de culto. Su mecánica Mazda lo hace increíblemente " +
          "fiable y fácil de mantener, mientras que su rareza lo convierte en el centro de atención en " +
          "cualquier concentración 4x4.",
        en:
          "Today the Asia Rocsta is a modern cult classic. Its Mazda mechanicals make it incredibly " +
          "reliable and easy to service, while its rarity puts it at the centre of attention at any 4x4 meet.",
      },
      {
        es:
          "No es un coche rápido, ni cómodo, ni silencioso. Pero es un compañero honesto, duro como una " +
          "roca, que nunca te dejará tirado si sabes cómo tratarlo. Hecho por coreanos, pensado por " +
          "japoneses y deseado por todoterrenos de corazón.",
        en:
          "It is not a fast car, nor a comfortable one, nor a quiet one. But it is an honest companion, " +
          "rock-solid, that will never leave you stranded if you know how to treat it. Built by Koreans, " +
          "engineered by Japanese minds, and wanted by off-roaders at heart.",
      },
    ],
  },
];

export const aboutMission = {
  title: { es: "Por qué existe este archivo", en: "Why this archive exists" } satisfies Localized,
  desc: {
    es:
      "El Rocsta es un coche escaso, sin red oficial de recambios y con documentación dispersa. Este " +
      "proyecto reúne piezas, equivalencias, guías y fallos comunes en un único lugar abierto, para que " +
      "cualquier propietario pueda mantener vivo su vehículo.",
    en:
      "The Rocsta is a rare vehicle with no official spares network and scattered documentation. This " +
      "project gathers parts, cross-references, guides and common faults in one open place so any owner " +
      "can keep their vehicle alive.",
  } satisfies Localized,
  cta: { es: "Únete a la comunidad", en: "Join the community" } satisfies Localized,
  cta2: { es: "Explorar piezas", en: "Browse parts" } satisfies Localized,
};
