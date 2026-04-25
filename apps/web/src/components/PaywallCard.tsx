export function extractPreview(body: string, wordCount = 150): string {
  const plain = body.replace(/<[^>]+>/g, "").replace(/\{[^}]*\}/g, "");
  const words = plain.split(/\s+/).filter(Boolean);
  const preview = words.slice(0, wordCount).join(" ");
  return words.length > wordCount ? `${preview}…` : preview;
}

export function PaywallCard({ body }: { body: string }) {
  const preview = extractPreview(body);

  return (
    <div className="relative mt-8 overflow-hidden rounded-md border-[length:var(--border-width-hard)] border-ink bg-muted shadow-brutal">
      <div className="px-6 pt-6 pb-24 text-ink-soft">
        <p className="line-clamp-6 leading-relaxed">{preview}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-muted from-60% to-transparent px-6 pb-6 pt-16">
        <div className="text-center">
          <p className="font-display text-lg font-bold text-ink">
            Become a member to read this gBlock
          </p>
          <button
            type="button"
            disabled
            className="mt-4 inline-block rounded-md border-[length:var(--border-width-hard)] border-ink bg-accent-lime px-6 py-3 font-display font-bold text-ink shadow-brutal transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)]"
          >
            Join gBlockParty
          </button>
        </div>
      </div>
    </div>
  );
}
