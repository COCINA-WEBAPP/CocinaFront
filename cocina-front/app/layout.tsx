import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "../components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

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
      <body
        className={`${plusJakarta.variable} ${playfair.variable} min-h-screen bg-background antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
