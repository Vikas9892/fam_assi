import type { Stop, StopCategory } from './schema'

export type VisualTheme = {
  gradient: string
  accent: string
  pattern: 'destination' | 'stop'
}

const DESTINATION_GRADIENTS = [
  'from-ocean via-ocean-deep to-pine/80',
  'from-ocean-deep via-ocean to-coral/50',
  'from-pine/90 via-ocean to-ocean-deep',
  'from-ocean via-pine/70 to-ocean-deep',
  'from-ocean-deep via-coral/40 to-ocean',
] as const

const CATEGORY_GRADIENTS: Record<StopCategory, string> = {
  food: 'from-coral/80 via-coral-dark/70 to-ocean/60',
  sight: 'from-ocean via-ocean-deep to-pine/70',
  activity: 'from-pine via-ocean to-ocean-deep',
  transport: 'from-ink/70 via-ocean/80 to-ocean-deep',
  rest: 'from-sand-dark via-mist to-ocean/40',
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(value: string, max = 2): string {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, max).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/** Deterministic visual themes — decoupled from LLM; no external image URLs. */
export function getDestinationTheme(destination: string): VisualTheme {
  const index = hashString(destination) % DESTINATION_GRADIENTS.length
  return {
    gradient: DESTINATION_GRADIENTS[index],
    accent: initials(destination),
    pattern: 'destination',
  }
}

export function getStopTheme(stop: Stop): VisualTheme {
  return {
    gradient: CATEGORY_GRADIENTS[stop.category],
    accent: initials(stop.title, 1),
    pattern: 'stop',
  }
}

export function getDestinationMonogram(destination: string): string {
  return initials(destination)
}
