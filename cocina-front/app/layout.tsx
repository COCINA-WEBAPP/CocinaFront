import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";

export const metadata: Metadata = {
  title: "RecipeShare - Descubre y Comparte Recetas",
  description: "Plataforma para descubrir recetas increíbles publicadas por usuarios de todo el mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
