import { describe, it, expect } from "vitest";
import { manuals } from "../data/manuals";
import { localize } from "../data/types";

describe("manuals data integrity", () => {
  it("exports a non-empty array", () => {
    expect(Array.isArray(manuals)).toBe(true);
    expect(manuals.length).toBeGreaterThan(0);
  });

  describe("required fields", () => {
    it("every manual has a non-empty id", () => {
      for (const m of manuals) {
        expect(typeof m.id).toBe("string");
        expect(m.id.length).toBeGreaterThan(0);
      }
    });

    it("every manual has localized title", () => {
      for (const m of manuals) {
        expect(m.title.es.length).toBeGreaterThan(0);
        expect(m.title.en.length).toBeGreaterThan(0);
      }
    });

    it("every manual has localized description", () => {
      for (const m of manuals) {
        expect(m.description.es.length).toBeGreaterThan(0);
        expect(m.description.en.length).toBeGreaterThan(0);
      }
    });

    it("every manual has a valid type", () => {
      for (const m of manuals) {
        expect(["workshop", "electrical", "catalog", "datasheet", "other"]).toContain(m.type);
      }
    });

    it("every manual has a valid format", () => {
      for (const m of manuals) {
        expect(["pdf", "image", "web"]).toContain(m.format);
      }
    });

    it("every manual has a valid language", () => {
      for (const m of manuals) {
        expect(["es", "en", "ko", "fr", "de", "pt"]).toContain(m.language);
      }
    });

    it("every manual has a valid motor", () => {
      for (const m of manuals) {
        expect(["F8", "R2", "ambos"]).toContain(m.motor);
      }
    });
  });

  describe("optional fields", () => {
    it("manuals with year have non-empty string", () => {
      const withYear = manuals.filter((m) => m.year);
      for (const m of withYear) {
        expect(typeof m.year).toBe("string");
        expect(m.year!.length).toBeGreaterThan(0);
      }
    });

    it("manuals with pages have number > 0", () => {
      const withPages = manuals.filter((m) => m.pages);
      for (const m of withPages) {
        expect(typeof m.pages).toBe("number");
        expect(m.pages!).toBeGreaterThan(0);
      }
    });

    it("manuals with url have valid URL string", () => {
      const withUrl = manuals.filter((m) => m.url);
      for (const m of withUrl) {
        expect(typeof m.url).toBe("string");
        expect(m.url!.length).toBeGreaterThan(0);
        expect(m.url!.startsWith("http")).toBe(true);
      }
    });
  });

  describe("no duplicate ids", () => {
    it("all ids are unique", () => {
      const ids = manuals.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("localize works for all fields", () => {
    it("title localizes correctly", () => {
      for (const m of manuals) {
        expect(localize(m.title, "es").length).toBeGreaterThan(0);
        expect(localize(m.title, "en").length).toBeGreaterThan(0);
      }
    });

    it("description localizes correctly", () => {
      for (const m of manuals) {
        expect(localize(m.description, "es").length).toBeGreaterThan(0);
        expect(localize(m.description, "en").length).toBeGreaterThan(0);
      }
    });
  });
});
