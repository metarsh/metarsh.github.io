import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";

interface CodeBlockProps {
  filename: string;
  language?: string;
  code: string;
}

export const CodeBlock = ({ filename, language = "python", code }: CodeBlockProps) => {
  const { copied, copyText } = useClipboard();
  const [copyFailed, setCopyFailed] = useState(false);

  const handleCopy = async () => {
    setCopyFailed(!(await copyText(code)));
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-white/10 bg-[#08080c] shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0c0c12] px-4 py-2.5 text-xs font-sans">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="ml-1 truncate font-mono text-zinc-300" title={filename}>
            {filename}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={`Copy code from ${filename}`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-zinc-300" />
                <span className="text-zinc-200 font-sans">copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="font-sans">{copyFailed ? "try again" : "copy"}</span>
              </>
            )}
          </button>
          <span className="sr-only" role="status">
            {copyFailed
              ? "Could not copy the code. Select the text and copy it manually."
              : copied
                ? "Code copied."
                : ""}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono text-zinc-200 selection:bg-white/20">
        <pre className="m-0 bg-transparent p-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
