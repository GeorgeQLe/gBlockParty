export interface RepoCardProps {
  url: string;
  name?: string;
  description?: string;
}

export function RepoCard({ url, name, description }: RepoCardProps) {
  return (
    <div data-mdx="repo-card">
      <a href={url}>{name ?? url}</a>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
