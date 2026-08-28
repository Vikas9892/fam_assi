import { useState } from 'react'
import { CompassIcon } from './icons/CompassIcon'
import { TripInputForm } from './TripInputForm'
import type { PlannerStatus } from '../hooks/useTripPlanner'

const INSPIRATIONS = [
  { label: 'Tokyo', prompt: 'Plan a 4-day trip to Tokyo focused on food, culture and neighborhoods.' },
  { label: 'Paris', prompt: 'Plan a 3-day trip to Paris focused on food and classic sights.' },
  { label: 'Bali', prompt: 'Plan a 5-day relaxed trip to Bali with beaches and local food.' },
  { label: 'New York', prompt: 'Plan a 4-day trip to New York focused on neighborhoods and culture.' },
]

type EmptyStateProps = {
  status: PlannerStatus
  onSubmit: (prompt: string) => void
}

export function EmptyState({ status, onSubmit }: EmptyStateProps) {
  const [prefill, setPrefill] = useState('')

  return (
    <section className="mt-2">
      <div className="rounded-2xl border border-dashed border-ocean/20 bg-white/70 px-6 py-10 text-center sm:px-10">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-ocean/10 text-ocean"
        >
          <CompassIcon className="size-7" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ocean sm:text-3xl">
          Plan your next adventure
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">
          Tell us where you&apos;re going, what you love, and how you want to spend your time.
          We&apos;ll turn it into a structured day-by-day route — not a chat transcript.
        </p>

        <div className="mt-8 text-left">
          <TripInputForm
            key={prefill}
            status={status}
            onSubmit={onSubmit}
            variant="empty"
            initialPrompt={prefill}
          />
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ocean/55">
            Popular inspiration
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {INSPIRATIONS.map(({ label, prompt }) => (
              <button
                key={label}
                type="button"
                onClick={() => setPrefill(prompt)}
                disabled={status === 'loading'}
                className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-ocean motion-safe-transition hover:bg-ocean/10 focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
