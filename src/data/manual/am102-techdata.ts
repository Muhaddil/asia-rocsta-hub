import type { LocalizedString } from "@/data/types";

/**
 * Technical data re-extracted from the AM102 workshop manual, section 22
 * ("TECHNICAL DATA", physical pages 22-2 to 22-11). Values were read from
 * the English original using its embedded OCR text layer and checked against
 * the scanned page images.
 *
 * Two-column tables follow the manual: left = diesel R2 (MAGMA),
 * right = gasoline F8 (JF8 F/B CAR). A ditto mark in the original is stored
 * as a shared `value`, while a dash is stored as a missing column.
 *
 * Exception: page 22-9 prints a single final-drive ratio (4.875) for both
 * engines, but the parts catalog (sections 2600 rear axle and 2710 rear
 * differential) fits a different final gear set per engine: 4.333 (39/9) on
 * the R2 diesel and 4.875 (39/8) on the F8 gasoline. The rear axle table uses
 * the parts catalog values, which match the different part numbers.
 *
 * NOTE: figures should still be verified against the original scan (see the
 * reader, section 22 "Technical data") before being relied upon.
 */
export interface TechRow {
  label: LocalizedString;
  /**
   * Shared value (tables that apply to both engines, or ditto marks).
   * Plain strings are unit-only values; textual values are localized.
   */
  value?: string | LocalizedString;
  /** Diesel R2 column */
  r2?: string | LocalizedString;
  /** Gasoline F8 column */
  f8?: string | LocalizedString;
}

export type TechGroup = "engine" | "drivetrain" | "chassis" | "body";

export interface TechTable {
  id: string;
  /** Section the table belongs to, used to group the UI */
  group: TechGroup;
  title: LocalizedString;
  /** true → renders an R2 / F8 split; false → single value column */
  split: boolean;
  /** Physical PDF page where this table lives */
  sourcePage: number;
  /** Optional clarification shown above the table */
  note?: LocalizedString;
  rows: TechRow[];
}

