import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { useEffect, useRef } from "react";
import { Oneko } from "lots-o-nekos";

let petHint: "invite" | "dodged" | "petted" = "invite";

/** A keyboard-accessible cat that stays beside the bottom navigation. */
export const FloatingCat = () => {
  const catRef = useRef<Oneko | null>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (!supportsFinePointer || prefersReducedMotion || isMobile) return;

    const getBounds = () => {
      const w = window.innerWidth;
      const maxX = w - 36;
      const besideNav = Math.max(w / 2 + 356, w - 200);
      // Use the space above the dock when its right margin is too narrow for the skid.
      const aboveNav = maxX - besideNav < 108;
      return {
        minX: aboveNav ? maxX - 140 : besideNav,
        maxX,
        floorY: Math.max(32, window.innerHeight - (aboveNav ? 90 : 20)),
      };
    };

    const { maxX, floorY } = getBounds();
    const initialX = maxX - 18;
    const initialY = floorY;

    if (!catRef.current) {
      catRef.current = new Oneko({
        source: assetUrl(portfolio.pet.sprite),
        speed: 4, // Gentle stroll speed
        allowedTargetDistance: 12,
        size: 32,
        x: initialX,
        y: initialY,
      });
    }

    const cat = catRef.current;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const schedule = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
      return timer;
    };
    if (!cat.element) return;
    const sprite = cat.element;
    let dodge: Animation | undefined;
    let jokeTimer: ReturnType<typeof setTimeout> | undefined;
    let dust: HTMLDivElement | undefined;

    cat.element.style.pointerEvents = "auto";
    cat.element.style.cursor = "pointer";
    cat.element.style.zIndex = "40"; // Below modals (z-50) so it never obstructs reading
    cat.element.style.transition =
      "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
    cat.element.setAttribute("title", portfolio.pet.label);
    cat.element.removeAttribute("aria-hidden");
    cat.element.setAttribute("role", "button");
    cat.element.setAttribute("aria-label", "Playful companion pet. Click to pet.");
    cat.element.setAttribute("tabindex", "0");

    const emoteContainer = document.createElement("div");
    emoteContainer.className = "oneko-emote-container";
    emoteContainer.style.position = "fixed";
    emoteContainer.style.pointerEvents = "none";
    emoteContainer.style.zIndex = "41";
    emoteContainer.style.left = "0";
    emoteContainer.style.top = "0";
    emoteContainer.style.transform = `translate(${cat.x}px, ${cat.y - 16}px) translate(-50%, -100%)`;
    emoteContainer.style.display = "flex";
    emoteContainer.style.flexDirection = "column";
    emoteContainer.style.alignItems = "center";
    document.body.appendChild(emoteContainer);

    const hint = document.createElement("span");
    hint.className =
      "whitespace-nowrap text-center font-caveat text-lg leading-none text-zinc-200 drop-shadow-md after:block after:content-['↓']";
    hint.textContent = petHint === "invite" ? "try to pet" : "maybe try again?";
    hint.setAttribute("aria-hidden", "true");
    if (petHint !== "petted") emoteContainer.appendChild(hint);

    const handleDraw = () => {
      emoteContainer.style.transform = `translate(${cat.x}px, ${cat.y - 14}px) translate(-50%, -100%)`;

      const isSleeping = cat.idleAnimation === "sleeping" && !hint.isConnected;
      const existingZzz = emoteContainer.querySelector(".pet-zzz");

      if (isSleeping && !existingZzz) {
        const zzzEl = document.createElement("span");
        zzzEl.className =
          "pet-zzz animate-pet-zzz font-mono text-xs font-bold text-indigo-300 drop-shadow-sm select-none pointer-events-none";
        zzzEl.textContent = "Zzz";
        emoteContainer.appendChild(zzzEl);
      } else if (!isSleeping && existingZzz) {
        existingZzz.remove();
      }
    };

    cat.addEventListener("draw", handleDraw);

    const stopSliding = () => {
      if (dodge) {
        dodge.onfinish = null;
        dodge.cancel();
        dodge = undefined;
      }
      sprite.style.pointerEvents = "auto";
    };

    const endDodge = () => {
      stopSliding();
      dust?.remove();
      dust = undefined;
      if (jokeTimer !== undefined) {
        clearTimeout(jokeTimer);
        timers.delete(jokeTimer);
        jokeTimer = undefined;
      }
    };

    const showRetry = () => {
      endDodge();
      hint.textContent = "maybe try again?";
      hint.hidden = false;
    };

    const handleFocus = () => {
      if (dodge) showRetry();
    };
    sprite.addEventListener("focus", handleFocus);

    const triggerPetting = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      endDodge();
      petHint = "petted";
      window.removeEventListener("pointermove", handleApproach);
      hint.remove();

      if (cat.idleAnimation === "sleeping") {
        cat.resetIdleAnimation();
      }
      cat.setSprite("alert", 0);

      if (cat.element) {
        cat.element.style.transform = "scale(1.22) translateY(-4px)";
        schedule(() => {
          if (cat.element) cat.element.style.transform = "scale(1)";
        }, 220);
      }

      const heart = document.createElement("span");
      heart.className =
        "animate-pet-heart font-sans text-xs text-rose-400 select-none drop-shadow-md";
      heart.textContent = Math.random() > 0.35 ? "♥" : "purr~";
      emoteContainer.appendChild(heart);
      schedule(() => heart.remove(), 1300);

      schedule(() => {
        if (cat.element && !cat.idleAnimation) {
          cat.idleAnimation = "scratchSelf";
          cat.idleAnimationFrame = 0;
        }
      }, 350);
    };

    cat.element.addEventListener("click", triggerPetting);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") triggerPetting(e);
    };
    cat.element.addEventListener("keydown", handleKeyDown);

    const handleApproach = (event: PointerEvent) => {
      if (petHint !== "invite" || event.pointerType !== "mouse" || event.buttons) return;
      const reach = cat.size / 2 + 10;
      if (Math.abs(event.clientX - cat.x) > reach || Math.abs(event.clientY - cat.y) > reach)
        return;
      if (sprite.inert || sprite.matches(":focus-visible")) return;

      petHint = "dodged";
      window.removeEventListener("pointermove", handleApproach);
      hint.hidden = true;
      sprite.style.pointerEvents = "none";
      cat.resetIdleAnimation();
      cat.setTarget(cat.x, cat.y);
      cat.setSprite("W", 0);
      const { minX } = getBounds();
      const landingX = Math.round(Math.max(minX, cat.x - 90));
      const facingLeft = sprite.style.backgroundPosition;
      dodge = sprite.animate(
        [
          { transform: "rotate(-7deg)", backgroundPosition: facingLeft },
          { transform: `translateX(${landingX - cat.x}px)`, backgroundPosition: facingLeft },
        ],
        { duration: 380, easing: "cubic-bezier(0.25, 0.5, 0.4, 1)", fill: "forwards" },
      );

      const trail = document.createElement("div");
      trail.className = "pointer-events-none fixed z-[41]";
      trail.style.left = `${landingX + 15}px`;
      trail.style.top = `${cat.y + 8}px`;
      trail.setAttribute("aria-hidden", "true");
      dust = document.body.appendChild(trail);
      for (const small of [true, false]) {
        const puff = document.createElement("span");
        puff.className = `absolute rounded-full bg-white before:absolute before:rounded-full before:bg-white before:content-[''] ${
          small
            ? "left-6 h-1 w-3 before:bottom-0.5 before:left-0.5 before:size-1.5"
            : "left-0 h-2 w-[18px] before:bottom-1 before:left-0.5 before:size-2.5 after:absolute after:bottom-0.5 after:right-0.5 after:size-2 after:rounded-full after:bg-white after:content-['']"
        }`;
        trail.appendChild(puff);
        const drift = puff.animate(
          [
            { opacity: 0, transform: "translateX(22px) scale(0.65)" },
            { opacity: 1, transform: "translate(12px, -2px) scale(1)", offset: 0.18 },
            { opacity: 0.9, transform: "translate(3px, -4px) scale(1.05)", offset: 0.55 },
            { opacity: 0, transform: "translate(10px, -12px) scale(1.25)" },
          ],
          { duration: small ? 390 : 520, delay: small ? 65 : 125, fill: "both" },
        );
        if (!small) drift.onfinish = () => trail.remove();
      }

      dodge.onfinish = () => {
        cat.x = landingX;
        cat.setTarget(landingX, cat.y);
        cat.setSprite("alert", 0);
        stopSliding();
        hint.textContent = "lol";
        hint.hidden = false;
        jokeTimer = schedule(showRetry, 1500);
      };
    };

    const handlePointerEnter = (event: PointerEvent) => {
      handleApproach(event);
      if (!dodge && cat.idleAnimation !== "sleeping") {
        cat.setSprite("alert", 0);
      }
    };
    if (petHint === "invite") {
      window.addEventListener("pointermove", handleApproach, { passive: true });
    }
    cat.element.addEventListener("pointerenter", handlePointerEnter);

    const scheduleNextActivity = () => {
      const delay = 9000 + Math.random() * 11000;
      schedule(() => {
        if (!cat.element || !cat.element.isConnected) return;

        // If a modal is open, keep the cat sleeping and quiet
        const isModalOpen = document.querySelector('[role="dialog"]') !== null;
        if (isModalOpen || dodge || jokeTimer !== undefined) {
          if (isModalOpen) cat.idleAnimation = "sleeping";
          scheduleNextActivity();
          return;
        }

        const currentBounds = getBounds();
        const roll = Math.random();

        if (roll < 0.45 && petHint !== "invite") {
          // Sideways stroll along the bottom floor
          const randomX =
            currentBounds.minX + Math.random() * (currentBounds.maxX - currentBounds.minX);
          cat.setTarget(Math.round(randomX), currentBounds.floorY);
        } else if (roll < 0.72) {
          // Take a peaceful nap
          cat.idleAnimation = "sleeping";
          cat.idleAnimationFrame = 0;
        } else {
          // Groom / scratch ear
          cat.idleAnimation = "scratchSelf";
          cat.idleAnimationFrame = 0;
        }

        scheduleNextActivity();
      }, delay);
    };

    scheduleNextActivity();

    const handleResize = () => {
      if (dodge) showRetry();
      const currentBounds = getBounds();
      if (window.innerWidth < 768) {
        if (cat.element) cat.element.style.display = "none";
        emoteContainer.style.display = "none";
        return;
      } else {
        if (cat.element) cat.element.style.display = "block";
        emoteContainer.style.display = "flex";
      }

      const clampedX =
        petHint === "invite"
          ? currentBounds.maxX - 18
          : Math.min(Math.max(currentBounds.minX, cat.x), currentBounds.maxX);
      cat.x = clampedX;
      cat.y = currentBounds.floorY;
      cat.setTarget(clampedX, currentBounds.floorY);
      cat.draw();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    cat.idleAnimation = "sleeping";
    cat.idleAnimationFrame = 0;

    return () => {
      endDodge();
      for (const timer of timers) clearTimeout(timer);
      cat.loopAnimating = false;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleApproach);
      cat.removeEventListener("draw", handleDraw);
      sprite.removeEventListener("focus", handleFocus);
      cat.element?.removeEventListener("click", triggerPetting);
      cat.element?.removeEventListener("keydown", handleKeyDown);
      cat.element?.removeEventListener("pointerenter", handlePointerEnter);
      cat.element?.remove();
      emoteContainer.remove();
      catRef.current = null;
    };
  }, []);

  return null;
};
