import { ArrowRight } from "lucide-react";
import { portfolio } from "@/config/portfolio";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TechnologyTiles } from "@/components/TechnologyStack";

export const InsightsTeaser = () => {
  return (
    <section
      id="insights"
      className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#050505] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white font-normal">
              {portfolio.sections.insights.title}
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden sm:flex gap-2 text-muted-foreground hover:text-white hover:bg-transparent"
          >
            <Link to="/insights">
              View all posts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015] p-8 sm:p-10 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.03]">
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-display font-normal mb-4 tracking-tight text-white">
              {portfolio.insight.title}
            </h3>

            <p className="text-base text-zinc-300 mb-8 max-w-2xl leading-relaxed">
              {portfolio.insight.summary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.07]">
              <TechnologyTiles items={portfolio.insight.tags} />
              <Button
                asChild
                className="max-w-full whitespace-normal gap-2 bg-white/10 hover:bg-white/20 text-white border-0 font-sans"
              >
                <Link to="/insights">
                  <span className="min-w-0 break-words">Read article</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/insights">
              View all posts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
