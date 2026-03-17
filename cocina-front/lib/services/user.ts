/**
 * SERVICIOS DE USUARIO
 *
 * Incluye autenticación, gestión de perfil, seguimiento, recetas guardadas
 * e historial de cocina.
 */

import { MOCK_USERS } from "@/lib/data/users";
import { User, LoginCredentials, RegisterData, UpdateUserProfile, CookingHistoryEntry } from "@/lib/types/users";
import { resetShoppingListCache } from "@/lib/services/shopping-list";

// ========================================
// VARIABLE GLOBAL: Usuario Actual
// ========================================
let currentUser: User | null = null;

const SESSION_KEY   = "recipeshare_session";
const SAVED_KEY     = "recipeshare_saved_recipes";
const HISTORY_KEY   = "recipeshare_cooking_history";
const CREDENTIALS_KEY = "recipeshare_credentials";   // email → password
const USERS_KEY       = "recipeshare_registered_users"; // usuarios nuevos persistidos

// ─── Session helpers ──────────────────────────────────────────────────────────

function persistSession(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function restoreSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as User;
    loadRegisteredUsers(); // asegura que usuarios nuevos estén en MOCK_USERS
    const live = MOCK_USERS.find((u) => u.id === parsed.id);
    return live ?? parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// ─── Credential helpers ───────────────────────────────────────────────────────

function saveCredentials(email: string, password: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    const all: Record<string, string> = raw ? JSON.parse(raw) : {};
    all[email] = password;
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

function checkCredentials(email: string, password: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return false;
    const all: Record<string, string> = JSON.parse(raw);
    return all[email] === password;
  } catch {
    return false;
  }
}

function hasStoredCredentials(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return false;
    const all: Record<string, string> = JSON.parse(raw);
    return email in all;
  } catch {
    return false;
  }
}

// ─── Registered users persistence ────────────────────────────────────────────

/**
 * Guarda un usuario nuevo en localStorage para que sobreviva recargas.
 */
function persistNewUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const all: User[] = raw ? JSON.parse(raw) : [];
    if (!all.find((u) => u.id === user.id)) {
      all.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(all));
    }
  } catch { /* noop */ }
}

/**
 * Carga usuarios registrados desde localStorage y los fusiona con MOCK_USERS.
 * Así login() los encuentra aunque se haya recargado la página.
 */
function loadRegisteredUsers(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return;
    const all: User[] = JSON.parse(raw);
    for (const u of all) {
      if (!MOCK_USERS.find((m) => m.id === u.id)) {
        MOCK_USERS.push(u);
      }
    }
  } catch { /* noop */ }
}

// ─── Saved recipes localStorage helpers ──────────────────────────────────────

function getSavedFromStorage(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${SAVED_KEY}_${userId}`);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveSavedToStorage(userId: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${SAVED_KEY}_${userId}`, JSON.stringify(ids));
}

// ─── Cooking history localStorage helpers ────────────────────────────────────

function getHistoryFromStorage(userId: string): CookingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY}_${userId}`);
    return raw ? (JSON.parse(raw) as CookingHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistoryToStorage(userId: string, history: CookingHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${HISTORY_KEY}_${userId}`, JSON.stringify(history));
}

// ========================================
// SECCIÓN 1: AUTENTICACIÓN
// ========================================

export async function login(credentials: LoginCredentials): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Carga usuarios registrados para que estén disponibles tras recarga
  loadRegisteredUsers();

  const user = MOCK_USERS.find((u) => u.email === credentials.email);
  if (!user) throw new Error("Usuario no encontrado");

  // Usuarios del mock inicial no tienen contraseña guardada → acceso libre
  // Usuarios registrados → valida contraseña contra localStorage
  if (hasStoredCredentials(credentials.email)) {
    if (!checkCredentials(credentials.email, credentials.password)) {
      throw new Error("Contraseña incorrecta");
    }
  }

  currentUser = user;
  persistSession(user);
  resetShoppingListCache();
  return user;
}

