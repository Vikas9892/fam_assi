import { CATEGORY_LABELS, CategoryIcon } from './icons/CategoryIcon'
import type { StopCategory } from '../lib/schema'

export type CategoryFilter = 'all' | StopCategory

type CategoryFiltersProps = {
  active: CategoryFilter
  onChange: (filter: CategoryFilter) => void
  available: StopCategory[]
}

const FILTER_OPTIONS: CategoryFilter[] = [
  'all',
  'food',
  'sight',
  'activity',
  'transport',
  'rest',
]

export function CategoryFilters({ active, onChange, available }: CategoryFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter stops by category"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {FILTER_OPTIONS.map((option) => {
        if (option !== 'all' && !available.includes(option)) return null

        const isActive = active === option
        const label = option === 'all' ? 'All' : CATEGORY_LABELS[option]

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold motion-safe-transition focus:outline-none focus:ring-2 focus:ring-ocean/30 ${
              isActive
                ? 'bg-ocean text-white shadow-sm'
                : 'bg-white text-ocean ring-1 ring-fog hover:bg-mist'
            }`}
          >
            {option !== 'all' && <CategoryIcon category={option} className="size-3.5" />}
            {label}
          </button>
        )
      })}
    </div>
  )
}
