import { getDestinationTheme } from '../lib/images'
import { formatDestinationHeading, getItineraryStats } from '../lib/itineraryStats'
import type { Itinerary } from '../lib/schema'
import { VisualPlaceholder } from './VisualPlaceholder'

type DestinationHeroProps = {
  itinerary: Itinerary
}

export function DestinationHero({ itinerary }: DestinationHeroProps) {
  const stats = getItineraryStats(itinerary)
  const theme = getDestinationTheme(itinerary.destination)

  return (
    <section aria-label="Trip destination" className="overflow-hidden rounded-2xl border border-fog bg-white shadow-sm">
      <div className="relative">
        <VisualPlaceholder
          theme={theme}
          label={`Visual theme for ${itinerary.destination}`}
          size="hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/85 via-ocean-deep/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Your destination
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-wide text-white sm:text-4xl">
            {formatDestinationHeading(itinerary.destination)}
          </h2>
          <p className="mt-2 text-sm font-medium text-white/90">
            {stats.totalDays} {stats.totalDays === 1 ? 'day' : 'days'} · {stats.totalStops}{' '}
            {stats.totalStops === 1 ? 'stop' : 'stops'}
          </p>
        </div>
      </div>
    </section>
  )
}
