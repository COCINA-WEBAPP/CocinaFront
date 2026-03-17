import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (class name merge)", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-2", "py-3")).toBe("px-2 py-3");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "extra")).toBe("base extra");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("deduplicates identical classes", () => {
    expect(cn("p-4 p-4")).toBe("p-4");
  });
});
