import type { Recipe } from "@/lib/types/recipes";

/**
 * TIPOS DE USUARIO
 * 
 * Este archivo define todas las estructuras de datos relacionadas con usuarios.
 * Los tipos aquí definen cómo se ve un usuario en tu aplicación.
 */

/**
 * Tipo principal de Usuario
 * Representa toda la información de un usuario en la aplicación
 */
export type User = {
  // ===== Información Básica =====
  id: string;                    // ID único del usuario
  username: string;              // Nombre de usuario único (ej: "maria_chef")
  email: string;                 // Email del usuario
  fullName: string;              // Nombre completo (ej: "María García")
  avatar?: string;               // URL de la foto de perfil (opcional)
  bio?: string;                  // Biografía/descripción del usuario (opcional)
  createdAt: string;             // Fecha de creación de la cuenta (formato ISO)
  role: "user" | "admin" ; // Rol del usuario en la plataforma

  // ===== Estadísticas del Usuario =====
  stats: {
    recipesCount: number;        // Número de recetas que ha creado
    followersCount: number;      // Número de seguidores
    followingCount: number;      // Número de usuarios que sigue
    savedRecipesCount: number;   // Número de recetas guardadas
  };

  // ===== Relaciones con Recetas =====
  savedRecipes: Recipe["id"][]; // IDs de recetas que ha guardado
  recipes: Recipe["id"][];      // IDs de recetas que ha creado

  // ===== Relaciones con Otros Usuarios =====
  following: string[];           // IDs de usuarios que este usuario sigue
  followers: string[];           // IDs de usuarios que siguen a este usuario

  // ===== Información Adicional (opcional) =====
  location?: string;             // Ubicación del usuario (ej: "Madrid, España")
  website?: string;              // Sitio web personal
  socialMedia?: {                // Redes sociales
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
};

/**
 * Credenciales para Iniciar Sesión
 * Se usa cuando un usuario quiere hacer login
 */
export type LoginCredentials = {
  email: string;                 // Email del usuario
  password: string;              // Contraseña
};

/**
 * Datos para Registrar un Nuevo Usuario
 * Se usa cuando alguien crea una cuenta nueva
 */
export type RegisterData = {
  username: string;              // Nombre de usuario deseado
  email: string;                 // Email para la cuenta
  password: string;              // Contraseña para la cuenta
  fullName: string;              // Nombre completo
};

/**
 * Datos para Actualizar el Perfil
 * Se usa cuando un usuario edita su información personal
 * Todos los campos son opcionales - solo se actualiza lo que se envíe
 */
export type UpdateUserProfile = {
  fullName?: string;             // Cambiar nombre completo
  bio?: string;                  // Cambiar biografía
  avatar?: string;               // Cambiar foto de perfil
  location?: string;             // Cambiar ubicación
  website?: string;              // Cambiar sitio web
  socialMedia?: {                // Cambiar redes sociales
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
};