export const AM102_TECH_DATA: TechTable[] = [
  {
    id: "engine",
    group: "engine",
    title: { es: "Motor — datos generales", en: "Engine — general" },
    split: true,
    sourcePage: 409,
    rows: [
      { label: { es: "Modelo de motor", en: "Engine model" }, r2: "MAGMA", f8: "JF8 F/B CAR." },
      {
        label: { es: "Tipo", en: "Type" },
        r2: { es: "Diésel, 4 tiempos", en: "Diesel, four-cycle" },
        f8: { es: "Gasolina, 4 tiempos", en: "Gasoline, four-cycle" },
      },
      {
        label: {
          es: "Número y disposición de cilindros",
          en: "Number and arrangement of cylinders",
        },
        value: { es: "Cuatro cilindros en línea", en: "Four cylinders, in-line" },
      },
      {
        label: { es: "Cámara de combustión", en: "Type of combustion chamber" },
        r2: { es: "Flujo de remolino (swirl)", en: "Swirl flow type" },
        f8: { es: "Multiesférica", en: "Multispherical" },
      },
      {
        label: { es: "Diámetro × carrera", en: "Bore and stroke" },
        r2: "86 × 94 mm (3.39 × 3.70 in)",
        f8: "86 × 77 mm (3.39 × 3.03 in)",
      },
      {
        label: { es: "Cilindrada total", en: "Total piston displacement" },
        r2: "2,184 cc",
        f8: "1,789 cc",
      },
      {
        label: { es: "Relación de compresión", en: "Compression ratio" },
        r2: "22.9 ± 0.4 : 1",
        f8: "8.6 : 1",
      },
      {
        label: { es: "Sistema de válvulas", en: "Valve system" },
        r2: { es: "Accionamiento directo, OHC", en: "Direct drive, OHC" },
        f8: { es: "OHC, correa dentada", en: "OHC, belt driven" },
      },
      {
        label: { es: "Distribución — admisión abre", en: "Valve timing — intake opens" },
        r2: "10° BTDC",
        f8: "19° BTDC",
      },
      {
        label: { es: "Distribución — admisión cierra", en: "Valve timing — intake closes" },
        r2: "42° ABDC",
        f8: "51° ABDC",
      },
      {
        label: { es: "Distribución — escape abre", en: "Valve timing — exhaust opens" },
        r2: "57° BBDC",
        f8: "57° BBDC",
      },
      {
        label: { es: "Distribución — escape cierra", en: "Valve timing — exhaust closes" },
        r2: "11° ATDC",
        f8: "13° ATDC",
      },
      { label: { es: "Orden de encendido", en: "Firing order" }, value: "1–3–4–2" },
      {
        label: { es: "Ralentí", en: "Idling speed" },
        r2: "700–750 rpm",
        f8: "750–800 rpm",
      },
      {
        label: { es: "Deflexión de correa, nueva", en: "Drive belt deflection, new" },
        r2: "10–12 mm (0.39–0.47 in)",
        f8: "6–8 mm (0.24–0.31 in)",
      },
      {
        label: { es: "Deflexión de correa, usada", en: "Drive belt deflection, used" },
        r2: "9–11 mm (0.35–0.43 in)",
        f8: "10–12 mm (0.39–0.47 in)",
      },
    ],
  },
  {
    id: "cylinder-head",
    group: "engine",
    title: { es: "Culata, válvulas y taqués", en: "Cylinder head, valves & tappets" },
    split: true,
    sourcePage: 409,
    rows: [
      {
        label: { es: "Holgura de válvulas, admisión", en: "Valve clearance, intake" },
        r2: "0.20–0.30 mm (0.008–0.012 in)",
        f8: "0.30 mm (0.012 in)",
      },
      {
        label: { es: "Holgura de válvulas, escape", en: "Valve clearance, exhaust" },
        r2: "0.30–0.40 mm (0.012–0.016 in)",
        f8: "0.30 mm (0.012 in)",
      },
      {
        label: { es: "Límite de deformación de la culata", en: "Cylinder head distortion limit" },
        r2: "0.15 mm (0.006 in)",
        f8: "0.15 mm (0.0059 in)",
      },
      {
        label: {
          es: "Longitud del perno de culata bajo la cabeza (estándar)",
          en: "Cylinder head bolt length below head (standard)",
        },
        r2: "112.7–113.3 mm (4.437–4.460 in)",
      },
      {
        label: {
          es: "Longitud del perno de culata bajo la cabeza (límite)",
          en: "Cylinder head bolt length below head (limit)",
        },
        r2: "114.5 mm (4.508 in)",
      },
      {
        label: {
          es: "Hundimiento del asiento, admisión (estándar)",
          en: "Valve seat sinking, intake (standard)",
        },
        value: "0.75–1.05 mm (0.030–0.041 in)",
      },
      {
        label: {
          es: "Hundimiento del asiento, admisión (límite)",
          en: "Valve seat sinking, intake (wear limit)",
        },
        value: "2.55 mm (0.100 in)",
      },
      {
        label: {
          es: "Hundimiento del asiento, escape (estándar)",
          en: "Valve seat sinking, exhaust (standard)",
        },
        value: "0.75–1.05 mm (0.030–0.041 in)",
      },
      {
        label: {
          es: "Hundimiento del asiento, escape (límite)",
          en: "Valve seat sinking, exhaust (wear limit)",
        },
        value: "2.55 mm (0.100 in)",
      },
      { label: { es: "Ángulo del asiento", en: "Seat angle" }, value: "45°" },
      {
        label: { es: "Ancho del asiento, admisión", en: "Seat width, intake" },
        r2: "1.7–2.3 mm (0.067–0.091 in)",
        f8: "0.5–1.5 mm (0.02–0.06 in)",
      },
      {
        label: { es: "Ancho del asiento, escape", en: "Seat width, exhaust" },
        r2: "1.7–2.3 mm (0.067–0.091 in)",
        f8: "0.5–1.5 mm (0.02–0.06 in)",
      },
      {
        label: { es: "Diámetro del vástago, admisión", en: "Standard valve stem diameter, intake" },
        value: "7.970–7.985 mm (0.3138–0.3144 in)",
      },
      {
        label: { es: "Diámetro del vástago, escape", en: "Standard valve stem diameter, exhaust" },
        value: "7.965–7.980 mm (0.3136–0.3142 in)",
      },
      {
        label: {
          es: "Holgura vástago-guía, admisión (límite)",
          en: "Valve stem to guide clearance limit, intake",
        },
        r2: "0.10 mm (0.004 in)",
        f8: "0.20 mm (0.008 in)",
      },
      {
        label: {
          es: "Holgura vástago-guía, escape (límite)",
          en: "Valve stem to guide clearance limit, exhaust",
        },
        r2: "0.10 mm (0.004 in)",
        f8: "0.20 mm (0.008 in)",
      },
      {
        label: {
          es: "Diámetro exterior del taqué (estándar)",
          en: "Standard tappet outer diameter",
        },
        value: "34.96–34.98 mm (1.3763–1.3771 in)",
      },
      {
        label: {
          es: "Diámetro del alojamiento del taqué (estándar)",
          en: "Standard tappet hole diameter",
        },
        value: "34.99–35.02 mm (1.3776–1.3787 in)",
      },
      {
        label: {
          es: "Holgura taqué-alojamiento (estándar)",
          en: "Tappet hole and outer clearance (standard)",
        },
        value: "0.02–0.06 mm (0.0008–0.0024 in)",
      },
      {
        label: {
          es: "Holgura taqué-alojamiento (límite)",
          en: "Tappet hole and outer clearance (limit)",
        },
        value: "0.10 mm (0.0040 in)",
      },
    ],
  },
  {
    id: "camshaft",
    group: "engine",
    title: { es: "Árbol de levas", en: "Camshaft" },
    split: true,
    sourcePage: 409,
    rows: [
      {
        label: { es: "Altura de leva, admisión (estándar)", en: "Cam height, intake (standard)" },
        r2: "44.31 mm (1.744 in)",
        f8: "38.202 mm (1.504 in)",
      },
      {
        label: { es: "Altura de leva, admisión (límite)", en: "Cam height, intake (wear limit)" },
        r2: "43.90 mm (1.728 in)",
        f8: "38.002 mm (1.496 in)",
      },
      {
        label: { es: "Altura de leva, escape (estándar)", en: "Cam height, exhaust (standard)" },
        r2: "45.30 mm (1.783 in)",
        f8: "38.202 mm (1.504 in)",
      },
      {
        label: { es: "Altura de leva, escape (límite)", en: "Cam height, exhaust (wear limit)" },
        r2: "44.90 mm (1.768 in)",
        f8: "38.002 mm (1.496 in)",
      },
      {
        label: { es: "Límite de elipticidad del muñón", en: "Journal ellipticity limit" },
        value: "0.05 mm (0.002 in)",
      },
      {
        label: { es: "Diámetro del muñón (estándar)", en: "Journal diameter (standard)" },
        value: "31.96–31.98 mm (1.258–1.259 in)",
      },
      {
        label: { es: "Diámetro del muñón (límite)", en: "Journal diameter (limit)" },
        r2: "31.86 mm (1.254 in)",
      },
      {
        label: { es: "Límite de flexión del árbol de levas", en: "Camshaft deflection limit" },
        r2: "0.10 mm (0.0040 in)",
        f8: "0.03 mm (0.0012 in)",
      },
      {
        label: {
          es: "Juego axial del árbol de levas (estándar)",
          en: "Camshaft end play (standard)",
        },
        r2: "0.02–0.15 mm (0.00079–0.0059 in)",
        f8: "0.08–0.16 mm (0.003–0.006 in)",
      },
      {
        label: { es: "Juego axial del árbol de levas (límite)", en: "Camshaft end play (limit)" },
        value: "0.2 mm (0.008 in)",
      },
    ],
  },
  {
    id: "connecting-rod",
    group: "engine",
    title: { es: "Biela y cojinetes", en: "Connecting rod & bearings" },
    split: true,
    sourcePage: 410,
    rows: [
      {
        label: { es: "Límite del cojinete de biela", en: "Rod bearing limit" },
        r2: "Less than 0.16 mm (0.006 in) per 100 mm (3.94 in)",
        f8: "Less than 0.075 mm (0.003 in) per 50 mm (1.97 in)",
      },
      {
        label: { es: "Diámetro interior del casquillo de biela", en: "Rod bushing inner diameter" },
        r2: "25.01–25.03 mm (0.9846–0.9854 in)",
      },
      {
        label: { es: "Holgura del casquillo de biela (límite)", en: "Rod bushing clearance limit" },
        r2: "0.05 mm (0.002 in)",
      },
      {
        label: { es: "Juego axial de la biela (estándar)", en: "Rod end play (standard)" },
        r2: "0.11–0.26 mm (0.0043–0.0102 in)",
        f8: "0.11–0.26 mm (0.004–0.010 in)",
      },
      {
        label: { es: "Juego axial de la biela (límite)", en: "Rod end play (limit)" },
        r2: "0.35 mm (0.014 in)",
        f8: "0.30 mm (0.012 in)",
      },
      {
        label: { es: "Holgura de aceite (estándar)", en: "Oil clearance (standard)" },
        r2: "0.03–0.06 mm (0.0012–0.0024 in)",
        f8: "0.027–0.067 mm (0.0010–0.0026 in)",
      },
      {
        label: { es: "Holgura de aceite (límite)", en: "Oil clearance (limit)" },
        r2: "0.08 mm (0.0031 in)",
        f8: "0.10 mm (0.0039 in)",
      },
      {
        label: { es: "Cojinetes de biela sobremedida", en: "Undersize connecting rod bearings" },
        value: "0.25 / 0.50 / 0.75 mm (0.010 / 0.020 / 0.030 in)",
      },
    ],
  },
  {
    id: "crankshaft",
    group: "engine",
    title: { es: "Cigüeñal y cojinetes principales", en: "Crankshaft & main bearings" },
    split: true,
    sourcePage: 410,
    rows: [
      {
        label: { es: "Límite de flexión del cigüeñal", en: "Crankshaft deflection limit" },
        r2: "0.05 mm (0.002 in)",
        f8: "0.03 mm (0.0012 in)",
      },
      {
        label: { es: "Diámetro de la muñequilla (estándar)", en: "Crankpin diameter (standard)" },
        value: "50.94–50.96 mm (2.006–2.007 in)",
      },
      {
        label: { es: "Diámetro de la muñequilla (límite)", en: "Crankpin diameter (limit)" },
        value: "0.05 mm (0.0020 in)",
      },
      {
        label: { es: "Límite de rectificado de la muñequilla", en: "Crankpin grinding limit" },
        value: "0.75 mm (0.0295 in)",
      },
      {
        label: {
          es: "Diámetro del muñón principal (estándar)",
          en: "Main journal diameter (standard)",
        },
        value: "59.94–59.96 mm (2.360–2.361 in)",
      },
      {
        label: { es: "Diámetro del muñón principal (límite)", en: "Main journal diameter (limit)" },
        value: "0.05 mm (0.0020 in)",
      },
      {
        label: {
          es: "Límite de rectificado del muñón principal",
          en: "Main journal grinding limit",
        },
        value: "0.75 mm (0.0295 in)",
      },
      {
        label: {
          es: "Diámetro de la superficie del retén trasero",
          en: "Rear housing oil seal sliding surface diameter",
        },
        value: "89.95–90.00 mm (3.541–3.543 in)",
      },
      {
        label: {
          es: "Holgura de aceite del cojinete principal (estándar)",
          en: "Main journal bearing oil clearance (standard)",
        },
        value: "0.031–0.049 mm (0.0012–0.0019 in)",
      },
      {
        label: {
          es: "Holgura de aceite del cojinete principal (límite)",
          en: "Main journal bearing oil clearance (limit)",
        },
        value: "0.08 mm (0.0031 in)",
      },
      {
        label: { es: "Cojinetes principales sobremedida", en: "Undersize main bearings" },
        value: "0.25 / 0.50 / 0.75 mm (0.010 / 0.020 / 0.030 in)",
      },
      {
        label: { es: "Juego axial del cigüeñal (estándar)", en: "Crankshaft end play (standard)" },
        r2: "0.04–0.28 mm (0.0016–0.0111 in)",
        f8: "0.08–0.282 mm (0.0031–0.0111 in)",
      },
      {
        label: { es: "Juego axial del cigüeñal (límite)", en: "Crankshaft end play (limit)" },
        value: "0.3 mm (0.0118 in)",
      },
      {
        label: {
          es: "Ancho del cojinete de empuje (estándar)",
          en: "Thrust bearing width (standard)",
        },
        r2: "2.18–2.23 mm (0.0858–0.0878 in)",
      },
      {
        label: {
          es: "Ancho del cojinete de empuje (sobremedida)",
          en: "Thrust bearing width (undersize)",
        },
        r2: "2.00–2.05 mm (0.0787–0.0807 in)",
      },
    ],
  },
  {
    id: "pistons",
    group: "engine",
    title: { es: "Bloque, pistones y segmentos", en: "Cylinder block, pistons & rings" },
    split: true,
    sourcePage: 410,
    rows: [
      {
        label: {
          es: "Límite de deformación de los cilindros",
          en: "Cylinder bore distortion limit",
        },
        value: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Diámetro del cilindro (estándar)", en: "Cylinder bore (standard)" },
        r2: "86.00 mm (3.39 in)",
        f8: "86.00–86.019 mm (3.3859–3.3866 in)",
      },
      {
        label: { es: "Diámetro del cilindro (límite)", en: "Cylinder bore (limit)" },
        r2: "85.85 mm (3.380 in)",
        f8: "86.15 mm (3.392 in)",
      },
      {
        label: { es: "Diferencia entre cilindros", en: "Difference between bores" },
        r2: "0.022 mm (0.0009 in)",
        f8: "0.019 mm (0.0007 in)",
      },
      {
        label: { es: "Diámetro exterior del pistón", en: "Piston standard outer diameter" },
        r2: "85.95–85.98 mm (3.384–3.385 in)",
        f8: "85.944–85.964 mm (3.3837–3.3845 in)",
      },
      {
        label: {
          es: "Holgura pistón-cilindro (límite)",
          en: "Piston and cylinder clearance limit",
        },
        value: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Segmentos sobremedida", en: "Oversize piston rings" },
        value: "1.0 / 0.50 mm (0.040 / 0.020 in)",
      },
      {
        label: {
          es: "Abertura de segmento en el cilindro (límite)",
          en: "Piston ring opening clearance limit, in the cylinder",
        },
        value: "1.0 mm (0.039 in)",
      },
      {
        label: {
          es: "Holgura segmento-ranura (límite)",
          en: "Clearance limit, piston ring and ring groove",
        },
        r2: "0.20 mm (0.008 in)",
        f8: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Ancho de ranura, superior", en: "Ring groove width, top" },
        r2: "2.04–2.06 mm (0.0803–0.0811 in)",
        f8: "1.52–1.54 mm (0.0598–0.0606 in)",
      },
      {
        label: { es: "Ancho de ranura, segundo", en: "Ring groove width, second" },
        r2: "2.03–2.05 mm (0.0799–0.0807 in)",
        f8: "1.52–1.54 mm (0.0598–0.0606 in)",
      },
      {
        label: { es: "Ancho de ranura, rascador", en: "Ring groove width, oil" },
        r2: "4.02–4.04 mm (0.1583–0.1591 in)",
      },
      {
        label: { es: "Espesor del segmento, superior", en: "Piston ring thickness, top" },
        r2: "2.04–2.06 mm (0.0803–0.0811 in)",
        f8: "1.17–1.19 mm (0.0579–0.0587 in)",
      },
      {
        label: { es: "Espesor del segmento, segundo", en: "Piston ring thickness, second" },
        r2: "2.03–2.05 mm (0.0799–0.0807 in)",
        f8: "1.17–1.19 mm (0.0579–0.0587 in)",
      },
      {
        label: { es: "Holgura segmento-ranura, superior", en: "Ring groove clearance, top" },
        r2: "0.05–0.09 mm (0.0020–0.0035 in)",
        f8: "0.037–0.07 mm (0.0012–0.0028 in)",
      },
      {
        label: { es: "Holgura segmento-ranura, segundo", en: "Ring groove clearance, second" },
        r2: "0.04–0.08 mm (0.0016–0.0031 in)",
        f8: "0.037–0.07 mm (0.0012–0.0028 in)",
      },
      {
        label: {
          es: "Holgura segmento-ranura (desgaste)",
          en: "Ring groove clearance, wear limit",
        },
        r2: "0.20 mm (0.0079 in)",
        f8: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Abertura del segmento, superior", en: "Piston ring end gap, top" },
        r2: "0.20–0.40 mm (0.0079–0.0157 in)",
        f8: "0.2–0.3 mm (0.008–0.014 in)",
      },
      {
        label: { es: "Abertura del segmento, segundo", en: "Piston ring end gap, second" },
        r2: "0.20–0.40 mm (0.0079–0.0157 in)",
        f8: "0.15–0.3 mm (0.006–0.012 in)",
      },
      {
        label: { es: "Abertura del segmento, rascador", en: "Piston ring end gap, oil" },
        r2: "0.20–0.40 mm (0.0079–0.0157 in)",
        f8: "0.3–0.9 mm (0.012–0.035 in)",
      },
      {
        label: { es: "Abertura del segmento (desgaste)", en: "Piston ring end gap, wear limit" },
        value: "1.0 mm (0.039 in)",
      },
      {
        label: { es: "Diámetro del pasador del pistón", en: "Piston pin diameter" },
        r2: "24.994–25.000 mm (0.9840–0.9843 in)",
        f8: "21.974–21.980 mm (0.8651–0.8654 in)",
      },
    ],
  },
  {
    id: "torques-engine",
    group: "engine",
    title: { es: "Pares de apriete — motor", en: "Tightening torques — engine" },
    split: true,
    sourcePage: 411,
    rows: [
      {
        label: { es: "Pernos de culata", en: "Cylinder head bolts" },
        r2: {
          es: "Par inicial 3 kg·m, luego apretar cada perno 90° + 90°",
          en: "Initial torque 3 kg·m, then tighten each bolt 90° + 90° more",
        },
        f8: "8.2–8.8 kg·m (59–63 ft·lb)",
      },
      {
        label: { es: "Tensor", en: "Tensioner" },
        r2: "3.2–4.7 kg·m (23–34 ft·lb)",
        f8: "2.0–3.5 kg·m (14–25 ft·lb)",
      },
      {
        label: { es: "Cubierta de correa (inferior)", en: "Timing belt cover (lower)" },
        r2: "0.7–1.0 kg·m (5–7 ft·lb)",
        f8: "0.7–1.0 kg·m (5–7 ft·lb)",
      },
      {
        label: { es: "Cubierta de correa (superior)", en: "Timing belt cover (upper)" },
        f8: "0.8–1.2 kg·m (5.8–8.6 ft·lb)",
      },
      {
        label: { es: "Polea del cigüeñal", en: "Crankshaft pulley" },
        r2: "2.3–3.3 kg·m (17–24 ft·lb)",
        f8: "1.25–1.75 kg·m (9–12 ft·lb)",
      },
      {
        label: { es: "Sombreretes del árbol de levas", en: "Camshaft caps" },
        r2: "2.0–2.7 kg·m (15–20 ft·lb)",
        f8: "1.8–2.7 kg·m (13–19 ft·lb)",
      },
      {
        label: { es: "Sombreretes de biela", en: "Connecting rod bearing caps" },
        r2: "7.0–7.5 kg·m (51–54 ft·lb)",
        f8: "6.6–7.0 kg·m (48–51 ft·lb)",
      },
      {
        label: { es: "Conjunto de la cubierta trasera", en: "Rear cover assembly" },
        r2: "0.7–1.0 kg·m (5–7 ft·lb)",
        f8: "0.8–1.2 kg·m (5.8–8.6 ft·lb)",
      },
      {
        label: { es: "Bomba de aceite, M8", en: "Oil pump assembly, M8" },
        r2: "1.6–2.3 kg·m (12–17 ft·lb)",
        f8: "1.9–3.1 kg·m (13–22 ft·lb)",
      },
      {
        label: { es: "Bomba de aceite, M10", en: "Oil pump assembly, M10" },
        r2: "3.2–4.7 kg·m (23–34 ft·lb)",
        f8: "3.8–5.3 kg·m (27–38 ft·lb)",
      },
      {
        label: { es: "Colador de aceite", en: "Oil strainer" },
        r2: "0.7–1.0 kg·m (5–7 ft·lb)",
        f8: "0.8–1.2 kg·m (5.8–8.6 ft·lb)",
      },
      {
        label: { es: "Cárter de aceite", en: "Oil pan" },
        r2: "0.7–1.0 kg·m (5–7 ft·lb)",
        f8: "0.7–1.2 kg·m (5–8.6 ft·lb)",
      },
      {
        label: { es: "Placa final", en: "End plate" },
        r2: "1.6–2.3 kg·m (12–17 ft·lb)",
        f8: "1.9–3.1 kg·m (14–22 ft·lb)",
      },
      {
        label: { es: "Polea de la correa de distribución", en: "Timing belt pulley" },
        value: "16–17 kg·m (116–123 ft·lb)",
      },
      {
        label: { es: "Interruptor de presión de aceite", en: "Oil pressure switch" },
        r2: "1.2–1.8 kg·m (9–13 ft·lb)",
        f8: "1.2–1.8 kg·m (8.6–13 ft·lb)",
      },
      {
        label: { es: "Bomba de agua", en: "Water pump" },
        r2: "3.2–4.7 kg·m (23–24 ft·lb)",
        f8: "1.9–2.6 kg·m (14–19 ft·lb)",
      },
      {
        label: { es: "Polea del árbol de levas", en: "Camshaft pulley" },
        r2: "5.6–6.6 kg·m (41–48 ft·lb)",
        f8: "4.8–6.6 kg·m (35–48 ft·lb)",
      },
      {
        label: { es: "Polea de la bomba de inyección", en: "Injection pump pulley" },
        r2: "6.0–7.0 kg·m (43–52 ft·lb)",
      },
    ],
  },
  {
    id: "lubrication",
    group: "engine",
    title: { es: "Sistema de lubricación", en: "Lubricating system" },
    split: true,
    sourcePage: 411,
    rows: [
      {
        label: { es: "Método de lubricación", en: "Lubricating method" },
        value: { es: "A presión", en: "Force-fed type" },
      },
      {
        label: { es: "Tipo de bomba de aceite", en: "Oil pump type" },
        value: { es: "Engranajes internos", en: "Inner gear type" },
      },
      {
        label: { es: "Presión de aceite a 3.000 rpm", en: "Oil pressure at 3,000 rpm" },
        r2: "4.1–4.9 kg/cm² (58–70 lb/in²)",
        f8: "3.0–4.0 kg/cm² (50–64 lb/in²)",
      },
      {
        label: {
          es: "Holgura diente exterior-creciente (estándar)",
          en: "Outer gear tooth tip and crescent clearance (standard)",
        },
        r2: "0.06–0.23 mm (0.0024–0.0091 in)",
        f8: "0.20–0.32 mm (0.0078–0.0126 in)",
      },
      {
        label: {
          es: "Holgura diente exterior-creciente (límite)",
          en: "Outer gear tooth tip and crescent clearance (limit)",
        },
        r2: "0.35 mm (0.0137 in)",
      },
      {
        label: {
          es: "Holgura diente interior-creciente (estándar)",
          en: "Inner gear tooth tip and crescent clearance (standard)",
        },
        r2: "0.10–0.21 mm (0.0039–0.0083 in)",
        f8: "0.267–0.38 mm (0.0105–0.015 in)",
      },
      {
        label: {
          es: "Holgura diente interior-creciente (límite)",
          en: "Inner gear tooth tip and crescent clearance (limit)",
        },
        r2: "0.35 mm (0.0137 in)",
        f8: "0.40 mm (0.016 in)",
      },
      {
        label: { es: "Holgura lateral (estándar)", en: "Side clearance (standard)" },
        r2: "0.03–0.09 mm (0.0012–0.0035 in)",
        f8: "0.03–0.063 mm (0.0012–0.0025 in)",
      },
      {
        label: { es: "Holgura lateral (límite)", en: "Side clearance (limit)" },
        r2: "0.15 mm (0.006 in)",
        f8: "0.10 mm (0.004 in)",
      },
      {
        label: {
          es: "Holgura eje-cuerpo de bomba (estándar)",
          en: "Pump shaft and body clearance (standard)",
        },
        r2: "0.06–0.15 mm (0.0024–0.0059 in)",
        f8: "0.09–0.184 mm (0.0035–0.0072 in)",
      },
      {
        label: {
          es: "Holgura eje-cuerpo de bomba (límite)",
          en: "Pump shaft and body clearance (limit)",
        },
        r2: "0.20 mm (0.0078 in)",
      },
      {
        label: { es: "Tipo de filtro de aceite", en: "Oil filter type" },
        value: { es: "Flujo total, papel", en: "Full flow, paper filter" },
      },
      {
        label: { es: "Capacidad total de aceite", en: "Total oil capacity" },
        r2: "6.4 L (6.76 US qt, 5.63 Imp qt)",
        f8: "4.6 L (4.86 US qt, 4.05 Imp qt)",
      },
      {
        label: { es: "Capacidad del cárter", en: "Oil pan capacity" },
        r2: "5.0 L (5.28 US qt, 4.40 Imp qt)",
        f8: "3.8 L (4.01 US qt, 3.34 Imp qt)",
      },
      {
        label: { es: "Capacidad del filtro", en: "Oil filter capacity" },
        r2: "0.4 L (0.42 US qt, 0.35 Imp qt)",
        f8: "0.3 L (0.32 US qt, 0.26 Imp qt)",
      },
      {
        label: {
          es: "Presión de activación del testigo de aceite",
          en: "Oil warning lamp activation pressure",
        },
        value: "0.3 kg/cm² (4.3 lb/in²)",
      },
      {
        label: { es: "Tipo de enfriador de aceite", en: "Oil cooler type" },
        value: { es: "Refrigerado por agua", en: "Water cooled" },
      },
      {
        label: { es: "Clasificación del aceite de motor", en: "Engine oil classification" },
        r2: "API Service CC, CD",
        f8: "API Service SE, SF",
      },
      {
        label: { es: "Par de apriete, filtro de aceite", en: "Tightening torque, oil filter" },
        value: { es: "A mano + 1/4 de vuelta", en: "By hand + 1/4 turn" },
      },
      {
        label: { es: "Par de apriete, cárter", en: "Tightening torque, oil pan" },
        r2: "0.9–1.2 kg·m (6.4–8.6 ft·lb)",
        f8: "0.7–1.2 kg·m (5–9 ft·lb)",
      },
      {
        label: { es: "Par de apriete, bomba de aceite M8", en: "Tightening torque, oil pump M8" },
        r2: "1.6–2.3 kg·m (11.4–16.4 ft·lb)",
        f8: "1.9–2.6 kg·m (13.7–18.8 ft·lb)",
      },
      {
        label: { es: "Par de apriete, bomba de aceite M10", en: "Tightening torque, oil pump M10" },
        r2: "3.2–4.7 kg·m (22.8–33.6 ft·lb)",
        f8: "3.8–5.3 kg·m (27.5–38 ft·lb)",
      },
      {
        label: {
          es: "Par de apriete, interruptor de presión de aceite",
          en: "Tightening torque, oil pressure switch",
        },
        r2: "1.2–1.8 kg·m (8.6–12.9 ft·lb)",
      },
    ],
  },
  {
    id: "cooling",
    group: "engine",
    title: { es: "Sistema de refrigeración", en: "Cooling system" },
    split: true,
    sourcePage: 412,
    rows: [
      {
        label: {
          es: "Tensión de correa, nueva (10 kg)",
          en: "Fan belt tension, new (10 kg force)",
        },
        r2: "9–11 mm (0.35–0.43 in)",
        f8: "6–8 mm (0.24–0.31 in)",
      },
      {
        label: {
          es: "Tensión de correa, usada (10 kg)",
          en: "Fan belt tension, used (10 kg force)",
        },
        r2: "10–12 mm (0.39–0.47 in)",
        f8: "10–12 mm (0.39–0.47 in)",
      },
      {
        label: { es: "Tipo de ventilador", en: "Fan type" },
        r2: { es: "Termomodulado", en: "Thermomodulated" },
        f8: { es: "Eléctrico", en: "Electric" },
      },
      {
        label: { es: "Número de palas", en: "Number of blades" },
        r2: "8",
        f8: "4",
      },
      {
        label: { es: "Diámetro exterior del ventilador", en: "Fan outer diameter" },
        r2: "380 mm (15.0 in)",
        f8: "300 mm (11.8 in)",
      },
      {
        label: {
          es: "Temperatura de apertura del termostato",
          en: "Thermostat opening temperature",
        },
        r2: "82 ± 1.5 °C (179.6 ± 2.7 °F)",
        f8: "82 °C (179.6 °F)",
      },
      {
        label: { es: "Temperatura de apertura total", en: "Thermostat full-open temperature" },
        value: "95 °C (203 °F)",
      },
      {
        label: { es: "Carrera de apertura total", en: "Thermostat full-open lift" },
        value: { es: "8.5 mm (0.34 in) o más", en: "8.5 mm (0.34 in) or more" },
      },
      {
        label: { es: "Tipo de bomba de agua", en: "Water pump type" },
        value: {
          es: "Centrífuga, accionada por correa de distribución",
          en: "Centrifugal, timing belt driven",
        },
      },
      {
        label: { es: "Tipo de radiador", en: "Radiator type" },
        value: { es: "Corrugado", en: "Corrugated" },
      },
      {
        label: { es: "Presión de apertura del tapón", en: "Radiator cap valve opening pressure" },
        r2: "0.9 ± 0.15 kg/cm² (12.8 ± 2.13 lb/in²)",
        f8: "0.75–1.05 kg/cm² (10.7–14.9 lb/in²)",
      },
      {
        label: { es: "Método de refrigeración", en: "Cooling method" },
        value: { es: "Refrigeración líquida", en: "Water-cooled" },
      },
      {
        label: {
          es: "Capacidad de refrigerante, con calefactor",
          en: "Coolant capacity, with heater",
        },
        r2: "9.0 L (9.5 US qt, 7.9 Imp qt)",
        f8: "7.0 L (7.4 US qt, 6.1 Imp qt)",
      },
      {
        label: {
          es: "Capacidad de refrigerante, sin calefactor",
          en: "Coolant capacity, without heater",
        },
        r2: "8.5 L (9.0 US qt, 7.5 Imp qt)",
      },
      {
        label: { es: "Nivel de refrigerante", en: "Cooling water level" },
        value: { es: "Entre FULL y LOW", en: "Between FULL and LOW" },
      },
      {
        label: {
          es: "Anticongelante, protección hasta -16 °C",
          en: "Antifreeze protection above -16 °C (3 °F)",
        },
        value: "1.054",
      },
      {
        label: {
          es: "Anticongelante, protección hasta -26 °C",
          en: "Antifreeze protection above -26 °C (-15 °F)",
        },
        value: "1.066",
      },
      {
        label: {
          es: "Anticongelante, protección hasta -40 °C",
          en: "Antifreeze protection above -40 °C (-40 °F)",
        },
        value: "1.078",
      },
    ],
  },
  {
    id: "fuel",
    group: "engine",
    title: { es: "Sistema de combustible", en: "Fuel system" },
    split: true,
    sourcePage: 412,
    rows: [
      {
        label: { es: "Ralentí", en: "Idle speed" },
        r2: "700–750 rpm",
        f8: "750–800 rpm",
      },
      {
        label: { es: "Ralentí acelerado (A/C conectado)", en: "Idle-up speed (A/C switch on)" },
        r2: "800 ± 25 rpm",
      },
      {
        label: { es: "Tipo de bomba de inyección", en: "Injection pump type" },
        r2: { es: "Tipo VE", en: "VE type" },
      },
      {
        label: { es: "Diámetro del émbolo", en: "Plunger diameter" },
        r2: "8.0 mm (0.315 in)",
      },
      {
        label: { es: "Levantamiento de leva", en: "Cam lift" },
        r2: "2.2 mm (0.09 in)",
      },
      {
        label: { es: "Gobernador", en: "Governor" },
        r2: {
          es: "Gobernador de velocidad semi-variable",
          en: "Half-variable speed governor",
        },
      },
      {
        label: { es: "Avance de inyección", en: "Injection timing" },
        r2: "2° ATDC",
      },
      {
        label: { es: "Tipo de inyector", en: "Injection nozzle type" },
        r2: { es: "Tipo estrangulador", en: "Throttle type" },
      },
      {
        label: { es: "Número y diámetro de toberas", en: "Number of nozzles and diameter" },
        r2: "1 × 1.0 mm (0.039 in)",
      },
      {
        label: { es: "Presión de inyección", en: "Injection pressure" },
        r2: "135 kg/cm² (1,920 lb/in²)",
      },
      {
        label: { es: "Juego libre del cable del acelerador", en: "Accelerator cable free play" },
        r2: "1–3 mm (0.04–0.12 in)",
      },
      {
        label: { es: "Capacidad del depósito", en: "Fuel tank capacity" },
        value: "65 L (68.7 US qt, 57.2 Imp qt)",
      },
      {
        label: { es: "Tipo de filtro de combustible", en: "Fuel filter type" },
        r2: { es: "Cartucho con detector de agua", en: "Cartridge, water detector" },
        f8: { es: "Papel filtrante", en: "Filter paper" },
      },
      {
        label: { es: "Elemento del filtro de aire", en: "Air cleaner element type" },
        value: { es: "Elemento de papel filtrante", en: "Filter paper element" },
      },
      {
        label: { es: "Tipo de bomba de combustible", en: "Fuel pump type" },
        f8: { es: "Tipo diafragma", en: "Diaphragm type" },
      },
      {
        label: { es: "Presión de la bomba de combustible", en: "Fuel pump injection pressure" },
        f8: "0.23–0.30 kg/cm² (2.84–4.26 lb/in²)",
      },
      {
        label: { es: "Caudal de la bomba de combustible", en: "Fuel pump injection rate" },
        f8: "860 cc/min (56.7 cu in/min) at idle",
      },
      {
        label: { es: "Conmutación del filtro de aire", en: "Air cleaner switching" },
        f8: { es: "Tipo diafragma", en: "Diaphragm type" },
      },
    ],
  },
  {
    id: "electrical",
    group: "engine",
    title: { es: "Sistema eléctrico del motor", en: "Engine electrical system" },
    split: true,
    sourcePage: 413,
    rows: [
      { label: { es: "Tipo de batería", en: "Battery type" }, r2: "PT 85", f8: "MF 60" },
      {
        label: { es: "Capacidad de batería (20 h)", en: "Battery capacity (20 hour rate)" },
        r2: "85 Ah",
        f8: "60 Ah",
      },
      {
        label: { es: "Nivel del electrolito", en: "Level of electrolyte" },
        value: { es: 'Entre "Upper" y "Lower"', en: 'Between "Upper" and "Lower"' },
      },
      {
        label: {
          es: "Densidad para recarga (25 °C)",
          en: "Specific gravity, recharge (25 °C / 77 °F)",
        },
        value: "1.20",
      },
      {
        label: { es: "Densidad, totalmente cargada", en: "Specific gravity, fully charged" },
        value: "1.25–1.27",
      },
      {
        label: { es: "Tipo de alternador", en: "Alternator type" },
        value: { es: "Alternador", en: "Alternating" },
      },
      {
        label: { es: "Tensión / capacidad del alternador", en: "Alternator voltage capacity" },
        value: "12 V / 55 A",
      },
      {
        label: { es: "Tensión regulada", en: "Regulated voltage" },
        value: "14.7 ± 0.3 V",
      },
      {
        label: { es: "Corriente sin carga", en: "No-load test current" },
        value: "5 A or less",
      },
      {
        label: { es: "Velocidad sin carga (motor)", en: "No-load test speed (engine)" },
        value: "2,000–2,500 rpm",
      },
      { label: { es: "Número de escobillas", en: "Number of brushes" }, value: "2" },
      {
        label: { es: "Límite de desgaste de escobillas", en: "Brush wear limit" },
        value: "6.5 mm (0.26 in)",
      },
      {
        label: { es: "Tipo de motor de arranque", en: "Starting motor type" },
        value: {
          es: "Tipo electromagnético de empuje",
          en: "Electromagnetic push-in type",
        },
      },
      {
        label: { es: "Tensión del motor de arranque", en: "Starting motor voltage" },
        value: "12 V",
      },
      {
        label: { es: "Potencia del motor de arranque", en: "Starting motor output" },
        r2: "2.0 kW",
        f8: "0.9 kW",
      },
      {
        label: { es: "Tipo de bujía de incandescencia", en: "Glow plug type" },
        r2: { es: "Blindada", en: "Sheathed" },
      },
      {
        label: { es: "Tensión / corriente de incandescencia", en: "Glow plug voltage / current" },
        r2: "10.5 V / 16.5 A",
      },
      { label: { es: "Salida de la bobina", en: "Ignition coil output" }, f8: "12 V" },
      { label: { es: "Tipo de bujía", en: "Spark plug type" }, f8: "BP5ES" },
      {
        label: { es: "Separación de electrodos", en: "Spark plug gap" },
        f8: "0.75–0.85 mm (0.029–0.033 in)",
      },
      {
        label: { es: "Tipo de distribuidor", en: "Distributor breaker type" },
        f8: { es: "Sin contactos (igniter)", en: "Contactless (igniter)" },
      },
    ],
  },
  {
    id: "clutch",
    group: "drivetrain",
    title: { es: "Embrague", en: "Clutch" },
    split: false,
    sourcePage: 414,
    rows: [
      {
        label: { es: "Mando del embrague", en: "Clutch control" },
        value: { es: "Hidráulico", en: "Hydraulic type" },
      },
      {
        label: { es: "Tipo de pedal", en: "Pedal type" },
        value: { es: "Tipo colgante", en: "Hanger type" },
      },
      { label: { es: "Relación del pedal", en: "Pedal ratio" }, value: "6.3" },
      { label: { es: "Altura del pedal", en: "Pedal height" }, value: "200.5 mm (7.89 in)" },
      {
        label: { es: "Carrera total del pedal", en: "Pedal full stroke" },
        value: "144 mm (5.7 in)",
      },
      {
        label: { es: "Juego libre del pedal", en: "Pedal free play" },
        value: "7.8–14.3 mm (0.3–0.6 in)",
      },
      {
        label: {
          es: "Distancia al suelo con embrague desembragado",
          en: "Distance to floor, clutch fully disengaged",
        },
        value: { es: "60 mm (2.4 in) o más", en: "60 mm (2.4 in) or more" },
      },
      {
        label: { es: "Tipo de disco", en: "Clutch disc type" },
        value: { es: "Monodisco en seco", en: "Single dry plate" },
      },
      {
        label: { es: "Límite de deformación del disco", en: "Clutch disc deflection limit" },
        value: "0.7 mm (0.027 in)",
      },
      {
        label: { es: "Límite de desgaste del disco", en: "Clutch disc wear limit" },
        value: {
          es: "0.3 mm (0.012 in) desde la cabeza del remache",
          en: "0.3 mm (0.012 in) from rivet head",
        },
      },
      {
        label: {
          es: "Dimensiones del disco, lado volante",
          en: "Clutch disc dimensions, flywheel side",
        },
        value: "225 × 150 × 3.5 mm (8.86 × 5.91 × 0.14 in)",
      },
      {
        label: {
          es: "Dimensiones del disco, lado plato de presión",
          en: "Clutch disc dimensions, pressure plate side",
        },
        value: "225 × 150 × 4.1 mm (8.86 × 5.91 × 0.16 in)",
      },
      {
        label: {
          es: "Diámetro interior del cilindro maestro",
          en: "Master cylinder inner diameter",
        },
        value: "15.9 mm (5/8 in)",
      },
      {
        label: {
          es: "Diámetro interior del cilindro receptor",
          en: "Release cylinder inner diameter",
        },
        value: "19.1 mm (3/4 in)",
      },
    ],
  },
  {
    id: "transmission",
    group: "drivetrain",
    title: { es: "Transmisión", en: "Transmission" },
    split: false,
    sourcePage: 414,
    note: {
      es: "Las relaciones de las cinco marchas y la reversa son comunes a ambos motores. La diferencia de régimen y velocidad real proviene del grupo final: 4,333:1 en el diésel R2 y 4,875:1 en el gasolina F8 (ver «Eje trasero / diferencial»).",
      en: "The five forward gear and reverse ratios are common to both engines. The difference in engine speed and actual road speed comes from the final drive: 4.333:1 on the R2 diesel and 4.875:1 on the F8 gasoline (see “Rear axle / differential”).",
    },
    rows: [
      {
        label: { es: "Tipo de transmisión", en: "Transmission type" },
        value: { es: "5 velocidades", en: "5-speed" },
      },
      {
        label: { es: "Posición de la palanca", en: "Change lever position" },
        value: { es: "Palanca en el suelo", en: "Floor shift" },
      },
      {
        label: { es: "Sistema de sincronización", en: "Synchromesh system" },
        value: {
          es: "Marchas adelante: sincronizadas · Reversa: engrane deslizante",
          en: "Forward: synchromesh · Reverse: sliding mesh",
        },
      },
      {
        label: { es: "1ª velocidad (transfer indirecta)", en: "First gear (indirect transfer)" },
        value: "3.565",
      },
      {
        label: { es: "1ª velocidad (transfer directa)", en: "First gear (direct transfer)" },
        value: "3.563",
      },
      { label: { es: "2ª velocidad", en: "Second gear" }, value: "2.212" },
      { label: { es: "3ª velocidad", en: "Third gear" }, value: "1.435" },
      { label: { es: "4ª velocidad", en: "Fourth gear" }, value: "1.000" },
      { label: { es: "5ª velocidad", en: "Fifth gear" }, value: "0.894" },
      { label: { es: "Reversa", en: "Reverse" }, value: "3.854" },
      {
        label: { es: "Aceite especificado", en: "Specified oil" },
        value: {
          es: "API GL-4 o GL-5 · SAE 80 por debajo de -18 °C (0 °F) · SAE 90 por encima de -18 °C (0 °F) · todo el año SAE 80W-90",
          en: "API GL-4 or GL-5 · SAE 80 below -18 °C (0 °F) · SAE 90 above -18 °C (0 °F) · all-season SAE 80W-90",
        },
      },
      {
        label: { es: "Capacidad de aceite", en: "Oil capacity" },
        value: "1.9 L (2.01 US qt, 1.67 Imp qt)",
      },
      {
        label: { es: "Límite de flexión del eje principal", en: "Main shaft deflection limit" },
        value: "0.03 mm (0.001 in)",
      },
      {
        label: {
          es: "Holgura anillo sincronizador-cara del engranaje (estándar)",
          en: "Synchronizer ring to gear flank clearance (standard)",
        },
        value: "1.5 mm (0.059 in)",
      },
      {
        label: {
          es: "Holgura anillo sincronizador-cara del engranaje (límite)",
          en: "Synchronizer ring to gear flank clearance (limit)",
        },
        value: "0.8 mm (0.031 in)",
      },
      {
        label: {
          es: "Holgura cubo-horquilla (estándar)",
          en: "Hub sleeve to release fork clearance (standard)",
        },
        value: "0.2–0.3 mm (0.008–0.012 in)",
      },
      {
        label: {
          es: "Holgura cubo-horquilla (límite)",
          en: "Hub sleeve to release fork clearance (limit)",
        },
        value: "0.8 mm (0.031 in)",
      },
      {
        label: {
          es: "Holgura carcasa embrague-cojinete eje principal",
          en: "Clutch housing to main shaft bearing clearance",
        },
        value: "0–0.1 mm (0–0.004 in)",
      },
      {
        label: {
          es: "Arandelas de ajuste (carcasa embrague)",
          en: "Adjustment shims (clutch housing)",
        },
        value: "0.1 / 0.15 / 0.3 mm (0.004 / 0.006 / 0.012 in)",
      },
      {
        label: {
          es: "Holgura caja de transmisión-cojinete eje principal",
          en: "Transmission case to main shaft bearing clearance",
        },
        value: "0.05–0.1 mm (0.002–0.004 in)",
      },
      {
        label: {
          es: "Holgura cojinete-cubierta (eje secundario)",
          en: "Countershaft bearing to cover clearance",
        },
        value: "0–0.1 mm (0–0.004 in)",
      },
      {
        label: {
          es: "Arandelas de ajuste (eje secundario)",
          en: "Adjustment shims (countershaft)",
        },
        value: "0.1 / 0.15 mm (0.004 / 0.006 in)",
      },
      {
        label: {
          es: "Holgura cubierta trasera-cojinete (transfer)",
          en: "Transfer rear cover to bearing clearance",
        },
        value: "0.05–0.1 mm (0.002–0.004 in)",
      },
    ],
  },
  {
    id: "propshaft",
    group: "drivetrain",
    title: { es: "Eje de transmisión (cardán)", en: "Propeller shaft" },
    split: false,
    sourcePage: 415,
    rows: [
      {
        label: { es: "Longitud delantera", en: "Front length" },
        value: "621–626 mm (24.4–24.6 in)",
      },
      {
        label: { es: "Longitud trasera", en: "Rear length" },
        value: "647–659 mm (25.5–25.9 in)",
      },
      { label: { es: "Límite de flexión", en: "Deflection limit" }, value: "0.4 mm (0.0157 in)" },
      {
        label: {
          es: "Par de arranque de la junta universal",
          en: "Universal joint starting torque",
        },
        value: {
          es: "Delantero 3–8 kg·cm (0.22–0.58 ft·lb) · Trasero 5–14 kg·cm (0.36–1.01 ft·lb)",
          en: "Front 3–8 kg·cm (0.22–0.58 ft·lb) · Rear 5–14 kg·cm (0.36–1.01 ft·lb)",
        },
      },
      {
        label: {
          es: "Arandelas de ajuste (anillo elástico)",
          en: "Starting torque adjustment snap ring",
        },
        value: "1.22 / 1.24 / 1.26 / 1.28 / 1.30 / 1.32 / 1.34 / 1.36 / 1.38 mm",
      },
      {
        label: {
          es: "Holgura de la cruceta (límite)",
          en: "Universal joint spider backlash limit",
        },
        value: "0.5 mm (0.020 in)",
      },
      {
        label: {
          es: "Par de apriete, horquilla y diferencial",
          en: "Tightening torque, yoke and differential",
        },
        value: "3.3–4.4 kg·m (23.8–31.8 ft·lb)",
      },
      {
        label: { es: "Engranaje reductor", en: "Reduction gear" },
        value: { es: "Engranaje hipoide", en: "Hypoid gear" },
      },
      {
        label: { es: "Engranaje del diferencial", en: "Differential gear" },
        value: { es: "Engranaje cónico recto", en: "Straight bevel gear" },
      },
    ],
  },
  {
    id: "rear-axle",
    group: "drivetrain",
    title: { es: "Eje trasero / diferencial", en: "Rear axle / differential" },
    split: true,
    sourcePage: 416,
    note: {
      es: "El manual de taller indica 4,875:1 para ambos motores, pero el catálogo de piezas (secciones 2600 y 2710) monta un grupo final distinto: 4,333:1 (corona 39 / piñón 9) en el diésel R2 y 4,875:1 (corona 39 / piñón 8) en el gasolina F8. El diferencial delantero usa el mismo grupo final que el trasero.",
      en: "The workshop manual lists 4.875:1 for both engines, but the parts catalog (sections 2600 and 2710) fits a different final gear set: 4.333:1 (39-tooth ring / 9-tooth pinion) on the R2 diesel and 4.875:1 (39-tooth ring / 8-tooth pinion) on the F8 gasoline. The front differential uses the same final gear set as the rear.",
    },
    rows: [
      {
        label: { es: "Relación de reducción", en: "Reduction ratio" },
        r2: "4.333",
        f8: "4.875",
      },
      { label: { es: "Dientes de la corona", en: "Ring gear teeth" }, value: "39" },
      {
        label: { es: "Dientes del piñón de ataque", en: "Drive pinion teeth" },
        r2: "9",
        f8: "8",
      },
      { label: { es: "Clase de aceite", en: "Oil class" }, value: "GL-5, SAE 80W" },
      {
        label: { es: "Capacidad", en: "Capacity" },
        value: { es: "Hasta el nivel del tapón", en: "Keep on the horizontal of oil plug" },
      },
      {
        label: {
          es: "Holgura piñón-corona (estándar)",
          en: "Drive pinion and ring gear backlash (standard)",
        },
        value: "0.09–0.11 mm (0.0035–0.0043 in)",
      },
      {
        label: {
          es: "Holgura piñón-corona (mínima)",
          en: "Drive pinion and ring gear backlash (minimum)",
        },
        value: { es: "Más de 0.05 mm (0.002 in)", en: "More than 0.05 mm (0.002 in)" },
      },
      {
        label: { es: "Variación admisible", en: "Allowable variation" },
        value: { es: "Menos de 0.07 mm (0.0028 in)", en: "Less than 0.07 mm (0.0028 in)" },
      },
      {
        label: { es: "Brida acompañante", en: "Companion flange" },
        value: "1.9–3.6 kg·m (13.6–25.7 ft·lb)",
      },
      { label: { es: "Corona", en: "Ring gear" }, value: "7.5–8.5 kg·m (53.6–60.7 ft·lb)" },
      {
        label: { es: "Sombrerete del cojinete", en: "Bearing cap" },
        value: "3.8–5.3 kg·m (27.1–37.8 ft·lb)",
      },
      {
        label: { es: "Disco y buje de rueda", en: "Disc plate and wheel hub" },
        value: "5.5–6.8 kg·m (39.3–48.6 ft·lb)",
      },
      {
        label: { es: "Mangueta y husillo", en: "Knuckle and spindle" },
        value: "3.5–5.5 kg·m (25–39.3 ft·lb)",
      },
      {
        label: { es: "Pinza y latiguillo", en: "Caliper and flexible hose" },
        value: "2.2–3.0 kg·m (15.7–21.4 ft·lb)",
      },
      {
        label: { es: "Pinza y adaptador", en: "Caliper and adapter" },
        value: "5.5–6.5 kg·m (39.3–46.4 ft·lb)",
      },
      {
        label: { es: "Tuerca de la placa trasera", en: "Backplate tightening nut" },
        value: "5.0–5.5 kg·m (35.7–39.3 ft·lb)",
      },
      { label: { es: "Placa de ajuste", en: "Set plate" }, value: "0.8–1.4 kg·m (5.7–10 ft·lb)" },
      {
        label: { es: "Tuerca del piñón de ataque", en: "Drive pinion lock nut" },
        value: "13–18 kg·m (92.8–128.5 ft·lb)",
      },
      {
        label: { es: "Portadiferencial", en: "Differential carrier" },
        value: "2.3–2.7 kg·m (16.4–19.3 ft·lb)",
      },
      {
        label: { es: "Perno rey y mangueta", en: "King pin and knuckle" },
        value: "3.5–4.2 kg·m (25–30 ft·lb)",
      },
      {
        label: { es: "Buje de rueda libre", en: "Free-wheel hub and hub" },
        value: "5.5–6.5 kg·m (39.3–46.4 ft·lb)",
      },
    ],
  },
  {
    id: "steering",
    group: "chassis",
    title: { es: "Dirección", en: "Steering" },
    split: false,
    sourcePage: 416,
    rows: [
      {
        label: { es: "Diámetro exterior del volante", en: "Steering wheel outer diameter" },
        value: "390 mm (15.35 in)",
      },
      {
        label: { es: "De tope a tope", en: "Lock to lock" },
        value: {
          es: "Manual 3.8 · Dirección asistida 2.5",
          en: "Manual 3.8 · Power steering 2.5",
        },
      },
      {
        label: { es: "Tipo de caja de dirección", en: "Gear type" },
        value: { es: "Sistema de tuerca de bolas", en: "Ball nut system" },
      },
      {
        label: { es: "Relación de dirección", en: "Gear ratio" },
        value: "21–25 : 1 (STD, DLX) · 15.2 : 1 (GT)",
      },
      {
        label: { es: "Tipo de asistencia (GT)", en: "Booster type (GT)" },
        value: { es: "Sistema integral", en: "Integral system" },
      },
      {
        label: { es: "Aceite utilizado", en: "Oil used" },
        value: "DEXRON II, FORD TYPE (M2C33F)",
      },
      {
        label: { es: "Capacidad de aceite", en: "Oil capacity" },
        value: "2 L (2.11 US qt, 1.76 Imp qt)",
      },
      {
        label: { es: "Ángulo máximo de giro, interior", en: "Maximum steering angle, inner" },
        value: "29°",
      },
      {
        label: { es: "Ángulo máximo de giro, exterior", en: "Maximum steering angle, outer" },
        value: "27°",
      },
      { label: { es: "Convergencia (toe-in)", en: "Toe-in" }, value: "3 ± 3 mm (0.12 ± 0.12 in)" },
      {
        label: { es: "Caída (camber)", en: "Camber angle" },
        value: { es: "7° 30' (dirección asistida)", en: "7° 30' (power steering)" },
      },
      {
        label: { es: "Avance (caster)", en: "Caster angle" },
        value: { es: "6° (dirección manual)", en: "6° (manual)" },
      },
      { label: { es: "Inclinación del pivote", en: "King-pin angle" }, value: "8° 30' ± 30'" },
      {
        label: { es: "Esfuerzo en el volante", en: "Steering wheel effort" },
        value: {
          es: "0.5–2 kg (1.10–4.41 lb) durante un giro del volante",
          en: "0.5–2 kg (1.10–4.41 lb) during one turn of the steering wheel",
        },
      },
      {
        label: { es: "Tuerca del volante", en: "Steering wheel nut" },
        value: "4.0–5.0 kg·m (29–36 ft·lb)",
      },
      {
        label: { es: "Tuerca de la rótula axial", en: "Tie-rod end lock nut" },
        value: "9–12 kg·m (64–86 ft·lb)",
      },
      {
        label: { es: "Rótula axial y mangueta", en: "Tie-rod end and knuckle" },
        value: "7.0–8.0 kg·m (51–58 ft·lb)",
      },
      {
        label: { es: "Pernos de la caja de dirección", en: "Gear box bolts" },
        value: "7.0–8.0 kg·m (51–58 ft·lb)",
      },
      {
        label: { es: "Tuerca de la palanca de la pitman", en: "Pitman arm lock nut" },
        value: "21–25 kg·m (150–178 ft·lb)",
      },
      {
        label: { es: "Perno de la junta universal", en: "Universal joint bolt" },
        value: "2.2–2.7 kg·m (16–20 ft·lb)",
      },
      {
        label: { es: "Tuerca de la barra de arrastre", en: "Drag link nut" },
        value: "7.0–8.0 kg·m (51–58 ft·lb)",
      },
    ],
  },
  {
    id: "brakes",
    group: "chassis",
    title: { es: "Frenos", en: "Brakes" },
    split: false,
    sourcePage: 417,
    rows: [
      {
        label: { es: "Tipo de pedal", en: "Brake pedal type" },
        value: { es: "Suspendido", en: "Suspended" },
      },
      { label: { es: "Altura del pedal", en: "Pedal height" }, value: "211 mm (8.31 in)" },
      { label: { es: "Juego libre del pedal", en: "Pedal play" }, value: "7–9 mm (0.28–0.35 in)" },
      {
        label: { es: "Recorrido restante", en: "Remaining step-in distance" },
        value: { es: "74 mm (2.91 in) o más", en: "74 mm (2.91 in) or more" },
      },
      { label: { es: "Relación de palanca del pedal", en: "Pedal lever ratio" }, value: "5.02" },
      { label: { es: "Carrera máxima", en: "Maximum stroke" }, value: "162 mm (6.38 in)" },
      {
        label: {
          es: "Diámetro interior del cilindro maestro",
          en: "Master cylinder inner diameter",
        },
        value: "22.22 mm (0.875 in)",
      },
      {
        label: {
          es: "Holgura pistón-cilindro (estándar)",
          en: "Piston to cylinder clearance (standard)",
        },
        value: "0.04–0.125 mm (0.002–0.005 in)",
      },
      {
        label: {
          es: "Holgura pistón-cilindro (límite)",
          en: "Piston to cylinder clearance (limit)",
        },
        value: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Capacidad del depósito de reserva", en: "Reserve tank capacity" },
        value: "182 cc",
      },
      {
        label: { es: "Tipo de freno delantero", en: "Front brake type" },
        value: { es: "Disco (ventilado)", en: "Disc (ventilated)" },
      },
      {
        label: {
          es: "Diámetro interior del cilindro delantero",
          en: "Front caliper cylinder inner diameter",
        },
        value: "57.15 mm (2.25 in)",
      },
      {
        label: {
          es: "Dimensiones de pastillas (ancho × largo × espesor)",
          en: "Pad dimensions (width × length × thickness)",
        },
        value: "49.0 × 111 × 10.0 mm (1.93 × 4.37 × 0.39 in)",
      },
      {
        label: { es: "Límite de espesor de pastillas", en: "Pad thickness limit" },
        value: "1.0 mm (0.04 in)",
      },
      {
        label: {
          es: "Dimensiones del disco (diámetro × espesor)",
          en: "Disc plate dimension (diameter × thickness)",
        },
        value: "275 × 20 mm (10.83 × 0.79 in)",
      },
      {
        label: { es: "Límite de espesor del disco", en: "Disc plate thickness limit" },
        value: "18 mm (0.71 in)",
      },
      {
        label: { es: "Límite de alabeo del disco", en: "Disc plate deflection limit" },
        value: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Tipo de freno trasero", en: "Rear brake type" },
        value: { es: "Tambor", en: "Drum" },
      },
      {
        label: {
          es: "Diámetro interior del cilindro de rueda",
          en: "Wheel cylinder inner diameter",
        },
        value: "19.05 mm (0.75 in)",
      },
      {
        label: {
          es: "Dimensiones de zapatas (ancho × largo × espesor)",
          en: "Lining dimensions (width × length × thickness)",
        },
        value: "45 × 249.6 × 4.5 mm (1.77 × 9.83 × 0.18 in)",
      },
      {
        label: { es: "Límite de espesor de zapatas", en: "Lining thickness limit" },
        value: "1.0 mm (0.04 in)",
      },
      {
        label: {
          es: "Holgura pistón-cilindro trasero (estándar)",
          en: "Rear piston to cylinder clearance (standard)",
        },
        value: "0.040–0.073 mm (0.0016–0.0028 in)",
      },
      {
        label: {
          es: "Holgura pistón-cilindro trasero (límite)",
          en: "Rear piston to cylinder clearance (limit)",
        },
        value: "0.15 mm (0.006 in)",
      },
      {
        label: { es: "Freno de mano", en: "Parking brake" },
        value: {
          es: "8–12 muescas con 25 kg (55.1 lb) de fuerza",
          en: "8–12 notches with 25 kg (55.1 lb) force",
        },
      },
    ],
  },
  {
    id: "wheels",
    group: "chassis",
    title: { es: "Ruedas y neumáticos", en: "Wheels & tires" },
    split: false,
    sourcePage: 417,
    rows: [
      { label: { es: "Llanta delantera", en: "Front rim size" }, value: "6.00J–15" },
      {
        label: { es: "Neumático delantero", en: "Front tire size" },
        value: "195R15RF (STD.)",
      },
      {
        label: { es: "Presión delantera", en: "Front tire air pressure" },
        value: "1.8 kg/cm² (25.6 lb/in²)",
      },
      { label: { es: "Llanta trasera", en: "Rear rim size" }, value: "6.00J–15" },
      {
        label: { es: "Neumático trasero", en: "Rear tire size" },
        value: "P215/75R15 (GT, DLX)",
      },
      {
        label: { es: "Presión trasera", en: "Rear tire air pressure" },
        value: "1.8 kg/cm² (25.6 lb/in²)",
      },
    ],
  },
  {
    id: "suspension",
    group: "chassis",
    title: { es: "Suspensión", en: "Suspension" },
    split: false,
    sourcePage: 418,
    rows: [
      {
        label: { es: "Delantera — tipo de suspensión", en: "Front — suspension type" },
        value: { es: "Tipo eje rígido", en: "Axle type" },
      },
      {
        label: { es: "Delantera — tipo de muelle", en: "Front — spring type" },
        value: { es: "Ballesta semielíptica", en: "Semielliptic leaf spring" },
      },
      {
        label: { es: "Delantera — amortiguadores", en: "Front — shock-absorber type" },
        value: { es: "Cilíndricos, doble efecto", en: "Cylindrical, double acting" },
      },
      {
        label: { es: "Delantera — estabilizador", en: "Front — stabilizer type" },
        value: { es: "Tipo barra de torsión", en: "Torsion bar type" },
      },
      {
        label: { es: "Trasera — tipo de suspensión", en: "Rear — suspension type" },
        value: { es: "Tipo eje rígido", en: "Axle type" },
      },
      {
        label: { es: "Trasera — tipo de muelle", en: "Rear — spring type" },
        value: { es: "Ballesta semielíptica", en: "Semielliptic leaf spring" },
      },
      {
        label: { es: "Trasera — amortiguadores", en: "Rear — shock-absorber type" },
        value: { es: "Cilíndricos, doble efecto", en: "Cylindrical, double acting" },
      },
    ],
  },
  {
    id: "bulbs",
    group: "body",
    title: { es: "Sistema eléctrico de carrocería", en: "Body electrical system" },
    split: false,
    sourcePage: 418,
    rows: [
      { label: { es: "Faros (corto/largo)", en: "Headlights (Hi/Low)" }, value: "60/55 W" },
      { label: { es: "Intermitentes delanteros", en: "Turn signal lights, front" }, value: "21 W" },
      { label: { es: "Intermitentes laterales", en: "Turn signal lights, side" }, value: "5 W" },
      { label: { es: "Intermitentes traseros", en: "Turn signal lights, rear" }, value: "21 W" },
      { label: { es: "Luces de posición traseras", en: "Tail lights" }, value: "5 W" },
      { label: { es: "Luces de matrícula", en: "License plate lights" }, value: "5 W" },
      { label: { es: "Luces de freno", en: "Stop lights" }, value: "21 W" },
      { label: { es: "Luces de marcha atrás", en: "Back-up lights" }, value: "21 W" },
      { label: { es: "Luz interior (habitáculo)", en: "Interior lights (room)" }, value: "10 W" },
      {
        label: { es: "Luces de conducción de apagón", en: "Blackout driving lights" },
        value: "35 W",
      },
      { label: { es: "Luces de freno de apagón", en: "Blackout stop lights" }, value: "12 W" },
      { label: { es: "Luces de posición de apagón", en: "Blackout marker lights" }, value: "12 W" },
      { label: { es: "Luces antiniebla", en: "Fog lights" }, value: "35 W" },
      {
        label: {
          es: "Indicadores y testigos, intermitentes",
          en: "Indicator and warning lights, turn signals",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, luz larga",
          en: "Indicator and warning lights, high beam",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, presión de aceite",
          en: "Indicator and warning lights, oil pressure",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, batería",
          en: "Indicator and warning lights, battery",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, freno de mano",
          en: "Indicator and warning lights, parking brake",
        },
        value: "1.2 W",
      },
      {
        label: { es: "Indicadores y testigos, 4×4", en: "Indicator and warning lights, 4×4" },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, sedimentador",
          en: "Indicator and warning lights, sedimenter",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, calentadores",
          en: "Indicator and warning lights, glow",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, líquido de frenos",
          en: "Indicator and warning lights, brake fluid",
        },
        value: "1.2 W",
      },
      {
        label: {
          es: "Indicadores y testigos, nivel de refrigerante",
          en: "Indicator and warning lights, coolant level",
        },
        value: "1.2 W",
      },
      {
        label: { es: "Iluminación, calefactor", en: "Illumination lights, heater" },
        value: "3.4 W",
      },
      {
        label: { es: "Iluminación, cuadro", en: "Illumination lights, meter" },
        value: "1.2 × 4 W",
      },
      { label: { es: "Encendedor de cigarrillos", en: "Cigar lighter" }, value: "1.4 W" },
      { label: { es: "Radio", en: "Radio" }, value: "1.4 W" },
    ],
  },
];
