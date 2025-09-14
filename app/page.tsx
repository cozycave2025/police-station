import Header from "../components/header.jsx";
import HeroSection from "../components/hero.jsx";
import HowItWorksSection from "../components/HowItWorksSection.jsx";
import FeaturesSection from "../components/FeaturesSection.jsx";
import StatisticsSection from "../components/StatisticsSection.jsx";
import Footer from "../components/Footer.jsx";
import AboutUsSection from "../components/about.jsx";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutUsSection/> 
      <HowItWorksSection />
      <FeaturesSection />
      <StatisticsSection />
      <Footer/>
    </>
  );
}
