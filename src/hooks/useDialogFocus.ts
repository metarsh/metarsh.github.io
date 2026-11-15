import { useEffect, useRef, type RefObject } from "react";

type DialogFocusOptions = {
  ref: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  suspended?: boolean;
};

/** Focus a body-level overlay, exclude its background, and restore its opener. */
export const useDialogFocus = ({ ref, open, onClose, suspended = false }: DialogFocusOptions) => {
  const closeRef = useRef(onClose);
  const suspendedRef = useRef(suspended);
  const nestedOpenerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
    if (suspended && !suspendedRef.current)
      nestedOpenerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!suspended && suspendedRef.current) nestedOpenerRef.current?.focus();
    suspendedRef.current = suspended;
  }, [onClose, suspended]);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const focusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);

    const overlay = dialog.closest("[data-modal-root]");
    const background = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element !== overlay &&
          !["SCRIPT", "STYLE", "LINK"].includes(element.tagName),
      )
      .map((element) => ({ element, inert: element.getAttribute("inert") }));
    background.forEach(({ element }) => {
      element.setAttribute("inert", "true");
    });
    const observer = new MutationObserver((records) => {
      if (suspendedRef.current) return;
      for (const record of records)
        for (const node of record.addedNodes) {
          if (
            !(node instanceof HTMLElement) ||
            node === overlay ||
            ["SCRIPT", "STYLE", "LINK"].includes(node.tagName)
          )
            continue;
          background.push({ element: node, inert: node.getAttribute("inert") });
          node.setAttribute("inert", "true");
        }
    });
    observer.observe(document.body, { childList: true });
    document.body.style.overflow = "hidden";
    (focusableElements()[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (suspendedRef.current) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      } else if (event.key === "Tab") {
        const elements = focusableElements();
        const first = elements[0] ?? dialog;
        const last = elements[elements.length - 1] ?? dialog;
        const active = document.activeElement;
        if (!dialog.contains(active) || (event.shiftKey ? active === first : active === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
      background.forEach(({ element, inert }) => {
        if (inert === null) element.removeAttribute("inert");
        else element.setAttribute("inert", inert);
      });
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus();
      else document.querySelector<HTMLElement>("header a[href]")?.focus();
    };
  }, [open, ref]);
};
