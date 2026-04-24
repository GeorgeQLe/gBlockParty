import type { ReactNode } from "react";

export interface CalloutProps {
  tone?: "info" | "warn" | "note";
  children?: ReactNode;
}

export function Callout({ tone = "info", children }: CalloutProps) {
  return (
    <aside data-mdx="callout" data-tone={tone}>
      {children}
    </aside>
  );
}
