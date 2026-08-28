import type { Itinerary, StopCategory } from './schema'

export type CategoryCounts = Record<StopCategory, number>

export type ItineraryStats = {
  totalDays: number
  totalStops: number
  categoryCounts: CategoryCounts
}

const EMPTY_COUNTS: CategoryCounts = {
  food: 0,
  sight: 0,
  activity: 0,
  transport: 0,
  rest: 0,
}

export function getItineraryStats(itinerary: Itinerary): ItineraryStats {
  const categoryCounts: CategoryCounts = { ...EMPTY_COUNTS }

  for (const day of itinerary.days) {
    for (const stop of day.stops) {
      categoryCounts[stop.category] += 1
    }
  }

  const totalStops = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)

  return {
    totalDays: itinerary.days.length,
    totalStops,
    categoryCounts,
  }
}

export function formatDestinationHeading(destination: string): string {
  return destination.trim().toUpperCase()
}
