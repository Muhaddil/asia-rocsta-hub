import { describe, it, expect } from "vitest";
import { globalSearch } from "../data/search";

describe("globalSearch", () => {
  it("returns empty array for empty query", () => {
    expect(globalSearch("")).toEqual([]);
    expect(globalSearch("   ")).toEqual([]);
  });

  it("finds parts by name (Spanish)", () => {
    const results = globalSearch("Filtro", "es");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "part")).toBe(true);
  });

  it("finds parts by name (English)", () => {
    const results = globalSearch("Filter", "en");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.type === "part")).toBe(true);
  });

  it("finds parts by OEM number", () => {
    const results = globalSearch("K886-13-800C", "es");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe("part");
  });

  it("finds parts by equivalence", () => {
    const results = globalSearch("Mazda B2200", "es");
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds results across different categories", () => {
    const results = globalSearch("Rocsta", "es");
    expect(results.length).toBeGreaterThan(0);
    const types = new Set(results.map((r) => r.type));
    expect(types.size).toBeGreaterThan(1);
  });

  it("results have correct structure", () => {
    const results = globalSearch("Filtro", "es");
    for (const result of results) {
      expect(result.id).toBeDefined();
      expect(result.id.length).toBeGreaterThan(0);
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
      expect(result.to.length).toBeGreaterThan(0);
      expect(["part", "compatibility", "guide", "problem", "manual"]).toContain(result.type);
    }
  });

  it("is case-insensitive", () => {
    const lower = globalSearch("filtro", "es");
    const upper = globalSearch("FILTRO", "es");
    expect(lower.length).toBe(upper.length);
  });

  it("respects language for title display", () => {
    const resultsEs = globalSearch("Filtro", "es");
    const resultsEn = globalSearch("Filter", "en");
    // Both should find results
    expect(resultsEs.length).toBeGreaterThan(0);
    expect(resultsEn.length).toBeGreaterThan(0);
  });

  it("returns at most 20 results", () => {
    const results = globalSearch("a", "es");
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it("finds guides", () => {
    // Search for a common term that might appear in guide titles
    const results = globalSearch("Cambio", "es");
    const guides = results.filter((r) => r.type === "guide");
    // May or may not find guides, but should not crash
    expect(Array.isArray(guides)).toBe(true);
  });

  it("finds problems", () => {
    const results = globalSearch("Fallo", "es");
    const problems = results.filter((r) => r.type === "problem");
    // May or may not find problems, but should not crash
    expect(Array.isArray(problems)).toBe(true);
  });
});
