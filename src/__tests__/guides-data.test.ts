import { describe, it, expect } from "vitest";
import { guides } from "../data/guides";
import { localize } from "../data/types";

describe("guides data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(guides)).toBe(true);
    expect(guides.length).toBeGreaterThan(0);
  });

  describe("required fields", () => {
    it("every guide has a non-empty id", () => {
      for (const g of guides) {
        expect(typeof g.id).toBe("string");
        expect(g.id.length).toBeGreaterThan(0);
      }
    });

    it("every guide has a non-empty slug", () => {
      for (const g of guides) {
        expect(typeof g.slug).toBe("string");
        expect(g.slug.length).toBeGreaterThan(0);
        expect(/^[a-z0-9-]+$/.test(g.slug)).toBe(true);
      }
    });

    it("every guide has localized title", () => {
      for (const g of guides) {
        expect(g.title.es.length).toBeGreaterThan(0);
        expect(g.title.en.length).toBeGreaterThan(0);
      }
    });

    it("every guide has localized description", () => {
      for (const g of guides) {
        expect(g.description.es.length).toBeGreaterThan(0);
        expect(g.description.en.length).toBeGreaterThan(0);
      }
    });

    it("every guide has a valid level", () => {
      for (const g of guides) {
        expect(["Principiante", "Intermedio", "Avanzado"]).toContain(g.level);
      }
    });

    it("every guide has a non-empty time", () => {
      for (const g of guides) {
        expect(typeof g.time).toBe("string");
        expect(g.time.length).toBeGreaterThan(0);
      }
    });

    it("every guide has a valid motor", () => {
      for (const g of guides) {
        expect(["F8", "R2", "ambos"]).toContain(g.motor);
      }
    });

    it("every guide has a valid category", () => {
      const valid = [
        "engine",
        "transmission",
        "suspension",
        "electrical",
        "brakes",
        "tires",
        "body",
      ];
      for (const g of guides) {
        expect(valid).toContain(g.category);
      }
    });

    it("every guide has tags as non-empty array", () => {
      for (const g of guides) {
        expect(Array.isArray(g.tags)).toBe(true);
        expect(g.tags.length).toBeGreaterThan(0);
      }
    });

    it("every guide has contributions as number >= 0", () => {
      for (const g of guides) {
        expect(typeof g.contributions).toBe("number");
        expect(g.contributions).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("tools", () => {
    it("every guide has tools as non-empty array", () => {
      for (const g of guides) {
        expect(Array.isArray(g.tools)).toBe(true);
        expect(g.tools.length).toBeGreaterThan(0);
      }
    });

    it("every tool has a localized name and quantity", () => {
      for (const g of guides) {
        for (const tool of g.tools) {
          expect(tool.name.es.length).toBeGreaterThan(0);
          expect(tool.name.en.length).toBeGreaterThan(0);
          expect(typeof tool.quantity).toBe("number");
          expect(tool.quantity).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("steps", () => {
    it("every guide has steps as non-empty array", () => {
      for (const g of guides) {
        expect(Array.isArray(g.steps)).toBe(true);
        expect(g.steps.length).toBeGreaterThan(0);
      }
    });

    it("every step has localized title and content", () => {
      for (const g of guides) {
        for (const step of g.steps) {
          expect(step.title.es.length).toBeGreaterThan(0);
          expect(step.title.en.length).toBeGreaterThan(0);
          expect(step.content.es.length).toBeGreaterThan(0);
          expect(step.content.en.length).toBeGreaterThan(0);
        }
      }
    });

    it("every step title starts with 'Paso' (es) or 'Step' (en)", () => {
      for (const g of guides) {
        for (const step of g.steps) {
          expect(step.title.es).toMatch(/^Paso \d+:/);
          expect(step.title.en).toMatch(/^Step \d+:/);
        }
      }
    });
  });

  describe("no duplicate ids", () => {
    it("all ids are unique", () => {
      const ids = guides.map((g) => g.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all slugs are unique", () => {
      const slugs = guides.map((g) => g.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });
  });

  describe("localize works for all fields", () => {
    it("title localizes correctly", () => {
      for (const g of guides) {
        expect(localize(g.title, "es").length).toBeGreaterThan(0);
        expect(localize(g.title, "en").length).toBeGreaterThan(0);
      }
    });

    it("description localizes correctly", () => {
      for (const g of guides) {
        expect(localize(g.description, "es").length).toBeGreaterThan(0);
        expect(localize(g.description, "en").length).toBeGreaterThan(0);
      }
    });
  });
});
