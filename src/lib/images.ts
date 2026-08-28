import type { Stop } from './schema'

function slug(value: string): string {
  return encodeURIComponent(value.trim().toLowerCase().replace(/\s+/g, '-'))
}

/** Deterministic placeholder images — separate from LLM schema; swappable later. */
export function getDestinationImageUrl(destination: string): string {
  return `https://picsum.photos/seed/dest-${slug(destination)}/1200/480`
}

export function getStopImageUrl(stop: Stop): string {
  return `https://picsum.photos/seed/stop-${slug(stop.id)}/480/280`
}
