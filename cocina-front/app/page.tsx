import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "@/styles/globals.css";

export const metadata = {
  title: "RecipeShare",
  description: "Descubre recetas increíbles",
};

export default function Home() {
  return (
    <div className="bg-background text-foreground antialiased min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Contenido principal */}
      </main>
      <Footer />
    </div>
  );
}