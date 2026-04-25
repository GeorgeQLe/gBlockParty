export interface YouTubeProps {
  id: string;
  title?: string;
}

export function YouTube({ id, title }: YouTubeProps) {
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden border-[length:var(--border-width-hard)] border-ink">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title ?? id}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
