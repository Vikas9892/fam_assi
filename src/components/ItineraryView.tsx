import { useEffect, useMemo, useState } from 'react'
import type { Itinerary, StopCategory } from '../lib/schema'
import { CategoryFilters, type CategoryFilter } from './CategoryFilters'
import { DayTabs } from './DayTabs'
import { DestinationHero } from './DestinationHero'
import { StopCard } from './StopCard'
import { TripSummary } from './TripSummary'

type ItineraryViewProps = {
  itinerary: Itinerary
  activeDay: number
  onSelectDay: (day: number) => void
  onRemoveStop: (stopId: string) => void
  onMoveStop: (stopId: string, direction: 'up' | 'down') => void
}

export function ItineraryView({
  itinerary,
  activeDay,
  onSelectDay,
  onRemoveStop,
  onMoveStop,
}: ItineraryViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const currentDay = itinerary.days.find((day) => day.day === activeDay)

  const availableCategories = useMemo(() => {
    if (!currentDay) return [] as StopCategory[]
    return [...new Set(currentDay.stops.map((stop) => stop.category))]
  }, [currentDay])

  const visibleStops = useMemo(() => {
    if (!currentDay) return []
    if (categoryFilter === 'all') return currentDay.stops
    return currentDay.stops.filter((stop) => stop.category === categoryFilter)
  }, [currentDay, categoryFilter])

  useEffect(() => {
    if (categoryFilter !== 'all' && !availableCategories.includes(categoryFilter)) {
      setCategoryFilter('all')
    }
  }, [activeDay, availableCategories, categoryFilter])

  const firstStopTime = visibleStops[0]?.time

  return (
    <section className="itinerary-enter mt-8 space-y-6">
      <DestinationHero itinerary={itinerary} />
      <TripSummary itinerary={itinerary} />

      <DayTabs days={itinerary.days} activeDay={activeDay} onSelect={onSelectDay} />

      {currentDay && (
        <div
          role="tabpanel"
          id={`day-panel-${currentDay.day}`}
          aria-labelledby={`day-tab-${currentDay.day}`}
          className="min-w-0 space-y-5"
        >
          <div className="rounded-xl border border-fog bg-white/70 px-4 py-4 sm:px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean/60">
              Today&apos;s route
            </p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold text-ocean sm:text-2xl">
                  Day {currentDay.day} · {currentDay.label}
                </h3>
                <p className="mt-1 text-sm text-ink/70">
                  {visibleStops.length}{' '}
                  {visibleStops.length === 1 ? 'stop' : 'stops'}
                  {firstStopTime ? ` · first up at ${firstStopTime}` : ''}
                </p>
              </div>
              <CategoryFilters
                active={categoryFilter}
                onChange={setCategoryFilter}
                available={availableCategories}
              />
            </div>
          </div>

          {visibleStops.length === 0 ? (
            <p className="rounded-xl border border-dashed border-fog bg-white/70 px-4 py-8 text-center text-sm text-ink/65">
              No stops match this filter on Day {currentDay.day}. Try another category or select
              All.
            </p>
          ) : (
            <ol className="min-w-0 list-none space-y-0 pb-2" aria-label={`Day ${currentDay.day} stops`}>
              {visibleStops.map((stop, index) => (
                <li key={stop.id} className="min-w-0">
                  <StopCard
                    stop={stop}
                    stopIndex={index}
                    isFirst={index === 0}
                    isLast={index === visibleStops.length - 1}
                    isUpNext={index === 0}
                    onRemove={onRemoveStop}
                    onMove={onMoveStop}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  )
}
