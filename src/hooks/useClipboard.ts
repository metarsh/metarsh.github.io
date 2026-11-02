import { useEffect, useRef, useState } from "react";

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2200);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  };

  return { copied, copyText };
};
