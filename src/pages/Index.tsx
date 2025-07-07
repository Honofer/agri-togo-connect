import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarketSection from "@/components/MarketSection";
import AdviceSection from "@/components/AdviceSection";
import WeatherSection from "@/components/WeatherSection";
import FinancingSection from "@/components/FinancingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <MarketSection />
        <AdviceSection />
        <WeatherSection />
        <FinancingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
