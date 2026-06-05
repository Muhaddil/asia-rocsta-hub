import { describe, it, expect } from "vitest";
import { problems } from "../data/problems";
import { localize } from "../data/types";

describe("problems data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(problems)).toBe(true);
    expect(problems.length).toBeGreaterThan(0);
  });

  describe("required fields", () => {
    it("every problem has a non-empty id", () => {
      for (const p of problems) {
        expect(typeof p.id).toBe("string");
        expect(p.id.length).toBeGreaterThan(0);
      }
    });

    it("every problem has localized title", () => {
      for (const p of problems) {
        expect(p.title.es.length).toBeGreaterThan(0);
        expect(p.title.en.length).toBeGreaterThan(0);
      }
    });

    it("every problem has a valid severity", () => {
      for (const p of problems) {
        expect(["critical", "warn", "info"]).toContain(p.severity);
      }
    });

    it("every problem has a valid motor", () => {
      for (const p of problems) {
        expect(["F8", "R2", "ambos"]).toContain(p.motor);
      }
    });

    it("every problem has a non-empty km range", () => {
      for (const p of problems) {
        expect(typeof p.km).toBe("string");
        expect(p.km.length).toBeGreaterThan(0);
      }
    });

    it("every problem has localized symptom, cause, solution", () => {
      for (const p of problems) {
        expect(p.symptom.es.length).toBeGreaterThan(0);
        expect(p.symptom.en.length).toBeGreaterThan(0);
        expect(p.cause.es.length).toBeGreaterThan(0);
        expect(p.cause.en.length).toBeGreaterThan(0);
        expect(p.solution.es.length).toBeGreaterThan(0);
        expect(p.solution.en.length).toBeGreaterThan(0);
      }
    });

    it("every problem has a non-empty cost", () => {
      for (const p of problems) {
        expect(typeof p.cost).toBe("string");
        expect(p.cost.length).toBeGreaterThan(0);
      }
    });

    it("every problem has a valid difficulty", () => {
      for (const p of problems) {
        expect(["Fácil", "Media", "Alta"]).toContain(p.difficulty);
      }
    });

    it("every problem has a valid category", () => {
      const valid = ["engine", "transmission", "suspension", "electrical", "brakes", "tires", "body"];
      for (const p of problems) {
        expect(valid).toContain(p.category);
      }
    });

    it("every problem has reports as number >= 0", () => {
      for (const p of problems) {
        expect(typeof p.reports).toBe("number");
        expect(p.reports).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("no duplicate ids", () => {
    it("all ids are unique", () => {
      const ids = problems.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("severity distribution", () => {
    it("has at least one critical problem", () => {
      expect(problems.some((p) => p.severity === "critical")).toBe(true);
    });

    it("has at least one warn problem", () => {
      expect(problems.some((p) => p.severity === "warn")).toBe(true);
    });

    it("has at least one info problem", () => {
      expect(problems.some((p) => p.severity === "info")).toBe(true);
    });
  });

  describe("engine coverage", () => {
    it("covers F8 engine", () => {
      expect(problems.some((p) => p.motor === "F8")).toBe(true);
    });

    it("covers R2 engine", () => {
      expect(problems.some((p) => p.motor === "R2")).toBe(true);
    });

    it("covers both engines", () => {
      expect(problems.some((p) => p.motor === "ambos")).toBe(true);
    });
  });

  describe("localize works for all fields", () => {
    it("title localizes correctly", () => {
      for (const p of problems) {
        expect(localize(p.title, "es").length).toBeGreaterThan(0);
        expect(localize(p.title, "en").length).toBeGreaterThan(0);
      }
    });

    it("symptom localizes correctly", () => {
      for (const p of problems) {
        expect(localize(p.symptom, "es").length).toBeGreaterThan(0);
        expect(localize(p.symptom, "en").length).toBeGreaterThan(0);
      }
    });

    it("cause localizes correctly", () => {
      for (const p of problems) {
        expect(localize(p.cause, "es").length).toBeGreaterThan(0);
        expect(localize(p.cause, "en").length).toBeGreaterThan(0);
      }
    });

    it("solution localizes correctly", () => {
      for (const p of problems) {
        expect(localize(p.solution, "es").length).toBeGreaterThan(0);
        expect(localize(p.solution, "en").length).toBeGreaterThan(0);
      }
    });
  });
});
