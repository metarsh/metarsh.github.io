import { useEffect, useRef, type RefObject } from "react";

type DialogFocusOptions = {
  ref: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  suspended?: boolean;
};

/** Trap keyboard focus and restore it to the opener when an overlay closes. */
export const useDialogFocus = ({ ref, open, onClose, suspended = false }: DialogFocusOptions) => {
  const closeRef = useRef(onClose);
  const suspendedRef = useRef(suspended);

  useEffect(() => {
    closeRef.current = onClose;
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
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus();
    };
  }, [open, ref]);
};
