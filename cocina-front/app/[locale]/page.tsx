import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/landing/HeroSection";
import { CTASection } from "@/components/landing/CTASection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="pb-20 md:pb-0">
      <HeroSection />
      <CTASection />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
