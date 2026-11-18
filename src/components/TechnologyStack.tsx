import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { TechLogo } from "@/components/TechLogo";
import { portfolio } from "@/config/portfolio";
import { useVisibleActivity } from "@/hooks/useVisibleActivity";

const technologyMarks = (items: string[]) => {
  const namesByMark = new Map<string, string[]>();
  for (const tool of items) {
    const mark =
      tool === "Transformers" && !portfolio.technologyLogos?.Transformers ? "HuggingFace" : tool;
    const names = namesByMark.get(mark) ?? [];
    names.push(tool);
    namesByMark.set(mark, names);
  }
  return [...namesByMark].map(([mark, names]) => ({ mark, label: names.join(" / ") }));
};

export const TechnologyTiles = ({ items }: { items: string[] }) => (
  <ul aria-label="Technologies" className="technology-tiles flex flex-wrap items-center gap-1.5">
    {technologyMarks(items).map(({ mark, label }) => (
      <li key={mark} title={label} className="technology-tile">
        <TechLogo name={mark} onLight className="size-[62%]" />
        <span className="sr-only">{label}</span>
      </li>
    ))}
  </ul>
);

export const TechnologyStack = ({ items }: { items: string[] }) => {
  const tiles = technologyMarks(items).slice(0, 7);
  const count = tiles.length;
  const ref = useRef<HTMLButtonElement>(null);
  const visible = useVisibleActivity(ref);
  const reducedMotion = useReducedMotion();
  const [front, setFront] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (
      !visible ||
      reducedMotion ||
      pinned ||
      hovered ||
      count < 2 ||
      !matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!ref.current?.matches(":focus-visible")) {
        setFront((current) => (current + 1) % count);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [count, hovered, pinned, reducedMotion, visible]);

  if (!count) return null;

  return (
    <div className="technology-stack w-fit max-w-full">
      <div className="technology-stack-rail" style={{ "--tile-count": count } as CSSProperties}>
        <button
          ref={ref}
          type="button"
          aria-label="Keep the project tech stack open"
          aria-description={items.join(", ")}
          aria-pressed={pinned}
          disabled={count < 2}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setPinned((current) => !current)}
          className="technology-stack-button rounded-xl enabled:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {tiles.map(({ mark, label }, index) => {
            const depth = (index - front + count) % count;
            const offset = Math.ceil(depth / 2) * (depth % 2 ? 1 : -1);
            return (
              <span
                key={mark}
                title={label}
                className="technology-tile technology-stack-tile"
                aria-hidden="true"
                style={
                  {
                    "--tile-depth": depth,
                    "--tile-offset": offset,
                    "--tile-column": index,
                  } as CSSProperties
                }
              >
                <TechLogo name={mark} onLight className="size-[62%]" />
              </span>
            );
          })}
        </button>
      </div>
    </div>
  );
};
