import { useState, type FormEvent } from 'react'
import type { PlannerStatus } from '../hooks/useTripPlanner'

type TripInputFormProps = {
  status: PlannerStatus
  onSubmit: (prompt: string) => void
  variant?: 'default' | 'empty' | 'compact'
  initialPrompt?: string
}

export function TripInputForm({
  status,
  onSubmit,
  variant = 'default',
  initialPrompt = '',
}: TripInputFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const isLoading = status === 'loading'
  const isCompact = variant === 'compact'
  const isEmpty = variant === 'empty'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed || isLoading) return
    onSubmit(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isEmpty
          ? 'space-y-4'
          : `rounded-2xl border border-fog bg-white shadow-sm motion-safe-transition ${
              isCompact ? 'p-4' : 'p-5 sm:p-6'
            }`
      }
    >
      {!isEmpty && (
        <>
          <label htmlFor="trip-prompt" className="font-display text-lg font-semibold text-ocean">
            {isCompact ? 'Plan another trip' : 'Where to next?'}
          </label>
          {!isCompact && (
            <p className="mt-1 text-sm text-ocean/70">
              Describe your destination, trip length, and what matters to you.
            </p>
          )}
        </>
      )}

      <label htmlFor="trip-prompt" className={isEmpty ? 'sr-only' : 'sr-only'}>
        Trip description
      </label>
      <textarea
        id="trip-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={isCompact ? 3 : 4}
        placeholder="Plan a 4-day trip to Tokyo focused on food, culture and neighborhoods."
        className={`w-full min-w-0 resize-y rounded-xl border border-fog bg-mist/50 px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 ${
          isEmpty ? '' : 'mt-4'
        }`}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || prompt.trim().length === 0}
        className={`btn-press inline-flex min-h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white motion-safe-transition hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
          isEmpty ? '' : 'mt-4'
        }`}
      >
        <span aria-hidden="true">✦</span>
        {isLoading ? 'Mapping your route…' : 'Build my itinerary'}
      </button>
    </form>
  )
}
