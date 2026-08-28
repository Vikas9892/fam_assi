import { DayTabs } from './DayTabs'
import { StopCard } from './StopCard'
import type { Itinerary } from '../lib/schema'

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
  const currentDay = itinerary.days.find((day) => day.day === activeDay)

  return (
    <section className="mt-8 space-y-5">
      <header className="border-b border-fog pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean/60">
          Your route
        </p>
        <h2 className="font-display text-3xl font-semibold text-ocean">
          {itinerary.destination}
        </h2>
      </header>

      <DayTabs days={itinerary.days} activeDay={activeDay} onSelect={onSelectDay} />

      {currentDay && (
        <div
          role="tabpanel"
          id={`day-panel-${currentDay.day}`}
          aria-labelledby={`day-tab-${currentDay.day}`}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-ink/70">
            Day {currentDay.day} · {currentDay.label}
          </h3>

          <div className="space-y-4">
            {currentDay.stops.map((stop, index) => (
              <StopCard
                key={stop.id}
                stop={stop}
                isFirst={index === 0}
                isLast={index === currentDay.stops.length - 1}
                onRemove={onRemoveStop}
                onMove={onMoveStop}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
