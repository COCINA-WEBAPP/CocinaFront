
// app/page.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import "@/styles/globals.css";
import Link from "next/link";
import { getAllRecipes } from "../lib/services/recipe";
import type { Recipe } from "../lib/types/recipes";

export const metadata = {
  title: "RecipeShare",
  description: "Descubre recetas increíbles",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* pb-20 en móvil para evitar que el contenido quede detrás del MobileBottomNav */}
      <main className="pb-20 md:pb-0">

      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
