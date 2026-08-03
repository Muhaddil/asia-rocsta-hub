import type { LocalizedString } from "@/data/types";

/**
 * Technical data curated from the AM102 workshop manual "TECHNICAL DATA"
 * section (physical pages 408-418). Values were extracted by OCR of the
 * scanned manual and organised into two columns where the manual does so:
 * left = diesel R2 (MAGMA), right = gasoline F8 (JF8 F/B).
 *
 * NOTE: figures should be verified against the original scan (see the
 * reader, section 22 "Technical data") before being relied upon.
 */
export interface TechRow {
  label: LocalizedString;
  /** Shared value (tables that apply to both engines) */
  value?: string;
  /** Diesel R2 column */
  r2?: string;
  /** Gasoline F8 column */
  f8?: string;
}

export interface TechTable {
  id: string;
  title: LocalizedString;
  /** true → renders an R2 / F8 split; false → single value column */
  split: boolean;
  /** Physical PDF page where this table lives */
  sourcePage: number;
  rows: TechRow[];
}

export const AM102_TECH_DATA: TechTable[] = [
  {
    id: "engine",
    title: { es: "Motor — general", en: "Engine — general" },
    split: true,
    sourcePage: 409,
    rows: [
      { label: { es: "Tipo", en: "Type" }, r2: "Diesel, 4 tiempos", f8: "Gasolina, 4 tiempos" },
      { label: { es: "Cilindros", en: "Cylinders" }, value: "4 en línea" },
      {
        label: { es: "Cámara de combustión", en: "Combustion chamber" },
        r2: "Flujo de remolino (swirl)",
        f8: "Multiesférica",
      },
      {
        label: { es: "Diámetro × carrera", en: "Bore × stroke" },
        r2: "86 × 94 mm",
        f8: "86 × 77 mm",
      },
      { label: { es: "Cilindrada", en: "Displacement" }, r2: "2.184 cm³", f8: "1.789 cm³" },
      {
        label: { es: "Relación de compresión", en: "Compression ratio" },
        r2: "22,9 ± 0,4 : 1",
        f8: "8,6 : 1",
      },
      {
        label: { es: "Distribución", en: "Valve system" },
        r2: "OHC, accionamiento directo",
        f8: "OHC, correa dentada",
      },
      { label: { es: "Orden de encendido", en: "Firing order" }, value: "1-3-4-2" },
      { label: { es: "Ralentí", en: "Idle speed" }, r2: "700–750 rpm", f8: "750–800 rpm" },
    ],
  },
  {
    id: "valves",
    title: { es: "Motor — culata y válvulas", en: "Engine — cylinder head & valves" },
    split: true,
    sourcePage: 409,
    rows: [
      {
        label: { es: "Holgura de válvulas, admisión", en: "Valve clearance, intake" },
        r2: "0,20–0,30 mm",
        f8: "0,30 mm",
      },
      {
        label: { es: "Holgura de válvulas, escape", en: "Valve clearance, exhaust" },
        r2: "0,30–0,40 mm",
        f8: "0,30 mm",
      },
      {
        label: { es: "Límite de deformación de la culata", en: "Cylinder head distortion limit" },
        r2: "0,15 mm",
        f8: "0,15 mm",
      },
      {
        label: { es: "Juego axial del árbol de levas", en: "Camshaft end play" },
        r2: "0,02–0,15 mm",
        f8: "0,08–0,16 mm",
      },
      {
        label: { es: "Juego axial máx. del árbol de levas", en: "Camshaft end play, limit" },
        value: "0,2 mm",
      },
      {
        label: { es: "Flecha máx. del árbol de levas", en: "Camshaft deflection limit" },
        r2: "0,10 mm",
        f8: "0,03 mm",
      },
    ],
  },
  {
    id: "pistons",
    title: {
      es: "Motor — bloque, pistones y cigüeñal",
      en: "Engine — block, pistons & crankshaft",
    },
    split: true,
    sourcePage: 410,
    rows: [
      {
        label: { es: "Diámetro del cilindro", en: "Cylinder bore" },
        r2: "86,00 mm",
        f8: "86,00–86,01 mm",
      },
      {
        label: { es: "Holgura pistón–cilindro (límite)", en: "Piston–cylinder clearance (limit)" },
        value: "0,15 mm",
      },
      {
        label: {
          es: "Abertura de segmento, 1er/2º (estándar)",
          en: "Piston ring end gap, 1st/2nd (std.)",
        },
        r2: "0,20–0,40 mm",
        f8: "0,2–0,3 mm",
      },
      {
        label: { es: "Abertura de segmento (límite)", en: "Piston ring end gap (limit)" },
        value: "1,0 mm",
      },
      {
        label: { es: "Diámetro del pie de biela (cigüeñal)", en: "Crankpin diameter" },
        value: "50,94–50,96 mm",
      },
      {
        label: { es: "Diámetro de la muñequilla principal", en: "Main journal diameter" },
        value: "59,94–59,96 mm",
      },
      {
        label: { es: "Flecha máxima del cigüeñal", en: "Crankshaft deflection limit" },
        value: "0,05 mm",
      },
    ],
  },
  {
    id: "torques-engine",
    title: { es: "Pares de apriete — motor", en: "Tightening torques — engine" },
    split: true,
    sourcePage: 411,
    rows: [
      {
        label: { es: "Pernos de culata", en: "Cylinder head bolts" },
        r2: "Par inicial 3 kg·m + 90° + 90°",
        f8: "8,2–8,8 kg·m (59–63 ft·lb)",
      },
      {
        label: { es: "Tensor de correa de distribución", en: "Timing belt tensioner" },
        r2: "3,2–4,7 kg·m (23–34 ft·lb)",
        f8: "2,0–3,5 kg·m (14–25 ft·lb)",
      },
      {
        label: { es: "Cubierta de la correa (inferior)", en: "Timing belt cover (lower)" },
        r2: "0,7–1,0 kg·m (5–7 ft·lb)",
        f8: "2,3–3,3 kg·m (17–24 ft·lb)",
      },
      {
        label: { es: "Cubierta de la correa (superior)", en: "Timing belt cover (upper)" },
        r2: "0,8–1,2 kg·m (5,8–8,6 ft·lb)",
        f8: "2,3–3,3 kg·m (17–24 ft·lb)",
      },
      {
        label: { es: "Polea del cigüeñal", en: "Crankshaft pulley" },
        r2: "1,25–1,75 kg·m (9–12 ft·lb)",
        f8: "2,0–2,7 kg·m (15–20 ft·lb)",
      },
      {
        label: { es: "Soportes del árbol de levas", en: "Camshaft caps" },
        r2: "1,8–2,7 kg·m (13–19 ft·lb)",
        f8: "7,0–7,5 kg·m (51–54 ft·lb)",
      },
      {
        label: { es: "Caps de la biela", en: "Connecting rod bearing caps" },
        r2: "6,6–7,0 kg·m (48–51 ft·lb)",
        f8: "4,9–5,4 kg·m (35–39 ft·lb)",
      },
      {
        label: { es: "Bomba de aceite M8 / M10", en: "Oil pump M8 / M10" },
        r2: "1,6–2,3 / 3,2–4,7 kg·m",
        f8: "1,9–3,1 / 3,8–5,3 kg·m",
      },
      {
        label: { es: "Cárter de aceite", en: "Oil pan" },
        r2: "0,7–1,0 kg·m (5–7 ft·lb)",
        f8: "0,7–1,2 kg·m (5–8,6 ft·lb)",
      },
      {
        label: { es: "Polea del árbol de levas", en: "Camshaft pulley" },
        r2: "4,8–6,6 kg·m (35–48 ft·lb)",
      },
      {
        label: { es: "Polea de la bomba de inyección", en: "Injection pump pulley" },
        r2: "6,0–7,0 kg·m (43–52 ft·lb)",
      },
    ],
  },
  {
    id: "lubrication",
    title: { es: "Lubricación", en: "Lubrication system" },
    split: true,
    sourcePage: 411,
    rows: [
      { label: { es: "Método de lubricación", en: "Lubricating method" }, value: "A presión" },
      { label: { es: "Bomba de aceite", en: "Oil pump" }, value: "Engranajes internos" },
      {
        label: { es: "Presión de aceite a 3.000 rpm", en: "Oil pressure @ 3,000 rpm" },
        r2: "4,1–4,9 kg/cm² (58–70 lb/in²)",
        f8: "3,0–4,0 kg/cm²",
      },
      { label: { es: "Filtro de aceite", en: "Oil filter" }, value: "Flujo total, papel" },
      {
        label: { es: "Capacidad total de aceite", en: "Total oil capacity" },
        r2: "6,4 L",
        f8: "4,6 L",
      },
      { label: { es: "Capacidad del cárter", en: "Oil pan capacity" }, r2: "5,0 L", f8: "3,8 L" },
      {
        label: { es: "Capacidad del filtro", en: "Oil filter capacity" },
        r2: "0,4 L",
        f8: "0,3 L",
      },
      {
        label: { es: "Clasificación del aceite", en: "Engine oil class" },
        r2: "API CC / CD",
        f8: "API SE / SF",
      },
      {
        label: { es: "Testigo de presión de aceite", en: "Oil warning lamp" },
        value: "0,3 kg/cm² (4,3 lb/in²)",
      },
    ],
  },
  {
    id: "cooling",
    title: { es: "Refrigeración", en: "Cooling system" },
    split: true,
    sourcePage: 412,
    rows: [
      { label: { es: "Ventilador", en: "Fan" }, r2: "Termomodulado", f8: "Eléctrico" },
      {
        label: { es: "Diámetro exterior del ventilador", en: "Fan outer diameter" },
        r2: "300 mm",
        f8: "300 mm",
      },
      {
        label: { es: "Termostato, apertura", en: "Thermostat opening temp." },
        r2: "82 ± 1,5 °C (179,6 ± 34,7 °F)",
        f8: "82 °C (179,6 °F)",
      },
      {
        label: { es: "Termostato, apertura total", en: "Thermostat full-open" },
        value: "95 °C (203 °F)",
      },
      {
        label: { es: "Termostato, carrera total", en: "Thermostat full-open lift" },
        value: "8,5 mm o más",
      },
      {
        label: { es: "Tapón del radiador", en: "Radiator cap pressure" },
        r2: "0,9 ± 0,15 kg/cm² (12,8 ± 2,1 lb/in²)",
        f8: "0,75–1,05 kg/cm²",
      },
      {
        label: { es: "Bomba de agua", en: "Water pump" },
        r2: "Centrífuga, por correa de distribución",
        f8: "Corrugada",
      },
      {
        label: {
          es: "Capacidad de refrigerante (con calefactor)",
          en: "Coolant capacity (with heater)",
        },
        r2: "7,0 L",
        f8: "7,4 L",
      },
      {
        label: {
          es: "Capacidad de refrigerante (sin calefactor)",
          en: "Coolant capacity (without heater)",
        },
        r2: "8,5 L",
        f8: "9,0 L",
      },
    ],
  },
  {
    id: "fuel",
    title: { es: "Sistema de combustible", en: "Fuel system" },
    split: false,
    sourcePage: 413,
    rows: [
      { label: { es: "Bomba de inyección", en: "Injection pump" }, value: "Tipo VE" },
      { label: { es: "Diámetro del émbolo", en: "Plunger diameter" }, value: "8,0 mm" },
      { label: { es: "Levantamiento de leva", en: "Cam lift" }, value: "2,2 mm" },
      { label: { es: "Avance de inyección", en: "Injection timing" }, value: "2° ATDC" },
      { label: { es: "Inyector", en: "Injection nozzle" }, value: "Tipo estrangulador (throttle)" },
      {
        label: { es: "Presión de inyección", en: "Injection pressure" },
        value: "135 kg/cm² (1.920 lb/in²)",
      },
      {
        label: { es: "Juego libre del cable del acelerador", en: "Accelerator cable free play" },
        value: "1–3 mm",
      },
      { label: { es: "Capacidad del depósito", en: "Fuel tank capacity" }, value: "65 L" },
      {
        label: { es: "Filtro de combustible", en: "Fuel filter" },
        value: "Cartucho, con detector de agua",
      },
      {
        label: { es: "Bomba de combustible (F8)", en: "Fuel pump (F8)" },
        value: "Tipo diafragma, 0,23–0,30 kg/cm²",
      },
      { label: { es: "Filtro de aire", en: "Air cleaner" }, value: "Elemento de papel (seco)" },
    ],
  },
  {
    id: "electrical",
    title: { es: "Sistema eléctrico del motor", en: "Engine electrical system" },
    split: true,
    sourcePage: 413,
    rows: [
      { label: { es: "Batería", en: "Battery" }, r2: "PT85 — 85 Ah", f8: "MF60 — 60 Ah" },
      {
        label: { es: "Alternador", en: "Alternator" },
        value: "12 V / 55 A, regulado a 14,7 ± 0,3 V",
      },
      { label: { es: "Motor de arranque", en: "Starter motor" }, r2: "2,0 kW", f8: "0,9 kW" },
      { label: { es: "Bujías de incandescencia", en: "Glow plugs" }, value: "10,5 V / 16,5 A" },
      { label: { es: "Bujías", en: "Spark plugs" }, value: "BP5ES, 0,75–0,85 mm" },
      { label: { es: "Distribuidor", en: "Distributor" }, value: "Sin contactos (igniter)" },
    ],
  },
  {
    id: "clutch",
    title: { es: "Embrague", en: "Clutch" },
    split: false,
    sourcePage: 414,
    rows: [
      { label: { es: "Mando", en: "Control" }, value: "Hidráulico" },
      { label: { es: "Altura del pedal", en: "Pedal height" }, value: "200,5 mm (7,89 in)" },
      {
        label: { es: "Carrera total del pedal", en: "Pedal full stroke" },
        value: "144 mm (5,7 in)",
      },
      {
        label: { es: "Juego libre del pedal", en: "Pedal free play" },
        value: "7,8–14,3 mm (0,3–0,6 in)",
      },
      {
        label: {
          es: "Distancia al suelo con embrague desembragado",
          en: "Distance to floor, disengaged",
        },
        value: "60 mm (2,4 in) o más",
      },
      { label: { es: "Disco", en: "Disc" }, value: "Simple seco, 225 × 150 × 3,5 mm" },
      {
        label: { es: "Límite de deformación del disco", en: "Disc deflection limit" },
        value: "0,7 mm",
      },
      {
        label: { es: "Límite de desgaste", en: "Wear limit" },
        value: "0,3 mm desde la cabeza del remache",
      },
      { label: { es: "Cilindro maestro", en: "Master cylinder" }, value: "15,9 mm (5/8 in)" },
      { label: { es: "Cilindro receptor", en: "Release cylinder" }, value: "19,1 mm (3/4 in)" },
    ],
  },
  {
    id: "transmission",
    title: { es: "Transmisión", en: "Transmission" },
    split: false,
    sourcePage: 414,
    rows: [
      { label: { es: "Tipo", en: "Type" }, value: "Manual de 5 velocidades, palanca en el suelo" },
      { label: { es: "1ª velocidad", en: "1st gear" }, value: "3,565" },
      { label: { es: "2ª velocidad", en: "2nd gear" }, value: "2,212" },
      { label: { es: "3ª velocidad", en: "3rd gear" }, value: "1,435" },
      { label: { es: "4ª velocidad", en: "4th gear" }, value: "1,000" },
      { label: { es: "5ª velocidad", en: "5th gear" }, value: "0,894" },
      { label: { es: "Reversa", en: "Reverse" }, value: "3,854" },
      {
        label: { es: "Aceite", en: "Specified oil" },
        value: "API GL-4 / GL-5 · SAE 80 / 90 / 80W-90",
      },
      { label: { es: "Capacidad de aceite", en: "Oil capacity" }, value: "1,9 L" },
    ],
  },
  {
    id: "propshaft",
    title: { es: "Eje de transmisión (cardán)", en: "Propeller shaft" },
    split: false,
    sourcePage: 415,
    rows: [
      { label: { es: "Longitud delantero", en: "Front length" }, value: "621–626 mm" },
      { label: { es: "Longitud trasero", en: "Rear length" }, value: "647–659 mm" },
      { label: { es: "Límite de deformación", en: "Deflection limit" }, value: "0,4 mm" },
      {
        label: {
          es: "Par de arranque de la junta universal",
          en: "Universal joint starting torque",
        },
        value: "Del. 3–8 kg·cm · Tras. 5–14 kg·cm",
      },
    ],
  },
  {
    id: "rear-axle",
    title: { es: "Eje trasero / diferencial", en: "Rear axle / differential" },
    split: false,
    sourcePage: 416,
    rows: [
      {
        label: { es: "Grupo reductor", en: "Reduction ratio" },
        value: "4,875 (piñón 8 / corona 39)",
      },
      { label: { es: "Aceite", en: "Oil" }, value: "GL-5, SAE 80W" },
      { label: { es: "Capacidad", en: "Capacity" }, value: "Hasta el nivel del tapón" },
      {
        label: { es: "Holgura piñón–corona (estándar)", en: "Pinion–ring backlash (std.)" },
        value: "0,09–0,11 mm",
      },
      {
        label: { es: "Holgura piñón–corona (mín.)", en: "Pinion–ring backlash (min.)" },
        value: "0,05 mm",
      },
      {
        label: { es: "Tuerca del piñón de ataque", en: "Drive pinion lock nut" },
        value: "13–18 kg·m (92,8–128,5 ft·lb)",
      },
      { label: { es: "Corona", en: "Ring gear" }, value: "7,5–8,5 kg·m (53,6–60,7 ft·lb)" },
      {
        label: { es: "Perno rey y mangueta", en: "King pin & knuckle" },
        value: "3,5–4,2 kg·m (25–30 ft·lb)",
      },
    ],
  },
  {
    id: "steering",
    title: { es: "Dirección", en: "Steering" },
    split: false,
    sourcePage: 416,
    rows: [
      { label: { es: "Volante", en: "Steering wheel" }, value: "390 mm de diámetro" },
      { label: { es: "De tope a tope", en: "Lock to lock" }, value: "Manual 3,8 · Asistida 2,5" },
      {
        label: { es: "Caja de dirección", en: "Gear" },
        value: "Tipo bola y tuerca, 21,25 : 1 (STD/DLX), 15,2 : 1 (GT)",
      },
      {
        label: { es: "Aceite asistida", en: "Power steering oil" },
        value: "DEXRON II / FORD M2C33F · 2,0 L",
      },
      {
        label: { es: "Ángulo máximo de giro", en: "Maximum steering angle" },
        value: "Interior 29° · Exterior 27°",
      },
      { label: { es: "Convergencia (toe-in)", en: "Toe-in" }, value: "3 ± 3 mm (0,12 ± 0,12 in)" },
      { label: { es: "Caída (camber)", en: "Camber" }, value: "1° 30' (asistida)" },
      { label: { es: "Avance (caster)", en: "Caster" }, value: "6° (manual)" },
      { label: { es: "Inclinación del pivote", en: "King-pin angle" }, value: "8° 30' ± 30'" },
      {
        label: { es: "Tuerca de rótula axial", en: "Tie-rod end lock nut" },
        value: "9–12 kg·m (64–86 ft·lb)",
      },
      {
        label: { es: "Tuerca de la palanca de la pitman", en: "Pitman arm lock nut" },
        value: "21–25 kg·m (150–178 ft·lb)",
      },
    ],
  },
  {
    id: "brakes",
    title: { es: "Frenos", en: "Brakes" },
    split: false,
    sourcePage: 417,
    rows: [
      { label: { es: "Altura del pedal", en: "Pedal height" }, value: "211 mm (8,31 in)" },
      { label: { es: "Juego libre del pedal", en: "Pedal play" }, value: "7–9 mm" },
      {
        label: { es: "Recorrido restante", en: "Remaining step-in" },
        value: "74 mm (2,91 in) o más",
      },
      { label: { es: "Cilindro maestro", en: "Master cylinder" }, value: "22,22 mm (0,875 in)" },
      {
        label: { es: "Freno delantero", en: "Front brake" },
        value: "Disco ventilado, 275 × 20 mm",
      },
      { label: { es: "Pastillas", en: "Pads" }, value: "49 × 111 × 10 mm · límite 1,0 mm" },
      {
        label: { es: "Límite del disco", en: "Disc limit" },
        value: "18 mm de grosor · 0,15 mm de deformación",
      },
      { label: { es: "Freno trasero", en: "Rear brake" }, value: "Tambor" },
      { label: { es: "Cilindro de rueda", en: "Wheel cylinder" }, value: "19,05 mm (0,75 in)" },
      { label: { es: "Zapatas", en: "Lining" }, value: "45 × 249,6 × 4,5 mm · límite 1,0 mm" },
      {
        label: { es: "Freno de mano", en: "Parking brake" },
        value: "8–12 muescas con 25 kg (55,1 lb)",
      },
    ],
  },
  {
    id: "wheels",
    title: { es: "Ruedas y neumáticos", en: "Wheels & tires" },
    split: false,
    sourcePage: 417,
    rows: [
      { label: { es: "Llanta", en: "Rim" }, value: "6.00J-15" },
      { label: { es: "Neumático", en: "Tire" }, value: "195R15RF (STD) · P215/75R15 (GT/DLX)" },
      {
        label: { es: "Presión", en: "Air pressure" },
        value: "1,8 kg/cm² (25,6 lb/in²) del. y tras.",
      },
    ],
  },
  {
    id: "suspension",
    title: { es: "Suspensión", en: "Suspension" },
    split: false,
    sourcePage: 418,
    rows: [
      { label: { es: "Delantera", en: "Front" }, value: "Eje rígido · ballestas semielípticas" },
      {
        label: { es: "Amortiguadores", en: "Shock absorbers" },
        value: "Cilíndricos, doble efecto",
      },
      {
        label: { es: "Estabilizador (del.)", en: "Stabilizer (front)" },
        value: "Barra de torsión",
      },
      { label: { es: "Trasera", en: "Rear" }, value: "Eje rígido · ballestas semielípticas" },
    ],
  },
  {
    id: "bulbs",
    title: { es: "Bombillas — carrocería", en: "Bulbs — body" },
    split: false,
    sourcePage: 418,
    rows: [
      { label: { es: "Faros", en: "Headlights" }, value: "60/55 W" },
      { label: { es: "Intermitentes", en: "Turn signals" }, value: "21 W" },
      { label: { es: "Stop / marcha atrás", en: "Stop / back-up" }, value: "21 W" },
      { label: { es: "Interior", en: "Interior lights" }, value: "10 W" },
      { label: { es: "Luces antiniebla", en: "Fog lights" }, value: "35 W" },
      { label: { es: "Testigos", en: "Indicator lights" }, value: "1,2 W" },
      {
        label: { es: "Iluminación del cuadro / calefactor", en: "Cluster / heater illumination" },
        value: "1,2 × 4 / 3,4 W",
      },
    ],
  },
];
