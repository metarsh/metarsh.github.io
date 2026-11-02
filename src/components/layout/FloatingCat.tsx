import { portfolio } from "@/config/portfolio";
import { assetUrl } from "@/lib/assets";
import { useEffect, useRef } from "react";
import { Oneko } from "lots-o-nekos";

/** A keyboard-accessible cat that stays beside the bottom navigation. */
export const FloatingCat = () => {
  const catRef = useRef<Oneko | null>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    if (!supportsFinePointer || prefersReducedMotion || isMobile) return;

    const getFloorY = () => Math.max(32, window.innerHeight - 20);
    const getBounds = () => {
      const w = window.innerWidth;
      const maxX = w - 36;
      // The nav pill is centered and at most 672px wide (max-w-2xl), so its right
      // edge sits at most at w / 2 + 336. Stroll clear of it, on the right.
      let minX = Math.max(w / 2 + 356, w - 200);
      // Guard: never let the range invert. At ~768px the pill spans nearly the whole
      // viewport, so fall back to hugging the right edge rather than the pill.
      if (minX >= maxX) minX = maxX - 40;
      if (minX <= w / 2 + 336) minX = Math.min(maxX, w / 2 + 340);
      return { minX, maxX, floorY: getFloorY() };
    };

    const { minX, maxX, floorY } = getBounds();
    const initialX = Math.min(maxX, Math.max(minX, maxX - 24));
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

    cat.element.style.pointerEvents = "auto";
    cat.element.style.cursor = "pointer";
    cat.element.style.zIndex = "40"; // Below modals (z-50) so it never obstructs reading
    cat.element.style.transition =
      "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease";
    cat.element.setAttribute("title", portfolio.pet.label);
    cat.element.setAttribute("role", "button");
    cat.element.setAttribute("aria-label", "Playful companion pet. Click to pet.");
    cat.element.setAttribute("tabindex", "0");

    const emoteContainer = document.createElement("div");
    emoteContainer.className = "oneko-emote-container";
    emoteContainer.style.position = "fixed";
    emoteContainer.style.pointerEvents = "none";
    emoteContainer.style.zIndex = "41";
    emoteContainer.style.left = `${cat.x}px`;
    emoteContainer.style.top = `${cat.y - 16}px`;
    emoteContainer.style.transform = "translate(-50%, -100%)";
    emoteContainer.style.display = "flex";
    emoteContainer.style.flexDirection = "column";
    emoteContainer.style.alignItems = "center";
    document.body.appendChild(emoteContainer);

    const handleDraw = () => {
      emoteContainer.style.left = `${cat.x}px`;
      emoteContainer.style.top = `${cat.y - 14}px`;

      const isSleeping = cat.idleAnimation === "sleeping";
      const existingZzz = emoteContainer.querySelector(".pet-zzz");

      if (isSleeping && !existingZzz) {
        const zzzEl = document.createElement("span");
        zzzEl.className =
          "pet-zzz animate-pet-zzz font-mono text-[11px] font-bold text-indigo-300/80 drop-shadow-sm select-none pointer-events-none";
        zzzEl.textContent = "Zzz";
        emoteContainer.appendChild(zzzEl);
      } else if (!isSleeping && existingZzz) {
        existingZzz.remove();
      }
    };

    cat.addEventListener("draw", handleDraw);

    const triggerPetting = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

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

    const handleMouseEnter = () => {
      if (cat.idleAnimation !== "sleeping") {
        cat.setSprite("alert", 0);
      }
    };
    cat.element.addEventListener("mouseenter", handleMouseEnter);

    const scheduleNextActivity = () => {
      const delay = 9000 + Math.random() * 11000;
      schedule(() => {
        if (!cat.element || !cat.element.isConnected) return;

        // If a modal is open, keep the cat sleeping and quiet
        const isModalOpen = document.querySelector('[role="dialog"]') !== null;
        if (isModalOpen) {
          cat.idleAnimation = "sleeping";
          scheduleNextActivity();
          return;
        }

        const currentBounds = getBounds();
        const roll = Math.random();

        if (roll < 0.45) {
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
      const currentBounds = getBounds();
      if (window.innerWidth < 768) {
        if (cat.element) cat.element.style.display = "none";
        emoteContainer.style.display = "none";
        return;
      } else {
        if (cat.element) cat.element.style.display = "block";
        emoteContainer.style.display = "flex";
      }

      const clampedX = Math.min(Math.max(currentBounds.minX, cat.x), currentBounds.maxX);
      cat.setPosition(clampedX, currentBounds.floorY);
      cat.setTarget(clampedX, currentBounds.floorY);
      cat.draw();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    cat.idleAnimation = "sleeping";
    cat.idleAnimationFrame = 0;

    return () => {
      for (const timer of timers) clearTimeout(timer);
      cat.loopAnimating = false;
      window.removeEventListener("resize", handleResize);
      cat.removeEventListener("draw", handleDraw);
      cat.element?.removeEventListener("click", triggerPetting);
      cat.element?.removeEventListener("keydown", handleKeyDown);
      cat.element?.removeEventListener("mouseenter", handleMouseEnter);
      cat.element?.remove();
      emoteContainer.remove();
      catRef.current = null;
    };
  }, []);

  return null;
};
