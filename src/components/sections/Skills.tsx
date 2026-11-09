import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { TechLogo } from "@/components/TechLogo";
import { portfolio } from "@/config/portfolio";
import type { StackTool } from "@/types/portfolio";

const { languages, machine, layers: stackLayers } = portfolio.skills;

const CAT = `   /\\_/\\
  ( o.o )
   > ^ <`;

const LINK_CLASS =
  "group inline-flex max-w-full items-baseline gap-1.5 text-zinc-300 transition-colors hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b10]";

const NAME_CLASS =
  "underline decoration-white/20 decoration-dotted underline-offset-4 group-hover:decoration-white/50";

const ToolList = ({ tools }: { tools: StackTool[] }) => (
  <>
    {tools.map((tool, index) => (
      <span key={tool.name}>
        {index > 0 ? <span className="text-muted-foreground">, </span> : null}
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          title={tool.note}
          aria-label={`${tool.name} (opens in a new tab)`}
          className={LINK_CLASS}
        >
          <TechLogo name={tool.name} className="h-3.5 w-3.5 shrink-0 self-center" colored={false} />
          <span className={NAME_CLASS}>{tool.name}</span>
        </a>
      </span>
    ))}
  </>
);

export const Skills = () => {
  const reduceMotion = useReducedMotion();

  const atIndex = machine.host.indexOf("@");
  const hostUser = atIndex === -1 ? machine.host : machine.host.slice(0, atIndex);
  const hostSuffix = atIndex === -1 ? "" : machine.host.slice(atIndex);

  const dollarIndex = machine.prompt.indexOf("$");
  const promptLead = dollarIndex === -1 ? "" : machine.prompt.slice(0, dollarIndex + 1);
  const promptCommand = dollarIndex === -1 ? machine.prompt : machine.prompt.slice(dollarIndex + 1);

  return (
    <section id="skills" className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl relative z-10">
        <SectionHeader align="center" title={portfolio.sections.skills.title} />

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-2 truncate font-mono text-xs">
              <span className="text-zinc-300">{hostUser}</span>
              <span className="text-muted-foreground">{hostSuffix}</span>
            </span>
          </div>

          <div className="p-5 font-mono text-xs leading-relaxed sm:p-6 sm:text-sm">
            <p className="break-words">
              <span className="text-muted-foreground">{promptLead}</span>
              <span className="text-zinc-200">{promptCommand}</span>
              <span
                className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-zinc-400 align-middle"
                aria-hidden="true"
              />
            </p>

            <div className="mt-5 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
              <pre className="hidden whitespace-pre text-zinc-500 sm:block" aria-hidden="true">
                {CAT}
              </pre>

              <div className="min-w-0">
                <div className="grid gap-y-1">
                  {machine.rows.map((row) => (
                    <div key={row.key} className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-3">
                      <span className="whitespace-nowrap text-muted-foreground">{row.key}</span>
                      <span className="min-w-0 text-zinc-200">{row.value}</span>
                    </div>
                  ))}

                  <div className="h-2" aria-hidden="true" />

                  {stackLayers.map((layer) => (
                    <div key={layer.id} className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-3">
                      <span className="whitespace-nowrap text-muted-foreground" title={layer.headline}>
                        <span
                          className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                          style={{ backgroundColor: layer.matte }}
                        />
                        {layer.id}
                      </span>
                      <span className="min-w-0 text-zinc-300">
                        <ToolList tools={layer.tools} />
                      </span>
                    </div>
                  ))}

                  <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-3">
                    <span className="whitespace-nowrap text-muted-foreground">langs</span>
                    <span className="min-w-0 text-zinc-300">
                      <ToolList tools={languages} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="sr-only">
              Layer accent palette: one swatch per stack layer, followed by a neutral base swatch.
            </p>
            <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
              {stackLayers.map((layer) => (
                <span
                  key={layer.id}
                  className="h-4 w-8 rounded-sm"
                  style={{ backgroundColor: layer.matte }}
                />
              ))}
              <span className="h-4 w-8 rounded-sm" style={{ backgroundColor: "#e4e4e7" }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
