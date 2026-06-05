import { describe, it, expect } from "vitest";
import { localize } from "../data/types";
import type { Language } from "@/components/language-provider";

describe("localize", () => {
  const obj = { es: "Hola", en: "Hello" };

  it("returns string values as-is", () => {
    expect(localize("K886-13-800C", "es")).toBe("K886-13-800C");
    expect(localize("plain text", "en")).toBe("plain text");
  });

  it("returns localized string from object for Spanish", () => {
    expect(localize(obj, "es")).toBe("Hola");
  });

  it("returns localized string from object for English", () => {
    expect(localize(obj, "en")).toBe("Hello");
  });

  it("falls back to es when lang key is missing", () => {
    const partial = { es: "Fallback español" } as Record<string, string>;
    expect(localize(partial, "fr")).toBe("Fallback español");
    expect(localize(partial, "de")).toBe("Fallback español");
  });

  it("returns empty string when value is empty object and lang is missing", () => {
    expect(localize({} as Record<string, string>, "fr")).toBe("");
  });

  it("throws TypeError for undefined value", () => {
    // @ts-expect-error — testing runtime edge case
    expect(() => localize(undefined, "es")).toThrow(TypeError);
  });

  it("throws TypeError for null value", () => {
    // @ts-expect-error — testing runtime edge case
    expect(() => localize(null, "en")).toThrow(TypeError);
  });

  it("handles objects with extra keys", () => {
    const enriched = {
      es: "Español",
      en: "English",
      fr: "Français",
      de: "Deutsch",
      pt: "Português",
    };
    expect(localize(enriched, "fr")).toBe("Français");
    expect(localize(enriched, "pt")).toBe("Português");
  });

  it("prefers exact lang match over es fallback", () => {
    const data = { es: "Español", en: "English" };
    expect(localize(data, "en")).toBe("English");
    expect(localize(data, "es")).toBe("Español");
  });

  it("returns empty string for empty string value", () => {
    expect(localize("", "es")).toBe("");
  });

  it("handles numeric-looking string values", () => {
    expect(localize("1789 cc", "en")).toBe("1789 cc");
  });
});
