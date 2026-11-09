import { ArrowDown, ExternalLink } from "lucide-react";
import { assetUrl } from "@/lib/assets";

export const EmiliaArchitectureDiagram = () => (
  <figure className="my-10 overflow-hidden rounded-2xl border border-[#dfdad0] bg-[#f5f2eb] text-[#1d1c1a]">
    <div className="flex items-center justify-between gap-4 border-b border-[#dfdad0] px-5 py-4">
      <figcaption className="text-base font-semibold">Emilia application architecture</figcaption>
      <a
        href={assetUrl("/diagrams/emilia.html")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 text-xs underline underline-offset-4"
      >
        Full screen <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    </div>

    <div className="space-y-4 p-5 sm:p-6">
      <div className="rounded-xl border border-[#dcd5c7] bg-[#ede7dc] p-4 text-center">
        <p className="text-sm font-semibold">Telegram</p>
        <p className="mt-1 text-xs leading-relaxed text-[#6e6c64]">
          A message arrives, a member joins, or someone presses a button.
        </p>
      </div>

      <ArrowDown className="mx-auto h-5 w-5 text-[#6e6c64]" aria-hidden="true" />

      <div className="rounded-xl border border-[#a8b5cd] bg-[#e8edf6] p-4">
        <p className="text-sm font-semibold">Python clients</p>
        <p className="mt-1 text-xs leading-relaxed text-[#526077]">
          Pyrogram receives Telegram events for each bot identity.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white/70 p-3">
            <p className="text-xs font-semibold">Main bot</p>
            <p className="mt-1 text-xs leading-relaxed text-[#526077]">
              Runs Emilia's modules, including music and chatbot replies.
            </p>
          </div>
          <div className="rounded-lg bg-white/70 p-3">
            <p className="text-xs font-semibold">Hosted bots</p>
            <p className="mt-1 text-xs leading-relaxed text-[#526077]">
              Separate identities and sessions using shared modules.
            </p>
          </div>
        </div>
      </div>

      <ArrowDown className="mx-auto h-5 w-5 text-[#6e6c64]" aria-hidden="true" />

      <div className="rounded-xl border border-[#dfdad0] bg-white p-4 text-center">
        <p className="text-sm font-semibold">Request handlers</p>
        <p className="mt-1 text-xs leading-relaxed text-[#6e6c64]">
          The module for the requested feature checks access and performs the action.
        </p>
      </div>

      <p className="text-center text-xs leading-relaxed text-[#6e6c64]">
        Handlers use the services their request needs.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#dcd5c7] bg-[#ede7dc] p-4">
          <p className="text-sm font-semibold">External work</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6c64]">
            Media preparation and external APIs. YouTube downloads use worker threads.
          </p>
        </div>
        <div className="rounded-xl border border-[#dcd5c7] bg-[#ede7dc] p-4">
          <p className="text-sm font-semibold">MongoDB</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6c64]">
            Group settings and saved records, including memory and clone leases.
          </p>
        </div>
        <div className="rounded-xl border border-[#dcd5c7] bg-[#ede7dc] p-4">
          <p className="text-sm font-semibold">Redis</p>
          <p className="mt-1 text-xs leading-relaxed text-[#6e6c64]">
            Atomic music queue updates and shared cached data.
          </p>
        </div>
      </div>

      <p className="text-center text-xs leading-relaxed text-[#6e6c64]">
        Results return through the bot's Telegram client.
      </p>
    </div>
  </figure>
);
