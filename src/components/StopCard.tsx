import { useState } from 'react'
import type { Stop, StopCategory } from '../lib/schema'

const CATEGORY_STYLES: Record<StopCategory, string> = {
  food: 'bg-coral/15 text-coral-dark ring-coral/25',
  sight: 'bg-ocean/10 text-ocean ring-ocean/20',
  activity: 'bg-pine/15 text-pine ring-pine/25',
  transport: 'bg-ink/8 text-ink/80 ring-ink/15',
  rest: 'bg-sand-dark text-ink/70 ring-sand-dark',
}

type StopCardProps = {
  stop: Stop
  isFirst: boolean
  isLast: boolean
  onRemove: (stopId: string) => void
  onMove: (stopId: string, direction: 'up' | 'down') => void
}

export function StopCard({ stop, isFirst, isLast, onRemove, onMove }: StopCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="relative pl-8">
      <span
        aria-hidden="true"
        className={`absolute left-[7px] w-0.5 bg-ocean/25 ${isFirst ? 'top-4' : 'top-0'} ${isLast ? 'bottom-[calc(100%-1rem)]' : 'bottom-0'}`}
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-4 size-4 rounded-full border-2 border-ocean bg-white"
      />

      <div className="motion-safe-transition rounded-xl border border-fog bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {stop.time && (
                <span className="text-xs font-medium uppercase tracking-wide text-ocean/60">
                  {stop.time}
                </span>
              )}
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${CATEGORY_STYLES[stop.category]}`}
              >
                {stop.category}
              </span>
            </div>
            <h4 className="mt-1 font-display text-lg font-semibold text-ocean">{stop.title}</h4>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:shrink-0">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-xs font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30"
            >
              {expanded ? 'Hide' : 'Notes'}
            </button>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMove(stop.id, 'up')}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Move stop up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMove(stop.id, 'down')}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Move stop down"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onRemove(stop.id)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-xs font-medium text-coral hover:bg-coral/10 focus:outline-none focus:ring-2 focus:ring-coral/30"
              aria-label={`Remove ${stop.title}`}
            >
              Remove
            </button>
          </div>
        </div>

        {expanded && (
          <p className="mt-3 border-t border-fog pt-3 text-sm leading-relaxed text-ink/80">
            {stop.description}
          </p>
        )}
      </div>
    </article>
  )
}
