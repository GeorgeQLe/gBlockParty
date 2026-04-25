import type { GBlockType } from "@gblockparty/gblock-schema";

const colorByType: Record<GBlockType, string> = {
  episode: "bg-accent-coral text-paper",
  stream: "bg-accent-coral text-paper",
  clip: "bg-accent-coral text-paper",
  repo: "bg-accent-blue text-paper",
  tool: "bg-accent-blue text-paper",
  demo: "bg-accent-blue text-paper",
  tutorial: "bg-ink text-paper",
  essay: "bg-ink text-paper",
};

export interface TypeBadgeProps {
  type: GBlockType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${colorByType[type]}`}
    >
      {type}
    </span>
  );
}
