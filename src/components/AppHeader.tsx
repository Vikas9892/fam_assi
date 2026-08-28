import { CompassIcon } from './icons/CompassIcon'

type AppHeaderProps = {
  onNewTrip?: () => void
  showNewTrip: boolean
}

export function AppHeader({ onNewTrip, showNewTrip }: AppHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-ocean">
          <CompassIcon className="size-6" />
          <p className="text-sm font-semibold tracking-wide">Trip Planner</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ocean sm:text-4xl">
          Chart your journey
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
          Turn a rough travel idea into a structured day-by-day route you can browse, trim, and
          reorder.
        </p>
      </div>

      {showNewTrip && onNewTrip && (
        <button
          type="button"
          onClick={onNewTrip}
          className="btn-press inline-flex min-h-11 items-center rounded-xl border border-fog bg-white px-4 py-2.5 text-sm font-semibold text-ocean shadow-sm motion-safe-transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30"
        >
          New trip
        </button>
      )}
    </header>
  )
}
