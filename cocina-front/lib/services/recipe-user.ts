import { MOCK_USERS } from "@/lib/data/users";
import type { RecipeUserRef } from "@/lib/types/recipe-interactions";
import type { User } from "@/lib/types/users";

type ResolvedUser = Pick<User, "username" | "fullName" | "avatar">;

const normalize = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "U";
};

export const getAvatarSrc = (displayName: string, avatar?: string): string => {
  if (avatar) return avatar;
  const seed = encodeURIComponent(displayName);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
};

export const getDisplayNameFromRef = (userRef: RecipeUserRef): string => {
  return typeof userRef === "string" ? userRef : userRef.fullName;
};

export const resolveRecipeUser = (userRef: RecipeUserRef): ResolvedUser | null => {
  if (typeof userRef !== "string") {
    const byUsername = MOCK_USERS.find((u) => u.username === userRef.username);
    if (byUsername) {
      return {
        username: byUsername.username,
        fullName: byUsername.fullName,
        avatar: byUsername.avatar,
      };
    }

    const byName = MOCK_USERS.find((u) => normalize(u.fullName) === normalize(userRef.fullName));
    if (byName) {
      return {
        username: byName.username,
        fullName: byName.fullName,
        avatar: byName.avatar,
      };
    }

    return {
      username: userRef.username,
      fullName: userRef.fullName,
      avatar: undefined,
    };
  }

  const ref = normalize(userRef);
  const byUsername = MOCK_USERS.find((u) => normalize(u.username) === ref);
  if (byUsername) {
    return {
      username: byUsername.username,
      fullName: byUsername.fullName,
      avatar: byUsername.avatar,
    };
  }

  const byExactName = MOCK_USERS.find((u) => normalize(u.fullName) === ref);
  if (byExactName) {
    return {
      username: byExactName.username,
      fullName: byExactName.fullName,
      avatar: byExactName.avatar,
    };
  }

  const byContains = MOCK_USERS.filter((u) => {
    const full = normalize(u.fullName);
    return full.includes(ref) || ref.includes(full);
  });

  if (byContains.length === 1) {
    return {
      username: byContains[0].username,
      fullName: byContains[0].fullName,
      avatar: byContains[0].avatar,
    };
  }

  const byFirstName = MOCK_USERS.filter((u) => normalize(u.fullName).split(" ")[0] === ref.split(" ")[0]);
  if (byFirstName.length === 1) {
    return {
      username: byFirstName[0].username,
      fullName: byFirstName[0].fullName,
      avatar: byFirstName[0].avatar,
    };
  }

  return null;
};
