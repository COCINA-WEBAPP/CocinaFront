/**
 * SERVICIOS DE USUARIO
 * 
 * Este archivo contiene todas las funciones para interactuar con usuarios.
 * Incluye autenticación, gestión de perfil, seguimiento y recetas guardadas.
 * 
 * IMPORTANTE: Estas funciones usan datos MOCK actualmente.
 * Cuando conectes con el backend, reemplaza las funciones con llamadas fetch/axios.
 */

import { MOCK_USERS } from "@/lib/data/users";
import { User, LoginCredentials, RegisterData, UpdateUserProfile } from "@/lib/types/users";

// ========================================
// VARIABLE GLOBAL: Usuario Actual
// ========================================
// En producción, esto se manejaría con Context API, Redux, Zustand, o similar
let currentUser: User | null = null;

const SESSION_KEY = "recipeshare_session";

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
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// ========================================
// SECCIÓN 1: AUTENTICACIÓN
// ========================================

/**
 * Inicia sesión con email y contraseña
 * 
 * @param credentials - Email y contraseña del usuario
 * @returns El usuario autenticado
 * @throws Error si el usuario no existe
 * 
 * MOCK: Solo verifica que el email exista, no valida la contraseña
 * PRODUCCIÓN: Debería hacer POST a /api/auth/login y validar con JWT
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  // Simula el delay de una petición HTTP
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Busca el usuario por email en los datos mock
  const user = MOCK_USERS.find((u) => u.email === credentials.email);
  
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  
  // En producción aquí verificarías la contraseña con bcrypt
  // y recibirías un token JWT del backend
  
  // Guarda el usuario como "actual"
  currentUser = user;
  persistSession(user);

  return user;
}

/**
 * Registra un nuevo usuario en la aplicación
 * 
 * @param data - Información del nuevo usuario (username, email, password, fullName)
 * @returns El usuario recién creado
 * @throws Error si el email ya está registrado
 * 
 * MOCK: Agrega el usuario al array MOCK_USERS
 * PRODUCCIÓN: Debería hacer POST a /api/auth/register
 */
export async function register(data: RegisterData): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Verifica si el email ya existe
  const existingUser = MOCK_USERS.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }
  
  // Crea el nuevo usuario con valores por defecto
  const newUser: User = {
    id: String(MOCK_USERS.length + 1),
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
  };
  
  // Agrega el usuario al array mock
  MOCK_USERS.push(newUser);
  currentUser = newUser;
  persistSession(newUser);

  return newUser;
}

/**
 * Cierra la sesión del usuario actual
 * 
 * MOCK: Solo limpia la variable currentUser
 * PRODUCCIÓN: Debería invalidar el token JWT y hacer POST a /api/auth/logout
 */
export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  currentUser = null;
  persistSession(null);
}

/**
 * Obtiene el usuario que está actualmente autenticado
 * 
 * @returns El usuario actual o null si no hay sesión
 * 
 * PRODUCCIÓN: Debería obtenerlo de Context API o un state manager
 */
export function getCurrentUser(): User | null {
  if (!currentUser) {
    currentUser = restoreSession();
  }
  return currentUser;
}

/**
 * Verifica si hay un usuario autenticado
 * 
 * @returns true si hay un usuario logeado
 */
export function isAuthenticated(): boolean {
  return Boolean(currentUser);
}

// ========================================
// SECCIÓN 2: GESTIÓN DE USUARIOS
// ========================================

/**
 * Obtiene la lista completa de todos los usuarios
 * 
 * @returns Array con todos los usuarios
 * 
 * MOCK: Retorna MOCK_USERS
 * PRODUCCIÓN: GET /api/users
 */
export async function getAllUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USERS;
}

/**
 * Busca un usuario específico por su ID
 * 
 * @param id - ID del usuario a buscar
 * @returns El usuario encontrado o undefined
 * 
 * PRODUCCIÓN: GET /api/users/:id
 */
