import { describe, it, expect } from "vitest";
import { aboutSections, aboutHero } from "../data/about";
import type { AboutFact, AboutInfo, AboutSection, Localized } from "../data/about";

describe("about data integrity", () => {
  describe("aboutHero", () => {
    it("has title and lead in both languages", () => {
      expect(aboutHero.title.es.length).toBeGreaterThan(0);
      expect(aboutHero.title.en.length).toBeGreaterThan(0);
      expect(aboutHero.lead.es.length).toBeGreaterThan(0);
      expect(aboutHero.lead.en.length).toBeGreaterThan(0);
    });
  });

  describe("sections structure", () => {
    it("exports a non-empty array of sections", () => {
      expect(Array.isArray(aboutSections)).toBe(true);
      expect(aboutSections.length).toBeGreaterThan(0);
    });

    it("every section has a valid kind", () => {
      const validKinds = ["prose", "facts", "engines", "dimensions", "list", "timeline"];
      for (const section of aboutSections) {
        expect(validKinds).toContain(section.kind);
      }
    });

    it("every section has a unique id", () => {
      const ids = aboutSections.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("every section has a localized title", () => {
      for (const section of aboutSections) {
        expect(section.title.es.length).toBeGreaterThan(0);
        expect(section.title.en.length).toBeGreaterThan(0);
      }
    });
  });

  describe("facts sections", () => {
    const factsSections = aboutSections.filter(
      (s): s is Extract<AboutSection, { kind: "facts" }> => s.kind === "facts",
    );

    it("has at least one facts section", () => {
      expect(factsSections.length).toBeGreaterThan(0);
    });

    it("every facts section has a non-empty facts array", () => {
      for (const section of factsSections) {
        expect(section.facts.length).toBeGreaterThan(0);
      }
    });

    it("every fact has a localized label and value", () => {
      for (const section of factsSections) {
        for (const fact of section.facts) {
          expect(fact.label.es.length).toBeGreaterThan(0);
          expect(fact.label.en.length).toBeGreaterThan(0);
          expect(fact.value.es.length).toBeGreaterThan(0);
          expect(fact.value.en.length).toBeGreaterThan(0);
        }
      }
    });

    it("every fact with info has proper tooltip and dialog structure", () => {
      const factsWithInfo = factsSections.flatMap((s) => s.facts.filter((f) => f.info));
      expect(factsWithInfo.length).toBeGreaterThan(0);

      for (const fact of factsWithInfo) {
        const info = fact.info as AboutInfo;
        expect(info.tooltip).toBeDefined();
        expect(info.tooltip.es.length).toBeGreaterThan(0);
        expect(info.tooltip.en.length).toBeGreaterThan(0);
        expect(info.dialog).toBeDefined();
        expect(info.dialog.title.es.length).toBeGreaterThan(0);
        expect(info.dialog.title.en.length).toBeGreaterThan(0);
        expect(info.dialog.body.es.length).toBeGreaterThan(0);
        expect(info.dialog.body.en.length).toBeGreaterThan(0);
      }
    });
  });

  describe("engines section", () => {
    const enginesSection = aboutSections.find(
      (s): s is Extract<AboutSection, { kind: "engines" }> => s.kind === "engines",
    );

    it("exists and has engines", () => {
      expect(enginesSection).toBeDefined();
      expect(enginesSection!.engines.length).toBeGreaterThan(0);
    });

    it("every engine has localized code and fuel", () => {
      for (const engine of enginesSection!.engines) {
        expect(engine.code.es.length).toBeGreaterThan(0);
        expect(engine.code.en.length).toBeGreaterThan(0);
        expect(engine.fuel.es.length).toBeGreaterThan(0);
        expect(engine.fuel.en.length).toBeGreaterThan(0);
      }
    });

    it("every engine has at least 10 specs", () => {
      for (const engine of enginesSection!.engines) {
        expect(engine.specs.length).toBeGreaterThanOrEqual(10);
      }
    });

    it("every engine spec has a localized label and value", () => {
      for (const engine of enginesSection!.engines) {
        for (const spec of engine.specs) {
          expect(spec.label.es.length).toBeGreaterThan(0);
          expect(spec.label.en.length).toBeGreaterThan(0);
          expect(spec.value.es.length).toBeGreaterThan(0);
          expect(spec.value.en.length).toBeGreaterThan(0);
        }
      }
    });

    it("every engine spec with info has proper structure", () => {
      for (const engine of enginesSection!.engines) {
        const specsInfo = engine.specs.filter((s) => s.info);
        for (const spec of specsInfo) {
          const info = spec.info as AboutInfo;
          expect(info.tooltip).toBeDefined();
          expect(info.tooltip.es.length).toBeGreaterThan(0);
          expect(info.tooltip.en.length).toBeGreaterThan(0);
          expect(info.dialog).toBeDefined();
          expect(info.dialog.title.es.length).toBeGreaterThan(0);
          expect(info.dialog.title.en.length).toBeGreaterThan(0);
          expect(info.dialog.body.es.length).toBeGreaterThan(0);
          expect(info.dialog.body.en.length).toBeGreaterThan(0);
        }
      }
    });

    it("every engine has localized notes", () => {
      for (const engine of enginesSection!.engines) {
        expect(engine.notes.es.length).toBeGreaterThan(0);
        expect(engine.notes.en.length).toBeGreaterThan(0);
      }
    });
  });

  describe("dimensions section", () => {
    const dimSection = aboutSections.find(
      (s): s is Extract<AboutSection, { kind: "dimensions" }> => s.kind === "dimensions",
    );

    it("exists and has dimension sets", () => {
      expect(dimSection).toBeDefined();
      expect(dimSection!.sets.length).toBeGreaterThan(0);
    });

    it("every dimension set has rows", () => {
      for (const set of dimSection!.sets) {
        expect(set.rows.length).toBeGreaterThan(0);
      }
    });

    it("every dimension row has localized label and value", () => {
      for (const set of dimSection!.sets) {
        for (const row of set.rows) {
          expect(row.label.es.length).toBeGreaterThan(0);
          expect(row.label.en.length).toBeGreaterThan(0);
          expect(row.value.es.length).toBeGreaterThan(0);
          expect(row.value.en.length).toBeGreaterThan(0);
        }
      }
    });

    it("every dimension row with info has proper structure", () => {
      for (const set of dimSection!.sets) {
        const rowsInfo = set.rows.filter((r) => r.info);
        for (const row of rowsInfo) {
          const info = row.info as AboutInfo;
          expect(info.tooltip).toBeDefined();
          expect(info.dialog).toBeDefined();
          expect(info.dialog.title).toBeDefined();
          expect(info.dialog.body).toBeDefined();
        }
      }
    });
  });

  describe("list sections", () => {
    const listSections = aboutSections.filter(
      (s): s is Extract<AboutSection, { kind: "list" }> => s.kind === "list",
    );

    it("every list section has items", () => {
      for (const section of listSections) {
        expect(section.items.length).toBeGreaterThan(0);
      }
    });

    it("every list item has localized title and description", () => {
      for (const section of listSections) {
        for (const item of section.items) {
          expect(item.title.es.length).toBeGreaterThan(0);
          expect(item.title.en.length).toBeGreaterThan(0);
          expect(item.description.es.length).toBeGreaterThan(0);
          expect(item.description.en.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("timeline sections", () => {
    const timelineSections = aboutSections.filter(
      (s): s is Extract<AboutSection, { kind: "timeline" }> => s.kind === "timeline",
    );

    it("every timeline section has entries", () => {
      for (const section of timelineSections) {
        expect(section.entries.length).toBeGreaterThan(0);
      }
    });

    it("every timeline entry has a year and localized text", () => {
      for (const section of timelineSections) {
        for (const entry of section.entries) {
          expect(entry.year.length).toBeGreaterThan(0);
          expect(entry.text.es.length).toBeGreaterThan(0);
          expect(entry.text.en.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("localized text completeness", () => {
    it("all Localized objects have exactly es and en keys", () => {
      // Check a sample of Localized objects across sections
      const allLocalized: Localized[] = [];

      for (const section of aboutSections) {
        allLocalized.push(section.title);
        if ("intro" in section && section.intro) allLocalized.push(section.intro);

        if (section.kind === "facts") {
          for (const fact of section.facts) {
            allLocalized.push(fact.label, fact.value);
            if (fact.info) {
              allLocalized.push(fact.info.tooltip, fact.info.dialog.title, fact.info.dialog.body);
            }
          }
        }
        if (section.kind === "engines") {
          for (const engine of section.engines) {
            allLocalized.push(engine.code, engine.fuel, engine.notes);
            for (const spec of engine.specs) {
              allLocalized.push(spec.label, spec.value);
              if (spec.info) {
                allLocalized.push(spec.info.tooltip, spec.info.dialog.title, spec.info.dialog.body);
              }
            }
          }
        }
      }

      for (const loc of allLocalized) {
        expect(typeof loc.es).toBe("string");
        expect(typeof loc.en).toBe("string");
      }
    });
  });
});
