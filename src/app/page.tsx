import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Hybrid } from "@/components/landing/hybrid";
import { HowTo } from "@/components/landing/how-to";
import { Pricing } from "@/components/landing/pricing";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Hybrid />
        <Features />
        <HowTo />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
