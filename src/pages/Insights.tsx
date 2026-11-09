import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopBlur } from "@/components/layout/EdgeBlur";
import { TechLogo } from "@/components/TechLogo";
import { EmiliaArticle } from "@/content/EmiliaArticle";
import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";

const Insights = () => {
  const { profile, insight } = portfolio;
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 pt-24 pb-28 px-4 sm:px-6 lg:px-8 selection:bg-white/20">
      <TopBlur height={75} />
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Button
            asChild
            variant="ghost"
            className="pl-0 hover:pl-2 text-zinc-400 hover:text-white transition-all"
          >
            <Link to="/" className="flex items-center gap-2 font-sans">
              <ArrowLeft className="h-4 w-4" /> Back to Portfolio
            </Link>
          </Button>
        </div>
        <article className="font-sans">
          <header className="mb-12 border-b border-white/10 pb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mb-5">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {insight.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {insight.readingTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-[1.12] tracking-tight text-white font-normal mb-6">
              {insight.title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8">
              {insight.introduction}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <img
                  src={assetUrl(profile.avatar)}
                  alt={profile.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{profile.name}</p>
                  <p className="text-xs text-zinc-400 font-mono">author & maintainer</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] text-xs font-mono text-zinc-300 border border-white/10"
                  >
                    <TechLogo name={tag} className="w-3.5 h-3.5" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-zinc-300">
            <EmiliaArticle />
            <div className="mt-14 rounded-2xl border border-white/10 bg-[#09090e] p-6 sm:p-8 flex flex-wrap gap-3">
              {insight.links.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="outline"
                  className="border-white/15 hover:bg-white/5"
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Insights;
