import { Suspense } from "react";
import { Header } from "@/components/Header";
import { RecipeCatalogue } from "./components/RecipeCatalogue";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* pb-20 en móvil para evitar que el contenido quede detrás del MobileBottomNav */}
      <main className="pb-20 md:pb-0">
        <Suspense fallback={<div className="container mx-auto px-4 py-8" />}>
          <RecipeCatalogue />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}