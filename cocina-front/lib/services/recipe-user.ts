/**
 * RESOLUCIÓN DE USUARIOS EN RECETAS
 *
 * Con la API real, las reseñas y comentarios retornan objetos de usuario
 * populados { username, fullName, avatar }. El caché de allUsersCache de
 * user.ts se usa como fallback para búsquedas por string.
 */

import { allUsersCache } from "@/lib/services/user";
import type { RecipeUserRef } from "@/lib/types/recipe-interactions";
import type { User } from "@/lib/types/users";

type ResolvedUser = Pick<User, "username" | "fullName" | "avatar">;

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ").filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
};

export const getAvatarSrc = (displayName: string, avatar?: string): string => {
  if (avatar) return avatar;
  const seed = encodeURIComponent(displayName);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
};

export const getDisplayNameFromRef = (userRef: RecipeUserRef): string =>
  typeof userRef === "string" ? userRef : userRef.fullName;

export const resolveRecipeUser = (userRef: RecipeUserRef): ResolvedUser | null => {
  // Objeto populado desde la API → devolver directamente
  if (typeof userRef !== "string") {
    // Buscar en caché para obtener avatar si no viene en el ref
    const cached =
      allUsersCache.find((u) => u.username === userRef.username) ||
      allUsersCache.find(
        (u) => normalize(u.fullName) === normalize(userRef.fullName)
      );

    return {
      username: userRef.username,
      fullName: userRef.fullName,
      avatar: (userRef as ResolvedUser).avatar ?? cached?.avatar,
    };
  }

  // Referencia por string (legado) → buscar en caché
  if (allUsersCache.length === 0) return null;

  const ref = normalize(userRef);

  const byUsername = allUsersCache.find((u) => normalize(u.username) === ref);
  if (byUsername)
    return { username: byUsername.username, fullName: byUsername.fullName, avatar: byUsername.avatar };

  const byExactName = allUsersCache.find((u) => normalize(u.fullName) === ref);
  if (byExactName)
    return { username: byExactName.username, fullName: byExactName.fullName, avatar: byExactName.avatar };

  const byContains = allUsersCache.filter((u) => {
    const full = normalize(u.fullName);
    return full.includes(ref) || ref.includes(full);
  });
  if (byContains.length === 1)
    return { username: byContains[0].username, fullName: byContains[0].fullName, avatar: byContains[0].avatar };

  return null;
};
