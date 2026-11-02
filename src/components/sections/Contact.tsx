import { scrollToSection } from "@/lib/scroll";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { portfolio, templateFormEndpoint, templateRecaptchaSiteKey } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { recaptchaToken } from "@/lib/recaptcha";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialDock } from "@/components/SocialDock";

const currentYear = new Date().getFullYear();

export const Contact = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const isSubmitting = status === "submitting";

  useEffect(() => () => requestRef.current?.abort(), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!portfolio.contact.formEndpoint || requestRef.current) return;
    // This helps template users; actual endpoint protection belongs in Formcarry.
    if (
      portfolio.contact.formEndpoint === templateFormEndpoint &&
      !["arshjaved.in", "metarsh.github.io"].includes(window.location.hostname)
    ) {
      setError(
        "Configure your own Formcarry endpoint in src/config/portfolio.ts to send messages.",
      );
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const { formEndpoint, recaptchaSiteKey } = portfolio.contact;
      // A copied portfolio's own form must not inherit the original site's CAPTCHA key.
      if (
        recaptchaSiteKey &&
        (formEndpoint === templateFormEndpoint || recaptchaSiteKey !== templateRecaptchaSiteKey)
      ) {
        formData.set("g-recaptcha-response", await recaptchaToken(recaptchaSiteKey));
        if (controller.signal.aborted) return;
      }
      const response = await fetch(portfolio.contact.formEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: controller.signal,
      });

      const data: unknown = await response.json();
      const result = typeof data === "object" && data !== null ? data : {};
      if (controller.signal.aborted) return;

      if (response.ok && "code" in result && result.code === 200) {
        setStatus("success");
        form.reset();
      } else {
        throw new Error(
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Could not send your message. Please try again.",
        );
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again later.",
        );
        setStatus("idle");
      }
    } finally {
      requestRef.current = null;
    }
  };

  return (
    <section
      id="contact"
      className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader align="center" className="mb-10" title={portfolio.sections.contact.title} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="flex flex-col h-full space-y-4">
            <Card className="p-3.5 sm:p-4 bg-[#0b0b10] border border-white/10 rounded-2xl shadow-xl shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="shrink-0">
                  <h3 className="text-lg sm:text-xl font-serif gradient-heading tracking-tight">
                    Direct Channels
                  </h3>
                  <a
                    href={`mailto:${portfolio.profile.email}`}
                    className="text-xs text-zinc-300 mt-0.5 font-sans hover:text-white"
                  >
                    {portfolio.profile.email}
                  </a>
                </div>

                <div className="flex items-center justify-start sm:justify-end py-2">
                  <SocialDock />
                </div>
              </div>
            </Card>

            <Card className="group p-3 bg-[#0b0b10] border border-white/10 rounded-2xl overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-500 hover:border-white/20 select-none flex-1 flex flex-col min-h-0">
              <div className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden bg-[#09090d]">
                <img
                  src={assetUrl(portfolio.contact.image)}
                  alt={portfolio.contact.imageAlt}
                  style={{ objectPosition: "center 52%" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {portfolio.contact.ditherImage && (
                  <img
                    src={assetUrl(portfolio.contact.ditherImage)}
                    alt=""
                    style={{ objectPosition: "center 52%" }}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
                    aria-hidden="true"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/50 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-2 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="font-sans text-xs text-zinc-300 font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    @{portfolio.profile.username}
                  </span>
                  <span className="font-caveat text-sm font-semibold text-rose-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {portfolio.contact.imageCaption}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-[#0b0b10] border border-white/10 rounded-2xl shadow-xl h-full flex flex-col">
            <h3 className="text-2xl sm:text-3xl font-serif mt-0.5 mb-3 gradient-heading tracking-tight">
              Drop a note
            </h3>
            {!portfolio.contact.formEndpoint ? (
              <div className="flex flex-1 flex-col justify-center gap-4">
                <p className="text-sm text-zinc-300">Send an email to get in touch.</p>
                <Button asChild>
                  <a href={`mailto:${portfolio.profile.email}`}>Email {portfolio.profile.name}</a>
                </Button>
              </div>
            ) : status === "success" ? (
              <div
                className="flex flex-col items-center justify-center py-10 text-center space-y-3 flex-1"
                role="status"
                aria-live="polite"
              >
                <CheckCircle className="h-12 w-12 text-emerald-400" aria-hidden="true" />
                <h4 className="text-xl font-semibold text-zinc-100">Message sent!</h4>
                <p className="text-sm text-zinc-300">{portfolio.contact.successMessage}</p>
                <Button
                  variant="outline"
                  onClick={() => setStatus("idle")}
                  className="mt-3 border-white/15 hover:bg-white/5 text-xs h-9"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-label="Contact form"
                data-purpose="contact-form"
                className="space-y-3 flex-1 flex flex-col"
              >
                <input type="hidden" name="_gotcha" value="" />
                <div>
                  <Label htmlFor="name" className="text-xs text-zinc-300 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                    className="mt-1 bg-black/40 border-white/10 focus-visible:border-white/30 h-10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs text-zinc-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="you@email.com"
                    required
                    className="mt-1 bg-black/40 border-white/10 focus-visible:border-white/30 h-10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>
                <div>
                  <Label htmlFor="project" className="text-xs text-zinc-300 font-medium">
                    Project (optional)
                  </Label>
                  <Input
                    id="project"
                    name="project"
                    autoComplete="off"
                    placeholder="Your project"
                    className="mt-1 bg-black/40 border-white/10 focus-visible:border-white/30 h-10 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-400"
                  />
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                  <Label htmlFor="details" className="text-xs text-zinc-300 font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="details"
                    name="details"
                    required
                    placeholder="Tell me about what you're working on, an idea, or just say hi..."
                    rows={3}
                    className="mt-1 bg-black/40 border-white/10 focus-visible:border-white/30 resize-none rounded-xl text-sm text-zinc-100 placeholder:text-zinc-400 flex-1 min-h-[75px]"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full h-10 text-sm font-semibold bg-white hover:bg-zinc-200 text-zinc-950 transition-colors border-0 rounded-xl disabled:opacity-50 mt-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send message"
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>

        <footer className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-400 text-center">
            <span>📍 {portfolio.profile.location}</span>
            <span aria-hidden="true">•</span>
            <span>{portfolio.contact.footerNote}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-zinc-400 mt-3">
            <span>
              © {currentYear} {portfolio.profile.name}
            </span>
          </div>

          <div className="mt-4 text-center">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="group hover:bg-transparent text-xs h-8"
            >
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#hero");
                }}
                className="flex items-center gap-1.5 justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Back to top{" "}
                <ArrowRight
                  className="h-3.5 w-3.5 rotate-[-90deg] group-hover:-translate-y-0.5 transition-transform"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
};
