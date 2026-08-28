import { useState } from 'react'
import { CATEGORY_LABELS, CategoryIcon } from './icons/CategoryIcon'
import { getStopImageUrl } from '../lib/images'
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
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getStopImageUrl(stop)

  return (
    <article className="timeline-item relative pb-8 pl-10 last:pb-0 sm:pl-12">
      <div className="absolute left-0 top-0 flex w-6 flex-col items-center sm:w-7">
        {stop.time && (
          <time className="mb-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-ocean/65">
            {stop.time}
          </time>
        )}
        <span
          aria-hidden="true"
          className="timeline-node size-3.5 shrink-0 rounded-full border-2 border-ocean bg-white shadow-sm"
        />
      </div>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[6px] top-8 w-px bg-ocean/20 sm:left-[7px]"
        />
      )}

      <div className="card-lift rounded-xl border border-fog bg-white shadow-sm">
        <div className="overflow-hidden rounded-t-xl">
          {!imageFailed ? (
            <img
              src={imageUrl}
              alt={stop.title}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="image-zoom aspect-[16/7] w-full object-cover sm:aspect-[16/6]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="aspect-[16/7] w-full bg-gradient-to-br from-mist via-sand to-ocean/10 sm:aspect-[16/6]"
            />
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${CATEGORY_STYLES[stop.category]}`}
            >
              <CategoryIcon category={stop.category} className="size-3.5" />
              {CATEGORY_LABELS[stop.category]}
            </span>
          </div>

          <h4 className="mt-2 font-display text-xl font-semibold text-ocean">{stop.title}</h4>

          {!expanded && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/75">{stop.description}</p>
          )}

          {expanded && (
            <p className="mt-3 text-sm leading-relaxed text-ink/80">{stop.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-fog pt-4">
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
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move earlier
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMove(stop.id, 'down')}
              className="btn-press inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ocean hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Move later
            </button>
            <button
              type="button"
              onClick={() => onRemove(stop.id)}
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
