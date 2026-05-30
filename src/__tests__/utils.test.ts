import { describe, it, expect } from "vitest";
import { normalizeString, cn } from "../lib/utils";

describe("normalizeString", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalizeString("Correa de distribución")).toBe("correa de distribucion");
    expect(normalizeString("Ásía Ròcstá")).toBe("asia rocsta");
    expect(normalizeString("MOTOR")).toBe("motor");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    expect(cn("px-4", (false as boolean) && "hidden")).toBe("px-4");
  });
});
