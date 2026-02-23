import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import BlogsSection from "../components/BlogsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import FramerBackground from "../components/FramerBackground";

export default function Home() {
  return (
    <main className="min-h-screen text-foreground relative z-0 selection:bg-neon selection:text-black">
      <FramerBackground />
      <Navbar />

      <div className="flex flex-col gap-12 lg:gap-24 pb-20">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <BlogsSection />
        <ContactSection />
      </div>

      <Footer />
    </main>
  );
}
