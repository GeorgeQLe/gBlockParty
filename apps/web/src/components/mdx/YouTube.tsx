export interface YouTubeProps {
  id: string;
  title?: string;
}

export function YouTube({ id, title }: YouTubeProps) {
  return (
    <div data-mdx="youtube" data-id={id}>
      YouTube: {title ?? id}
    </div>
  );
}
