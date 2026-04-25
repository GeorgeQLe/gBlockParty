import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import type { GBlockType } from "@gblockparty/gblock-schema";
import { loadCollection, loadAllGBlocks } from "@/lib/content";
import { GBlockCard } from "@/components/GBlockCard";

function resolveContentRoot(): string {
  const candidate = path.join(process.cwd(), "content");
  if (fs.existsSync(candidate)) return candidate;
  return path.resolve(process.cwd(), "../../content");
}

const contentRoot = resolveContentRoot();
const collectionsRoot = path.join(contentRoot, "collections");

type PageProps = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ type?: string }>;
};

export function generateStaticParams(): { collection: string }[] {
  return fs
    .readdirSync(collectionsRoot)
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => ({ collection: f.replace(/\.yaml$/, "") }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = loadCollection(slug, { collectionsRoot });
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      title: collection.name,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { collection: slug } = await params;
  const { type: activeType } = await searchParams;

  const collection = loadCollection(slug, { collectionsRoot });

  const allBlocks = loadAllGBlocks({ contentRoot });
  let blocks = allBlocks
    .filter((b) => b.collection === slug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

  const typesInCollection = [
    ...new Set(blocks.map((b) => b.type)),
  ] as GBlockType[];

  if (activeType) {
    blocks = blocks.filter((b) => b.type === activeType);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">{collection.name}</h1>
        <p className="mt-2 text-lg text-ink-soft">{collection.description}</p>
      </header>

      {typesInCollection.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            href={`/${slug}`}
            label="All"
            active={!activeType}
          />
          {typesInCollection.map((t) => (
            <FilterChip
              key={t}
              href={`/${slug}?type=${t}`}
              label={t}
              active={activeType === t}
            />
          ))}
        </div>
      )}

      {blocks.length === 0 ? (
        <p className="mt-8 text-center text-ink-soft">
          No gBlocks in this collection yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <GBlockCard
              key={block.slug}
              block={block}
              collectionName={collection.name}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-sm border-[length:var(--border-width-hard)] border-ink px-3 py-1 text-xs font-medium capitalize transition-colors duration-[var(--duration-base)] ${
        active
          ? "bg-ink text-paper"
          : "bg-surface text-ink-soft hover:bg-muted"
      }`}
    >
      {label}
    </Link>
  );
}
