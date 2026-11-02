import { ExternalLink, Users, Cpu } from "lucide-react";
import { assetUrl } from "@/lib/assets";
import { useRef, useEffect, useState } from "react";
import { SiTelegram, SiMongodb, SiRedis, SiPython, SiLibuv, SiMetaai } from "react-icons/si";

export const EmiliaArchitectureDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || 768;
        const targetScale = Math.min(1, Math.max(0.38, (parentWidth - 16) / 1200));
        setScale(targetScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const STAGE_W = 1200;
  const STAGE_H = 705;

  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-[#ded9ce] bg-[#f5f2eb] text-[#1d1c1a] shadow-xs selection:bg-neutral-200">
      <div className="flex items-center justify-between border-b border-[#dfdad0] bg-[#f5f2eb] px-6 py-3 text-xs font-mono text-[#6e6c64]">
        <div className="flex items-center gap-2"></div>
        <a
          href={assetUrl("/diagrams/emilia.html")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-md border border-[#dfdad0] bg-[#ffffff] px-2.5 py-1 text-[11px] font-medium text-[#1d1c1a] transition-colors hover:bg-[#ede7dc]"
        >
          <span>full screen</span>
          <ExternalLink className="h-3 w-3 text-[#6e6c64]" />
        </a>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-[#f5f2eb]"
        style={{ height: `${STAGE_H * scale}px` }}
      >
        <div
          className="absolute left-0 top-0 select-none origin-top-left"
          style={{
            width: `${STAGE_W}px`,
            height: `${STAGE_H}px`,
            transform: `scale(${scale})`,
            fontFamily: '"Geist", system-ui, -apple-system, sans-serif',
          }}
        >
          <div className="absolute left-[45px] top-[30px] flex items-baseline gap-2.5">
            <span className="text-[22px] font-bold tracking-tight text-[#1d1c1a]">Emilia</span>
            <span className="text-[22px] font-normal tracking-tight text-[#6e6c64]">
              system architecture
            </span>
          </div>

          <div className="absolute left-[890px] top-[22px] w-[255px] rounded-[10px] border border-[#dcd5c7] bg-[#ede7dc] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-[#1d1c1a] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                Supergroup Admins
              </div>
            </div>
            <div className="mt-1 text-[11.5px] text-[#6e6c64] leading-snug">
              reviews exceptions, sets filters &amp; permissions
            </div>
          </div>

          <div className="absolute left-[45px] top-[160px] w-[220px] rounded-[10px] border border-[#dcd5c7] bg-[#ede7dc] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiTelegram className="h-5 w-5 text-[#24A1DE] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                Telegram MTProto
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              Pyrogram + Telethon · ~10,000 msgs/min
            </div>
          </div>

          <div className="absolute left-[45px] top-[375px] w-[220px] rounded-[10px] border border-[#b8cefc] bg-[#e4ecfe] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiMetaai className="h-5 w-5 text-[#0081FB] shrink-0" />
              <div className="text-[14px] font-bold text-[#1c3ba8] leading-tight">
                Groq · Llama 3
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#556994] leading-snug">
              AI character persona, advisory moderation
            </div>
          </div>

          <div className="absolute left-[295px] top-[110px] w-[850px] h-[375px] rounded-[14px] border border-[#dfdad0] bg-[rgba(255,255,255,0.3)] pointer-events-none">
            <div className="px-5 pt-3.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#737067] font-mono">
              EMILIA BOT ENGINE · ASYNC PYTHON
            </div>
          </div>

          <div className="absolute left-[335px] top-[160px] w-[235px] rounded-[10px] border border-[#dfdad0] bg-[#ffffff] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiPython className="h-5 w-5 text-[#3776AB] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                Event Ingress Router
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              MTProto packet decode, event ID &amp; signature checks
            </div>
          </div>

          <div className="absolute left-[355px] top-[320px] w-[325px] rounded-[10px] border-2 border-[#1d1c1a] bg-[#ffffff] p-4 shadow-[0_2px_6px_rgba(29,28,26,0.06)]">
            <div className="flex items-center gap-2.5">
              <SiLibuv className="h-5 w-5 text-[#40B5A4] shrink-0" />
              <div className="text-[14px] font-bold text-[#1d1c1a] leading-tight">
                uvloop Async Engine
              </div>
            </div>
            <div className="mt-2 space-y-0.5 text-[11.5px] text-[#6e6c64] leading-snug">
              <div>C-based libuv loop · zero-wait dispatch</div>
              <div>modular plugins: antispam, ranks, federations</div>
              <div>the only writer: enforces permissions before mutations</div>
            </div>
          </div>

          <div className="absolute left-[890px] top-[160px] w-[240px] rounded-[10px] border border-[#dfdad0] bg-[#ffffff] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-[#1d1c1a] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                L1 Process Cache
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              OrderedDict LRU · &lt;0.05ms read · 10,000 keys
            </div>
            <div className="text-[11px] text-[#85827a] leading-snug">
              instant permission &amp; filter checks
            </div>
          </div>

          <div className="absolute left-[890px] top-[285px] w-[240px] rounded-[10px] border border-[#dfdad0] bg-[#ffffff] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiRedis className="h-5 w-5 text-[#DC382D] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                Cache Invalidation Bus
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              Redis Pub/Sub (cache_inv:*) · cluster eviction
            </div>
            <div className="text-[11px] text-[#85827a] leading-snug">
              keeps worker sharding consistent
            </div>
          </div>

          <div className="absolute left-[295px] top-[510px] w-[850px] h-[165px] rounded-[14px] border border-[#dfdad0] bg-[rgba(255,255,255,0.3)] pointer-events-none">
            <div className="px-5 pt-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#737067] font-mono">
              DATA AND INFRASTRUCTURE
            </div>
          </div>

          <div className="absolute left-[315px] top-[548px] w-[255px] rounded-[10px] border border-[#dcd5c7] bg-[#ede7dc] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiMongodb className="h-5 w-5 text-[#47A248] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                MongoDB Primary Cluster
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              Indexed replica set · pool &lt;= 100
            </div>
            <div className="text-[11px] text-[#85827a] leading-snug">
              compound indexes · IXSCAN lookups
            </div>
          </div>

          <div className="absolute left-[592px] top-[548px] w-[255px] rounded-[10px] border border-[#dcd5c7] bg-[#ede7dc] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiPython className="h-5 w-5 text-[#3776AB] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                WriteBuffer (5s Batcher)
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              In-memory dict + 5s atomic swap
            </div>
            <div className="text-[11px] text-[#85827a] leading-snug">
              bulk_write(ordered=False) cuts IOPS by 95%
            </div>
          </div>

          <div className="absolute left-[870px] top-[548px] w-[255px] rounded-[10px] border border-[#dcd5c7] bg-[#ede7dc] px-4 py-3 shadow-[0_1px_2px_rgba(29,28,26,0.03)]">
            <div className="flex items-center gap-2.5">
              <SiRedis className="h-5 w-5 text-[#DC382D] shrink-0" />
              <div className="text-[14px] font-semibold text-[#1d1c1a] leading-tight">
                Redis Cluster
              </div>
            </div>
            <div className="mt-1.5 text-[11.5px] text-[#6e6c64] leading-snug">
              L2 shared cache · orjson serialization
            </div>
            <div className="text-[11px] text-[#85827a] leading-snug">
              Pub/Sub channel &amp; distributed state
            </div>
          </div>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="arr"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6e6c64" />
              </marker>
            </defs>

            <path
              d="M 265 198 L 327 198"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 452 238 L 452 312"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 355 352 L 155 352 L 155 242"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 355 415 L 273 415"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              markerEnd="url(#arr)"
            />

            <path
              d="M 1010 94 L 1010 152"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 1010 240 L 1010 277"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 890 350 L 688 350"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 442 422 L 442 540"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              markerEnd="url(#arr)"
            />

            <path
              d="M 580 422 L 580 485 L 720 485 L 720 540"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              markerEnd="url(#arr)"
            />

            <path
              d="M 1010 365 L 1010 540"
              fill="none"
              stroke="#6e6c64"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              markerEnd="url(#arr)"
            />
          </svg>

          <div className="absolute left-[272px] top-[186px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            raw updates
          </div>

          <div className="absolute left-[460px] top-[265px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            parsed events
          </div>

          <div className="absolute left-[175px] top-[338px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            dispatched actions
          </div>

          <div className="absolute left-[280px] top-[402px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            AI prompts
          </div>

          <div className="absolute left-[1018px] top-[114px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            admin config
          </div>

          <div className="absolute left-[1018px] top-[250px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            cache miss
          </div>

          <div className="absolute left-[708px] top-[337px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            evict stale keys (Pub/Sub)
          </div>

          <div className="absolute left-[450px] top-[470px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            indexed reads (IXSCAN)
          </div>

          <div className="absolute left-[595px] top-[470px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            buffer user writes
          </div>

          <div className="absolute left-[1018px] top-[440px] rounded bg-[#f5f2eb] px-1.5 py-0.5 border border-[#dfdad0]/60 text-[10.5px] font-sans text-[#6e6c64] whitespace-nowrap shadow-xs">
            L2 sync &amp; invalidation
          </div>
        </div>
      </div>
    </div>
  );
};
