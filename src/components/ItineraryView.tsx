import { useEffect, useMemo, useState } from 'react'
import { CategoryFilters, type CategoryFilter } from './CategoryFilters'
import { DayTabs } from './DayTabs'
import { DestinationHero } from './DestinationHero'
import { StopCard } from './StopCard'
import { TripSummary } from './TripSummary'
import type { Itinerary, StopCategory } from '../lib/schema'

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
          className="space-y-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-base font-medium text-ink/75">
              Day {currentDay.day} · {currentDay.label}
            </h3>
            <CategoryFilters
              active={categoryFilter}
              onChange={setCategoryFilter}
              available={availableCategories}
            />
          </div>

          {visibleStops.length === 0 ? (
            <p className="rounded-xl border border-dashed border-fog bg-white/70 px-4 py-8 text-center text-sm text-ink/65">
              No stops match this filter on Day {currentDay.day}. Try another category or select
              All.
            </p>
          ) : (
            <div className="space-y-8 pb-2">
              {visibleStops.map((stop, index) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  isFirst={index === 0}
                  isLast={index === visibleStops.length - 1}
                  onRemove={onRemoveStop}
                  onMove={onMoveStop}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
