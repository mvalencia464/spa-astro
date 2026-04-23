/**
 * Public media on R2: r2://media/spas/island-elite/ →
 * https://media.stokeleads.com/spas/island-elite/<filename>
 */
const MEDIA_ORIGIN = 'https://media.stokeleads.com';
const ISLAND_ELITE_PREFIX = '/spas/island-elite/';

/** Build a safe URL for a file in the island-elite bucket (spaces, parens, etc.). */
export function islandEliteImage(filename: string): string {
  return `${MEDIA_ORIGIN}${ISLAND_ELITE_PREFIX}${encodeURIComponent(filename)}`;
}

/** Brand / shared assets that are not (yet) in the island-elite folder. */
export function brandImage(path: string): string {
  return `${MEDIA_ORIGIN}/test/${path.replace(/^\//, '')}`;
}
