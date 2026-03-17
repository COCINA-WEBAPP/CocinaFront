import { describe, it, expect } from "vitest";
import {
  getInitials,
  getAvatarSrc,
  getDisplayNameFromRef,
  resolveRecipeUser,
} from "@/lib/services/recipe-user";

describe("getInitials", () => {
  it("returns first letters of first and last name", () => {
    expect(getInitials("María García")).toBe("MG");
  });

  it("returns single initial for one-word name", () => {
    expect(getInitials("Admin")).toBe("A");
  });

  it("takes only first two parts for long names", () => {
    expect(getInitials("Juan Carlos López Martínez")).toBe("JC");
  });

  it("returns 'U' for empty string", () => {
    expect(getInitials("")).toBe("U");
  });

  it("handles extra whitespace", () => {
    expect(getInitials("  Ana   Ruiz  ")).toBe("AR");
  });
});

describe("getAvatarSrc", () => {
  it("returns provided avatar URL when given", () => {
    expect(getAvatarSrc("Test User", "/img/avatar.png")).toBe("/img/avatar.png");
  });

  it("returns dicebear URL when no avatar provided", () => {
    const result = getAvatarSrc("Test User");
    expect(result).toContain("dicebear.com");
    expect(result).toContain("Test%20User");
  });

  it("returns dicebear URL when avatar is undefined", () => {
    const result = getAvatarSrc("Ana", undefined);
    expect(result).toContain("dicebear.com");
  });
});

describe("getDisplayNameFromRef", () => {
  it("returns the string directly for string ref", () => {
    expect(getDisplayNameFromRef("Juan Pérez")).toBe("Juan Pérez");
  });

  it("returns fullName for object ref", () => {
    expect(
      getDisplayNameFromRef({ username: "jperez", fullName: "Juan Pérez" })
    ).toBe("Juan Pérez");
  });
});

describe("resolveRecipeUser", () => {
  it("resolves a known user by username (object ref)", () => {
    const result = resolveRecipeUser({ username: "maria_user", fullName: "María García" });
    expect(result).not.toBeNull();
    expect(result?.username).toBe("maria_user");
  });

  it("returns null for completely unknown string ref", () => {
    const result = resolveRecipeUser("xyznonexistent12345");
    expect(result).toBeNull();
  });

  it("returns fallback object for unknown object ref", () => {
    const result = resolveRecipeUser({ username: "unknown_user_xyz", fullName: "Nobody" });
    expect(result).not.toBeNull();
    expect(result?.username).toBe("unknown_user_xyz");
    expect(result?.fullName).toBe("Nobody");
  });
});
