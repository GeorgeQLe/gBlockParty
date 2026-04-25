import Link from "next/link";

export interface CollectionBadgeProps {
  collection: string;
  name: string;
}

export function CollectionBadge({ collection, name }: CollectionBadgeProps) {
  return (
    <Link
      href={`/${collection}`}
      className="inline-block rounded-sm border-[length:var(--border-width-hard)] border-ink bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft hover:bg-muted"
    >
      {name}
    </Link>
  );
}
