import { Header } from "./components/Header";
import { ProductCatalogue } from "./components/ProductCatalogue";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductCatalogue />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}