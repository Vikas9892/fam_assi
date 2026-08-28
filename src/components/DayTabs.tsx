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
      className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className={`day-tab shrink-0 rounded-xl px-4 py-3 text-left motion-safe-transition focus:outline-none focus:ring-2 focus:ring-ocean/30 ${
              isActive
                ? 'bg-ocean text-white shadow-md ring-2 ring-ocean/20'
                : 'bg-white text-ocean ring-1 ring-fog hover:bg-mist'
            }`}
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
              Day {day.day}
            </span>
            <span className="mt-0.5 block max-w-[9rem] truncate text-sm font-semibold sm:max-w-[11rem]">
              {day.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
