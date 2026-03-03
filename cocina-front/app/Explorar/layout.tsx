/**
 * Layout para la sección de Explorar recetas.
 *
 * NOTA: Los layouts anidados en Next.js App Router NO deben incluir
 * etiquetas <html> ni <body> — esas solo van en el root layout (app/layout.tsx).
 * Este layout simplemente envuelve el contenido de las páginas de /Explorar.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RecipeShare - Descubre y Comparte Recetas",
  description: "Plataforma para descubrir recetas increíbles publicadas por usuarios de todo el mundo",
};

export default function ExplorarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
