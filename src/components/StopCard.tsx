import { useState } from 'react'
import { getStopTheme } from '../lib/images'
import type { Stop, StopCategory } from '../lib/schema'
import { CATEGORY_LABELS, CategoryIcon } from './icons/CategoryIcon'
import { VisualPlaceholder } from './VisualPlaceholder'

const CATEGORY_STYLES: Record<StopCategory, string> = {
  food: 'bg-coral/12 text-coral-dark ring-coral/20',
  sight: 'bg-ocean/10 text-ocean ring-ocean/15',
  activity: 'bg-pine/12 text-pine ring-pine/20',
  transport: 'bg-ink/6 text-ink/75 ring-ink/10',
  rest: 'bg-sand-dark text-ink/70 ring-sand-dark',
}

type StopCardProps = {
  stop: Stop
  stopIndex: number
  isFirst: boolean
  isLast: boolean
  isUpNext?: boolean
  onRemove: (stopId: string) => void
  onMove: (stopId: string, direction: 'up' | 'down') => void
}

export function StopCard({
  stop,
  stopIndex,
  isFirst,
  isLast,
  isUpNext = false,
  onRemove,
  onMove,
}: StopCardProps) {
  const [expanded, setExpanded] = useState(false)
  const theme = getStopTheme(stop)

  return (
    <article
      className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 pb-7 last:pb-0 sm:grid-cols-[4.25rem_0.875rem_minmax(0,1fr)] sm:gap-x-4 sm:items-start"
      aria-label={`Stop ${stopIndex + 1}: ${stop.title}`}
    >
      {stop.time ? (
        <time
          dateTime={stop.time}
          className="col-start-1 row-start-1 self-start pt-1 text-[11px] font-semibold uppercase tracking-wide text-ocean/70 sm:text-right"
        >
          {stop.time}
        </time>
      ) : (
        <span className="col-start-1 row-start-1 hidden sm:block" aria-hidden="true" />
      )}

      <div className="relative col-start-1 row-start-2 flex justify-start sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:justify-center sm:pt-1.5">
        <span
          aria-hidden="true"
          className={`timeline-node size-3 shrink-0 rounded-full border-2 bg-white shadow-sm ${
            isUpNext ? 'border-coral ring-2 ring-coral/25' : 'border-ocean'
          }`}
        />
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-4 -translate-x-1/2 bottom-[-1.75rem] w-px bg-ocean/18 sm:bottom-[-1.5rem]"
          />
        )}
      </div>

      <div className="card-lift col-start-2 row-start-2 min-w-0 overflow-hidden rounded-xl border border-fog bg-white shadow-sm sm:col-start-3 sm:row-start-1 sm:row-span-2">
        <VisualPlaceholder
          theme={theme}
          label={`Visual theme for ${stop.title}`}
          category={stop.category}
          size="stop"
        />

        <div className="p-4 sm:p-5">
          {isUpNext && (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
              Up next
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${CATEGORY_STYLES[stop.category]}`}
            >
              <CategoryIcon category={stop.category} className="size-3.5" />
              {CATEGORY_LABELS[stop.category]}
            </span>
            <span className="text-xs text-ink/50">Stop {stopIndex + 1}</span>
          </div>

          <h4 className="mt-2.5 font-display text-lg font-semibold leading-snug text-ocean sm:text-xl">
            {stop.title}
          </h4>

          <p
            className={`mt-2 text-sm leading-relaxed text-ink/75 ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {stop.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-fog pt-4">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30"
            >
              {expanded ? 'Collapse details' : 'View details'}
            </button>
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMove(stop.id, 'up')}
              aria-label={`Move ${stop.title} earlier`}
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move earlier
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMove(stop.id, 'down')}
              aria-label={`Move ${stop.title} later`}
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move later
            </button>
            <button
              type="button"
              onClick={() => onRemove(stop.id)}
              aria-label={`Remove ${stop.title}`}
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-coral hover:bg-coral/10 focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              Remove stop
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
