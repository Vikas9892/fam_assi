import type { Day } from '../lib/schema'

type DayTabsProps = {
  days: Day[]
  activeDay: number
  onSelect: (day: number) => void
}

export function DayTabs({ days, activeDay, onSelect }: DayTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Trip days"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {days.map((day) => {
        const isActive = day.day === activeDay

        return (
          <button
            key={day.day}
            type="button"
            role="tab"
            id={`day-tab-${day.day}`}
            aria-controls={`day-panel-${day.day}`}
            aria-selected={isActive}
            onClick={() => onSelect(day.day)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors motion-safe-transition focus:outline-none focus:ring-2 focus:ring-ocean/30 ${
              isActive
                ? 'bg-ocean text-white shadow-sm'
                : 'bg-white text-ocean ring-1 ring-fog hover:bg-mist'
            }`}
          >
            Day {day.day}
          </button>
        )
      })}
    </div>
  )
}
