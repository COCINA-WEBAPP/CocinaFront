import { Header } from "./components/Header";
import { RecipeCatalogue } from "./components/RecipeCatalogue";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RecipeCatalogue />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}