export async function register(data: RegisterData): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Carga usuarios registrados antes de verificar duplicados
  loadRegisteredUsers();

  const existingUser = MOCK_USERS.find((u) => u.email === data.email);
  if (existingUser) throw new Error("El email ya está registrado");

  const newUser: User = {
    id: String(Date.now()),
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    createdAt: new Date().toISOString(),
    role: "user",
    stats: {
      recipesCount: 0,
      followersCount: 0,
      followingCount: 0,
      savedRecipesCount: 0,
    },
    savedRecipes: [],
    following: [],
    followers: [],
    recipes: [],
    tagInventory: [],
    cookingHistory: [],
  };

  MOCK_USERS.push(newUser);

  // Persiste credenciales y usuario para que sobrevivan recargas
  saveCredentials(data.email, data.password);
  persistNewUser(newUser);

  currentUser = newUser;
  persistSession(newUser);
  resetShoppingListCache();
  return newUser;
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  currentUser = null;
  persistSession(null);
  resetShoppingListCache();
}

export function getCurrentUser(): User | null {
  if (!currentUser) {
    currentUser = restoreSession();
  }
  if (currentUser) {
    loadRegisteredUsers(); // asegura que usuarios nuevos estén en MOCK_USERS
    const live = MOCK_USERS.find((u) => u.id === currentUser!.id);
    const base = live ?? currentUser;
    const savedRecipes = getSavedFromStorage(base.id);
    currentUser = {
      ...base,
      savedRecipes,
      stats: {
        ...base.stats,
        savedRecipesCount: savedRecipes.length,
      },
    };
  }
  return currentUser;
}

export function isAuthenticated(): boolean {
  return Boolean(getCurrentUser());
}

// ========================================
// SECCIÓN 2: GESTIÓN DE USUARIOS
// ========================================

export async function getAllUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USERS;
}

export async function getUserById(id: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_USERS.find((u) => u.id === id);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_USERS.find((u) => u.username === username);
}

export async function updateUserProfile(userId: string, data: UpdateUserProfile): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error("Usuario no encontrado");

  MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };

  // Actualiza también en localStorage si es un usuario registrado
  persistNewUser(MOCK_USERS[userIndex]);

  if (currentUser?.id === userId) {
    currentUser = { ...MOCK_USERS[userIndex] };
    persistSession(currentUser);
  }

  return MOCK_USERS[userIndex];
}

// ========================================
// SECCIÓN 3: SISTEMA DE SEGUIMIENTO (FOLLOW)
// ========================================

export async function followUser(userIdToFollow: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!currentUser) throw new Error("Debes iniciar sesión");

  const currentUserIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  if (currentUserIndex !== -1 && !MOCK_USERS[currentUserIndex].following.includes(userIdToFollow)) {
    MOCK_USERS[currentUserIndex].following.push(userIdToFollow);
    MOCK_USERS[currentUserIndex].stats.followingCount++;
  }

  const userToFollowIndex = MOCK_USERS.findIndex((u) => u.id === userIdToFollow);
  if (userToFollowIndex !== -1 && !MOCK_USERS[userToFollowIndex].followers.includes(currentUser.id)) {
    MOCK_USERS[userToFollowIndex].followers.push(currentUser.id);
    MOCK_USERS[userToFollowIndex].stats.followersCount++;
  }

  if (currentUserIndex !== -1) {
    currentUser = MOCK_USERS[currentUserIndex];
    persistSession(currentUser);
  }
}