export async function getUserById(id: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_USERS.find((u) => u.id === id);
}

/**
 * Busca un usuario específico por su nombre de usuario
 * 
 * @param username - Username del usuario a buscar
 * @returns El usuario encontrado o undefined
 * 
 * PRODUCCIÓN: GET /api/users/username/:username
 */
export async function getUserByUsername(username: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_USERS.find((u) => u.username === username);
}

/**
 * Actualiza la información del perfil de un usuario
 * 
 * @param userId - ID del usuario a actualizar
 * @param data - Datos a actualizar (solo los campos que cambien)
 * @returns El usuario actualizado
 * @throws Error si el usuario no existe
 * 
 * MOCK: Modifica el usuario en MOCK_USERS
 * PRODUCCIÓN: PATCH /api/users/:id
 */
export async function updateUserProfile(userId: string, data: UpdateUserProfile): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const userIndex = MOCK_USERS.findIndex((u) => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error("Usuario no encontrado");
  }
  
  // Actualiza solo los campos que vienen en 'data'
  MOCK_USERS[userIndex] = {
    ...MOCK_USERS[userIndex],
    ...data,
  };
  
  // Si es el usuario actual, actualiza también esa variable
  if (currentUser?.id === userId) {
    currentUser = MOCK_USERS[userIndex];
    persistSession(currentUser);
  }

  return MOCK_USERS[userIndex];
}

// ========================================
// SECCIÓN 3: SISTEMA DE SEGUIMIENTO (FOLLOW)
// ========================================

/**
 * Hace que el usuario actual siga a otro usuario
 * 
 * @param userIdToFollow - ID del usuario a seguir
 * @throws Error si no hay sesión activa
 * 
 * PRODUCCIÓN: POST /api/users/:id/follow
 */
export async function followUser(userIdToFollow: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (!currentUser) {
    throw new Error("Debes iniciar sesión");
  }
  
  // Actualiza la lista de "following" del usuario actual
  const currentUserIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  if (!MOCK_USERS[currentUserIndex].following.includes(userIdToFollow)) {
    MOCK_USERS[currentUserIndex].following.push(userIdToFollow);
    MOCK_USERS[currentUserIndex].stats.followingCount++;
  }
  
  // Actualiza la lista de "followers" del usuario seguido
  const userToFollowIndex = MOCK_USERS.findIndex((u) => u.id === userIdToFollow);
  if (userToFollowIndex !== -1) {
    if (!MOCK_USERS[userToFollowIndex].followers.includes(currentUser.id)) {
      MOCK_USERS[userToFollowIndex].followers.push(currentUser.id);
      MOCK_USERS[userToFollowIndex].stats.followersCount++;
    }
  }
  
  currentUser = MOCK_USERS[currentUserIndex];
  persistSession(currentUser);
}

/**
 * Hace que el usuario actual deje de seguir a otro usuario
 * 
 * @param userIdToUnfollow - ID del usuario a dejar de seguir
 * @throws Error si no hay sesión activa
 * 
 * PRODUCCIÓN: DELETE /api/users/:id/follow
 */
export async function unfollowUser(userIdToUnfollow: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (!currentUser) {
    throw new Error("Debes iniciar sesión");
  }
  
  // Quita el usuario de la lista de "following"
  const currentUserIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  MOCK_USERS[currentUserIndex].following = MOCK_USERS[currentUserIndex].following.filter(
    (id) => id !== userIdToUnfollow
  );
  MOCK_USERS[currentUserIndex].stats.followingCount--;
  
  // Quita al usuario actual de la lista de "followers" del otro usuario
  const userToUnfollowIndex = MOCK_USERS.findIndex((u) => u.id === userIdToUnfollow);
  if (userToUnfollowIndex !== -1) {
    MOCK_USERS[userToUnfollowIndex].followers = MOCK_USERS[userToUnfollowIndex].followers.filter(
      (id) => id !== currentUser!.id
    );
    MOCK_USERS[userToUnfollowIndex].stats.followersCount--;
  }
  
  currentUser = MOCK_USERS[currentUserIndex];
  persistSession(currentUser);
}

