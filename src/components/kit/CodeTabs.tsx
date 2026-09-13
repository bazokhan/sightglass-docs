import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

export interface CodeTab {
  label: string;
  code: string;
  filename?: string;
}

export function CodeTabs({ tabs, className }: { tabs: CodeTab[]; className?: string }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className={cn("min-w-0 max-w-full space-y-2", className)}>
      <div className="flex flex-wrap gap-1">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded px-2.5 py-1 font-mono text-[11.5px] transition-colors",
              i === active
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab ? <CodeBlock code={tab.code} filename={tab.filename ?? tab.label} /> : null}
    </div>
  );
}
