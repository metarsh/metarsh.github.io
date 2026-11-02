import { portfolio } from "@/config/portfolio";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Header } from "@/components/layout/Header";
import { BottomBlur } from "@/components/layout/EdgeBlur";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { Experience } from "@/components/sections/Experience";
import { Certificates } from "@/components/sections/Certificates";
import { InsightsTeaser } from "@/components/sections/InsightsTeaser";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        Skip to content
      </a>
      <BottomBlur height={88} />
      <Header />
      <main id="main-content">
        {portfolio.sections.hero.enabled && <Hero />}
        {portfolio.sections.about.enabled && <About />}
        {portfolio.sections.skills.enabled && <Skills />}
        {portfolio.sections.work.enabled && <Projects />}
        {portfolio.sections.research.enabled && <Publications />}
        {portfolio.sections.experience.enabled && <Experience />}
        {portfolio.sections.credentials.enabled && <Certificates />}
        {portfolio.sections.insights.enabled && <InsightsTeaser />}
        {portfolio.sections.contact.enabled && <Contact />}
      </main>
    </div>
  );
};

export default Index;
