import { describe, it, expect } from "vitest";
import { parts } from "../data/parts";
import { localize } from "../data/types";
import type { Part } from "../data/types";

describe("parts.json data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(parts)).toBe(true);
    expect(parts.length).toBeGreaterThan(0);
  });

  describe("required fields", () => {
    it("every part has a non-empty id", () => {
      for (const part of parts) {
        expect(typeof part.id).toBe("string");
        expect(part.id.length).toBeGreaterThan(0);
      }
    });

    it("every part has a non-empty localized name", () => {
      for (const part of parts) {
        expect(part.name).toBeDefined();
        expect(typeof part.name).toBe("object");
        expect(part.name.es.length).toBeGreaterThan(0);
        expect(part.name.en.length).toBeGreaterThan(0);
      }
    });

    it("every part has a valid category", () => {
      const validCategories = [
        "engine",
        "transmission",
        "suspension",
        "electrical",
        "brakes",
        "tires",
        "body",
      ];
      for (const part of parts) {
        expect(validCategories).toContain(part.category);
      }
    });

    it("every part has a non-empty localized description", () => {
      for (const part of parts) {
        expect(part.description).toBeDefined();
        expect(typeof part.description).toBe("object");
        expect(part.description.es.length).toBeGreaterThan(0);
        expect(part.description.en.length).toBeGreaterThan(0);
      }
    });

    it("every part has a valid status", () => {
      const validStatuses = ["verified", "mod", "unverified"];
      for (const part of parts) {
        expect(validStatuses).toContain(part.status);
      }
    });

    it("every part has a valid motor", () => {
      const validMotors = ["F8", "R2", "ambos"];
      for (const part of parts) {
        expect(validMotors).toContain(part.motor);
      }
    });

    it("every part has equiv as an array", () => {
      for (const part of parts) {
        expect(Array.isArray(part.equiv)).toBe(true);
      }
    });
  });

  describe("oem field", () => {
    it("every part has an oem field", () => {
      for (const part of parts) {
        expect(part.oem).toBeDefined();
      }
    });

    it("oem is either a string or a localized object", () => {
      for (const part of parts) {
        const isString = typeof part.oem === "string";
        const isObject = typeof part.oem === "object" && part.oem !== null;
        expect(isString || isObject).toBe(true);
      }
    });

    it("string oem values are non-empty", () => {
      const stringOems = parts.filter((p) => typeof p.oem === "string");
      expect(stringOems.length).toBeGreaterThan(0);
      for (const part of stringOems) {
        expect((part.oem as string).length).toBeGreaterThan(0);
      }
    });

    it("object oem values have es and en keys", () => {
      const objectOems = parts.filter((p) => typeof p.oem === "object") as Array<
        Part & { oem: Record<string, string> }
      >;
      expect(objectOems.length).toBeGreaterThan(0);
      for (const part of objectOems) {
        expect(typeof part.oem.es).toBe("string");
        expect(typeof part.oem.en).toBe("string");
        expect(part.oem.es.length).toBeGreaterThan(0);
        expect(part.oem.en.length).toBeGreaterThan(0);
      }
    });

    it("localize() works correctly for both string and object oem", () => {
      for (const part of parts) {
        const resultEs = localize(part.oem, "es");
        const resultEn = localize(part.oem, "en");
        expect(typeof resultEs).toBe("string");
        expect(typeof resultEn).toBe("string");
        expect(resultEs.length).toBeGreaterThan(0);
        expect(resultEn.length).toBeGreaterThan(0);
      }
    });
  });

  describe("no duplicate ids", () => {
    it("all part ids are unique", () => {
      const ids = parts.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("data consistency", () => {
    it("every part with notes has localized notes", () => {
      const withNotes = parts.filter((p) => p.notes);
      for (const part of withNotes) {
        expect(typeof part.notes).toBe("object");
        expect(part.notes!.es).toBeDefined();
        expect(part.notes!.en).toBeDefined();
      }
    });

    it("every part with refs has a non-empty array", () => {
      const withRefs = parts.filter((p) => p.refs);
      for (const part of withRefs) {
        expect(Array.isArray(part.refs)).toBe(true);
        expect(part.refs!.length).toBeGreaterThan(0);
      }
    });

    it("no part has empty string values in name", () => {
      for (const part of parts) {
        expect(part.name.es.trim()).not.toBe("");
        expect(part.name.en.trim()).not.toBe("");
      }
    });
  });
});