export async function unfollowUser(userIdToUnfollow: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!currentUser) throw new Error("Debes iniciar sesión");

  const currentUserIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  if (currentUserIndex !== -1) {
    MOCK_USERS[currentUserIndex].following = MOCK_USERS[currentUserIndex].following.filter(
      (id) => id !== userIdToUnfollow
    );
    MOCK_USERS[currentUserIndex].stats.followingCount = Math.max(
      0, MOCK_USERS[currentUserIndex].stats.followingCount - 1
    );
    currentUser = MOCK_USERS[currentUserIndex];
    persistSession(currentUser);
  }

  const userToUnfollowIndex = MOCK_USERS.findIndex((u) => u.id === userIdToUnfollow);
  if (userToUnfollowIndex !== -1) {
    MOCK_USERS[userToUnfollowIndex].followers = MOCK_USERS[userToUnfollowIndex].followers.filter(
      (id) => id !== currentUser!.id
    );
    MOCK_USERS[userToUnfollowIndex].stats.followersCount = Math.max(
      0, MOCK_USERS[userToUnfollowIndex].stats.followersCount - 1
    );
  }
}

export async function getUserFollowers(userId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return [];
  return MOCK_USERS.filter((u) => user.followers.includes(u.id));
}

export async function getUserFollowing(userId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return [];
  return MOCK_USERS.filter((u) => user.following.includes(u.id));
}

export function isFollowingUser(userId: string): boolean {
  if (!currentUser) return false;
  return currentUser.following.includes(userId);
}

// ========================================
// SECCIÓN 4: RECETAS GUARDADAS
// ========================================

export async function saveRecipe(recipeId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const saved = getSavedFromStorage(user.id);
  if (!saved.includes(recipeId)) {
    saved.push(recipeId);
    saveSavedToStorage(user.id, saved);

    const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex].savedRecipes = saved;
      MOCK_USERS[userIndex].stats.savedRecipesCount = saved.length;
    }
    currentUser = { ...user, savedRecipes: saved, stats: { ...user.stats, savedRecipesCount: saved.length } };
    persistSession(currentUser);
  }
}

export async function unsaveRecipe(recipeId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const saved = getSavedFromStorage(user.id).filter((id) => id !== recipeId);
  saveSavedToStorage(user.id, saved);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].savedRecipes = saved;
    MOCK_USERS[userIndex].stats.savedRecipesCount = saved.length;
  }
  currentUser = { ...user, savedRecipes: saved, stats: { ...user.stats, savedRecipesCount: saved.length } };
  persistSession(currentUser);
}

export async function getUserSavedRecipes(userId: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = getCurrentUser();
  if (user?.id === userId) return getSavedFromStorage(userId);
  return MOCK_USERS.find((u) => u.id === userId)?.savedRecipes ?? [];
}

export function isRecipeSaved(recipeId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return getSavedFromStorage(user.id).includes(recipeId);
}

// ========================================
// SECCIÓN 5: HISTORIAL DE COCINA
// ========================================

export async function addToCookingHistory(
  recipeId: string,
  recipeTitle: string,
  recipeImage?: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const entry: CookingHistoryEntry = {
    recipeId,
    recipeTitle,
    recipeImage,
    cookedAt: new Date().toISOString(),
  };

  const history = getHistoryFromStorage(user.id);
  history.unshift(entry);
  saveHistoryToStorage(user.id, history);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    if (!MOCK_USERS[userIndex].cookingHistory) MOCK_USERS[userIndex].cookingHistory = [];
    MOCK_USERS[userIndex].cookingHistory = history;
    currentUser = MOCK_USERS[userIndex];
    persistSession(currentUser);
  }
}

export function getCookingHistory(): CookingHistoryEntry[] {
  const user = getCurrentUser();
  if (!user) return [];
  return getHistoryFromStorage(user.id);
}

export async function removeFromCookingHistory(index: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  const history = getHistoryFromStorage(user.id);
  history.splice(index, 1);
  saveHistoryToStorage(user.id, history);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].cookingHistory = history;
    currentUser = MOCK_USERS[userIndex];
    persistSession(currentUser);
  }
}

export async function clearCookingHistory(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión");

  saveHistoryToStorage(user.id, []);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    MOCK_USERS[userIndex].cookingHistory = [];
    currentUser = MOCK_USERS[userIndex];
    persistSession(currentUser);
  }
}