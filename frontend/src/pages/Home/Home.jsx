import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Donate from "./Donate";
import FAQPreview from "./FAQPreview";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";

const Home = () => {
  return (
    <div className="bg-secondary">
      <Navbar />
      <Hero />
      <Stats />
      <section id="how-it-works" className="scroll-mt-20">
        <HowItWorks />
      </section>
      <Donate />
      <FAQPreview />
      <Footer />
    </div>
  );
};

export default Home;
