import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero";
import { ProgressionSection } from "@/components/landing/progression";
import { QuestSection } from "@/components/landing/quests";
import { CharacterSection } from "@/components/landing/character";
import { RewardsSection } from "@/components/landing/rewards";
import { CTASection } from "@/components/landing/cta";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProgressionSection />
        <QuestSection />
        <CharacterSection />
        <RewardsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