/**
 * Obtiene la lista de seguidores de un usuario
 * 
 * @param userId - ID del usuario del cual obtener seguidores
 * @returns Array de usuarios que siguen al usuario especificado
 * 
 * PRODUCCIÓN: GET /api/users/:id/followers
 */
export async function getUserFollowers(userId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return [];
  
  // Filtra los usuarios que están en la lista de followers
  return MOCK_USERS.filter((u) => user.followers.includes(u.id));
}

/**
 * Obtiene la lista de usuarios que sigue un usuario
 * 
 * @param userId - ID del usuario del cual obtener "following"
 * @returns Array de usuarios que el usuario especificado sigue
 * 
 * PRODUCCIÓN: GET /api/users/:id/following
 */
export async function getUserFollowing(userId: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return [];
  
  // Filtra los usuarios que están en la lista de following
  return MOCK_USERS.filter((u) => user.following.includes(u.id));
}

/**
 * Verifica si el usuario actual sigue a otro usuario específico
 * 
 * @param userId - ID del usuario a verificar
 * @returns true si lo sigue, false si no
 */
export function isFollowingUser(userId: string): boolean {
  if (!currentUser) return false;
  return currentUser.following.includes(userId);
}

// ========================================
// SECCIÓN 4: RECETAS GUARDADAS
// ========================================

/**
 * Guarda una receta en los favoritos del usuario actual
 * 
 * @param recipeId - ID de la receta a guardar
 * @throws Error si no hay sesión activa
 * 
 * PRODUCCIÓN: POST /api/users/:id/saved-recipes
 */
export async function saveRecipe(recipeId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  if (!currentUser) {
    throw new Error("Debes iniciar sesión");
  }
  
  const userIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  
  // Solo agrega si no está ya guardada
  if (!MOCK_USERS[userIndex].savedRecipes.includes(recipeId)) {
    MOCK_USERS[userIndex].savedRecipes.push(recipeId);
    MOCK_USERS[userIndex].stats.savedRecipesCount++;
    currentUser = MOCK_USERS[userIndex];
    persistSession(currentUser);
  }
}

/**
 * Elimina una receta de los favoritos del usuario actual
 * 
 * @param recipeId - ID de la receta a eliminar
 * @throws Error si no hay sesión activa
 * 
 * PRODUCCIÓN: DELETE /api/users/:id/saved-recipes/:recipeId
 */
export async function unsaveRecipe(recipeId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  if (!currentUser) {
    throw new Error("Debes iniciar sesión");
  }
  
  const userIndex = MOCK_USERS.findIndex((u) => u.id === currentUser!.id);
  
  // Filtra la receta de la lista de guardadas
  MOCK_USERS[userIndex].savedRecipes = MOCK_USERS[userIndex].savedRecipes.filter(
    (id) => id !== recipeId
  );
  MOCK_USERS[userIndex].stats.savedRecipesCount--;
  currentUser = MOCK_USERS[userIndex];
  persistSession(currentUser);
}

/**
 * Obtiene los IDs de todas las recetas guardadas por un usuario
 * 
 * @param userId - ID del usuario
 * @returns Array de IDs de recetas guardadas
 * 
 * PRODUCCIÓN: GET /api/users/:id/saved-recipes
 */
export async function getUserSavedRecipes(userId: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const user = MOCK_USERS.find((u) => u.id === userId);
  return user?.savedRecipes || [];
}

/**
 * Verifica si el usuario actual ha guardado una receta específica
 * 
 * @param recipeId - ID de la receta a verificar
 * @returns true si está guardada, false si no
 */
export function isRecipeSaved(recipeId: string): boolean {
  if (!currentUser) return false;
  return currentUser.savedRecipes.includes(recipeId);
}
