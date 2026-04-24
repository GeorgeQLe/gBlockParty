export interface AudioPlayerProps {
  src: string;
  title?: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <figure data-mdx="audio-player">
      {title ? <figcaption>{title}</figcaption> : null}
      <audio controls src={src} />
    </figure>
  );
}
