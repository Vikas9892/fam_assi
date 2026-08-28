import { useState } from 'react'
import type { Stop } from '../lib/schema'

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
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            {stop.time && (
              <span className="text-sm text-slate-500">{stop.time}</span>
            )}
            <h4 className="font-medium text-slate-900">{stop.title}</h4>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs uppercase text-slate-600">
              {stop.category}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMove(stop.id, 'up')}
            className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Move stop up"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMove(stop.id, 'down')}
            className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Move stop down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => onRemove(stop.id)}
            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            aria-label="Remove stop"
          >
            Remove
          </button>
        </div>
      </div>

      {expanded && (
        <p className="mt-3 text-sm text-slate-600">{stop.description}</p>
      )}
    </article>
  )
}
