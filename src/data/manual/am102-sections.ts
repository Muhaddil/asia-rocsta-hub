import type { LocalizedString } from "@/data/types";

/**
 * Sections of the Asia Rocsta Workshop Manual (AM102, Dec 1994) as detected
 * from the scanned pages. `start`/`end` are zero-indexed physical PDF pages,
 * mapped from the printed page footers (e.g. "1A-8").
 */
export interface ManualSection {
  /** Section code printed in the manual, e.g. "1A" */
  code: string;
  title: LocalizedString;
  /** Whether the section only applies to one engine family */
  motor: "F8" | "R2" | "ambos";
  start: number;
  end: number;
}

export const AM102_SECTIONS: ManualSection[] = [
  {
    code: "0",
    title: { es: "Información general", en: "General information" },
    motor: "ambos",
    start: 5,
    end: 12,
  },
  {
    code: "1A",
    title: { es: "Motor diésel (R2)", en: "Engine, diesel (R2)" },
    motor: "R2",
    start: 13,
    end: 58,
  },
  {
    code: "1B",
    title: { es: "Motor gasolina (F8)", en: "Engine, gasoline (F8)" },
    motor: "F8",
    start: 59,
    end: 102,
  },
  {
    code: "2A",
    title: { es: "Sistema de lubricación (R2)", en: "Lubrication system (R2)" },
    motor: "R2",
    start: 103,
    end: 116,
  },
  {
    code: "2B",
    title: { es: "Sistema de lubricación (F8)", en: "Lubrication system (F8)" },
    motor: "F8",
    start: 117,
    end: 124,
  },
  {
    code: "3A",
    title: { es: "Sistema de refrigeración (R2)", en: "Cooling system (R2)" },
    motor: "R2",
    start: 125,
    end: 135,
  },
  {
    code: "3B",
    title: { es: "Sistema de refrigeración (F8)", en: "Cooling system (F8)" },
    motor: "F8",
    start: 136,
    end: 142,
  },
  {
    code: "4A",
    title: { es: "Combustible, admisión y escape (R2)", en: "Fuel, intake & exhaust (R2)" },
    motor: "R2",
    start: 143,
    end: 160,
  },
  {
    code: "4B",
    title: { es: "Combustible, admisión y escape (F8)", en: "Fuel, intake & exhaust (F8)" },
    motor: "F8",
    start: 161,
    end: 192,
  },
  {
    code: "5",
    title: { es: "Sistema eléctrico del motor", en: "Engine electrical system" },
    motor: "ambos",
    start: 193,
    end: 228,
  },
  { code: "6", title: { es: "Embrague", en: "Clutch" }, motor: "ambos", start: 229, end: 245 },
  {
    code: "7",
    title: { es: "Transmisión", en: "Transmission" },
    motor: "ambos",
    start: 246,
    end: 268,
  },
  {
    code: "8",
    title: { es: "Eje de transmisión (cardán)", en: "Propeller shaft" },
    motor: "ambos",
    start: 269,
    end: 276,
  },
  {
    code: "9",
    title: { es: "Ejes delantero y trasero", en: "Front & rear axles" },
    motor: "ambos",
    start: 277,
    end: 305,
  },
  { code: "10", title: { es: "Dirección", en: "Steering" }, motor: "ambos", start: 306, end: 324 },
  { code: "11", title: { es: "Frenos", en: "Brakes" }, motor: "ambos", start: 325, end: 352 },
  {
    code: "12",
    title: { es: "Ruedas y neumáticos", en: "Wheels & tires" },
    motor: "ambos",
    start: 353,
    end: 359,
  },
  {
    code: "13",
    title: { es: "Suspensión", en: "Suspension" },
    motor: "ambos",
    start: 360,
    end: 367,
  },
  { code: "14", title: { es: "Carrocería", en: "Body" }, motor: "ambos", start: 368, end: 387 },
  {
    code: "15",
    title: { es: "Sistema eléctrico de carrocería", en: "Body electrical system" },
    motor: "ambos",
    start: 388,
    end: 407,
  },
  {
    code: "22",
    title: { es: "Datos técnicos", en: "Technical data" },
    motor: "ambos",
    start: 408,
    end: 418,
  },
  {
    code: "23",
    title: { es: "Herramientas especiales", en: "Special tools" },
    motor: "ambos",
    start: 419,
    end: 424,
  },
];

export function sectionForPage(page: number): ManualSection | undefined {
  return AM102_SECTIONS.find((s) => page >= s.start && page <= s.end);
}
