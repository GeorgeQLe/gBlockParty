import type { ReactNode } from "react";

export interface CalloutProps {
  tone?: "info" | "warn" | "note";
  children?: ReactNode;
}

const toneStyles: Record<string, string> = {
  info: "border-accent-blue bg-accent-blue/10",
  warn: "border-accent-coral bg-accent-coral/10",
  note: "border-ink bg-muted",
};

export function Callout({ tone = "info", children }: CalloutProps) {
  return (
    <aside
      className={`my-4 border-l-4 px-4 py-3 text-sm ${toneStyles[tone] ?? toneStyles.info}`}
    >
      {children}
    </aside>
  );
}
