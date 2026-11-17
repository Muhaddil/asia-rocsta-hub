import { describe, it, expect } from "vitest";
import { AM102_TECH_DATA } from "../data/manual/am102-techdata";
import { localize, type LocalizedString } from "../data/types";

const localizedKeys: ("es" | "en")[] = ["es", "en"];

function expectLocalized(value: LocalizedString, context: string) {
  for (const key of localizedKeys) {
    expect(value[key], `${context} (${key})`).toBeTruthy();
  }
}

describe("AM102 technical data", () => {
  it("has a non-empty table list", () => {
    expect(AM102_TECH_DATA.length).toBeGreaterThan(0);
  });

  it("has unique table ids", () => {
    const ids = AM102_TECH_DATA.map((table) => table.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every table to section 22 pages", () => {
    for (const table of AM102_TECH_DATA) {
      expect(table.sourcePage).toBeGreaterThanOrEqual(409);
      expect(table.sourcePage).toBeLessThanOrEqual(418);
    }
  });

  it("assigns every table to a known group", () => {
    const groups = ["engine", "drivetrain", "chassis", "body"];
    for (const table of AM102_TECH_DATA) {
      expect(groups, `table ${table.id}`).toContain(table.group);
    }
    expect(new Set(AM102_TECH_DATA.map((table) => table.group))).toEqual(new Set(groups));
  });

  it("localizes table titles", () => {
    for (const table of AM102_TECH_DATA) {
      expectLocalized(table.title, `table ${table.id}`);
    }
  });

  it("localizes table notes", () => {
    for (const table of AM102_TECH_DATA) {
      if (table.note) expectLocalized(table.note, `table ${table.id} note`);
    }
  });

  it("uses the per-engine final drive ratio from the parts catalog", () => {
    const axle = AM102_TECH_DATA.find((table) => table.id === "rear-axle");
    expect(axle?.split).toBe(true);

    const ratio = axle?.rows.find((row) => row.label.en === "Reduction ratio");
    expect(ratio?.r2).toBe("4.333");
    expect(ratio?.f8).toBe("4.875");

    const pinion = axle?.rows.find((row) => row.label.en === "Drive pinion teeth");
    expect(pinion?.r2).toBe("9");
    expect(pinion?.f8).toBe("8");
  });

  it("has localized row labels and at least one value", () => {
    for (const table of AM102_TECH_DATA) {
      for (const row of table.rows) {
        expectLocalized(row.label, `table ${table.id}`);
        expect(
          Boolean(row.value || row.r2 || row.f8),
          `table ${table.id} / ${localize(row.label, "en")}`,
        ).toBe(true);
      }
    }
  });

  it("localizes every textual value for both languages", () => {
    for (const table of AM102_TECH_DATA) {
      for (const row of table.rows) {
        for (const field of [row.value, row.r2, row.f8]) {
          if (typeof field === "object" && field !== null) {
            expectLocalized(field, `table ${table.id} / ${localize(row.label, "en")}`);
          }
        }
      }
    }
  });
});
