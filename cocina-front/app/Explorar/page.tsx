import { Header } from "@/components/Header";
import { RecipeCatalogue } from "./components/RecipeCatalogue";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RecipeCatalogue />
        <Button asChild>
          <Link href="/Main_Page">users</Link>
        </Button>  
      </main>
      <Footer />
    </div>
  );  
}