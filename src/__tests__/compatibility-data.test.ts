import { describe, it, expect } from "vitest";
import { compatibilities } from "../data/compatibility";
import { localize } from "../data/types";

describe("compatibility.json data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(compatibilities)).toBe(true);
    expect(compatibilities.length).toBeGreaterThan(0);
  });

  describe("required fields", () => {
    it("every entry has a non-empty id", () => {
      for (const c of compatibilities) {
        expect(typeof c.id).toBe("string");
        expect(c.id.length).toBeGreaterThan(0);
      }
    });

    it("every entry has localized rocstaPart", () => {
      for (const c of compatibilities) {
        expect(c.rocstaPart.es.length).toBeGreaterThan(0);
        expect(c.rocstaPart.en.length).toBeGreaterThan(0);
      }
    });

    it("every entry has localized donorVehicle", () => {
      for (const c of compatibilities) {
        expect(c.donorVehicle.es.length).toBeGreaterThan(0);
        expect(c.donorVehicle.en.length).toBeGreaterThan(0);
      }
    });

    it("every entry has a non-empty donorRef", () => {
      for (const c of compatibilities) {
        expect(typeof c.donorRef).toBe("string");
        expect(c.donorRef.length).toBeGreaterThan(0);
      }
    });

    it("every entry has a valid type", () => {
      for (const c of compatibilities) {
        expect(["directo", "adaptación"]).toContain(c.type);
      }
    });

    it("every entry has a valid difficulty", () => {
      for (const c of compatibilities) {
        expect(["Fácil", "Media", "Alta"]).toContain(c.difficulty);
      }
    });

    it("every entry has a valid motor", () => {
      for (const c of compatibilities) {
        expect(["F8", "R2", "ambos"]).toContain(c.motor);
      }
    });

    it("every entry has a valid category", () => {
      const valid = ["engine", "transmission", "suspension", "electrical", "brakes", "tires", "body"];
      for (const c of compatibilities) {
        expect(valid).toContain(c.category);
      }
    });

    it("every entry has verified as boolean", () => {
      for (const c of compatibilities) {
        expect(typeof c.verified).toBe("boolean");
      }
    });

    it("every entry has confirmations as number", () => {
      for (const c of compatibilities) {
        expect(typeof c.confirmations).toBe("number");
        expect(c.confirmations).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("no duplicate ids", () => {
    it("all ids are unique", () => {
      const ids = compatibilities.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("localize works for all fields", () => {
    it("rocstaPart localizes correctly", () => {
      for (const c of compatibilities) {
        expect(localize(c.rocstaPart, "es").length).toBeGreaterThan(0);
        expect(localize(c.rocstaPart, "en").length).toBeGreaterThan(0);
      }
    });

    it("donorVehicle localizes correctly", () => {
      for (const c of compatibilities) {
        expect(localize(c.donorVehicle, "es").length).toBeGreaterThan(0);
        expect(localize(c.donorVehicle, "en").length).toBeGreaterThan(0);
      }
    });

    it("notes localizes correctly when present", () => {
      const withNotes = compatibilities.filter((c) => c.notes);
      for (const c of withNotes) {
        expect(localize(c.notes!, "es").length).toBeGreaterThan(0);
        expect(localize(c.notes!, "en").length).toBeGreaterThan(0);
      }
    });
  });

  describe("data consistency", () => {
    it("at least one entry is direct fit", () => {
      expect(compatibilities.some((c) => c.type === "directo")).toBe(true);
    });

    it("at least one entry requires adaptation", () => {
      expect(compatibilities.some((c) => c.type === "adaptación")).toBe(true);
    });

    it("at least one entry covers each engine", () => {
      expect(compatibilities.some((c) => c.motor === "F8")).toBe(true);
      expect(compatibilities.some((c) => c.motor === "R2")).toBe(true);
    });
  });
});
