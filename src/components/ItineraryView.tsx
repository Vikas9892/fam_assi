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
    <section className="mt-8 space-y-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{itinerary.destination}</h2>
      </header>

      <DayTabs days={itinerary.days} activeDay={activeDay} onSelect={onSelectDay} />

      {currentDay && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">
            Day {currentDay.day}: {currentDay.label}
          </h3>

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
      )}
    </section>
  )
}
