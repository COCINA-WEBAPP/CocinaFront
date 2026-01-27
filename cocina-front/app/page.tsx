import { Header } from "@/components/Header";
import { RecipeCatalogue } from "@/components/RecipeCatalogue";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RecipeCatalogue />
      </main>
      <Footer />
    </div>
  );  
}