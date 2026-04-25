export interface RepoCardProps {
  url: string;
  name?: string;
  description?: string;
}

export function RepoCard({ url, name, description }: RepoCardProps) {
  return (
    <div className="my-4 border-[length:var(--border-width-hard)] border-ink bg-surface p-4 transition-colors duration-[var(--duration-base)] hover:bg-muted">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm font-semibold text-accent-blue hover:underline"
      >
        {name ?? url}
      </a>
      {description ? (
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      ) : null}
    </div>
  );
}
