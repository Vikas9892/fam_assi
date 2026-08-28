import type { Day } from '../lib/schema'

type DayTabsProps = {
  days: Day[]
  activeDay: number
  onSelect: (day: number) => void
}

export function DayTabs({ days, activeDay, onSelect }: DayTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => {
        const isActive = day.day === activeDay

        return (
          <button
            key={day.day}
            type="button"
            onClick={() => onSelect(day.day)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            Day {day.day}
          </button>
        )
      })}
    </div>
  )
}
