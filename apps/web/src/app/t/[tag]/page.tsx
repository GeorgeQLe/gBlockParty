import type { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams(): { tag: string }[] {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Tag: ${tag}`,
    description: `gBlocks tagged with "${tag}"`,
    openGraph: {
      title: `Tag: ${tag}`,
      description: `gBlocks tagged with "${tag}"`,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold">#{tag}</h1>
      <p className="mt-4 text-lg text-ink-soft">Tag pages coming soon.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-ink-soft transition-colors duration-[var(--duration-base)] hover:text-ink"
      >
        &larr; Back to home
      </Link>
    </main>
  );
}
