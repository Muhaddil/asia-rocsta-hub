// Para añadir o traducir contenido nuevo basta con editar este archivo:
//   1. Cada texto es un objeto Localized { es, en }.
//   2. Para añadir un idioma nuevo, extiende el tipo Localized y rellena
//      las claves; la página About leerá automáticamente el idioma
//      activo via useLanguage().
//   3. Para añadir una sección nueva, empújala dentro de
//      `aboutSections` con el tipo `AboutSection` apropiado.
// =====================================================================

export type Localized = { es: string; en: string };

export type AboutInfo = {
  tooltip: Localized;
  dialog: { title: Localized; body: Localized };
};

export type AboutFact = { label: Localized; value: Localized; info?: AboutInfo };

export type AboutEngine = {
  code: Localized;
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
        info: {
          tooltip: {
            es: "Asia Motors era filial de KIA Motors, ambos surcoreanos",
            en: "Asia Motors was a subsidiary of KIA Motors, both South Korean",
          },
          dialog: {
            title: { es: "Sobre Asia Motors", en: "About Asia Motors" },
            body: {
              es: "Asia Motors Co., Ltd. fue un fabricante surcoreano de vehículos especializado en todoterrenos y vehículos militares, fundado en 1964 en Seúl. Era filial de KIA Motors (fundada en 1944). En 1999, KIA absorbió definitivamente la marca.\n\nAntes del Rocsta, Asia Motors producía el KM410, un todoterreno militar del que deriva directamente el Rocsta. Tras el éxito del Rocsta civil, Asia Motors pasó a producir exclusivamente el modelo hasta su cierre.",
              en: "Asia Motors Co., Ltd. was a South Korean vehicle manufacturer specialised in off-road and military vehicles, founded in 1964 in Seoul. It was a subsidiary of KIA Motors (founded in 1944). In 1999, KIA fully absorbed the brand.\n\nBefore the Rocsta, Asia Motors produced the KM410, a military off-roader from which the Rocsta derives directly. After the success of the civilian Rocsta, Asia Motors produced exclusively this model until closure.",
            },
          },
        },
      },
      {
        label: { es: "Producción", en: "Production" },
        value: { es: "1990 – 1997", en: "1990 – 1997" },
        info: {
          tooltip: {
            es: "7 años de producción, con crisis asiática en el último año",
            en: "7 years of production, with Asian crisis in the final year",
          },
          dialog: {
            title: { es: "Período de producción", en: "Production period" },
            body: {
              es: "El Rocsta se fabricó durante 7 años. El modelo fue actualizado mecánicamente en 1993-1994 (introducción del motor RF y dirección asistida opcional) y 1995-1996 (mejoras de equipamiento).\n\nLa crisis financiera asiática de 1997 golpeó duramente a Asia Motors, con la caída de la demanda de exportación y la devaluación del won. La producción cesó en 1997 y la marca fue absorbida por KIA en 1999.",
              en: "The Rocsta was manufactured for 7 years. The model was mechanically updated in 1993-1994 (introduction of the RF engine and optional power steering) and 1995-1996 (equipment upgrades).\n\nThe 1997 Asian financial crisis hit Asia Motors hard, with falling export demand and won devaluation. Production ceased in 1997 and the brand was absorbed by KIA in 1999.",
            },
          },
        },
      },
      {
        label: { es: "Unidades producidas", en: "Units produced" },
        value: {
          es: "≈ 30.000 – 35.000 (estimación; no hay cifra oficial publicada)",
          en: "≈ 30,000 – 35,000 (estimate; no official figure published)",
        },
        info: {
          tooltip: {
            es: "Cifra estimada por registros de exportación y de campo",
            en: "Figure estimated from export and field records",
          },
          dialog: {
            title: { es: "Unidades producidas", en: "Units produced" },
            body: {
              es: "Asia Motors nunca publicó una cifra oficial de producción. La estimación de 30.000-35.000 unidades se basa en:\n• Registros de exportación a Europa (≈ 12.000-15.000 unidades a España, Portugal, Italia, Grecia).\n• Mercado doméstico coreano y flotas militares (≈ 8.000-10.000 unidades).\n• Exportaciones a Latinoamérica, Oriente Medio y África (≈ 10.000-12.000 unidades).\n\nEsto hace del Rocsta un vehículo raro: menos unidades que un Suzuki Samurai o un Daihatsu Feroza del mismo período.",
              en: "Asia Motors never published an official production figure. The 30,000-35,000 unit estimate is based on:\n• European export records (≈ 12,000-15,000 units to Spain, Portugal, Italy, Greece).\n• Korean domestic market and military fleets (≈ 8,000-10,000 units).\n• Exports to Latin America, Middle East and Africa (≈ 10,000-12,000 units).\n\nThis makes the Rocsta a rare vehicle: fewer units than a Suzuki Samurai or Daihatsu Feroza from the same period.",
            },
          },
        },
      },
      {
        label: { es: "Planta", en: "Plant" },
        value: { es: "Gwangju, Corea del Sur", en: "Gwangju, South Korea" },
        info: {
          tooltip: {
            es: "Fábrica de Asia Motors en Gwangju (provincia de Jeolla del Sur)",
            en: "Asia Motors factory in Gwangju (South Jeolla Province)",
          },
          dialog: {
            title: { es: "Planta de Gwangju", en: "Gwangju plant" },
            body: {
              es: "La planta de Asia Motors en Gwangju (광주), capital de la provincia de Jeolla del Sur, fabricó todos los Rocsta producidos. La fábrica fue posteriormente integrada en la red de producción de KIA tras la absorción de 1999.\n\nGwangju es un importante polo industrial del suroeste de Corea del Sur, conocido también por la industria del automóvil. La planta original ha sido modernizada y produce actualmente modelos de KIA.",
              en: "The Asia Motors plant in Gwangju (광주), capital of South Jeolla Province, manufactured all Rocstas produced. The factory was later integrated into KIA's production network after the 1999 absorption.\n\nGwangju is an important industrial hub in southwest South Korea, also known for the automotive industry. The original plant has been modernised and currently produces KIA models.",
            },
          },
        },
      },
      {
        label: { es: "Plataforma base", en: "Base platform" },
        value: { es: "KIA KM410 (vehículo militar)", en: "KIA KM410 (military vehicle)" },
        info: {
          tooltip: {
            es: "El KM410 fue diseñado para el ejército surcoreano",
            en: "The KM410 was designed for the South Korean army",
          },
          dialog: {
            title: { es: "Plataforma KIA KM410", en: "KIA KM410 platform" },
            body: {
              es: "El KM410 es un vehículo militar ligero diseñado por KIA para las fuerzas armadas de Corea del Sur. El Rocsta hereda su chasis de largueros, tracción total part-time y caja de transferencia de dos velocidades. Esta base militar garantiza una robustez estructural exceptional, con largueros de acero de alta resistencia capaces de soportar torsiones severas fuera del asfalto.",
              en: "The KM410 is a light military vehicle designed by KIA for the South Korean armed forces. The Rocsta inherits its ladder-frame chassis, part-time 4WD and two-speed transfer case. This military foundation guarantees exceptional structural robustness, with high-strength steel sills capable of withstanding severe twisting loads off-road.",
            },
          },
        },
      },
      {
        label: { es: "Tipo", en: "Type" },
        value: {
          es: "4x4 con chasis de largueros (body-on-frame)",
          en: "Body-on-frame 4x4",
        },
        info: {
          tooltip: {
            es: "Construcción separada: carrocería sobre chasis",
            en: "Separate construction: body on frame",
          },
          dialog: {
            title: { es: "Construcción body-on-frame", en: "Body-on-frame construction" },
            body: {
              es: "A diferencia de los SUV modernos con carrocería autoportante (unibody), el Rocsta usa una construcción body-on-frame: la carrocería se monta sobre un chasis rígido de largueros y travesaños. Esto permite separar la carrocería del bastidor, facilita reparaciones estructurales y resiste mejor las torsiones off-road. Es el estándar en todoterrenos puros como el Jeep Wrangler o el Land Rover Defender.",
              en: "Unlike modern SUVs with unibody construction, the Rocsta uses a body-on-frame design: the body mounts on a rigid chassis of sills and cross-members. This allows separating the body from the frame, facilitates structural repairs and better withstands off-road twisting. It is the standard in pure off-roaders like the Jeep Wrangler or Land Rover Defender.",
            },
          },
        },
      },
      {
        label: { es: "Inspiración", en: "Inspiration" },
        value: { es: "Filosofía Jeep CJ", en: "Jeep CJ philosophy" },
        info: {
          tooltip: {
            es: "Diseño inspirado en el Jeep CJ-7 americano",
            en: "Design inspired by the American Jeep CJ-7",
          },
          dialog: {
            title: { es: "Inspiración Jeep CJ", en: "Jeep CJ inspiration" },
            body: {
              es: "El Rocsta adopta la filosofía del Jeep CJ (Civilian Jeep) americano: un todoterreno esencial, con parabrisas abatible, carrocería separable, sin comodidades superfluas y pensado para el trabajo y el ocio outdoor.\n\nLa influencia se ve claramente en:\n• Parabrisas frontal abatible hacia delante.\n• Puertas y capós desmontables.\n• Techo rígido o de lona intercambiable.\n• Cuadro de instrumentos simple y funcional.\n• Manejo de palancas y pedales directo y mecánico.\n\nNo es una copia del CJ-7, sino una reinterpretación coreana con mecánica Mazda.",
              en: "The Rocsta adopts the American Jeep CJ (Civilian Jeep) philosophy: an essential off-roader, with fold-down windscreen, removable body, without superfluous comforts and designed for work and outdoor leisure.\n\nThe influence is clearly seen in:\n• Front fold-down windscreen.\n• Removable doors and bonnets.\n• Interchangeable rigid or canvas top.\n• Simple and functional instrument cluster.\n• Direct and mechanical lever and pedal feel.\n\nIt is not a CJ-7 copy, but a Korean reinterpretation with Mazda mechanicals.",
            },
          },
        },
      },
      {
        label: { es: "Principales mercados de exportación", en: "Main export markets" },
        value: {
          es: "España, Portugal, Italia, Grecia, Colombia, Chile, Oriente Medio, África",
          en: "Spain, Portugal, Italy, Greece, Colombia, Chile, Middle East, Africa",
        },
        info: {
          tooltip: {
            es: "España y Portugal son los mayores mercados europeos",
            en: "Spain and Portugal are the largest European markets",
          },
          dialog: {
            title: { es: "Mercados de exportación", en: "Export markets" },
            body: {
              es: "El Rocsta se exportó a mercados muy diversos:\n• Europa mediterránea (España, Portugal, Italia, Grecia): principales mercados europeos. España fue el primer importador, vía Bensus Automoción (1993).\n• Latinoamérica (Colombia, Chile, México): gran aceptación en zonas rurales y agrícolas.\n• Oriente Medio y norte de África: por sus capacidades off-road y robustez.\n• África subsahariana: usado en agricultura, minería y por ONG.\n\nNo se vendió oficialmente en Norteamérica ni en Europa central/occidental (Alemania, Francia, Reino Unido), donde la competencia del Suzuki Samurai, Daihatsu Feroza y Lada Niva era más fuerte.",
              en: "The Rocsta was exported to very diverse markets:\n• Mediterranean Europe (Spain, Portugal, Italy, Greece): main European markets. Spain was the first importer, via Bensus Automoción (1993).\n• Latin America (Colombia, Chile, Mexico): well received in rural and agricultural areas.\n• Middle East and North Africa: for its off-road capabilities and robustness.\n• Sub-Saharan Africa: used in agriculture, mining and by NGOs.\n\nIt was not officially sold in North America or Central/Western Europe (Germany, France, UK), where competition from the Suzuki Samurai, Daihatsu Feroza and Lada Niva was stronger.",
            },
          },
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
          '(Country / Country Classic) y batalla corta (Deluxe / Softtop / "Stubby").',
        en:
          "This grants exceptional structural rigidity and means the body is almost a cosmetic shell, " +
          "removable from the chassis. Two dimensional families were offered: long-wheelbase " +
          '(Country / Country Classic) and short-wheelbase (Deluxe / Softtop / "Stubby").',
      },
      {
        es:
          "La tracción total es part-time con caja de transferencia de dos velocidades (2H / 4H / 4L) y " +
          "cubos de rueda manuales. No hay diferencial central, por lo que en asfalto seco es obligatorio " +
          "circular en 2H para evitar daños en la transmisión.",
        en:
          "The four-wheel drive is part-time with a two-speed transfer case (2H / 4H / 4L) and manual " +
          "locking hubs. There is no centre differential, so on dry tarmac driving in 2H is mandatory " +
          "to avoid transmission wind-up and damage.",
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
            info: {
              tooltip: {
                es: "Similar a un Suzuki Jimny actual (3.645 mm)",
                en: "Similar to a current Suzuki Jimny (3,645 mm)",
              },
              dialog: {
                title: { es: "Longitud total LWB", en: "LWB overall length" },
                body: {
                  es: "Con 3.835 mm de longitud, el LWB es un vehículo compacto para ser un 4x4. Es apenas 200 mm más largo que la versión SWB y ≈ 200 mm más corto que un Jeep Wrangler YJ del mismo período.\n\nEsta longitud moderada facilita maniobras en ciudad y senderos estrechos, sin sacrificar demasiado espacio interior ni capacidad de carga.",
                  en: "At 3,835 mm long, the LWB is a compact vehicle for a 4x4. It is barely 200 mm longer than the SWB and ≈ 200 mm shorter than a Jeep Wrangler YJ of the same period.\n\nThis moderate length facilitates manoeuvres in city and narrow trails, without sacrificing too much interior space or load capacity.",
                },
              },
            },
          },
          {
            label: { es: "Anchura total", en: "Overall width" },
            value: { es: "1.688 mm", en: "1,688 mm" },
            info: {
              tooltip: {
                es: "Cuerpo estrecho ideal para senderos",
                en: "Narrow body ideal for trails",
              },
              dialog: {
                title: { es: "Anchura total", en: "Overall width" },
                body: {
                  es: "Con 1.688 mm de anchura, el Rocsta es notablemente estrecho comparado con SUVs modernos (1.800-1.900 mm). Esto es una ventaja off-road: el vehículo cabe por senderos estrechos, entre árboles y rocas.\n\nEn el interior, esta anchura se traduce en asientos delanteros algo justos para personas de talla grande. La anchura entre pasos de rueda es limitada, por lo que montar neumáticos muy anchos (> 235 mm) puede requerir modificaciones.",
                  en: "At 1,688 mm wide, the Rocsta is notably narrow compared to modern SUVs (1,800-1,900 mm). This is an off-road advantage: the vehicle fits through narrow trails, between trees and rocks.\n\nInside, this width translates into somewhat tight front seats for tall people. The width between wheel arches is limited, so fitting very wide tyres (> 235 mm) may require modifications.",
                },
              },
            },
          },
          {
            label: { es: "Altura total", en: "Overall height" },
            value: {
              es: "1.960 mm (1.900 mm en algunas variantes)",
              en: "1,960 mm (1,900 mm on some variants)",
            },
            info: {
              tooltip: {
                es: "Algunos mercados tenían techo más bajo",
                en: "Some markets had a lower roof",
              },
              dialog: {
                title: { es: "Altura total", en: "Overall height" },
                body: {
                  es: "La altura de 1.960 mm es la estándar para la versión LWB. Algunas variantes (especialmente las destinadas a Corea del Sur) se fabricaron con un techo más bajo (1.900 mm), posiblemente para cumplir normativas de altura máxima en parkings subterráneos.\n\nSi tu Rocsta mide menos de 1.950 mm, es probable que sea una variante de techo bajo. Esto es puramente cosmético y no afecta a las capacidades off-road.",
                  en: "The 1,960 mm height is standard for the LWB version. Some variants (especially those for the South Korean domestic market) were manufactured with a lower roof (1,900 mm), possibly to comply with maximum height regulations in underground car parks.\n\nIf your Rocsta measures less than 1,950 mm, it is likely a low-roof variant. This is purely cosmetic and does not affect off-road capabilities.",
                },
              },
            },
          },
          {
            label: { es: "Batalla", en: "Wheelbase" },
            value: { es: "2.632 mm", en: "2,632 mm" },
            info: {
              tooltip: {
                es: "Distancia entre ejes — define el espacio interior",
                en: "Distance between axles — defines interior space",
              },
              dialog: {
                title: { es: "Distancia entre ejes LWB", en: "LWB wheelbase" },
                body: {
                  es: "La batalla de 2.632 mm es 500 mm mayor que la SWB. Esto se traduce en:\n• Mayor espacio interior y de carga.\n• Mejor estabilidad en carretera y a alta velocidad.\n• Ángulo de rampa menor (peor para subir rampas pronunciadas).\n• Mayor círculo de giro.\n\nEs la opción más equilibrada para uso mixto carretera/off-road.",
                  en: "The 2,632 mm wheelbase is 500 mm longer than the SWB. This translates into:\n• More interior and load space.\n• Better stability on road and at high speed.\n• Smaller ramp-over angle (worse for climbing steep ramps).\n• Larger turning circle.\n\nIt is the most balanced option for mixed road/off-road use.",
                },
              },
            },
          },
          {
            label: { es: "Vía del./tras.", en: "Front/rear track" },
            value: { es: "1.310 mm", en: "1,310 mm" },
            info: {
              tooltip: {
                es: "Anchura entre ruedas — afecta a la estabilidad",
                en: "Width between wheels — affects stability",
              },
              dialog: {
                title: { es: "Vía delantera y trasera", en: "Front and rear track" },
                body: {
                  es: "La vía de 1.310 mm es relativamente estrecha para un 4x4, lo que mejora la maniobrabilidad en terreno cerrado pero reduce la estabilidad lateral en curva.\n\nLa vía es igual delante y detrás, lo que simplifica la fabricación de neumáticos y permite cierta intercambiabilidad entre ejes (rotación cruzada).\n\nPara mejorar la estabilidad off-road y en carretera, algunos propietarios instalan separadores de rueda (wheel spacers) de 25-30 mm, que amplían la vía efectiva a ≈ 1.360-1.370 mm.",
                  en: "The 1,310 mm track is relatively narrow for a 4x4, improving manoeuvrability in closed terrain but reducing lateral stability in corners.\n\nThe track is equal front and rear, simplifying tyre manufacturing and allowing some interchangeability between axles (cross-rotation).\n\nTo improve off-road and road stability, some owners install 25-30 mm wheel spacers, extending the effective track to ≈ 1,360-1,370 mm.",
                },
              },
            },
          },
          {
            label: { es: "Peso en orden de marcha", en: "Kerb weight" },
            value: { es: "≈ 1.200 – 1.250 kg", en: "≈ 1,200 – 1,250 kg" },
            info: {
              tooltip: {
                es: "Ligero para un 4x4 — facilita rescates y modificaciones",
                en: "Light for a 4x4 — facilitates recovery and modifications",
              },
              dialog: {
                title: { es: "Peso en orden de marcha", en: "Kerb weight" },
                body: {
                  es: "Con ≈ 1.200-1.250 kg, el Rocsta LWB es ligero para un 4x4 (un Jeep Wrangler YJ pesa ≈ 1.500 kg). Esto se traduce en:\n• Mejor relación potencia/peso con el motor gasolina F8.\n• Más fácil de recuperar con cabrestante o empujar.\n• Menor consumo y carga sobre ejes.\n• Flota mejor en agua (literalmente).\n\nEl peso varía según equipamiento: dirección asistida, aire acondicionado y hardtop añaden entre 50 y 100 kg.",
                  en: "At ≈ 1,200-1,250 kg, the Rocsta LWB is light for a 4x4 (a Jeep Wrangler YJ weighs ≈ 1,500 kg). This translates into:\n• Better power/weight ratio with the F8 petrol engine.\n• Easier to recover with winch or to push.\n• Lower consumption and axle load.\n• Floats better in water (literally).\n\nWeight varies with equipment: power steering, air conditioning and hardtop add between 50 and 100 kg.",
                },
              },
            },
          },
          {
            label: { es: "Carga útil (pick-up)", en: "Payload (pick-up)" },
            value: { es: "Hasta 1.000 kg", en: "Up to 1,000 kg" },
            info: {
              tooltip: {
                es: "Capacidad notable — apta para uso agrícola y de trabajo",
                en: "Notable capacity — suitable for agricultural and work use",
              },
              dialog: {
                title: { es: "Carga útil", en: "Payload" },
                body: {
                  es: "La versión pick-up tiene una carga útil de hasta 1.000 kg, comparable a pick-ups comerciales compactas del mismo período (Ford Courier, Mazda B2200). Esto incluye:\n• Carga en la caja trasera (palets, herramientas, materiales).\n• Pasajeros (5 plazas en versión cerrada, 2 en pick-up).\n• Equipamiento extra (cabrestante, baca, depósito auxiliar).\n\nCon carga máxima, la suspensión puede tocar topes: se recomienda reforzar las ballestas traseras (overload springs) si se transportan > 500 kg habitualmente.",
                  en: "The pick-up version has a payload of up to 1,000 kg, comparable to compact commercial pick-ups of the same period (Ford Courier, Mazda B2200). This includes:\n• Load in the rear bed (pallets, tools, materials).\n• Passengers (5 seats in closed version, 2 in pick-up).\n• Extra equipment (winch, roof rack, auxiliary tank).\n\nAt maximum load, the suspension may bottom out: rear overload springs are recommended if > 500 kg is regularly carried.",
                },
              },
            },
          },
          {
            label: { es: "Círculo de giro", en: "Turning circle" },
            value: { es: "13,40 m", en: "13.40 m" },
            info: {
              tooltip: {
                es: "Círculo amplio para un vehículo tan corto",
                en: "Wide circle for such a short vehicle",
              },
              dialog: {
                title: { es: "Círculo de giro LWB", en: "LWB turning circle" },
                body: {
                  es: "El círculo de giro de 13,40 m es relativamente amplio considerando la longitud del LWB. Esto se debe a la dirección de recirculación de bolas, que limita el ángulo máximo de las ruedas.\n\nA modo de comparación:\n• Suzuki Jimny: 9,4 m (más corto y dirección más directa).\n• Jeep Wrangler YJ LWB: 12,4 m (mejor).\n• Toyota Land Cruiser 70: 14,4 m (peor).\n\nEn ciudad hay que planificar las maniobras con más espacio. En campo, no es problema.",
                  en: "The 13.40 m turning circle is relatively wide considering the LWB length. This is due to the recirculating ball steering, which limits the maximum wheel angle.\n\nFor comparison:\n• Suzuki Jimny: 9.4 m (shorter and more direct steering).\n• Jeep Wrangler YJ LWB: 12.4 m (better).\n• Toyota Land Cruiser 70: 14.4 m (worse).\n\nIn the city, plan manoeuvres with more space. Off-road, it is not a problem.",
                },
              },
            },
          },
        ],
      },
      {
        id: "swb",
        name: {
          es: 'Batalla corta · Deluxe / Softtop / "Stubby"',
          en: 'Short wheelbase · Deluxe / Softtop / "Stubby"',
        },
        tagline: { es: "Maniobrable en terreno cerrado.", en: "Nimble in tight terrain." },
        rows: [
          {
            label: { es: "Longitud total", en: "Overall length" },
            value: { es: "3.460 mm", en: "3,460 mm" },
            info: {
              tooltip: {
                es: "≈ 375 mm más corto que el LWB",
                en: "≈ 375 mm shorter than the LWB",
              },
              dialog: {
                title: { es: "Longitud total SWB", en: "SWB overall length" },
                body: {
                  es: "Con 3.460 mm, el SWB es ≈ 375 mm más corto que el LWB. Esto lo hace más maniobrable y le da mejores ángulos off-road (especialmente el de rampa).\n\nEs la versión preferida para:\n• Competición todoterreno.\n• Uso en bosques, senderos técnicos y rocosos.\n• Estética 'mini-Jeep' muy buscada por coleccionistas.",
                  en: "At 3,460 mm, the SWB is ≈ 375 mm shorter than the LWB. This makes it more manoeuvrable and gives better off-road angles (especially ramp-over).\n\nIt is the preferred version for:\n• Off-road competition.\n• Use in forests, technical and rocky trails.\n• 'Mini-Jeep' look much sought after by collectors.",
                },
              },
            },
          },
          {
            label: { es: "Anchura total", en: "Overall width" },
            value: { es: "1.680 mm", en: "1,680 mm" },
            info: {
              tooltip: {
                es: "8 mm más estrecho que el LWB",
                en: "8 mm narrower than the LWB",
              },
              dialog: {
                title: { es: "Anchura total SWB", en: "SWB overall width" },
                body: {
                  es: "La anchura de 1.680 mm es prácticamente igual a la del LWB (1.688 mm) — solo 8 mm de diferencia. Las dos versiones comparten la misma carrocería y la diferencia se debe a pequeños detalles de paneles.\n\nEsta anchura compacta es ideal para circular por senderos estrechos y entre vegetación densa.",
                  en: "The 1,680 mm width is virtually the same as the LWB (1,688 mm) — only 8 mm difference. Both versions share the same body and the difference is due to small panel details.\n\nThis compact width is ideal for driving on narrow trails and through dense vegetation.",
                },
              },
            },
          },
          {
            label: { es: "Altura total", en: "Overall height" },
            value: { es: "1.855 mm", en: "1,855 mm" },
            info: {
              tooltip: {
                es: "105 mm más bajo que el LWB",
                en: "105 mm lower than the LWB",
              },
              dialog: {
                title: { es: "Altura total SWB", en: "SWB overall height" },
                body: {
                  es: "El SWB es 105 mm más bajo que el LWB (1.855 vs 1.960 mm). Esto se debe a su menor batalla y a un centro de gravedad más bajo, lo que mejora la estabilidad en curvas y reduce el riesgo de vuelco lateral off-road.\n\nEl centro de gravedad más bajo es especialmente ventajoso en pasos laterales pronunciados, donde un 4x4 alto podría volcar.",
                  en: "The SWB is 105 mm lower than the LWB (1,855 vs 1,960 mm). This is due to its shorter wheelbase and lower centre of gravity, improving cornering stability and reducing the risk of side rollover off-road.\n\nThe lower centre of gravity is especially advantageous on steep side slopes, where a tall 4x4 could roll over.",
                },
              },
            },
          },
          {
            label: { es: "Batalla", en: "Wheelbase" },
            value: { es: "2.132 mm", en: "2,132 mm" },
            info: {
              tooltip: {
                es: "500 mm más corta que el LWB",
                en: "500 mm shorter than the LWB",
              },
              dialog: {
                title: { es: "Distancia entre ejes SWB", en: "SWB wheelbase" },
                body: {
                  es: "La batalla de 2.132 mm es 500 mm más corta que la del LWB. Las consecuencias:\n• Ángulo de rampa mejor (≈ 25° vs ≈ 18° del LWB).\n• Mejor ángulo de ataque y salida (paragolpes más cerca del suelo).\n• Más maniobrable en terreno cerrado.\n• Peor comportamiento en carretera (más sensible a viento lateral, dirección más nerviosa).\n• Menor espacio interior para piernas en las plazas traseras.",
                  en: "The 2,132 mm wheelbase is 500 mm shorter than the LWB. Consequences:\n• Better ramp-over angle (≈ 25° vs ≈ 18° for LWB).\n• Better approach and departure angles (bumpers closer to the ground).\n• More manoeuvrable in closed terrain.\n• Worse road behaviour (more sensitive to crosswind, twitchier steering).\n• Less rear legroom for passengers.",
                },
              },
            },
          },
          {
            label: { es: "Peso en orden de marcha", en: "Kerb weight" },
            value: { es: "≈ 1.220 – 1.270 kg", en: "≈ 1,220 – 1,270 kg" },
            info: {
              tooltip: {
                es: "Más pesado que el LWB por la concentración de masa",
                en: "Heavier than the LWB due to mass concentration",
              },
              dialog: {
                title: { es: "Peso en orden de marcha SWB", en: "SWB kerb weight" },
                body: {
                  es: "Paradójicamente, el SWB pesa ligeramente MÁS que el LWB (1.220-1.270 kg vs 1.200-1.250 kg) a pesar de ser más corto. Esto se debe a:\n• Versiones equipadas con A/C y dirección asistida, más comunes en SWB.\n• Mayor porcentaje de equipos opcionales (techo rígido más pesado, más opciones de acabado).\n• Refuerzos estructurales en batalla corta.\n\nEn la práctica, la diferencia es despreciable (≈ 20 kg) y no afecta a las prestaciones.",
                  en: "Paradoxically, the SWB weighs slightly MORE than the LWB (1,220-1,270 kg vs 1,200-1,250 kg) despite being shorter. This is due to:\n• Versions fitted with A/C and power steering, more common in SWB.\n• Higher percentage of optional equipment (heavier hardtop, more trim options).\n• Structural reinforcements in short wheelbase.\n\nIn practice, the difference is negligible (≈ 20 kg) and does not affect performance.",
                },
              },
            },
          },
          {
            label: { es: "Círculo de giro", en: "Turning circle" },
            value: { es: "9,60 m", en: "9.60 m" },
            info: {
              tooltip: {
                es: "Excelente para uso urbano y senderos",
                en: "Excellent for urban use and trails",
              },
              dialog: {
                title: { es: "Círculo de giro SWB", en: "SWB turning circle" },
                body: {
                  es: "Con 9,60 m, el SWB tiene un círculo de giro excelente — comparable al de un Suzuki Jimny (9,4 m) y notablemente mejor que el LWB (13,40 m).\n\nEsto se traduce en:\n• Maniobras de parking mucho más fáciles.\n• Giros cerrados en senderos de montaña.\n• Mayor agilidad en trial y competición.\n\nSi buscas un 4x4 para uso mixto ciudad/campo, el SWB es claramente superior en maniobrabilidad.",
                  en: "At 9.60 m, the SWB has an excellent turning circle — comparable to a Suzuki Jimny (9.4 m) and notably better than the LWB (13.40 m).\n\nThis translates into:\n• Much easier parking manoeuvres.\n• Tight turns on mountain trails.\n• Greater agility in trial and competition.\n\nIf you are looking for a 4x4 for mixed city/country use, the SWB is clearly superior in manoeuvrability.",
                },
              },
            },
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
        "Asia Motors recurrió a Mazda bajo licencia para las tres opciones de motor. Todas se asocian a " +
        "una caja manual de 5 velocidades y a una tracción total conectable (part-time 4WD) sin diferencial " +
        "central: en asfalto seco hay que circular en 2WD para no dañar la transmisión.",
      en:
        "Asia Motors relied on Mazda under licence for all three engine options. All use a 5-speed manual " +
        "gearbox and a part-time 4WD system without a centre differential: on dry tarmac you must drive " +
        "in 2WD to avoid damaging the transmission.",
    },
    engines: [
      {
        code: { es: "Mazda F8 — 1.8 Gasolina", en: "Mazda F8 — 1.8 Petrol" },
        fuel: { es: "Gasolina", en: "Petrol" },
        specs: [
          {
            label: { es: "Cilindrada", en: "Displacement" },
            value: { es: "1.789 cc · 4 cil. en línea", en: "1,789 cc · 4-cyl inline" },
            info: {
              tooltip: { es: "1.789 cc — 4 cilindros en línea", en: "1,789 cc — 4-cyl inline" },
              dialog: {
                title: { es: "Cilindrada", en: "Displacement" },
                body: {
                  es: "El Mazda F8 tiene una cilindrada exacta de 1.789 cc, con un diámetro de 86 mm y una carrera de 77 mm.\n\nEs un motor de 4 cilindros en línea con configuración longitudinal, diseñado originalmente para el Mazda B-Series (pick-up) y el Mazda Familia / 323.\n\nCompáralo con motores de la misma época: el R2 diésel tiene 2.184 cc, el RF sobrealimentado tiene 2.184 cc con turbo, y el Mitsubishi 4D56 (competidor) tiene 2.477 cc.",
                  en: "The Mazda F8 has an exact displacement of 1,789 cc, with a bore of 86 mm and stroke of 77 mm.\n\nIt's a 4-cylinder inline engine with longitudinal layout, originally designed for the Mazda B-Series (pick-up) and the Mazda Familia / 323.\n\nCompare to engines of the same era: the R2 diesel has 2,184 cc, the RF turbo has 2,184 cc with turbo, and the Mitsubishi 4D56 (competitor) has 2,477 cc.",
                },
              },
            },
          },
          {
            label: { es: "Bore × carrera", en: "Bore × stroke" },
            value: { es: "86 × 77 mm", en: "86 × 77 mm" },
            info: {
              tooltip: {
                es: "Diámetro 86 mm · carrera 77 mm — motor cuadrado",
                en: "Bore 86 mm · stroke 77 mm — square engine",
              },
              dialog: {
                title: { es: "Bore × carrera", en: "Bore × stroke" },
                body: {
                  es: "El motor F8 es ligeramente «cuadrado» (diámetro mayor que carrera): 86 mm de diámetro por 77 mm de carrera. Esto favorece la potencia a altas revoluciones frente al par a bajas vueltas.\n\nRelación diámetro/carrera: 1,12 (sobrecuadrado).\n\nPara referencia:\n• Mazda R2: 86 × 94 mm (subcuadrado, más par)\n• RF turbodiésel: 86 × 94 mm (subcuadrado)\n\nUn motor sobrecuadrado como el F8 puede revolucionar más libremente pero genera menos par a bajo régimen, lo que no es ideal para off-road puro pero sí para conducción mixta.",
                  en: "The F8 engine is slightly 'oversquare' (bore larger than stroke): 86 mm bore by 77 mm stroke. This favors high-RPM power over low-end torque.\n\nBore/stroke ratio: 1.12 (oversquare).\n\nFor reference:\n• Mazda R2: 86 × 94 mm (undersquare, more torque)\n• RF turbodiesel: 86 × 94 mm (undersquare)\n\nAn oversquare engine like the F8 can rev more freely but generates less low-end torque, which is not ideal for pure off-road but works well for mixed driving.",
                },
              },
            },
          },
          {
            label: { es: "Distribución", en: "Valvetrain" },
            value: { es: "SOHC 8v (árbol de levas en cabeza)", en: "SOHC 8v (overhead camshaft)" },
            info: {
              tooltip: {
                es: "SOHC 8 válvulas · correa dentada",
                en: "SOHC 8 valves · timing belt",
              },
              dialog: {
                title: { es: "Distribución", en: "Valvetrain" },
                body: {
                  es: "El F8 usa un sistema SOHC (Single Overhead Camshaft) con 8 válvulas (2 por cilindro). Un solo árbol de levas en la culata acciona tanto válvulas de admisión como de escape.\n\nLa transmisión de la distribución es por correa dentada (no cadena).\n\nIntervalo de cambio recomendado: cada 60.000-80.000 km o 4-5 años.\n\n⚠️ Una rotura de la correa de distribución causa daños graves en el motor (válvulas dobladas, pistones dañados). Es el mantenimiento preventivo más crítico del motor F8.",
                  en: "The F8 uses a SOHC (Single Overhead Camshaft) system with 8 valves (2 per cylinder). A single camshaft in the head actuates both intake and exhaust valves.\n\nThe timing drive uses a toothed belt (not a chain).\n\nRecommended replacement interval: every 60,000-80,000 km or 4-5 years.\n\n⚠️ Timing belt failure causes severe engine damage (bent valves, damaged pistons). This is the single most critical maintenance item on the F8 engine.",
                },
              },
            },
          },
          {
            label: { es: "Alimentación", en: "Fueling" },
            value: { es: "Carburador / inyección posterior", en: "Carburetor / later EFI" },
            info: {
              tooltip: {
                es: "Los primeros usaban carburador; los últimos, inyección electrónica",
                en: "Early units used carburetor; later ones had electronic fuel injection",
              },
              dialog: {
                title: { es: "Alimentación del F8", en: "F8 fueling system" },
                body: {
                  es: "Los primeros Rocsta con motor F8 montaban un carburador convencional. Esto es más sencillo de reparar pero menos eficiente y más sensible a cambios de altitud y temperatura.\n\nLas versiones posteriores (aprox. desde 1993) equiparon inyección electrónica multipunto (EFI), que ofrece mejor consumo, arranque en frío y fiabilidad. Para distinguirlo: si tiene cuerpo de carburador con mariposa visible es carburado; si tiene riel de inyectores y centralita, es EFI.",
                  en: "Early Rocstas with the F8 engine used a conventional carburetor. This is simpler to repair but less efficient and more sensitive to altitude and temperature changes.\n\nLater versions (approx. from 1993) fitted multipoint electronic fuel injection (EFI), offering better fuel consumption, cold-start and reliability. To tell them apart: if it has a carburettor body with visible butterfly valve, it is carbureted; if it has an injector rail and ECU, it is EFI.",
                },
              },
            },
          },
          {
            label: { es: "Compresión", en: "Compression ratio" },
            value: { es: "8,6 : 1", en: "8.6 : 1" },
            info: {
              tooltip: {
                es: "Relación baja para un motor gasolina — usa gasolina de octanaje medio",
                en: "Low ratio for a petrol engine — use mid-octane fuel",
              },
              dialog: {
                title: { es: "Relación de compresión del F8", en: "F8 compression ratio" },
                body: {
                  es: "Una relación de compresión de 8,6:1 es baja para un motor gasolina de época (los contemporáneos rondaban los 9,0–9,5:1). Esto permite usar gasolina de octanaje medio sin problemas de detonación, pero limita la eficiencia térmica y la potencia específica.\n\nEn la práctica, puedes usar gasolina 95 sin problema. No tiene sentido usar 98 ya que el motor no aprovecha la mayor resistencia a la detonación.",
                  en: "A compression ratio of 8.6:1 is low for a petrol engine of the era (contemporaries ranged 9.0–9.5:1). This allows using mid-octane fuel without detonation issues, but limits thermal efficiency and specific power.\n\nIn practice, you can use RON 95 fuel without problems. There is no point using RON 98 as the engine does not benefit from the higher detonation resistance.",
                },
              },
            },
          },
          {
            label: { es: "Potencia", en: "Power" },
            value: { es: "≈ 60 kW (81 CV) a 5.500 rpm", en: "≈ 60 kW (81 hp) @ 5,500 rpm" },
            info: {
              tooltip: {
                es: "81 CV — suficiente para off-road, justo en carretera",
                en: "81 hp — adequate for off-road, tight on road",
              },
              dialog: {
                title: { es: "Potencia del F8", en: "F8 power output" },
                body: {
                  es: "Con 81 CV, el F8 no es un motor potente en términos modernos, pero su par a 2.500 rpm (133 Nm) lo hace apto para todoterreno. La potencia máxima se alcanza a 5.500 rpm, lo que da un margen de giro útil.\n\nEn carretera, mantener velocidades de crucero de 100-110 km/h es posible aunque forzando el motor. Adelantar requiere planificación. La relación de cambio del 5ª directa permite la velocidad de 120 km/h a ≈ 4.000 rpm, donde el motor está en su zona de consumo máximo.",
                  en: "With 81 hp, the F8 is not powerful by modern standards, but its torque at 2,500 rpm (133 Nm) makes it suitable for off-road. Peak power is reached at 5,500 rpm, giving a useful rev range.\n\nOn road, cruising at 100-110 km/h is possible although the engine is working. Overtaking requires planning. The 5th direct gear allows 120 km/h at ≈ 4,000 rpm, where the engine is at its peak fuel consumption.",
                },
              },
            },
          },
          {
            label: { es: "Par", en: "Torque" },
            value: { es: "133 Nm a 2.500 rpm", en: "133 Nm @ 2,500 rpm" },
            info: {
              tooltip: {
                es: "Par modesto a bajas rpm — respuesta off-road progresiva",
                en: "Modest low-rpm torque — progressive off-road response",
              },
              dialog: {
                title: { es: "Par motor del F8", en: "F8 torque" },
                body: {
                  es: "El par de 133 Nm a 2.500 rpm es un valor contenido pero entregado muy pronto. Esto permite al Rocsta moverse con fluidez en marchas cortas sin necesidad de revolucionar el motor.\n\nEn off-road práctico:\n• 4L (reducción 2,05:1) permite circular a paso de peatón con el motor a ralentí, sin tocar el acelerador.\n• La progresividad del par es buena, sin picos ni caídas bruscas.\n• En arena o barro no hay suficiente par para levantar la rueda, lo que paradójicamente mejora la tracción.",
                  en: "The 133 Nm at 2,500 rpm is a modest value but delivered very early. This allows the Rocsta to move smoothly in low gears without needing to rev the engine.\n\nIn practical off-road:\n• 4L (2.05:1 reduction) allows walking-speed travel at idle without touching the accelerator.\n• Torque progression is smooth, without peaks or sudden drops.\n• In sand or mud there is not enough torque to lift a wheel, paradoxically improving traction.",
                },
              },
            },
          },
          {
            label: { es: "Relación pot./peso", en: "Power/weight" },
            value: { es: "≈ 48–50 kW/t", en: "≈ 48–50 kW/t" },
            info: {
              tooltip: {
                es: "Similar a un Suzuki Samurai (~48 kW/t)",
                en: "Similar to a Suzuki Samurai (~48 kW/t)",
              },
              dialog: {
                title: { es: "Relación potencia/peso del F8", en: "F8 power-to-weight ratio" },
                body: {
                  es: "La relación potencia/peso del F8 es de 48–50 kW/t, determinada por el peso del Rocsta LWB (≈ 1.200-1.250 kg). Para comparación:\n• Suzuki Samurai (1.3L): ≈ 48 kW/t (similar).\n• Suzuki Jimny actual: ≈ 65 kW/t (más).\n• Jeep Wrangler YJ (2.5L): ≈ 60 kW/t (más).\n\nNo es un ratio deportivo, pero es suficiente para las capacidades del vehículo: subir montañas, cargar materiales o cruzar vadeos no suponen un problema.",
                  en: "The F8 power-to-weight ratio is 48–50 kW/t, determined by the Rocsta LWB weight (≈ 1,200-1,250 kg). For comparison:\n• Suzuki Samurai (1.3L): ≈ 48 kW/t (similar).\n• Current Suzuki Jimny: ≈ 65 kW/t (more).\n• Jeep Wrangler YJ (2.5L): ≈ 60 kW/t (more).\n\nIt is not a sporty ratio, but sufficient for the vehicle's capabilities: climbing mountains, carrying materials or crossing fords are not an issue.",
                },
              },
            },
          },
          {
            label: { es: "Bloque / culata", en: "Block / head" },
            value: {
              es: "Bloque hierro fundido · culata aleación",
              en: "Cast-iron block · alloy head",
            },
            info: {
              tooltip: {
                es: "Bloque de hierro muy duradero, culata ligera de aleación",
                en: "Very durable cast-iron block, lightweight alloy head",
              },
              dialog: {
                title: { es: "Bloque y culata del F8", en: "F8 block and head" },
                body: {
                  es: "El F8 usa un bloque de hierro fundido y culata de aleación de aluminio — la combinación clásica de motores de los 80-90. Esto ofrece:\n• Bloque de hierro: muy resistente al desgaste y capaz de reparaciones por sobremedida (rectificado).\n• Culata de aleación: más ligera, con mejor disipación térmica.\n• Coste de reparación moderado: un rectificado y junta de culata es asequible.\n\nLa junta de culata es un punto conocido de fallo en unidades sobrecalentadas. Si el motor ha hervido (temperatura alta), verificar la planitud de la culata.",
                  en: "The F8 uses a cast-iron block and aluminium alloy head — the classic 80s-90s engine combination. This offers:\n• Iron block: very wear-resistant and capable of overbore repairs.\n• Alloy head: lighter, with better heat dissipation.\n• Moderate repair cost: a head gasket replacement is affordable.\n\nThe head gasket is a known failure point on overheated units. If the engine has boiled, check head flatness.",
                },
              },
            },
          },
          {
            label: { es: "Transmisión de distribución", en: "Timing drive" },
            value: { es: "Correa dentada", en: "Toothed belt" },
            info: {
              tooltip: {
                es: "Correa de distribución — cambiar cada 80.000 km",
                en: "Timing belt — replace every 80,000 km",
              },
              dialog: {
                title: { es: "Correa de distribución del F8", en: "F8 timing belt" },
                body: {
                  es: "El F8 usa una correa dentada para la distribución. Es un motor interferencia: si la correa se rompe, las válvulas pueden golpear los pistones (menos crítico que en el RF diésel, pero también grave).\n\nIntervalo recomendado de cambio: 80.000 km o 5 años. Al cambiar, se recomienda sustituir también:\n• Bomba de agua (si es accionada por la misma correa).\n• Tensor de correa.\n• Polea loca (si existe).\n\nLa correa es accesible y el cambio puede hacerlo un aficionado con herramientas básicas.",
                  en: "The F8 uses a toothed timing belt. It is an interference engine: if the belt breaks, valves may hit the pistons (less critical than the RF diesel, but still serious).\n\nRecommended replacement interval: 80,000 km or 5 years. When replacing, also change:\n• Water pump (if belt-driven).\n• Tensioner.\n• Idler pulley (if fitted).\n\nThe belt is accessible and can be replaced by a hobbyist with basic tools.",
                },
              },
            },
          },
          {
            label: { es: "Capacidad aceite", en: "Oil capacity" },
            value: { es: "3,9 L (con filtro)", en: "3.9 L (with filter)" },
            info: {
              tooltip: {
                es: "Capacidad pequeña — más cambios frecuentes necesarios",
                en: "Small capacity — more frequent changes needed",
              },
              dialog: {
                title: { es: "Capacidad de aceite del F8", en: "F8 oil capacity" },
                body: {
                  es: "Con solo 3,9 L (incluyendo filtro), la capacidad de aceite del F8 es pequeña comparada con motores japoneses similares (4,5-5,5 L). Esto significa que:\n• El aceite se degrada más rápido (menos volumen para diluir contaminantes).\n• Intervalo de cambio recomendado: cada 5.000-7.500 km.\n• Usar aceite de calidad: 5W-30 sintético es lo ideal.\n• En motores muy usados o con fugas, verificar nivel semanalmente.\n\nEl mínimo en la varilla es ≈ 1 L por debajo del máximo. No circular con nivel bajo.",
                  en: "At only 3.9 L (including filter), the F8's oil capacity is small compared to similar Japanese engines (4.5-5.5 L). This means:\n• Oil degrades faster (less volume to dilute contaminants).\n• Recommended change interval: every 5,000-7,500 km.\n• Use quality oil: synthetic 5W-30 is ideal.\n• On high-mileage or leaky engines, check level weekly.\n\nThe minimum on the dipstick is ≈ 1 L below maximum. Do not run with low oil level.",
                },
              },
            },
          },
          {
            label: { es: "Aceite recomendado", en: "Recommended oil" },
            value: { es: "5W-30", en: "5W-30" },
            info: {
              tooltip: {
                es: "5W-30 sintético — también 10W-40 en climas cálidos",
                en: "5W-30 synthetic — also 10W-40 in hot climates",
              },
              dialog: {
                title: { es: "Aceite recomendado para F8", en: "Recommended oil for F8" },
                body: {
                  es: "El aceite recomendado para el F8 es 5W-30 sintético (API SG/SH o superior). Alternativas según clima:\n• Clima templado/frío: 5W-30 (mejor arranque en frío).\n• Clima cálido (> 30°C): 10W-40 (más protección a alta temperatura).\n• Motores con mucho desgaste ( > 200.000 km): 15W-40 mineral para reducir fugas.\n\nEvitar aceites de baja calidad. El F8 no tiene turbos ni sistemas hidráulicos complejos, pero un aceite de calidad prolonga la vida del motor.",
                  en: "Recommended oil for the F8 is 5W-30 synthetic (API SG/SH or higher). Alternatives by climate:\n• Temperate/cold climate: 5W-30 (better cold start).\n• Hot climate (> 30°C): 10W-40 (more protection at high temperature).\n• Worn engines (> 200,000 km): 15W-40 mineral to reduce leaks.\n\nAvoid low-quality oils. The F8 has no turbos or complex hydraulic systems, but quality oil extends engine life.",
                },
              },
            },
          },
          {
            label: { es: "Peso del motor", en: "Engine weight" },
            value: { es: "≈ 155 kg", en: "≈ 155 kg" },
            info: {
              tooltip: {
                es: "155 kg — ligero para un 4 cilindros de fundición",
                en: "155 kg — light for a cast-iron 4-cylinder",
              },
              dialog: {
                title: { es: "Peso del motor F8", en: "F8 engine weight" },
                body: {
                  es: "Con ≈ 155 kg (incluyendo accesorios), el F8 es un motor relativamente ligero para ser de hierro fundido. Competidores de la época:\n• Mitsubishi 4G63 2.0L: ≈ 150 kg.\n• Toyota 22R 2.4L: ≈ 160 kg.\n• Peugeot XU9 1.9L: ≈ 140 kg.\n\nEl peso ligero contribuye a la buena relación potencia/peso del Rocsta y facilita las tareas de extracción y montaje del motor.",
                  en: "At ≈ 155 kg (including accessories), the F8 is a relatively light engine for cast-iron construction. Contemporaries:\n• Mitsubishi 4G63 2.0L: ≈ 150 kg.\n• Toyota 22R 2.4L: ≈ 160 kg.\n• Peugeot XU9 1.9L: ≈ 140 kg.\n\nThe light weight contributes to the Rocsta's good power-to-weight ratio and facilitates engine removal and installation.",
                },
              },
            },
          },
          {
            label: { es: "Refrigeración", en: "Cooling" },
            value: { es: "Líquida (agua/anticongelante)", en: "Liquid (water/coolant)" },
            info: {
              tooltip: {
                es: "Refrigeración por agua con ventilador mecánico",
                en: "Water cooling with mechanical fan",
              },
              dialog: {
                title: { es: "Sistema de refrigeración del F8", en: "F8 cooling system" },
                body: {
                  es: "El F8 emplea refrigeración líquida por agua con una bomba centrífuga accionada por la correa de distribución y un ventilador mecánico acoplado al eje de la bomba. El termostato regula la temperatura.\n\nRecomendaciones:\n• Usar anticongelante de calidad (etilenglicol) al 50% con agua destilada.\n• Cambiar el refrigerante cada 2 años o 40.000 km.\n• El radiador original es de latón/cobre y suele durar décadas.\n• En climas muy fríos (< -15°C), aumentar proporción de anticongelante al 60%.",
                  en: "The F8 uses liquid water cooling with a centrifugal pump driven by the timing belt and a mechanical fan coupled to the pump shaft. The thermostat regulates temperature.\n\nRecommendations:\n• Use quality antifreeze (ethylene glycol) at 50% with distilled water.\n• Replace coolant every 2 years or 40,000 km.\n• The original radiator is brass/copper and usually lasts decades.\n• In very cold climates (< -15°C), increase antifreeze ratio to 60%.",
                },
              },
            },
          },
          {
            label: { es: "Depósito", en: "Fuel tank" },
            value: { es: "62 L", en: "62 L" },
            info: {
              tooltip: {
                es: "62 L — autonomía ≈ 400-500 km",
                en: "62 L — range ≈ 400-500 km",
              },
              dialog: {
                title: { es: "Depósito de combustible", en: "Fuel tank" },
                body: {
                  es: "El depósito de 62 litros es común a todas las variantes y motores. Ofrece una autonomía estimada de:\n• F8 gasolina: ≈ 400-500 km (consumo 11-15 L/100 km).\n• R2 diésel: ≈ 700-850 km (consumo 7-9 L/100 km).\n• RF diésel: ≈ 650-800 km (consumo 7,5-9,5 L/100 km).\n\nEl depósito está situado en la parte trasera inferior, protegido por un soporte de chapa. Es propenso a la corrosión interna si el vehículo ha estado parado mucho tiempo. Se recomienda usar estabilizador de combustible si se almacena.",
                  en: "The 62-litre tank is common to all variants and engines. It offers an estimated range of:\n• F8 petrol: ≈ 400-500 km (consumption 11-15 L/100 km).\n• R2 diesel: ≈ 700-850 km (consumption 7-9 L/100 km).\n• RF diesel: ≈ 650-800 km (consumption 7.5-9.5 L/100 km).\n\nThe tank is located at the rear underside, protected by a sheet-metal bracket. It is prone to internal corrosion if the vehicle has been parked for a long time. Use fuel stabiliser if storing.",
                },
              },
            },
          },
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
        code: {
          es: "Mazda R2 — 2.2 Diésel (primera generación)",
          en: "Mazda R2 — 2.2 Diesel (first generation)",
        },
        fuel: { es: "Diésel", en: "Diesel" },
        specs: [
          {
            label: { es: "Cilindrada", en: "Displacement" },
            value: { es: "2.184 cc · 4 cil. en línea", en: "2,184 cc · 4-cyl inline" },
            info: {
              tooltip: {
                es: "2,2 litros — cubicaje típico de diésel de los 80",
                en: "2.2 litres — typical 80s diesel displacement",
              },
              dialog: {
                title: { es: "Cilindrada del R2", en: "R2 displacement" },
                body: {
                  es: "El R2 comparte la misma cilindrada que el RF (2.184 cc), pero es un motor más grande físicamente porque usa empujadores OHV en lugar de árbol de levas en cabeza. La cilindrada de 2,2 L es típica de motores diésel japoneses de los 80-90.\n\nComparativa:\n• Mitsubishi 4D56 2.5L: 2.477 cc (más grande).\n• Toyota 2L 2.4L: 2.446 cc (más grande).\n• Nissan TD23 2.3L: 2.289 cc (similar).",
                  en: "The R2 shares the same displacement as the RF (2,184 cc), but is a physically larger engine due to using OHV pushrods instead of an overhead camshaft. The 2.2 L displacement is typical of 80s-90s Japanese diesel engines.\n\nComparison:\n• Mitsubishi 4D56 2.5L: 2,477 cc (larger).\n• Toyota 2L 2.4L: 2,446 cc (larger).\n• Nissan TD23 2.3L: 2,289 cc (similar).",
                },
              },
            },
          },
          {
            label: { es: "Bore × carrera", en: "Bore × stroke" },
            value: { es: "86 × 94 mm", en: "86 × 94 mm" },
            info: {
              tooltip: {
                es: "Carrera larga (undersquare) — diseñado para par",
                en: "Long stroke (undersquare) — designed for torque",
              },
              dialog: {
                title: { es: "Bore × carrera del R2", en: "R2 bore × stroke" },
                body: {
                  es: "El R2 tiene la misma relación bore×carrera que el RF (86×94 mm). Esta configuración de 'carrera larga' (undersquare) es típica de motores diésel que priorizan el par a bajas revoluciones sobre la potencia máxima.\n\nLa carrera de 94 mm genera una velocidad de pistón mayor que en el F8 (77 mm), lo que junto a la alta compresión (22,7:1) es lo que produce el característico ruido diésel del R2 — el llamado 'golpeteo de émbolo'.",
                  en: "The R2 has the same bore×stroke as the RF (86×94 mm). This 'long stroke' (undersquare) configuration is typical of diesel engines that prioritise low-end torque over peak power.\n\nThe 94 mm stroke generates higher piston speed than the F8 (77 mm), which together with the high compression ratio (22.7:1) produces the characteristic diesel knock of the R2 — the so-called 'piston slap'.",
                },
              },
            },
          },
          {
            label: { es: "Distribución", en: "Valvetrain" },
            value: { es: "OHV 8v (árbol de levas en bloque)", en: "OHV 8v (pushrod)" },
            info: {
              tooltip: {
                es: "Motor de empujadores — tecnología de los 50 perdurable",
                en: "Pushrod engine — 1950s technology, durable",
              },
              dialog: {
                title: { es: "Distribución OHV del R2", en: "R2 OHV valvetrain" },
                body: {
                  es: "El sistema OHV (OverHead Valve) con árbol de levas en el bloque es la tecnología de distribución más antigua y simple que existe. En el R2:\n• El árbol de levas está dentro del bloque y acciona las válvulas mediante varillas (pushrods) y balancines.\n• Es fiable, fácil de ajustar y no requiere cadena compleja.\n• La regulación de válvulas (cada 100.000 km) se ajusta manualmente con galgas — no tiene taqués hidráulicos.\n• Las válvulas están en la culata pero el árbol de levas está abajo, lo que limita la velocidad máxima del motor (~4.500 rpm).",
                  en: "The OHV (OverHead Valve) system with block-mounted camshaft is the oldest and simplest valvetrain technology. In the R2:\n• The camshaft is inside the block and actuates the valves via pushrods and rockers.\n• It is reliable, easy to adjust and does not require a complex chain.\n• Valve adjustment (every 100,000 km) is done manually with feeler gauges — no hydraulic lifters.\n• Valves are in the head but camshaft is down below, limiting maximum engine speed (~4,500 rpm).",
                },
              },
            },
          },
          {
            label: { es: "Alimentación", en: "Fueling" },
            value: {
              es: "Inyección indirecta mecánica (precámara)",
              en: "Mechanical indirect injection (pre-chamber)",
            },
            info: {
              tooltip: {
                es: "Inyección mecánica con precámara — arranque fácil sin glow plugs",
                en: "Mechanical injection with pre-chamber — easy start without glow plugs",
              },
              dialog: {
                title: { es: "Alimentación del R2", en: "R2 fueling system" },
                body: {
                  es: "El R2 usa inyección indirecta mecánica con precámara. Funciona así:\n• La bomba de inyección mecánica (tipo Bosch VE) envía el combustible a una pequeña precámara en la culata.\n• En la precámara el combustible se mezcla con aire y se enciende parcialmente, creando una llama que se expande al cilindro principal.\n• Esto permite inyectar a menor presión y usar toberas más sencillas que en inyección directa.\n\nVentajas: arranque fácil incluso sin calentadores (glow plugs).\nDesventajas: menor eficiencia que inyección directa, más ruidoso.",
                  en: "The R2 uses mechanical indirect injection with a pre-chamber. How it works:\n• The mechanical injection pump (Bosch VE type) delivers fuel to a small pre-chamber in the cylinder head.\n• In the pre-chamber the fuel mixes with air and partially ignites, creating a flame that expands into the main cylinder.\n• This allows lower injection pressure and simpler nozzles than direct injection.\n\nAdvantages: easy starting even without glow plugs.\nDisadvantages: lower efficiency than direct injection, noisier.",
                },
              },
            },
          },
          {
            label: { es: "Compresión", en: "Compression ratio" },
            value: { es: "22,9 : 1", en: "22.9 : 1" },
            info: {
              tooltip: {
                es: "Compresión muy alta — típica de diésel atmosférico",
                en: "Very high compression — typical of naturally aspirated diesel",
              },
              dialog: {
                title: { es: "Compresión del R2", en: "R2 compression ratio" },
                body: {
                  es: "Con 22,9:1, el R2 tiene una de las relaciones de compresión más altas de cualquier motor diésel atmosférico. Esto es necesario porque:\n• La inyección indirecta en precámara tiene pérdidas térmicas.\n• La compresión alta genera suficiente calor para la autoignición del gasoil.\n• Garantiza arranque en frío sin calentadores.\n\nUna compresión baja ( < 18:1 ) en un cilindro indica desgaste: segmentos gastados, válvulas quemadas o junta de culata dañada. La diferencia máxima entre cilindros no debe superar 3:1.",
                  en: "At 22.9:1, the R2 has one of the highest compression ratios of any naturally aspirated diesel engine. This is necessary because:\n• Indirect injection in a pre-chamber has thermal losses.\n• The high compression generates enough heat for diesel autoignition.\n• Guarantees cold starting without glow plugs.\n\nLow compression ( < 18:1 ) in a cylinder indicates wear: worn rings, burnt valves or damaged head gasket. Maximum difference between cylinders must not exceed 3:1.",
                },
              },
            },
          },
          {
            label: { es: "Potencia", en: "Power" },
            value: { es: "≈ 51,5 kW (70 CV) a 4.050 rpm", en: "≈ 51.5 kW (70 hp) @ 4,050 rpm" },
            info: {
              tooltip: {
                es: "70 CV — muy justo, ideal para off-road lento",
                en: "70 hp — very modest, ideal for slow off-road",
              },
              dialog: {
                title: { es: "Potencia del R2", en: "R2 power output" },
                body: {
                  es: "Con solo 70 CV, el R2 es el menos potente de los tres motores. Sin embargo, el par a bajas rpm lo compensa en off-road. La potencia máxima se alcanza a solo 4.050 rpm (contra las 5.500 del F8).\n\nEn carretera, el R2 acelera lentamente: ≈ 0-100 km/h en unos 20 segundos. La velocidad máxima es de ≈ 110-115 km/h, y mantener 100 km/h en autovía supone tener el motor a ≈ 3.500 rpm, con el ruido y consumo resultantes.\n\nPara mejorar la potencia, se pueden instalar turbos de la serie B2200/Bongo después de 1993, con una presión de 0,5 bar.",
                  en: "At only 70 hp, the R2 is the least powerful of the three engines. However, low-rpm torque compensates off-road. Peak power is reached at only 4,050 rpm (vs 5,500 rpm of the F8).\n\nOn road, the R2 accelerates slowly: ≈ 0-100 km/h in about 20 seconds. Top speed is ≈ 110-115 km/h, and maintaining 100 km/h on the motorway means running at ≈ 3,500 rpm, with resulting noise and consumption.\n\nTo improve power, turbos from post-1993 B2200/Bongo can be fitted, at 0.5 bar boost.",
                },
              },
            },
          },
          {
            label: { es: "Par", en: "Torque" },
            value: { es: "142 Nm a 2.500 rpm", en: "142 Nm @ 2,500 rpm" },
            info: {
              tooltip: {
                es: "142 Nm a bajas rpm — par adecuado para tracción",
                en: "142 Nm at low rpm — adequate pulling power",
              },
              dialog: {
                title: { es: "Par motor del R2", en: "R2 torque" },
                body: {
                  es: "Con 142 Nm a 2.500 rpm, el R2 tiene el par más bajo de los tres motores (F8: 133 Nm, RF: 121 Nm). Su ventaja es cómo entrega el par: comienza a los 1.200 rpm y se mantiene plano hasta las 2.500 rpm.\n\nEn off-road práctico:\n• 4L permite subir pendientes del 60% sin acelerar.\n• La respuesta a bajas rpm es ideal para trial de precisión.\n• Al no tener turbo, la entrega de potencia es predecible y sin sobresaltos.\n• No hay 'lag' de turbo que pueda sorprender en terrenos técnicos.",
                  en: "At 142 Nm at 2,500 rpm, the R2 has the lowest torque of the three engines (F8: 133 Nm, RF: 121 Nm). Its advantage is how torque is delivered: it starts at 1,200 rpm and stays flat until 2,500 rpm.\n\nIn practical off-road:\n• 4L allows climbing 60% gradients without accelerating.\n• Low-rpm response is ideal for precision trial.\n• Without a turbo, power delivery is predictable and smooth.\n• No turbo lag to surprise you on technical terrain.",
                },
              },
            },
          },
          {
            label: { es: "Relación pot./peso", en: "Power/weight" },
            value: { es: "≈ 40–42 kW/t", en: "≈ 40–42 kW/t" },
            info: {
              tooltip: {
                es: "Baja relación — el motor menos potente de los tres",
                en: "Low ratio — the least powerful of the three",
              },
              dialog: {
                title: { es: "Relación potencia/peso del R2", en: "R2 power-to-weight ratio" },
                body: {
                  es: "Con 40-42 kW/t, el R2 es el más lento de los tres motores. Para referencia:\n• F8: 48-50 kW/t (más potencia específica).\n• RF: ≈ 36 kW/t (similar).\n• Un Rocsta R2 pesa ≈ 1.270 kg con el motor diésel más pesado (190 kg vs 155 kg del F8).\n\nEn la práctica: el R2 acelera lo justo para incorporarse al tráfico. Las cuestas largas requieren reducir marcha. El consumo en autovía a 100 km/h es alto (≈ 8-9 L/100 km) porque el motor va muy revolucionado.",
                  en: "At 40-42 kW/t, the R2 is the slowest of the three engines. For reference:\n• F8: 48-50 kW/t (more specific power).\n• RF: ≈ 36 kW/t (similar).\n• A Rocsta R2 weighs ≈ 1,270 kg with the heavier diesel engine (190 kg vs 155 kg of the F8).\n\nIn practice: the R2 accelerates barely enough to merge into traffic. Long hills require downshifting. Motorway consumption at 100 km/h is high (≈ 8-9 L/100 km) because the engine runs at high rpm.",
                },
              },
            },
          },
          {
            label: { es: "Bloque / culata", en: "Block / head" },
            value: {
              es: "Bloque hierro fundido · culata aluminio",
              en: "Cast-iron block · aluminium head",
            },
            info: {
              tooltip: {
                es: "Bloque robusto — culata de aluminio punto débil (grietas)",
                en: "Robust block — aluminium head weak point (cracking)",
              },
              dialog: {
                title: { es: "Bloque y culata del R2", en: "R2 block and head" },
                body: {
                  es: "El R2 comparte bloque y culata con el RF. El bloque de hierro fundido es virtualmente indestructible. La culata de aluminio, sin embargo, es un punto crítico:\n• Las precámaras en la culata son una zona de alta temperatura y presión.\n• Con el tiempo (> 200.000 km), aparecen microfisuras alrededor de las precámaras.\n• Estas fisuras causan pérdida de compresión y consumo de aceite.\n• La sustitución de la culata por una de segunda mano es posible, pero verificar que no tenga grietas.\n\nEl bloque admite rectificados de hasta 0,5 mm. Se recomienda verificar la planitud de la culata al menor síntoma de sobrecalentamiento.",
                  en: "The R2 shares the block and head with the RF. The cast-iron block is virtually indestructible. The aluminium head, however, is a critical point:\n• The pre-chambers in the head are a high-temperature, high-pressure zone.\n• Over time (> 200,000 km), microcracks appear around the pre-chambers.\n• These cracks cause compression loss and oil consumption.\n• Replacing the head with a second-hand unit is possible, but check for cracks.\n\nThe block can be overbored up to 0.5 mm. Check head flatness at the slightest sign of overheating.",
                },
              },
            },
          },
          {
            label: { es: "Transmisión de distribución", en: "Timing drive" },
            value: { es: "Correa dentada", en: "Toothed belt" },
            info: {
              tooltip: {
                es: "Correa de distribución — cambiar cada 60.000 km",
                en: "Timing belt — replace every 60,000 km",
              },
              dialog: {
                title: { es: "Correa de distribución del R2", en: "R2 timing belt" },
                body: {
                  es: "El R2 también usa correa dentada (no cadena). El intervalo de cambio recomendado es 60.000 km o 4 años, más frecuente que el RF.\n\nAunque el R2 es OHV y menos crítico que el RF (las válvulas están más lejos de los pistones), la rotura de correa sigue siendo un problema costoso: válvulas dobladas y posible rotura de balancines.\n\nAl cambiar la correa, revisar la bomba de inyección (puede tener una polea auxiliar) y la bomba de agua si es correa-compartida.",
                  en: "The R2 also uses a toothed belt (not a chain). Recommended replacement interval is 60,000 km or 4 years, more frequent than the RF.\n\nAlthough the R2 is OHV and less critical than the RF (valves are farther from pistons), belt breakage is still an expensive problem: bent valves and possible rocker breakage.\n\nWhen replacing the belt, check the injection pump (may have an auxiliary pulley) and the water pump if belt-driven.",
                },
              },
            },
          },
          {
            label: { es: "Capacidad aceite", en: "Oil capacity" },
            value: { es: "6,5 L (con filtro)", en: "6.5 L (with filter)" },
            info: {
              tooltip: {
                es: "Capacidad grande — buena refrigeración del aceite",
                en: "Large capacity — good oil cooling",
              },
              dialog: {
                title: { es: "Capacidad de aceite del R2", en: "R2 oil capacity" },
                body: {
                  es: "Con 6,5 L (con filtro), el R2 tiene una capacidad de aceite notablemente mayor que el F8 (3,9 L) y el RF (4,7 L). Esto se debe al cárter más grande necesario para alojar el árbol de levas en bloque y los empujadores.\n\nBeneficios:\n• Mejor refrigeración del aceite (más volumen para disipar calor).\n• Intervalos de cambio más largos (hasta 10.000 km con aceite sintético).\n• Mayor capacidad para diluir contaminantes.\n\nContras: más aceite significa más coste por cambio y más peso total.",
                  en: "At 6.5 L (with filter), the R2 has a notably larger oil capacity than the F8 (3.9 L) and the RF (4.7 L). This is due to the larger sump needed to house the block-mounted camshaft and pushrods.\n\nBenefits:\n• Better oil cooling (more volume to dissipate heat).\n• Longer change intervals (up to 10,000 km with synthetic oil).\n• Greater capacity to dilute contaminants.\n\nCons: more oil means higher cost per change and more total weight.",
                },
              },
            },
          },
          {
            label: { es: "Aceite recomendado", en: "Recommended oil" },
            value: { es: "5W-30", en: "5W-30" },
            info: {
              tooltip: {
                es: "5W-30 diésel — también 10W-40 en climas cálidos",
                en: "5W-30 diesel — also 10W-40 in hot climates",
              },
              dialog: {
                title: { es: "Aceite recomendado para R2", en: "Recommended oil for R2" },
                body: {
                  es: "El aceite recomendado para el R2 es 5W-30 con especificación API CF/CI-4 para motores diésel. Alternativas:\n• Clima templado/frío: 5W-30 sintético (mejor arranque en frío).\n• Clima cálido (> 30°C): 10W-40 semisintético.\n• Motores con desgaste: 15W-40 mineral ayuda a reducir fugas.\n\nNo usar aceites para gasolina API SJ+ en el R2: no tienen los aditivos antidesgaste necesarios para los empujadores y el árbol de levas en bloque.\n\nCambio cada 7.500-10.000 km con filtro.",
                  en: "Recommended oil for the R2 is 5W-30 with API CF/CI-4 diesel specification. Alternatives:\n• Temperate/cold climate: 5W-30 synthetic (better cold start).\n• Hot climate (> 30°C): 10W-40 semi-synthetic.\n• Worn engines: 15W-40 mineral helps reduce leaks.\n\nDo not use petrol engine oils API SJ+ in the R2: they lack the anti-wear additives needed for pushrods and block-mounted camshaft.\n\nChange every 7,500-10,000 km with filter.",
                },
              },
            },
          },
          {
            label: { es: "Peso del motor", en: "Engine weight" },
            value: { es: "≈ 190 kg", en: "≈ 190 kg" },
            info: {
              tooltip: {
                es: "190 kg — el motor más pesado de los tres",
                en: "190 kg — the heaviest of the three engines",
              },
              dialog: {
                title: { es: "Peso del motor R2", en: "R2 engine weight" },
                body: {
                  es: "Con 190 kg, el R2 es 35 kg más pesado que el F8 y 7 kg más ligero que el RF. Su mayor peso se debe al bloque más grande y al sistema OHV con empujadores.\n\nEsto afecta:\n• Al reparto de pesos delantero (el Rocsta R2 es más cabezudo).\n• Al desgaste de la suspensión delantera (ballestas y amortiguadores).\n• A la capacidad de remolque (el peso extra cuenta como tara).\n\nEn off-road, el peso extra delante puede mejorar la tracción en pendientes, pero empeora la flotación en barro y arena.",
                  en: "At 190 kg, the R2 is 35 kg heavier than the F8 and 7 kg lighter than the RF. Its greater weight is due to the larger block and OHV pushrod system.\n\nThis affects:\n• Front weight distribution (the R2 Rocsta is more nose-heavy).\n• Front suspension wear (leaf springs and dampers).\n• Towing capacity (the extra weight counts as tare).\n\nOff-road, the extra front weight can improve traction on slopes, but worsens flotation in mud and sand.",
                },
              },
            },
          },
          {
            label: { es: "Refrigeración", en: "Cooling" },
            value: { es: "Líquida (agua/anticongelante)", en: "Liquid (water/coolant)" },
            info: {
              tooltip: {
                es: "Refrigeración líquida — vital para motor diésel",
                en: "Liquid cooling — vital for diesel engine",
              },
              dialog: {
                title: { es: "Sistema de refrigeración del R2", en: "R2 cooling system" },
                body: {
                  es: "El sistema de refrigeración del R2 es similar al del F8: bomba centrífuga, termostato y radiador de latón/cobre. Es crítico mantenerlo en buen estado porque:\n• Un diésel sobrecalentado puede agrietar la culata de aluminio (especialmente alrededor de las precámaras).\n• La culata del R2 no es 'sellar' como las modernas — requiere revisión periódica.\n\nRecomendaciones:\n• Refrigerante 50/50 anticongelante/agua destilada.\n• Cambio cada 2 años.\n• En climas muy fríos, anticongelante al 60%.\n• Revisar nivel semanalmente (el R2 puede perder refrigerante por la junta de culata si está deteriorada).",
                  en: "The R2 cooling system is similar to the F8: centrifugal pump, thermostat and brass/copper radiator. Keeping it in good condition is critical because:\n• An overheated diesel can crack the aluminium head (especially around the pre-chambers).\n• The R2 head is not 'sealable' like modern ones — it requires periodic inspection.\n\nRecommendations:\n• Coolant 50/50 antifreeze/distilled water.\n• Change every 2 years.\n• In very cold climates, 60% antifreeze.\n• Check level weekly (the R2 can lose coolant through a deteriorated head gasket).",
                },
              },
            },
          },
          {
            label: { es: "Depósito", en: "Fuel tank" },
            value: { es: "62 L", en: "62 L" },
            info: {
              tooltip: {
                es: "62 L — autonomía ≈ 700-850 km en R2 diésel",
                en: "62 L — range ≈ 700-850 km in R2 diesel",
              },
              dialog: {
                title: { es: "Depósito de combustible", en: "Fuel tank" },
                body: {
                  es: "El depósito de 62 L es el mismo para todos los motores. La autonomía del R2 varía según conducción:\n• Carretera: ≈ 700-850 km (consumo 7-9 L/100 km).\n• Off-road/ciudad: ≈ 500-600 km (consumo 10-12 L/100 km).\n\nEl R2 es el más eficiente de los tres motores en consumo de combustible, pero su menor velocidad máxima hace que la autonomía real en autovía sea similar a la del F8.\n\nSe recomienda no llevar el depósito por debajo de 1/4 para evitar que la bomba de inyección coja aire.",
                  en: "The 62 L tank is the same for all engines. Range in the R2 varies by driving:\n• Road: ≈ 700-850 km (consumption 7-9 L/100 km).\n• Off-road/city: ≈ 500-600 km (consumption 10-12 L/100 km).\n\nThe R2 is the most fuel-efficient of the three engines, but its lower top speed means real motorway range is similar to the F8.\n\nIt is recommended not to run the tank below 1/4 to prevent the injection pump from drawing air.",
                },
              },
            },
          },
        ],
        notes: {
          es:
            "Versión más antigua, presente en los primeros Rocsta (1990–1993 aprox.). Motor de empuje " +
            "con árbol de levas en bloque; robusto y de fácil reparación, aunque con más vibración que " +
            "el RF. Derivado de la pickup Mazda B2200 / Bongo. Comparte muchas piezas con el RF.",
          en:
            "Older version, found in early Rocsta units (approx. 1990–1993). Pushrod engine with " +
            "block-mounted camshaft; robust and easy to repair, though noisier than the RF. Derived from " +
            "the Mazda B2200 / Bongo pickup. Shares many parts with the RF.",
        },
      },
      {
        code: {
          es: "Mazda RF — 2.0 Diésel (segunda generación)",
          en: "Mazda RF — 2.0 Diesel (second generation)",
        },
        fuel: { es: "Diésel", en: "Diesel" },
        specs: [
          {
            label: { es: "Cilindrada", en: "Displacement" },
            value: { es: "1.998 cc · 4 cil. en línea", en: "1,998 cc · 4-cyl inline" },
            info: {
              tooltip: {
                es: "2,0 litros — basado en el bloque FE de Mazda",
                en: "2.0 litres — based on the Mazda FE block",
              },
              dialog: {
                title: { es: "Cilindrada del RF", en: "RF displacement" },
                body: {
                  es: "El RF es una variante diésel del motor Mazda FE, con sus mismas dimensiones cúbicas: 1.998 cm³ y configuración cuadrada de 86 mm de diámetro por 86 mm de carrera. No comparte cilindrada con el R2 (2.184 cc), aunque ambos se usaron en el Rocsta.\n\nComparativa:\n• R2 (OHV): 2.184 cc — 86×94 mm.\n• RF (SOHC): 1.998 cc — 86×86 mm.\n• Ambos comparten el bloque de hierro fundido, pero la culata y la distribución son distintas.",
                  en: "The RF is a diesel variant of the Mazda FE engine, sharing its same cubic dimensions: 1,998 cm³ and a square configuration of 86 mm bore by 86 mm stroke. It does not share displacement with the R2 (2,184 cc), although both were used in the Rocsta.\n\nComparison:\n• R2 (OHV): 2,184 cc — 86×94 mm.\n• RF (SOHC): 1,998 cc — 86×86 mm.\n• Both share the cast-iron block, but the head and valvetrain differ.",
                },
              },
            },
          },
          {
            label: { es: "Bore × carrera", en: "Bore × stroke" },
            value: { es: "86 × 86 mm", en: "86 × 86 mm" },
            info: {
              tooltip: {
                es: "Configuración cuadrada — misma relación que el FE gasolina",
                en: "Square configuration — same as the FE petrol",
              },
              dialog: {
                title: { es: "Bore × carrera del RF", en: "RF bore × stroke" },
                body: {
                  es: "El RF hereda la configuración cuadrada del FE (86×86 mm), con diámetro y carrera idénticos. Esto lo diferencia del R2, que tiene carrera más larga (94 mm).\n\n• La velocidad media del pistón a 4.000 rpm es de ≈ 11,5 m/s, inferior a la del R2.\n• La relación biela/carrera es más favorable que en el R2, reduciendo el desgaste lateral.\n• Al ser cuadrado (bore = stroke), ofrece un equilibrio entre par a bajas rpm y capacidad de giro.",
                  en: "The RF inherits the square configuration from the FE (86×86 mm), with identical bore and stroke. This differentiates it from the R2, which has a longer stroke (94 mm).\n\n• Mean piston speed at 4,000 rpm is ≈ 11.5 m/s, lower than the R2.\n• The conrod/stroke ratio is more favourable than the R2, reducing side wear.\n• Being square (bore = stroke), it offers a balance between low-end torque and revving ability.",
                },
              },
            },
          },
          {
            label: { es: "Distribución", en: "Valvetrain" },
            value: { es: "SOHC 8v (árbol de levas en cabeza)", en: "SOHC 8v (overhead camshaft)" },
            info: {
              tooltip: {
                es: "SOHC — más refinado que el OHV del R2",
                en: "SOHC — more refined than the R2's OHV",
              },
              dialog: {
                title: { es: "Distribución del RF", en: "RF valvetrain" },
                body: {
                  es: "El RF usa un árbol de levas en cabeza (SOHC) con 8 válvulas, accionado por correa dentada. Esta es su mejora principal sobre el R2:\n\nVentajas:\n• Más silencioso (sin empujadores).\n• Mayor velocidad máxima del motor (hasta 4.500-4.800 rpm).\n• Válvulas accionadas directamente por balancines sobre el árbol de levas: desgaste más uniforme.\n• Mejor comportamiento térmico de la culata.\n\nDesventajas:\n• Correa de distribución más crítica (interferencia).\n• Ajuste válvulas cada 100.000 km, manual con galgas.",
                  en: "The RF uses an overhead camshaft (SOHC) with 8 valves, driven by a toothed belt. This is its main improvement over the R2:\n\nAdvantages:\n• Quieter (no pushrods).\n• Higher engine speed (up to 4,500-4,800 rpm).\n• Valves actuated directly by rockers on the camshaft: more uniform wear.\n• Better thermal behaviour of the cylinder head.\n\nDisadvantages:\n• Timing belt more critical (interference).\n• Valve adjustment every 100,000 km, manual with feeler gauges.",
                },
              },
            },
          },
          {
            label: { es: "Alimentación", en: "Fueling" },
            value: {
              es: "Inyección indirecta mecánica (cámara de torbellino)",
              en: "Mechanical indirect injection (swirl chamber)",
            },
            info: {
              tooltip: {
                es: "Inyección indirecta con precámara de torbellino",
                en: "Indirect injection with swirl pre-chamber",
              },
              dialog: {
                title: { es: "Alimentación del RF", en: "RF fueling system" },
                body: {
                  es: "El RF usa inyección indirecta mecánica con cámara de torbellino (swirl chamber), una evolución de la precámara del R2:\n• La cámara de torbellino genera un flujo de aire rotacional que mezcla mejor el combustible con el aire.\n• Mejor eficiencia que la precámara simple del R2.\n• Arranque en frío más fácil y humo blanco reducido.\n\nLa bomba de inyección es una Bosch VE mecánica (sin electrónica). Su ventaja: si la batería está muerta, se puede arrancar a empujón. Su desventaja: no hay control electrónico de la inyección, por lo que el consumo es fijo y la respuesta a la altitud no se compensa.",
                  en: "The RF uses mechanical indirect injection with a swirl chamber, an evolution of the R2 pre-chamber:\n• The swirl chamber creates a rotational airflow that mixes fuel and air better.\n• Better efficiency than the simple pre-chamber of the R2.\n• Easier cold starting and reduced white smoke.\n\nThe injection pump is a mechanical Bosch VE (no electronics). Its advantage: if the battery is dead, the engine can be push-started. Its disadvantage: no electronic injection control, so consumption is fixed and altitude response is not compensated.",
                },
              },
            },
          },
          {
            label: { es: "Compresión", en: "Compression ratio" },
            value: { es: "22,9 : 1", en: "22.9 : 1" },
            info: {
              tooltip: {
                es: "22,9:1 — muy alta, típica de diésel atmosférico",
                en: "22.9:1 — very high, typical of NA diesel",
              },
              dialog: {
                title: { es: "Compresión del RF", en: "RF compression ratio" },
                body: {
                  es: "Con 22,9:1, el RF tiene una relación de compresión ligeramente superior a la del R2 (22,7:1). Esta alta compresión es necesaria para la autoignición del gasoil en motores atmosféricos.\n\nLa compresión del RF se mide en bares (normalmente 28-32 bar en frío). Valores por debajo de 22 bar indican desgaste severo.\n\nAl igual que en el R2, una diferencia entre cilindros > 3 bar indica problemas localizados (anillos pegados, válvula quemada).",
                  en: "At 22.9:1, the RF has a slightly higher compression ratio than the R2 (22.7:1). This high compression is necessary for diesel autoignition in naturally aspirated engines.\n\nRF compression is measured in bar (normally 28-32 bar cold). Values below 22 bar indicate severe wear.\n\nAs with the R2, a difference between cylinders > 3 bar indicates localised problems (stuck rings, burnt valve).",
                },
              },
            },
          },
          {
            label: { es: "Potencia", en: "Power" },
            value: { es: "≈ 45 kW (61 CV) a 4.000 rpm", en: "≈ 45 kW (61 hp) @ 4,000 rpm" },
            info: {
              tooltip: {
                es: "61 CV — potencia modesta, típica de diésel atmosférico",
                en: "61 hp — modest power, typical of NA diesel",
              },
              dialog: {
                title: { es: "Potencia del RF", en: "RF power output" },
                body: {
                  es: "Con 61 CV, el RF ofrece 9 CV menos que el R2. La potencia máxima se alcanza a 4.000 rpm. La ventaja del RF sobre el R2 no es la potencia, sino el refinamiento: el SOHC es más silencioso y suave que el OHV de empujadores.\n\nEn carretera:\n• 0-100 km/h: ≈ 20-22 segundos.\n• Velocidad máxima: ≈ 110-115 km/h.\n• Consumo: 7,5-9,5 L/100 km en carretera.\n\nEl RF atmosférico es el más lento de los tres motores, pero en off-road su par a bajas rpm (121 Nm a 2.750 rpm) lo hace perfectamente funcional.",
                  en: "At 61 hp, the RF offers 9 hp less than the R2. Peak power is reached at 4,000 rpm. The RF's advantage over the R2 is not power, but refinement: the SOHC is quieter and smoother than the OHV pushrod design.\n\nOn road:\n• 0-100 km/h: ≈ 20-22 seconds.\n• Top speed: ≈ 110-115 km/h.\n• Consumption: 7.5-9.5 L/100 km on road.\n\nThe naturally aspirated RF is the slowest of the three engines, but off-road its low-end torque (121 Nm at 2,750 rpm) makes it perfectly functional.",
                },
              },
            },
          },
          {
            label: { es: "Par", en: "Torque" },
            value: { es: "121 Nm a 2.750 rpm", en: "121 Nm @ 2,750 rpm" },
            info: {
              tooltip: {
                es: "121 Nm — menos que el R2, pero entrega más progresiva",
                en: "121 Nm — less than the R2, but smoother delivery",
              },
              dialog: {
                title: { es: "Par motor del RF", en: "RF torque" },
                body: {
                  es: "Con 121 Nm a 2.750 rpm, el RF tiene el par más bajo de los tres motores (F8: 133 Nm, R2: 142 Nm). Sin embargo, su curva de par es más lineal y progresiva.\n\nEn off-road:\n• Ideal para escalada técnica donde se necesita precisión.\n• La progresividad evita pérdidas de tracción por exceso de par.\n• Baja reducción (4L) permite circular a ritmo de senderismo.\n• Al no tener turbo, la entrega de potencia es predecible y sin sobresaltos.",
                  en: "At 121 Nm @ 2,750 rpm, the RF has the lowest torque of the three engines (F8: 133 Nm, R2: 142 Nm). However, its torque curve is more linear and progressive.\n\nOff-road:\n• Ideal for technical climbing where precision is needed.\n• Progressiveness avoids traction loss from excess torque.\n• Low reduction (4L) allows hiking-pace travel.\n• Without a turbo, power delivery is predictable and smooth.",
                },
              },
            },
          },
          {
            label: { es: "Relación pot./peso", en: "Power/weight" },
            value: { es: "≈ 36 kW/t", en: "≈ 36 kW/t" },
            info: {
              tooltip: {
                es: "36 kW/t — la más baja de los tres motores",
                en: "36 kW/t — the lowest of the three engines",
              },
              dialog: {
                title: { es: "Relación potencia/peso del RF", en: "RF power-to-weight ratio" },
                body: {
                  es: "Con 36 kW/t, el RF es el que peor relación potencia/peso ofrece de los tres.\n\nComparativa RF vs. competidores de época:\n• Land Rover 200Tdi: ≈ 50 kW/t (mejor, turbo).\n• Mitsubishi 4D56 T: ≈ 54 kW/t (mejor, turbo).\n• Mercedes-Benz OM616 (G-Wagen 240D): ≈ 35 kW/t (similar).\n\nEl RF no es rápido, pero en todoterreno es suficiente con la reductora.",
                  en: "At 36 kW/t, the RF has the worst power-to-weight ratio of the three.\n\nRF vs. contemporaries:\n• Land Rover 200Tdi: ≈ 50 kW/t (better, turbo).\n• Mitsubishi 4D56 T: ≈ 54 kW/t (better, turbo).\n• Mercedes-Benz OM616 (G-Wagen 240D): ≈ 35 kW/t (similar).\n\nThe RF is not fast, but with low-range gearing it is adequate off-road.",
                },
              },
            },
          },
          {
            label: { es: "Bloque / culata", en: "Block / head" },
            value: {
              es: "Bloque hierro fundido · culata aluminio",
              en: "Cast-iron block · aluminium head",
            },
            info: {
              tooltip: {
                es: "Mismo bloque R2, diferente culata SOHC",
                en: "Same R2 block, different SOHC head",
              },
              dialog: {
                title: { es: "Bloque y culata del RF", en: "RF block and head" },
                body: {
                  es: "El RF comparte el bloque de hierro fundido con el R2 (mismos cilindros, mismas cotas). La culata de aluminio es diferente: aloja el árbol de levas en cabeza en lugar de tener alojamiento para empujadores.\n\nEsto significa que:\n• El bloque es el mismo y muchas piezas internas son intercambiables.\n• La culata NO es intercambiable con la del R2 (diferente diseño de la precámara y distribución).\n• La culata del RF es menos propensa a grietas que la del R2.\n• Un sobrecalentamiento también puede dañarla.",
                  en: "The RF shares the cast-iron block with the R2 (same cylinders, same dimensions). The aluminium head is different: it houses the overhead camshaft instead of pushrod accommodation.\n\nThis means:\n• The block is the same and many internal parts are interchangeable.\n• The head is NOT interchangeable with the R2 (different pre-chamber and valvetrain design).\n• The RF head is less prone to cracking than the R2.\n• Overheating can still damage it.",
                },
              },
            },
          },
          {
            label: { es: "Capacidad aceite", en: "Oil capacity" },
            value: { es: "4,7 L (con filtro)", en: "4.7 L (with filter)" },
            info: {
              tooltip: {
                es: "4,7 L — más que el F8 (3,9), menos que el R2 (6,5)",
                en: "4.7 L — more than F8 (3.9), less than R2 (6.5)",
              },
              dialog: {
                title: { es: "Capacidad de aceite del RF", en: "RF oil capacity" },
                body: {
                  es: "La capacidad de aceite del RF es de 4,7 L (con filtro), intermedia entre el F8 (3,9 L) y el R2 (6,5 L).\n\nIntervalos de cambio:\n• Aceite mineral: cada 5.000 km.\n• Aceite semisintético: cada 7.500 km.\n• Aceite sintético: cada 10.000 km.\n\nSe recomienda cambiar el filtro de aceite en cada cambio. El RF tiene un cárter de chapa de acero que puede dañarse en impactos. Los protectores de cárter son recomendables.",
                  en: "The RF oil capacity is 4.7 L (with filter), between the F8 (3.9 L) and the R2 (6.5 L).\n\nChange intervals:\n• Mineral oil: every 5,000 km.\n• Semi-synthetic: every 7,500 km.\n• Fully synthetic: every 10,000 km.\n\nChange the oil filter at every service. The RF has a sheet-steel sump that can be damaged by impacts. Sump guards are recommended.",
                },
              },
            },
          },
          {
            label: { es: "Aceite recomendado", en: "Recommended oil" },
            value: { es: "5W-30", en: "5W-30" },
            info: {
              tooltip: {
                es: "5W-30 diésel sintético — especificación API CF",
                en: "5W-30 diesel synthetic — API CF spec",
              },
              dialog: {
                title: { es: "Aceite recomendado para RF", en: "Recommended oil for RF" },
                body: {
                  es: "El aceite recomendado para el RF es 5W-30 sintético con especificación API CF/CI-4 para motores diésel.\n\nAlternativas:\n• 10W-40 semisintético: recomendado en climas cálidos (> 30°C).\n• 15W-40 mineral: para motores con desgaste avanzado (> 250.000 km).\n\nIMPORTANTE: No usar aceites para gasolina API SJ+. El RF necesita aditivos antidesgaste específicos para el SOHC y el tren de válvulas. Los aceites para gasolina no tienen los aditivos AW (anti-wear) en cantidad suficiente.",
                  en: "Recommended oil for the RF is 5W-30 synthetic with API CF/CI-4 diesel specification.\n\nAlternatives:\n• 10W-40 semi-synthetic: recommended in hot climates (> 30°C).\n• 15W-40 mineral: for high-mileage engines (> 250,000 km).\n\nIMPORTANT: Do not use petrol engine oils API SJ+. The RF needs specific anti-wear additives for the SOHC and valve train. Petrol oils do not have sufficient AW additives.",
                },
              },
            },
          },
          {
            label: { es: "Peso del motor", en: "Engine weight" },
            value: { es: "≈ 197 kg", en: "≈ 197 kg" },
            info: {
              tooltip: {
                es: "197 kg — el más pesado por la culata SOHC",
                en: "197 kg — heaviest due to SOHC head",
              },
              dialog: {
                title: { es: "Peso del motor RF", en: "RF engine weight" },
                body: {
                  es: "Con ≈ 197 kg (incluyendo accesorios), el RF es el más pesado de los tres motores. Es 7 kg más pesado que el R2 (190 kg) y 42 kg más que el F8 (155 kg).\n\nEl peso extra respecto al R2 se debe a:\n• Culata SOHC más grande y pesada (con árbol de levas y balancines).\n• Bomba de inyección y toberas.\n• Sistema de admisión con cámara de torbellino.\n\nEl mayor peso delante empeora ligeramente la maniobrabilidad off-road respecto al F8, pero el par adicional lo compensa.",
                  en: "At ≈ 197 kg (including accessories), the RF is the heaviest of the three engines. It is 7 kg heavier than the R2 (190 kg) and 42 kg heavier than the F8 (155 kg).\n\nThe extra weight vs the R2 is due to:\n• Larger, heavier SOHC head (with camshaft and rockers).\n• Injection pump and nozzles.\n• Intake system with swirl chamber.\n\nThe extra front weight slightly worsens off-road manoeuvrability compared to the F8, but the additional torque compensates.",
                },
              },
            },
          },
          {
            label: { es: "Refrigeración", en: "Cooling" },
            value: { es: "Líquida (agua/anticongelante)", en: "Liquid (water/coolant)" },
            info: {
              tooltip: {
                es: "Refrigeración líquida vital para motor diésel SOHC",
                en: "Liquid cooling vital for SOHC diesel",
              },
              dialog: {
                title: { es: "Sistema de refrigeración del RF", en: "RF cooling system" },
                body: {
                  es: "El sistema de refrigeración del RF comparte el radiador con el R2 (latón/cobre) pero usa una bomba de agua diferente, adaptada al bloque SOHC.\n\nEl RF tiene mejor refrigeración que el R2 porque la culata SOHC tiene canales de agua más eficientes. Sin embargo:\n• Un sobrecalentamiento puede agrietar la culata, aunque es menos común que en el R2.\n• La correa de distribución acciona la bomba de agua — cuidar ambas.\n• El termostato original (82°C) puede sustituirse por uno de 74°C en climas muy cálidos para evitar sobrecalentamiento en ralentí prolongado.",
                  en: "The RF cooling system shares the radiator with the R2 (brass/copper) but uses a different water pump, adapted to the SOHC block.\n\nThe RF has better cooling than the R2 because the SOHC head has more efficient water channels. However:\n• Overheating can crack the head, although it is less common than in the R2.\n• The timing belt drives the water pump — care for both.\n• The original thermostat (82°C) can be replaced with a 74°C unit in very hot climates to avoid overheating at prolonged idle.",
                },
              },
            },
          },
          {
            label: { es: "Depósito", en: "Fuel tank" },
            value: { es: "62 L", en: "62 L" },
            info: {
              tooltip: {
                es: "62 L — autonomía RF ≈ 650-800 km",
                en: "62 L — RF range ≈ 650-800 km",
              },
              dialog: {
                title: { es: "Depósito de combustible", en: "Fuel tank" },
                body: {
                  es: "El depósito de 62 L ofrece al RF una autonomía de:\n• Carretera: ≈ 650-800 km (consumo 7,5-9,5 L/100 km).\n• Off-road/ciudad: ≈ 500-600 km (consumo 10-12 L/100 km).\n\nComparado con el R2, el RF consume ligeramente más en carretera (8,5 vs 8 L/100 km medio) pero ofrece mejor comportamiento en autovía.\n\nRecomendación: añadir aditivo antigel al diésel en inviernos severos. El gasoil puede formar parafinas que tapan los filtros a temperaturas < -10°C.",
                  en: "The 62 L tank gives the RF a range of:\n• Road: ≈ 650-800 km (consumption 7.5-9.5 L/100 km).\n• Off-road/city: ≈ 500-600 km (consumption 10-12 L/100 km).\n\nCompared to the R2, the RF consumes slightly more on road (8.5 vs 8 L/100 km average) but offers better motorway behaviour.\n\nRecommendation: add anti-gel additive to diesel in severe winters. Diesel fuel can form paraffin that clogs filters at temperatures < -10°C.",
                },
              },
            },
          },
        ],
        notes: {
          es:
            "La elección lógica para off-road puro: par a bajas revoluciones ideal para escalar rocas o " +
            "salir del barro. Más refinado y silencioso que el R2 gracias al SOHC. Consumo notablemente " +
            "más bajo que el gasolina. Correa de distribución crítica: cambio obligatorio cada 80.000 km " +
            "o 5 años. Derivado del motor Mazda FE de la serie 626 / Capella.",
          en:
            "The logical choice for pure off-road: low-rpm torque ideal for crawling rocks or escaping " +
            "mud. More refined and quieter than the R2 thanks to the SOHC head. Significantly lower fuel " +
            "consumption than the petrol. Critical timing belt: must be replaced every 80,000 km or " +
            "5 years. Derived from the Mazda FE engine of the 626 / Capella series.",
        },
      },
    ],
  },

  // 5 — Suspensión, frenos y ruedas
  {
    kind: "facts",
    id: "chassis-spec",
    title: { es: "Suspensión, frenos y dirección", en: "Suspension, brakes & steering" },
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
          es: "Eje rígido con ballestas longitudinales y amortiguadores hidráulicos",
          en: "Live axle with longitudinal leaf springs and hydraulic dampers",
        },
        info: {
          tooltip: {
            es: "Eje rígido Dana 35 — robusto pero incómodo",
            en: "Dana 35 live axle — robust but uncomfortable",
          },
          dialog: {
            title: { es: "Suspensión delantera", en: "Front suspension" },
            body: {
              es: "El Rocsta usa un eje rígido Dana 35 delantero con ballestas longitudinales (leaf springs) y amortiguadores hidráulicos telescópicos. Este diseño es heredado del KM410 militar.\n\nVentajas:\n• Extremadamente robusto y sencillo.\n• Gran capacidad de carga.\n• Fácil de reparar con herramientas básicas.\n• Mucho recorrido de suspensión.\n\nDesventajas:\n• Confort de marcha pobre (el eje rígido transmite todas las irregularidades).\n• Estabilidad en curva limitada.\n• Las ballestas pierden arco con el tiempo (cada 100.000-150.000 km).\n\nLos casquillos de las ballestas se desgastan y producen holgura. Cambiar a poliuretano mejora la durabilidad.",
              en: "The Rocsta uses a Dana 35 front live axle with longitudinal leaf springs and telescopic hydraulic dampers. This design is inherited from the KM410 military vehicle.\n\nAdvantages:\n• Extremely robust and simple.\n• High load capacity.\n• Easy to repair with basic tools.\n• Lots of suspension travel.\n\nDisadvantages:\n• Poor ride comfort (the live axle transmits all road irregularities).\n• Limited cornering stability.\n• Leaf springs lose arch over time (every 100,000-150,000 km).\n\nLeaf spring bushings wear out and cause play. Switching to polyurethane improves durability.",
            },
          },
        },
      },
      {
        label: { es: "Suspensión trasera", en: "Rear suspension" },
        value: {
          es: "Eje rígido con ballestas longitudinales y amortiguadores hidráulicos",
          en: "Live axle with longitudinal leaf springs and hydraulic dampers",
        },
        info: {
          tooltip: {
            es: "Misma configuración que el delantero",
            en: "Same configuration as front",
          },
          dialog: {
            title: { es: "Suspensión trasera", en: "Rear suspension" },
            body: {
              es: "La suspensión trasera es idéntica a la delantera: eje rígido Dana 35 con ballestas longitudinales y amortiguadores.\n\nA menudo, las ballestas traseras se hunden con el tiempo debido al peso del depósito de combustible, rueda de repuesto y equipamiento opcional. Signos de ballestas cansadas:\n• El vehículo se inclina hacia atrás.\n• Los topes de goma tocan en baches.\n• Dirección más ligera (menos carga en el eje delantero).\n\nSolución: ballestas de refuerzo (add-a-leaf) o recambios originales. No es caro ni complejo.",
              en: "The rear suspension is identical to the front: Dana 35 live axle with longitudinal leaf springs and dampers.\n\nOften, rear leaf springs sag over time due to fuel tank, spare wheel and optional equipment weight. Signs of tired springs:\n• Vehicle sags backwards.\n• Rubber bump stops hit on bumps.\n• Lighter steering (less load on front axle).\n\nSolution: add-a-leaf reinforcements or original replacements. Not expensive or complex.",
            },
          },
        },
      },
      {
        label: { es: "Frenos delanteros", en: "Front brakes" },
        value: { es: "Discos ventilados", en: "Ventilated discs" },
        info: {
          tooltip: {
            es: "Discos ventilados — frenada potente pero sin ABS",
            en: "Ventilated discs — powerful braking but no ABS",
          },
          dialog: {
            title: { es: "Frenos delanteros", en: "Front brakes" },
            body: {
              es: "Los frenos delanteros son de disco ventilado, lo que proporciona buena disipación térmica en uso off-road intensivo. Las pinzas son de simple pistón.\n\nDatos prácticos:\n• Diámetro del disco: ≈ 258 mm.\n• Pinzas: NIssin o similar.\n• Recomendado: cambiar pastillas de freno cada 30.000-40.000 km.\n• El desgaste de discos suele ser lento (≈ 100.000 km).\n\nLos discos ventilados son una ventaja: en barro o arena, los discos se limpian mejor que los sólidos. Si tienes vibración al frenar, probablemente los discos estén alabeados (sobrecalentamiento en vadeo con discos calientes).",
              en: "Front brakes are ventilated discs, providing good heat dissipation in intensive off-road use. Calipers are single-piston.\n\nPractical data:\n• Disc diameter: ≈ 258 mm.\n• Calipers: NIssin or similar.\n• Recommended: change brake pads every 30,000-40,000 km.\n• Disc wear is usually slow (≈ 100,000 km).\n\nVentilated discs are an advantage: in mud or sand, discs clean better than solid ones. If you have vibration when braking, discs are probably warped (overheating when wading with hot discs).",
            },
          },
        },
      },
      {
        label: { es: "Frenos traseros", en: "Rear brakes" },
        value: { es: "Tambores", en: "Drums" },
        info: {
          tooltip: {
            es: "Tambores — menor potencia que discos, pero duraderos",
            en: "Drums — less powerful than discs, but durable",
          },
          dialog: {
            title: { es: "Frenos traseros", en: "Rear brakes" },
            body: {
              es: "Los frenos traseros son de tambor (drum brakes). Es una configuración antigua pero fiable y económica de mantener.\n\nDatos prácticos:\n• Diámetro del tambor: ≈ 254 mm.\n• Zapatas: se cambian cuando el forro llega a 1,5 mm de espesor.\n• Los cilindros de rueda se agarrotan con el tiempo — revisar cada 2 años.\n\nProblema común: los cilindros de rueda traseros se agarrotan por falta de uso o corrosión interna. Síntoma: frenada irregular, arrastre en una rueda.\n\nSi conduces principalmente en carretera, los tambores traseros duran décadas. En off-road con agua y barro, revisar anualmente.",
              en: "Rear brakes are drum brakes. An old but reliable and cheap-to-maintain configuration.\n\nPractical data:\n• Drum diameter: ≈ 254 mm.\n• Shoes: replace when lining reaches 1.5 mm thickness.\n• Wheel cylinders seize over time — inspect every 2 years.\n\nCommon problem: rear wheel cylinders seize due to lack of use or internal corrosion. Symptom: uneven braking, drag on one wheel.\n\nIf you drive mainly on road, rear drums last decades. In off-road with water and mud, check annually.",
            },
          },
        },
      },
      {
        label: { es: "Servofreno / ABS", en: "Brake servo / ABS" },
        value: {
          es: "Servofreno de vacío · Sin ABS",
          en: "Vacuum servo · No ABS",
        },
        info: {
          tooltip: {
            es: "Servofreno de vacío — sin ABS. Frenar con cabeza.",
            en: "Vacuum servo — no ABS. Brake with care.",
          },
          dialog: {
            title: { es: "Servofreno y ABS", en: "Brake servo and ABS" },
            body: {
              es: "El Rocsta tiene servofreno de vacío (asistencia a la frenada) pero NO tiene ABS. Esto significa:\n\nAVISO: Sin ABS, las ruedas pueden bloquearse en frenadas de emergencia, especialmente en asfalto mojado, grava o barro. Técnica de frenada correcta:\n• En superficie deslizante: bombear el pedal (pisa-suelta) para no bloquear las ruedas.\n• En off-road: frenar antes de las curvas, no dentro.\n• En asfalto mojado: aumentar distancia de seguridad.\n\nEl servofreno funciona con vacío del colector de admisión. Si el motor se para, se pierde la asistencia pero los frenos siguen funcionando (con más esfuerzo).",
              en: "The Rocsta has a vacuum brake servo (brake booster) but NO ABS. This means:\n\nWARNING: Without ABS, wheels can lock under emergency braking, especially on wet tarmac, gravel or mud. Correct braking technique:\n• On slippery surfaces: pump the pedal (apply-release) to avoid wheel lock.\n• Off-road: brake before corners, not in them.\n• On wet tarmac: increase safety distance.\n\nThe servo works with intake manifold vacuum. If the engine stalls, assistance is lost but brakes still work (with more effort).",
            },
          },
        },
      },
      {
        label: { es: "Neumáticos", en: "Tires" },
        value: {
          es: "215/75 R15 (versiones de trabajo) · 235/75 R15 (Deluxe)",
          en: "215/75 R15 (work versions) · 235/75 R15 (Deluxe)",
        },
        info: {
          tooltip: {
            es: "215/75 R15 de serie — 235/75 R15 en Deluxe",
            en: "215/75 R15 standard — 235/75 R15 on Deluxe",
          },
          dialog: {
            title: { es: "Neumáticos", en: "Tyres" },
            body: {
              es: 'El Rocsta se equipó de serie con dos medidas de neumáticos según versión:\n\n215/75 R15 (versiones de trabajo: Country, Pick-up):\n• Neumático más estrecho — mejor flotación en barro.\n• Mayor confort de marcha.\n• Menor consumo.\n\n235/75 R15 (Deluxe):\n• Neumático más ancho — mejor tracción en seco y roca.\n• Mejor estética.\n• Mayor consumo y ruido.\n\nAmbas medidas son 15". Se pueden montar neumáticos más grandes (31×10.5 R15 o 235/85 R15) con modificaciones mínimas (elevar suspensión o recortar guardabarros).',
              en: 'The Rocsta was fitted with two tyre sizes depending on version:\n\n215/75 R15 (work versions: Country, Pick-up):\n• Narrower tyre — better mud flotation.\n• Better ride comfort.\n• Lower consumption.\n\n235/75 R15 (Deluxe):\n• Wider tyre — better dry and rock traction.\n• Better looks.\n• Higher consumption and noise.\n\nBoth sizes are 15". Larger tyres (31×10.5 R15 or 235/85 R15) can be fitted with minor modifications (suspension lift or fender trimming).',
            },
          },
        },
      },
      {
        label: { es: "Llantas", en: "Wheels" },
        value: {
          es: '15" × 5,5J acero · 15" × 6J aleación (Deluxe)',
          en: '15" × 5.5J steel · 15" × 6J alloy (Deluxe)',
        },
        info: {
          tooltip: {
            es: "Llantas de acero (trabajo) o aleación (Deluxe)",
            en: "Steel (work) or alloy (Deluxe) wheels",
          },
          dialog: {
            title: { es: "Llantas", en: "Wheels" },
            body: {
              es: 'Las llantas de serie son de 15":\n• Versiones de trabajo: 5,5J de acero (pintadas en negro o gris).\n• Deluxe: 6J de aleación (color plata o gris claro).\n\nLas llantas de acero son más pesadas pero más resistentes a impactos off-road. Las de aleación son más ligeras y estéticas, pero pueden agrietarse con piedras grandes.\n\nCompatibilidad: las llantas del Rocsta tienen un PCD de 6×139,7 mm (6 tornillos), el mismo que Toyota Land Cruiser, Suzuki Vitara y muchos 4x4 japoneses. Hay multitud de opciones de segunda mano.\n\nET (offset): ≈ -6 a +10 mm según llanta.',
              en: 'Standard wheels are 15":\n• Work versions: 5.5J steel (painted black or grey).\n• Deluxe: 6J alloy (silver or light grey).\n\nSteel wheels are heavier but more resistant to off-road impacts. Alloy wheels are lighter and better looking, but can crack on large rocks.\n\nCompatibility: Rocsta wheels have a PCD of 6×139.7 mm (6 lugs), same as Toyota Land Cruiser, Suzuki Vitara and many Japanese 4x4s. Plenty of second-hand options available.\n\nET (offset): ≈ -6 to +10 mm depending on wheel.',
            },
          },
        },
      },
      {
        label: { es: "Suspensión trasera", en: "Rear suspension" },
        value: {
          es: "Eje rígido con ballestas longitudinales y amortiguadores hidráulicos",
          en: "Live axle with longitudinal leaf springs and hydraulic dampers",
        },
      },
      {
        label: { es: "Frenos delanteros", en: "Front brakes" },
        value: { es: "Discos ventilados", en: "Ventilated discs" },
      },
      {
        label: { es: "Frenos traseros", en: "Rear brakes" },
        value: { es: "Tambores", en: "Drums" },
      },
      {
        label: { es: "Servofreno / ABS", en: "Brake servo / ABS" },
        value: {
          es: "Servofreno de vacío · Sin ABS",
          en: "Vacuum servo · No ABS",
        },
      },
      {
        label: { es: "Dirección", en: "Steering" },
        value: {
          es: "Recirculación de bolas, sin asistencia (mecánica pura). Algunas unidades disponían de dirección asistida hidráulica con bomba.",
          en: "Recirculating ball, unassisted (purely mechanical). Some units were fitted with hydraulic power steering with a pump.",
        },
        info: {
          tooltip: {
            es: "La dirección asistida era opcional, no de serie",
            en: "Power steering was optional, not standard",
          },
          dialog: {
            title: { es: "Dirección: asistida vs. mecánica", en: "Steering: power vs. manual" },
            body: {
              es: "La mayoría de los Rocsta salieron de fábrica con dirección mecánica pura (sin asistencia). Esto requiere más fuerza al volante, especialmente a baja velocidad o en parking, pero ofrece una sensación directa y sin intermediarios.\n\nAlgunas unidades —principalmente las equipadas con aire acondicionado o destinadas a mercados que lo requerían— montaban dirección asistida hidráulica con bomba. Esta versión es mucho más cómoda en ciudad pero añade un punto de fallo (bomba, mangueras, líquido).\n\nPara identificar si tu unidad tiene dirección asistida: busca la bomba en la parte frontal del motor y un depósito de líquido de dirección junto al alternador.",
              en: "Most Rocstas left the factory with purely manual steering (unassisted). This requires more effort at the wheel, especially at low speeds or parking, but offers a direct, unfiltered feel.\n\nSome units —mainly those fitted with air conditioning or destined for markets requiring it— came with hydraulic power steering with a pump. This version is much more comfortable in town but adds a failure point (pump, hoses, fluid).\n\nTo identify if your unit has power steering: look for the pump at the front of the engine and a steering fluid reservoir near the alternator.",
            },
          },
        },
      },
      {
        label: { es: "Aire acondicionado", en: "Air conditioning" },
        value: {
          es: "Opcional en algunas unidades (componentes Behr/Hella). No de serie.",
          en: "Optional on some units (Behr/Hella components). Not standard.",
        },
        info: {
          tooltip: {
            es: "Componentes Behr/Hella, no de serie en todas las unidades",
            en: "Behr/Hella components, not standard on all units",
          },
          dialog: {
            title: { es: "Aire acondicionado", en: "Air conditioning" },
            body: {
              es: "El aire acondicionado no era de serie en el Rocsta. Se ofrecía como opcional o accesorio de fábrica en determinados mercados (especialmente el mediterráneo y Oriente Medio). Los componentes son de fabricación Behr/Hella.\n\nUnidades sin A/C podían llevar un hueco precortado en el salpicadero para su instalación posterior. Si tu unidad tiene A/C, verifica el estado del compresor y la cantidad de gas refrigerante, ya que los sistemas antiguos son propensos a fugas por envejecimiento de juntas y mangueras.",
              en: "Air conditioning was not standard on the Rocsta. It was offered as optional or factory-fitted in certain markets (especially Mediterranean and Middle East). Components are Behr/Hella manufactured.\n\nUnits without A/C may have a pre-cut slot in the dashboard for later installation. If your unit has A/C, check the compressor condition and refrigerant charge, as older systems are prone to leaks from aging seals and hoses.",
            },
          },
        },
      },
      {
        label: { es: "Neumáticos", en: "Tires" },
        value: {
          es: "215/75 R15 (versiones de trabajo) · 235/75 R15 (Deluxe)",
          en: "215/75 R15 (work versions) · 235/75 R15 (Deluxe)",
        },
      },
      {
        label: { es: "Llantas", en: "Wheels" },
        value: {
          es: '15" × 5,5J acero · 15" × 6J aleación (Deluxe)',
          en: '15" × 5.5J steel · 15" × 6J alloy (Deluxe)',
        },
      },
      {
        label: { es: "Altura libre al suelo", en: "Ground clearance" },
        value: { es: "205 – 230 mm", en: "205 – 230 mm" },
        info: {
          tooltip: {
            es: "Varía según variante y neumáticos montados",
            en: "Varies by variant and fitted tyres",
          },
          dialog: {
            title: { es: "Altura libre al suelo", en: "Ground clearance" },
            body: {
              es: "La altura libre al suelo depende de la variante, los neumáticos y el estado de las ballestas. La batalla corta (SWB) suele tener más altura (≈ 230 mm) que la larga (LWB, ≈ 205 mm) por su menor peso.\n\nCon neumáticos 235/75 R15 (Deluxe) se alcanza la máxima altura. Si se montan neumáticos más grandes (por ejemplo 31×10.5 R15), la altura puede superar los 250 mm, pero se verifica que no rocen los guardabarros ni se vea afectado el círculo de giro.",
              en: "Ground clearance depends on the variant, tyres and leaf spring condition. The short-wheelbase (SWB) usually has more clearance (≈ 230 mm) than the LWB (≈ 205 mm) due to lower weight.\n\nWith 235/75 R15 tyres (Deluxe) maximum clearance is achieved. Fitting larger tyres (e.g. 31×10.5 R15) can push clearance above 250 mm, but verify they do not rub the fenders or affect the turning circle.",
            },
          },
        },
      },
    ],
  },

  // 6 — Off-road & remolque
  {
    kind: "facts",
    id: "offroad",
    title: { es: "Capacidades off-road y remolque", en: "Off-road & towing capability" },
    intro: {
      es:
        "Los ángulos y datos de paso son aproximados y varían según variante, neumáticos y altura de " +
        "suspensión. Los valores indicados corresponden a la batalla corta con neumáticos de serie.",
      en:
        "Angles and departure figures are approximate and vary by variant, tyre and suspension height. " +
        "Values shown correspond to the short-wheelbase version with standard tyres.",
    },
    facts: [
      {
        label: { es: "Ángulo de ataque (SWB)", en: "Approach angle (SWB)" },
        value: { es: "≈ 44°", en: "≈ 44°" },
        info: {
          tooltip: {
            es: "Excelente — supera a la mayoría de 4x4 actuales",
            en: "Excellent — beats most current 4x4s",
          },
          dialog: {
            title: { es: "Ángulo de ataque SWB", en: "SWB approach angle" },
            body: {
              es: "El ángulo de ataque de ≈ 44° en el SWB es excelente. Esto se debe a:\n• El paragolpes delantero es corto y alto.\n• No hay spoiler ni carenados bajos.\n\nComparativa:\n• Suzuki Jimny: ≈ 41°.\n• Jeep Wrangler JL: ≈ 44°.\n• Land Rover Defender 90: ≈ 48°.\n• Toyota Land Cruiser 70: ≈ 35°.\n\nEn el LWB, el ángulo es menor (≈ 35°) por su mayor longitud. Si montas un paragolpes delantero de competición (sin los bajos de plástico), puedes alcanzar ≈ 50°.",
              en: "The ≈ 44° approach angle on the SWB is excellent. This is due to:\n• The front bumper is short and high.\n• No low spoiler or fairings.\n\nComparison:\n• Suzuki Jimny: ≈ 41°.\n• Jeep Wrangler JL: ≈ 44°.\n• Land Rover Defender 90: ≈ 48°.\n• Toyota Land Cruiser 70: ≈ 35°.\n\nOn the LWB, the angle is smaller (≈ 35°) due to greater length. If you fit a competition front bumper (without lower plastic), you can reach ≈ 50°.",
            },
          },
        },
      },
      {
        label: { es: "Ángulo de salida (SWB)", en: "Departure angle (SWB)" },
        value: { es: "≈ 35°", en: "≈ 35°" },
        info: {
          tooltip: {
            es: "Bueno — el paragolpes trasero no sobresale mucho",
            en: "Good — the rear bumper does not protrude much",
          },
          dialog: {
            title: { es: "Ángulo de salida SWB", en: "SWB departure angle" },
            body: {
              es: "El ángulo de salida de ≈ 35° en el SWB es bueno, aunque menor que el de ataque debido a la rueda de repuesto montada en la puerta trasera.\n\nComparativa:\n• Suzuki Jimny: ≈ 46° (rueda de repuesto dentro).\n• Jeep Wrangler JL: ≈ 37°.\n• Land Rover Defender 90: ≈ 53°.\n\nSi la rueda de repuesto se retira (uso trial), el ángulo de salida mejora a ≈ 40°. En el LWB, el ángulo de salida es peor (≈ 28°) por la mayor longitud trasera.\n\nAVISO: el enganche de remolque reduce el ángulo de salida efectivo. No circular por rampas pronunciadas con el enganche puesto.",
              en: "The ≈ 35° departure angle on the SWB is good, although less than the approach angle due to the spare wheel mounted on the rear door.\n\nComparison:\n• Suzuki Jimny: ≈ 46° (spare wheel inside).\n• Jeep Wrangler JL: ≈ 37°.\n• Land Rover Defender 90: ≈ 53°.\n\nIf the spare wheel is removed (trial use), the departure angle improves to ≈ 40°. On the LWB, the departure angle is worse (≈ 28°) due to greater rear length.\n\nWARNING: the tow hitch reduces effective departure angle. Do not drive on steep ramps with the hitch fitted.",
            },
          },
        },
      },
      {
        label: { es: "Ángulo de rampa (SWB)", en: "Ramp-over angle (SWB)" },
        value: { es: "≈ 25°", en: "≈ 25°" },
        info: {
          tooltip: {
            es: "Limitado por la batalla corta — pero mejor que el LWB",
            en: "Limited by short wheelbase — but better than LWB",
          },
          dialog: {
            title: { es: "Ángulo de rampa SWB", en: "SWB ramp-over angle" },
            body: {
              es: "El ángulo de rampa de ≈ 25° es uno de los puntos fuertes del SWB. Es el ángulo entre la rueda delantera y trasera que determina si el vehículo se 'empacha' en una cresta.\n\nComparativa:\n• Suzuki Jimny: ≈ 28° (batalla más corta).\n• Jeep Wrangler JL SWB: ≈ 23°.\n• LWB Country: ≈ 18° (significativamente peor).\n\nPara mejorar ángulo de rampa:\n• Levantar la suspensión (2-3 cm).\n• Montar neumáticos más grandes.\n• Retirar los bajos de protección si son metálicos.\n\nEl SWB es claramente superior al LWB para trial técnico y rocas.",
              en: "The ≈ 25° ramp-over angle is a strong point of the SWB. It is the angle between front and rear wheels that determines whether the vehicle 'bottom out' on a crest.\n\nComparison:\n• Suzuki Jimny: ≈ 28° (shorter wheelbase).\n• Jeep Wrangler JL SWB: ≈ 23°.\n• LWB Country: ≈ 18° (significantly worse).\n\nTo improve ramp-over angle:\n• Lift suspension (2-3 cm).\n• Fit larger tyres.\n• Remove metal underbody protection.\n\nThe SWB is clearly superior to LWB for technical trial and rock crawling.",
            },
          },
        },
      },
      {
        label: { es: "Vadeo", en: "Wading depth" },
        value: {
          es: "≈ 500 mm (limitado por la toma de aire del filtro)",
          en: "≈ 500 mm (limited by air filter intake)",
        },
        info: {
          tooltip: {
            es: "500 mm — limitado por la entrada de aire original",
            en: "500 mm — limited by original air intake",
          },
          dialog: {
            title: { es: "Vadeo", en: "Wading depth" },
            body: {
              es: "El Rocsta puede vadear hasta ≈ 500 mm de agua de serie. El límite es la toma de aire original, situada en el paso de rueda delantero derecho, a media altura.\n\nPara aumentar la capacidad de vadeo:\n• Instalar snorkel con toma de aire elevada al techo (permite vadear hasta ≈ 1.200 mm).\n• Elevar las respiraderos de los diferenciales (diferencial breathers) al vano motor.\n• Revisar que los retenes de los semiejes no tengan fugas.\n\nAVISO: al vadear con discos calientes, pueden alabearse. Dejar enfriar antes de meter agua.\n\nDespués de un vadeo profundo, revisar el aceite del diferencial y la caja de cambios por posible entrada de agua.",
              en: "The Rocsta can wade up to ≈ 500 mm of water standard. The limit is the original air intake, located in the right front wheel arch, at mid-height.\n\nTo increase wading capacity:\n• Install a snorkel with raised intake to roofline (allows wading up to ≈ 1,200 mm).\n• Extend differential breathers to the engine bay.\n• Check half-shaft seals for leaks.\n\nWARNING: when wading with hot discs, they may warp. Let them cool before entering water.\n\nAfter deep wading, check differential and gearbox oil for water ingress.",
            },
          },
        },
      },
      {
        label: { es: "Remolque con freno", en: "Braked towing" },
        value: { es: "1.000 kg", en: "1,000 kg" },
        info: {
          tooltip: {
            es: "1.000 kg suficiente para caravana pequeña o remolque",
            en: "1,000 kg adequate for small caravan or trailer",
          },
          dialog: {
            title: { es: "Remolque con freno", en: "Braked towing" },
            body: {
              es: "El Rocsta puede remolcar hasta 1.000 kg con remolque provisto de freno propio. Esto es suficiente para:\n• Caravana pequeña (hasta 4 m).\n• Remolque de caballos pequeño.\n• Barco de hasta 4,5 m.\n\nEl motor más recomendado para remolque es el RF (par a bajas rpm). El F8 también sirve pero con mayor consumo. El R2 es el menos indicado por su menor potencia.\n\nAVISO: el peso máximo remolcable se reduce a 750 kg en pendientes pronunciadas (> 12%). No exceder en ningún caso.",
              en: "The Rocsta can tow up to 1,000 kg with a braked trailer. This is sufficient for:\n• Small caravan (up to 4 m).\n• Small horse trailer.\n• Boat up to 4.5 m.\n\nThe most recommended engine for towing is the RF (low-end torque). The F8 also works but with higher consumption. The R2 is the least suitable due to its lower power.\n\nWARNING: the maximum towing weight is reduced to 750 kg on steep gradients (> 12%). Do not exceed under any circumstances.",
            },
          },
        },
      },
      {
        label: { es: "Remolque sin freno", en: "Unbraked towing" },
        value: { es: "450 kg", en: "450 kg" },
        info: {
          tooltip: {
            es: "450 kg para remolque ligero sin frenos",
            en: "450 kg for light unbraked trailer",
          },
          dialog: {
            title: { es: "Remolque sin freno", en: "Unbraked towing" },
            body: {
              es: "Sin freno propio, el límite es de 450 kg (remolque ligero). Esto incluye:\n• Remolque de jardinería.\n• Porta motos pequeño.\n• Remolque de escombros.\n\nEs importante recordar que sin freno propio, la distancia de frenado aumenta significativamente. En descensos prolongados, los frenos pueden sobrecalentarse. Usar marchas cortas (2ª o 3ª) ayuda a controlar la velocidad sin quemar los frenos.",
              en: "Without its own brake, the limit is 450 kg (light trailer). This includes:\n• Gardening trailer.\n• Small motorcycle carrier.\n• Rubble trailer.\n\nIt is important to remember that without its own brake, braking distance increases significantly. On long descents, brakes may overheat. Use low gears (2nd or 3rd) to control speed without burning the brakes.",
            },
          },
        },
      },
      {
        label: { es: "Caja de cambios", en: "Gearbox" },
        value: { es: "Manual de 5 velocidades", en: "5-speed manual" },
        info: {
          tooltip: {
            es: "Caja Mazda de 5 velocidades — robusta, sin 5ª síncrono",
            en: "Mazda 5-speed gearbox — robust, no 5th synchro",
          },
          dialog: {
            title: { es: "Caja de cambios", en: "Gearbox" },
            body: {
              es: "Todos los Rocsta equipan una caja manual Mazda de 5 velocidades (modelo M5OD similar). La 5ª es directa (1:1) o overdrive (0,85:1) según año y mercado.\n\nCaracterísticas:\n• 1ª: corta (≈ 4,5:1) para arranque con carga.\n• 2ª a 4ª: relaciones progresivas para conducción normal.\n• 5ª: directa para carretera (no overdrive en la mayoría).\n• Marcha atrás: sin sincronizador (atención al engranar).\n\nNOTA: la 5ª no tiene sincronizador en algunas versiones. No engranar en movimiento rápido. Siempre reducir a 4ª antes de pasar a 5ª para evitar rechineo.\n\nEl aceite recomendado es ATF Dexron III (no aceite de engranajes API GL).",
              en: "All Rocstas are equipped with a Mazda 5-speed manual gearbox (M5OD type). 5th is direct (1:1) or overdrive (0.85:1) depending on year and market.\n\nFeatures:\n• 1st: low (≈ 4.5:1) for loaded starts.\n• 2nd to 4th: progressive ratios for normal driving.\n• 5th: direct for road (not overdrive on most).\n• Reverse: unsynchronised (care when engaging).\n\nNOTE: 5th gear has no synchromesh on some versions. Do not engage at speed. Always go to 4th before shifting to 5th to avoid grinding.\n\nRecommended oil is ATF Dexron III (not API GL gear oil).",
            },
          },
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
      es:
        "Asia Motors ofreció un abanico de versiones para cubrir todas las necesidades. Las variantes de " +
        "batalla larga (LWB) y batalla corta (SWB) se diferencian no solo en longitud sino también en " +
        "equipamiento disponible.",
      en:
        "Asia Motors offered a range of versions to cover every need. Long-wheelbase (LWB) and " +
        "short-wheelbase (SWB) variants differ not only in length but also in available equipment.",
    },
    items: [
      {
        title: { es: "Country (LWB · Hard Top)", en: "Country (LWB · Hard Top)" },
        description: {
          es:
            "La versión de trabajo por excelencia: batalla larga, techo rígido de metal, equipamiento " +
            "funcional sin adornos. Base de los modelos pick-up y de uso agrícola.",
          en:
            "The workhorse version: long wheelbase, steel hard top, functional equipment without frills. " +
            "Basis for pick-up and agricultural variants.",
        },
      },
      {
        title: {
          es: "Country Classic (LWB · Hard Top equipado)",
          en: "Country Classic (LWB · Hard Top equipped)",
        },
        description: {
          es:
            "Versión enriquecida del Country con mejor acabado interior, tapizado mejorado y equipamiento " +
            "adicional (elevalunas, cierre centralizado según mercado). Misma mecánica y chasis.",
          en:
            "Upmarket version of the Country with better interior finish, improved upholstery and " +
            "additional equipment (electric windows, central locking depending on market). Same " +
            "mechanicals and chassis.",
        },
      },
      {
        title: { es: "Deluxe (SWB · Hard Top)", en: "Deluxe (SWB · Hard Top)" },
        description: {
          es:
            "Batalla corta con techo rígido. El más común en España y Europa occidental. Combina " +
            "maniobrabilidad extrema con el uso diario. Neumáticos 235/75 R15 de serie.",
          en:
            "Short wheelbase with hard top. The most common version in Spain and Western Europe. " +
            "Combines extreme manoeuvrability with everyday usability. 235/75 R15 tyres standard.",
        },
      },
      {
        title: { es: "Softtop (SWB · Soft Top)", en: "Softtop (SWB · Soft Top)" },
        description: {
          es:
            "Batalla corta con techo de lona desmontable. Versión para puristas y clima cálido. " +
            "Mayor exposición al ruido y a los elementos; ideal para off-road abierto y días soleados.",
          en:
            "Short wheelbase with removable canvas top. For purists and warm climates. Greater exposure " +
            "to noise and the elements; ideal for open off-road use and sunny days.",
        },
      },
      {
        title: { es: "Pick-up (LWB · Chasis cabina)", en: "Pick-up (LWB · Chassis cab)" },
        description: {
          es:
            "Versión con caja de carga abierta sobre batalla larga. Popular en entornos agrícolas, " +
            "forestales y de construcción. Carga útil de hasta 1.000 kg; disponible con o sin toldilla.",
          en:
            "Open-bed version on long wheelbase. Popular in agricultural, forestry and construction " +
            "settings. Up to 1,000 kg payload; available with or without a canopy.",
        },
      },
    ],
  },

  // 8 — Fallos comunes y mantenimiento
  {
    kind: "list",
    id: "common-faults",
    title: {
      es: "Fallos comunes y mantenimiento preventivo",
      en: "Common faults & preventive maintenance",
    },
    intro: {
      es:
        "La mayoría de los problemas del Rocsta son predecibles y fáciles de resolver si se anticipan. " +
        "Esta sección recoge los puntos críticos que todo propietario debe conocer.",
      en:
        "Most Rocsta problems are predictable and easy to resolve if anticipated. This section covers " +
        "the critical points every owner should know.",
    },
    items: [
      {
        title: {
          es: "Correa de distribución (RF diésel) — CRÍTICO",
          en: "Timing belt (RF diesel) — CRITICAL",
        },
        description: {
          es:
            "El fallo más peligroso del motor RF. La correa debe cambiarse cada 80.000 km o 5 años " +
            "(lo que llegue primero), junto con la bomba de agua y los tensores. Una rotura destruye el " +
            "motor por interferencia de válvulas. Muchos vehículos de segunda mano no tienen registro " +
            "de este mantenimiento: verificar siempre antes de comprar.",
          en:
            "The most dangerous RF engine failure. The belt must be replaced every 80,000 km or 5 years " +
            "(whichever comes first), along with the water pump and tensioners. A break destroys the " +
            "engine due to valve interference. Many second-hand vehicles have no record of this service: " +
            "always verify before buying.",
        },
      },
      {
        title: { es: "Óxido en chasis y largueros", en: "Chassis and sill rust" },
        description: {
          es:
            "El punto débil estructural del Rocsta. Los largueros inferiores, los travesaños del chasis " +
            "y los soportes de ballesta son las zonas más afectadas, especialmente en vehículos de " +
            "climas húmedos o costeros. Inspección recomendada con el vehículo elevado al menos una " +
            "vez al año; tratamiento con cera de cavidades si hay zonas expuestas.",
          en:
            "The Rocsta's structural weak point. Lower sills, chassis cross-members and leaf-spring " +
            "mounts are the most affected areas, especially on vehicles from humid or coastal climates. " +
            "Inspection recommended with the vehicle lifted at least once a year; cavity wax treatment " +
            "if bare metal is found.",
        },
      },
      {
        title: { es: "Cubos de bloqueo manual", en: "Manual locking hubs" },
        description: {
          es:
            "Los cubos delantera son piezas de desgaste. Los síntomas de fallo son ruido al girar en " +
            "4WD y dificultad para engranar o desengranar. Se recomienda desmontar, limpiar y relubricar " +
            "cada 30.000 km o siempre que el vehículo haya estado mucho tiempo sin usar el 4WD.",
          en:
            "Front hubs are wear items. Failure symptoms are noise when turning in 4WD and difficulty " +
            "engaging or disengaging. Recommended to disassemble, clean and re-grease every 30,000 km " +
            "or whenever the vehicle has gone long periods without using 4WD.",
        },
      },
      {
        title: { es: "Silentblocks y casquillos de ballesta", en: "Leaf spring bushings" },
        description: {
          es:
            "Con el tiempo los casquillos de goma de las ballestas se endurecen y agrietan, provocando " +
            "golpeteos al circular por terreno irregular y holgura en el eje. El reemplazo con casquillos " +
            "de poliuretano mejora la precisión aunque endurece ligeramente el confort.",
          en:
            "Over time the rubber leaf-spring bushings harden and crack, causing knocking on rough " +
            "terrain and axle play. Replacing with polyurethane bushings improves precision, though it " +
            "slightly firms up the ride.",
        },
      },
      {
        title: { es: "Carburador (motor F8 gasolina)", en: "Carburetor (F8 petrol engine)" },
        description: {
          es:
            "En los F8 carburados, el principal problema es la obstrucción de los surtidores por " +
            "depósitos de barniz tras períodos de inactividad. Limpieza con ultrasonidos o sustitución " +
            "por un Weber 32/36 DGV es la solución habitual. Los modelos de inyección posterior evitan " +
            "este problema.",
          en:
            "On carburetted F8 engines, the main issue is jet blockage from varnish deposits after " +
            "periods of inactivity. Ultrasonic cleaning or replacement with a Weber 32/36 DGV is the " +
            "usual fix. Later EFI models avoid this problem entirely.",
        },
      },
      {
        title: { es: "Fugas de aceite en caja de transferencia", en: "Transfer case oil leaks" },
        description: {
          es:
            "Los retenes de salida de la caja de transferencia son propensos a fugarse con el paso de " +
            "los años. Una fuga sostenida puede dejar la caja sin lubricación y causar daños graves. " +
            "Revisar el nivel de aceite cada 20.000 km y verificar el estado de los retenes.",
          en:
            "Transfer case output seals are prone to leaking with age. A sustained leak can leave the " +
            "case oil-starved and cause serious damage. Check the oil level every 20,000 km and inspect " +
            "seal condition.",
        },
      },
      {
        title: { es: "Pinzas de freno traseras agarrotadas", en: "Seized rear brake cylinders" },
        description: {
          es:
            "Los cilindros de rueda traseros (freno de tambor) pueden agarrotarse por la falta de uso " +
            "o corrosión interna. El síntoma es frenada irregular o arrastre en uno de los lados. " +
            "Revisión recomendada cada 2 años o 40.000 km, con sustitución de los latiguillos si " +
            "presentan signos de envejecimiento.",
          en:
            "Rear wheel cylinders (drum brake) can seize due to lack of use or internal corrosion. " +
            "Symptom is uneven braking or drag on one side. Inspection recommended every 2 years or " +
            "40,000 km, replacing flexible hoses if they show signs of age.",
        },
      },
    ],
  },

  // 9 — Timeline
  {
    kind: "timeline",
    id: "history",
    title: { es: "Línea temporal", en: "Timeline" },
    entries: [
      {
        year: "1990",
        text: {
          es: "Lanzamiento del Asia Rocsta en Corea del Sur, basado en el chasis militar KM410. Asia Motors comienza a exportar a mercados del Pacífico y Oriente Medio.",
          en: "Asia Rocsta launches in South Korea, based on the KM410 military chassis. Asia Motors begins exporting to Pacific Rim and Middle East markets.",
        },
      },
      {
        year: "1991",
        text: {
          es: "Inicio de exportaciones a Europa occidental, principalmente a Portugal, Italia y Grecia. El vehículo se posiciona como alternativa económica al Suzuki Samurai y al Land Rover Defender.",
          en: "Exports to Western Europe begin, primarily to Portugal, Italy and Greece. The vehicle is positioned as a budget alternative to the Suzuki Samurai and Land Rover Defender.",
        },
      },
      {
        year: "1992",
        text: {
          es: "Expansión a Latinoamérica: Colombia, Chile y México reciben los primeros lotes. En Oriente Medio y el norte de África el Rocsta gana popularidad en usos agrícolas y militares ligeros.",
          en: "Expansion to Latin America: Colombia, Chile and Mexico receive first shipments. In the Middle East and North Africa the Rocsta gains traction in agricultural and light military roles.",
        },
      },
      {
        year: "1993",
        text: {
          es: "Llegada a España importado por Bensus Automoción. KIA refuerza su red de distribución europea y Asia Motors alcanza sus máximos históricos de exportación.",
          en: "Arrives in Spain imported by Bensus Automoción. KIA strengthens its European distribution network and Asia Motors reaches its historic export peak.",
        },
      },
      {
        year: "1994",
        text: {
          es: "Actualización mecánica menor y mejoras de equipamiento. Se introduce la variante pick-up de batalla larga para mercados agrícolas en África subsahariana y el sudeste asiático.",
          en: "Minor mechanical update and equipment improvements. The long-wheelbase pick-up variant is introduced for agricultural markets in sub-Saharan Africa and Southeast Asia.",
        },
      },
      {
        year: "1995",
        text: {
          es: "KIA adquiere una participación mayoritaria en Asia Motors, acelerando la integración de plataformas. En algunos mercados europeos el Rocsta compite directamente con el Daihatsu Feroza y el Lada Niva.",
          en: "KIA acquires a majority stake in Asia Motors, accelerating platform integration. In some European markets the Rocsta competes directly with the Daihatsu Feroza and Lada Niva.",
        },
      },
      {
        year: "1997",
        text: {
          es: "Fin de producción. La crisis financiera asiática golpea duramente a Asia Motors y paraliza las exportaciones globales. Los últimos mercados en recibir unidades son Latinoamérica y Oriente Medio.",
          en: "Production ends. The Asian financial crisis hits Asia Motors hard, halting global exports. Latin America and the Middle East are the last markets to receive units.",
        },
      },
      {
        year: "1999",
        text: {
          es: "KIA absorbe definitivamente la marca Asia Motors. Los activos, plataformas y redes de distribución se integran en la estructura global de KIA Motors.",
          en: "KIA fully absorbs the Asia Motors brand. Assets, platforms and distribution networks are folded into the KIA Motors global structure.",
        },
      },
      {
        year: "2010+",
        text: {
          es: "Florecen las primeras comunidades de restauración organizadas en Italia y España. En Corea del Sur el Rocsta empieza a aparecer en concentraciones de vehículos clásicos militares.",
          en: "The first organised restoration communities emerge in Italy and Spain. In South Korea the Rocsta begins appearing at military classic vehicle gatherings.",
        },
      },
      {
        year: "2020+",
        text: {
          es: "Auge global de la comunidad de restauradores: España, Italia, Corea del Sur, Portugal y Colombia lideran el movimiento. El Rocsta se consolida internacionalmente como clásico moderno de culto.",
          en: "Global surge of the restorer community: Spain, Italy, South Korea, Portugal and Colombia lead the movement. The Rocsta consolidates internationally as a modern cult classic.",
        },
      },
    ],
  },

  // 10 — Legado / Legacy
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
