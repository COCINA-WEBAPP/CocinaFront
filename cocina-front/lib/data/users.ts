/**
 * DATOS MOCK DE USUARIOS
 * 
 * Este archivo contiene usuarios de ejemplo para desarrollo y pruebas.
 * En producción, estos datos vendrán de tu base de datos backend.
 */

import { User } from "@/lib/types/users";

/**
 * Lista de usuarios de ejemplo (Mock Data)
 * 
 * Estos son usuarios ficticios para probar la aplicación.
 * Cuando conectes con el backend, estos datos NO se usarán.
 */
export const MOCK_USERS: User[] = [
  {
    // Usuario 1: user profesional
    id: "1",
    username: "maria_user",
    email: "maria@example.com",
    fullName: "María García",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "user profesional con más de 10 años de experiencia en cocina mediterránea",
    createdAt: "2024-01-15T10:00:00Z",
    role: "user",
    stats: {
      recipesCount: 45,
      followersCount: 1250,
      followingCount: 320,
      savedRecipesCount: 180,
    },
    savedRecipes: ["1", "3", "5"],         // Recetas que María ha guardado
    following: ["2", "3"],                 // María sigue a Carlos y Ana
    followers: ["2", "3", "4"],            // Estos usuarios siguen a María
    recipes: ["1", "2", "3", "14", "15", "16"], // Recetas creadas por María
    location: "Madrid, España",
    website: "https://maria-user.com",
    socialMedia: {
      instagram: "@maria_user",
      twitter: "@mariauser",
    },
  },
  {
    // Usuario 2: Usuario regular
    id: "2",
    username: "carlos_cocina",
    email: "carlos@example.com",
    fullName: "Carlos Rodríguez",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Amante de la cocina casera y tradicional",
    createdAt: "2024-02-20T14:30:00Z",
    role: "user",
    stats: {
      recipesCount: 12,
      followersCount: 380,
      followingCount: 150,
      savedRecipesCount: 95,
    },
    savedRecipes: ["2", "4", "6"],
    following: ["1"],                      // Carlos sigue a María
    followers: ["1", "3"],                 // María y Ana siguen a Carlos
    recipes: ["4", "5", "17", "18", "19"],
    location: "Barcelona, España",
  },
  {
    // Usuario 3: Repostera profesional
    id: "3",
    username: "ana_reposteria",
    email: "ana@example.com",
    fullName: "Ana López",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Repostera profesional. Especializada en pasteles y postres",
    createdAt: "2024-03-10T09:15:00Z",
    role: "user",
    stats: {
      recipesCount: 67,
      followersCount: 2100,
      followingCount: 85,
      savedRecipesCount: 234,
    },
    savedRecipes: ["1", "2", "3", "4"],
    following: ["1", "2"],                 // Ana sigue a María y Carlos
    followers: ["1", "2", "4", "5"],
    recipes: ["6", "7", "8", "20", "21", "22"],
    location: "Valencia, España",
    website: "https://ana-reposteria.com",
    socialMedia: {
      instagram: "@ana_reposteria",
      facebook: "AnaReposteriaOficial",
    },
  },
  {
    // Usuario 4: Usuario enfocado en cocina vegana
    id: "4",
    username: "pedro_vegano",
    email: "pedro@example.com",
    fullName: "Pedro Martínez",
    avatar: "https://i.pravatar.cc/150?img=14",
    bio: "Cocina vegana y saludable para todos",
    createdAt: "2024-04-05T16:45:00Z",
    role: "user",
    stats: {
      recipesCount: 28,
      followersCount: 890,
      followingCount: 210,
      savedRecipesCount: 142,
    },
    savedRecipes: ["5", "6"],
    following: ["1", "3"],                 // Pedro sigue a María y Ana
    followers: ["3", "5"],
    recipes: ["9", "10", "23", "24"],
    location: "Sevilla, España",
    socialMedia: {
      instagram: "@pedro_vegano",
    },
  },
  {
    // Usuario 5: user de cocina fusión
    id: "5",
    username: "lucia_fusion",
    email: "lucia@example.com",
    fullName: "Lucía Fernández",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Explorando fusiones culinarias del mundo",
    createdAt: "2024-05-12T11:20:00Z",
    role: "user",
    stats: {
      recipesCount: 34,
      followersCount: 1560,
      followingCount: 420,
      savedRecipesCount: 201,
    },
    savedRecipes: ["1", "3", "7"],
    following: ["1", "2", "3", "4"],       // Lucía sigue a todos
    followers: ["2", "4"],
    recipes: ["11", "12", "13", "25", "26", "27"],
    location: "Bilbao, España",
    website: "https://lucia-fusion.com",
  },
];
