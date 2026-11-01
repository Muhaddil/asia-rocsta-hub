import { describe, expect, it } from "vitest";
import pkg from "../../package.json";
import { CURRENT_VERSION, CHANGELOG } from "@/data/version";

describe("version metadata", () => {
  it("keeps package.json and CURRENT_VERSION in sync", () => {
    expect(CURRENT_VERSION).toBe(pkg.version);
  });

  it("lists the current version as the newest changelog entry", () => {
    expect(CHANGELOG[0]?.version).toBe(CURRENT_VERSION);
  });

  it("has unique, well-formed versions and dates", () => {
    const versions = CHANGELOG.map((entry) => entry.version);
    expect(new Set(versions).size).toBe(versions.length);
    for (const entry of CHANGELOG) {
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(entry.date))).toBe(false);
    }
  });

  it("describes every change in Spanish and English", () => {
    for (const entry of CHANGELOG) {
      expect(entry.changes.length).toBeGreaterThan(0);
      for (const change of entry.changes) {
        expect(change.es.trim(), `${entry.version}:es`).not.toBe("");
        expect(change.en.trim(), `${entry.version}:en`).not.toBe("");
      }
    }
  });
});
