import Link from "next/link";
import type { GBlock } from "@gblockparty/gblock-schema";
import { TypeBadge } from "./TypeBadge";
import { CollectionBadge } from "./CollectionBadge";

const placeholderColor: Record<string, string> = {
  episode: "bg-accent-coral",
  stream: "bg-accent-coral",
  clip: "bg-accent-coral",
  repo: "bg-accent-blue",
  tool: "bg-accent-blue",
  demo: "bg-accent-blue",
  tutorial: "bg-ink",
  essay: "bg-ink",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface GBlockCardProps {
  block: GBlock;
  collectionName?: string;
}

export function GBlockCard({ block, collectionName }: GBlockCardProps) {
  const href = `/${block.collection}/${block.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border-[length:var(--border-width-hard)] border-ink bg-paper shadow-brutal transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
      {block.heroImage ? (
        <img
          src={block.heroImage}
          alt=""
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div
          className={`aspect-video w-full ${placeholderColor[block.type]}`}
        />
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={block.type} />
          <CollectionBadge
            collection={block.collection}
            name={collectionName ?? block.collection}
          />
        </div>

        <h3 className="font-display text-lg font-bold leading-snug">
          <Link href={href} className="hover:underline">
            {block.title}
          </Link>
        </h3>

        {block.publishedAt && (
          <time
            dateTime={block.publishedAt}
            className="mt-auto text-sm text-ink-soft"
          >
            {formatDate(block.publishedAt)}
          </time>
        )}
      </div>
    </article>
  );
}
