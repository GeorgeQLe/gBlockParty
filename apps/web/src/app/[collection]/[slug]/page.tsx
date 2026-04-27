import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { loadAllGBlocks, type LoadedGBlock } from "@/lib/content";
import { HIDDEN_COLLECTIONS } from "@/lib/hidden-collections";
import { TypeBadge } from "@/components/TypeBadge";
import { CollectionBadge } from "@/components/CollectionBadge";
import { PaywallCard } from "@/components/PaywallCard";
import { YouTube } from "@/components/mdx/YouTube";
import { Callout } from "@/components/mdx/Callout";
import { RepoCard } from "@/components/mdx/RepoCard";
import { AudioPlayer } from "@/components/mdx/AudioPlayer";

function resolveContentRoot(): string {
  const candidate = path.join(process.cwd(), "content");
  if (fs.existsSync(candidate)) return candidate;
  return path.resolve(process.cwd(), "../../content");
}

const contentRoot = resolveContentRoot();

const mdxComponents = {
  YouTube,
  Callout,
  RepoCard,
  AudioPlayer,
};

type PageProps = {
  params: Promise<{ collection: string; slug: string }>;
};

function findBlock(
  collection: string,
  slug: string,
): LoadedGBlock | undefined {
  const blocks = loadAllGBlocks({ contentRoot });
  return blocks.find((b) => b.collection === collection && b.slug === slug);
}

export function generateStaticParams(): { collection: string; slug: string }[] {
  return loadAllGBlocks({ contentRoot })
    .filter((b) => !HIDDEN_COLLECTIONS.includes(b.collection))
    .map((b) => ({
      collection: b.collection,
      slug: b.slug,
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection, slug } = await params;
  const block = findBlock(collection, slug);
  if (!block) return {};
  return {
    title: block.title,
    description: block.summary ?? "",
    openGraph: {
      title: block.title,
      description: block.summary ?? "",
      ...(block.heroImage ? { images: [{ url: block.heroImage }] } : {}),
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  return match?.[1] ?? null;
}

function VideoHeader({ block }: { block: LoadedGBlock }) {
  const videoId = block.videoUrl ? extractYouTubeId(block.videoUrl) : null;
  if (!videoId) return null;
  return (
    <div className="relative mb-6 aspect-video w-full overflow-hidden border-[length:var(--border-width-hard)] border-ink">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={block.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function TextHeader({ block }: { block: LoadedGBlock }) {
  const readingTime =
    "readingTimeMinutes" in block ? block.readingTimeMinutes : undefined;
  return (
    <div className="mb-6">
      {block.heroImage && (
        <div className="mb-4 overflow-hidden border-[length:var(--border-width-hard)] border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.heroImage}
            alt={block.title}
            className="w-full object-cover"
          />
        </div>
      )}
      {readingTime && (
        <span className="inline-block rounded-sm bg-muted px-2 py-0.5 text-xs font-medium text-ink-soft">
          {readingTime} min read
        </span>
      )}
    </div>
  );
}

function CodeHeader({ block }: { block: LoadedGBlock }) {
  const url =
    "repoUrl" in block
      ? block.repoUrl
      : "demoUrl" in block
        ? block.demoUrl
        : undefined;
  if (!url) return null;
  return (
    <div className="mb-6">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border-[length:var(--border-width-hard)] border-ink bg-surface px-4 py-3 font-mono text-sm transition-colors duration-[var(--duration-base)] hover:bg-muted"
      >
        <span className="text-accent-blue">&rarr;</span>
        {url}
      </a>
    </div>
  );
}

export default async function GBlockDetailPage({ params }: PageProps) {
  const { collection, slug } = await params;
  const block = findBlock(collection, slug);
  if (!block) notFound();

  const isVideo =
    block.type === "episode" ||
    block.type === "stream" ||
    block.type === "clip";
  const isText = block.type === "tutorial" || block.type === "essay";
  const isCode =
    block.type === "repo" || block.type === "tool" || block.type === "demo";

  const isMember = block.membership === "member";

  const { content } = isMember
    ? { content: null }
    : await compileMDX({
        source: block.body,
        components: mdxComponents,
      });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${collection}`}
        className="mb-6 inline-block text-sm text-ink-soft transition-colors duration-[var(--duration-base)] hover:text-ink"
      >
        &larr; Back to {collection}
      </Link>

      {isVideo && <VideoHeader block={block} />}
      {isText && <TextHeader block={block} />}
      {isCode && <CodeHeader block={block} />}

      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
        {block.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TypeBadge type={block.type} />
        <CollectionBadge collection={collection} name={collection} />
        {block.publishedAt && (
          <span className="text-xs text-ink-soft">
            {formatDate(block.publishedAt)}
          </span>
        )}
      </div>

      {isMember ? (
        <PaywallCard body={block.body} />
      ) : (
        <article className="prose mt-8">{content}</article>
      )}
    </main>
  );
}
