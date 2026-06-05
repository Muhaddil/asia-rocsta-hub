import { describe, it, expect } from "vitest";
import { communityStats, communityMembers } from "../data/community";
import { parts } from "../data/parts";
import { compatibilities } from "../data/compatibility";
import { guides } from "../data/guides";
import { problems } from "../data/problems";

describe("community stats", () => {
  describe("partsDocumented", () => {
    it("returns the correct parts count", () => {
      expect(communityStats.partsDocumented).toBe(parts.length);
    });

    it("is a positive number", () => {
      expect(communityStats.partsDocumented).toBeGreaterThan(0);
    });
  });

  describe("verifiedEquivalences", () => {
    it("returns the correct verified count", () => {
      const expected = compatibilities.filter((c) => c.verified).length;
      expect(communityStats.verifiedEquivalences).toBe(expected);
    });

    it("is less than or equal to total compatibilities", () => {
      expect(communityStats.verifiedEquivalences).toBeLessThanOrEqual(compatibilities.length);
    });
  });

  describe("repairGuides", () => {
    it("returns the correct guides count", () => {
      expect(communityStats.repairGuides).toBe(guides.length);
    });

    it("is a positive number", () => {
      expect(communityStats.repairGuides).toBeGreaterThan(0);
    });
  });

  describe("registeredProblems", () => {
    it("returns the correct problems count", () => {
      expect(communityStats.registeredProblems).toBe(problems.length);
    });

    it("is a positive number", () => {
      expect(communityStats.registeredProblems).toBeGreaterThan(0);
    });
  });

  describe("downloadedManuals", () => {
    it("returns a positive number", () => {
      expect(communityStats.downloadedManuals).toBeGreaterThan(0);
    });
  });

  describe("totalContributions", () => {
    it("returns a number >= sum of parts + compatibilities + guides", () => {
      const memberContributions = communityMembers.reduce(
        (sum, m) => sum + m.contributions,
        0,
      );
      const expected = memberContributions + parts.length + compatibilities.length + guides.length;
      expect(communityStats.totalContributions).toBe(expected);
    });

    it("is greater than parts + compatibilities + guides", () => {
      // Even with empty members, contributions = parts + compatibilities + guides
      expect(communityStats.totalContributions).toBeGreaterThanOrEqual(
        parts.length + compatibilities.length + guides.length
      );
    });
  });

  describe("communityMembers", () => {
    it("is an array (possibly empty)", () => {
      expect(Array.isArray(communityMembers)).toBe(true);
    });

    it("every member has required fields", () => {
      for (const m of communityMembers) {
        expect(typeof m.id).toBe("string");
        expect(typeof m.name).toBe("string");
        expect(typeof m.country).toBe("string");
        expect(typeof m.avatarColor).toBe("string");
        expect(typeof m.contributions).toBe("number");
        expect(typeof m.speciality).toBe("string");
        expect(typeof m.joinedYear).toBe("number");
      }
    });

    it("every member has non-negative contributions", () => {
      for (const m of communityMembers) {
        expect(m.contributions).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
