export function generateUrl(
  projectSlug: string,
  domain?: string,
): string {
  const d = domain ?? process.env.PLATFORM_DOMAIN ?? "localhost";
  return `https://${projectSlug}.${d}`;
}

export function generatePreviewUrl(
  projectSlug: string,
  prNumber: number,
  domain?: string,
): string {
  const d = domain ?? process.env.PLATFORM_DOMAIN ?? "localhost";
  return `https://pr-${prNumber}--${projectSlug}.${d}`;
}

export function generatePlatformUrl(domain?: string): string {
  const d = domain ?? process.env.PLATFORM_DOMAIN ?? "localhost";
  return `https://platform.${d}`;
}
