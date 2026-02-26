import { Suspense } from "react";
import { Header } from "@/components/Header";
import { RecipeCatalogue } from "./components/RecipeCatalogue";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Suspense fallback={<div className="container mx-auto px-4 py-8" />}>
          <RecipeCatalogue />
        </Suspense>
      </main>
      <Footer />
    </div>
  );  
}