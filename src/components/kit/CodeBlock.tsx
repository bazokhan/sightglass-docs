import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  dense?: boolean;
}

export function CodeBlock({ code, language = "ts", filename, className, dense }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={cn(
        "group relative min-w-0 max-w-full overflow-hidden rounded-md border border-border bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 bg-surface-2/50 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {filename ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? <Check className="size-3 text-ok" /> : <Copy className="size-3" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre
        className={cn(
          "block w-full min-w-0 max-w-full overflow-x-auto px-4 text-[12.5px] leading-relaxed text-foreground/90",
          dense ? "py-2.5" : "py-3.5",
        )}
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
