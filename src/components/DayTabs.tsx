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
      className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(day.day)}
            className={`day-tab min-h-11 shrink-0 rounded-xl px-3.5 py-2.5 text-left motion-safe-transition focus:outline-none focus:ring-2 focus:ring-ocean/30 ${
              isActive
                ? 'bg-ocean text-white shadow-md ring-2 ring-ocean/25'
                : 'bg-white text-ocean ring-1 ring-fog hover:bg-mist'
            }`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-[0.14em] ${
                isActive ? 'text-white/85' : 'text-ocean/65'
              }`}
            >
              Day {day.day}
            </span>
            <span className="mt-0.5 block max-w-[8.5rem] truncate text-sm font-semibold sm:max-w-[10rem]">
              {day.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
