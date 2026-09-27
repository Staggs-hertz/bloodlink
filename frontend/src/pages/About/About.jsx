import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import AboutHero from "./AboutHero";
import MissionVision from "./MissionVision";
import OurValues from "./OurValues";
import TeamCTA from "./TeamCTA";

const About = () => {
  return (
    <div className="flex flex-col bg-secondary">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <MissionVision />
        <OurValues />
        <TeamCTA />
      </main>
      <Footer />
    </div>
  );
};

export default About;
