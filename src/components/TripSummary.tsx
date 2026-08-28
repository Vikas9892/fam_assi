import { CATEGORY_LABELS, CategoryIcon } from './icons/CategoryIcon'
import { getItineraryStats } from '../lib/itineraryStats'
import type { Itinerary, StopCategory } from '../lib/schema'

type TripSummaryProps = {
  itinerary: Itinerary
}

const DISPLAY_ORDER: StopCategory[] = ['food', 'sight', 'activity', 'transport', 'rest']

export function TripSummary({ itinerary }: TripSummaryProps) {
  const stats = getItineraryStats(itinerary)

  return (
    <section
      aria-label="Trip summary"
      className="rounded-xl border border-fog bg-white/80 px-4 py-3.5 sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ocean/60">At a glance</p>
        <div className="flex gap-5 text-center">
          <div>
            <p className="font-display text-xl font-semibold text-ocean">{stats.totalDays}</p>
            <p className="text-[11px] uppercase tracking-wide text-ink/55">
              {stats.totalDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ocean">{stats.totalStops}</p>
            <p className="text-[11px] uppercase tracking-wide text-ink/55">
              {stats.totalStops === 1 ? 'Stop' : 'Stops'}
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {DISPLAY_ORDER.map((category) => {
          const count = stats.categoryCounts[category]
          if (count === 0) return null

          return (
            <li
              key={category}
              className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/80"
            >
              <CategoryIcon category={category} className="size-3.5 text-ocean" />
              <span>{CATEGORY_LABELS[category]}</span>
              <span className="font-semibold tabular-nums text-ocean">{count}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
