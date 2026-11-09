import { portfolio } from "@/config/portfolio";
import { motion } from "framer-motion";

const { stats } = portfolio.about;
const [educationSummary, ...educationDetails] = portfolio.about.education.split(" · ");

export const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#050505] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="border-y border-white/[0.08] py-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 divide-y divide-white/[0.08] md:grid-cols-3 md:divide-y-0 md:divide-x">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-start gap-2.5 px-6 py-4 md:justify-center"
              >
                <span className="text-sm font-semibold text-white tracking-tight">
                  {stat.title}
                </span>
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-sans text-sm font-medium leading-relaxed tracking-tight text-zinc-300">
            <span>{educationSummary}</span>
            {educationDetails.map((detail) => (
              <span
                key={detail}
                className="inline-flex items-baseline gap-3 whitespace-nowrap"
              >
                <span aria-hidden="true">·</span>
                {detail}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
