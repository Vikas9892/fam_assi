import { useState, type FormEvent } from 'react'
import type { PlannerStatus } from '../hooks/useTripPlanner'

type TripInputFormProps = {
  status: PlannerStatus
  onSubmit: (prompt: string) => void
}

export function TripInputForm({ status, onSubmit }: TripInputFormProps) {
  const [prompt, setPrompt] = useState('')
  const isLoading = status === 'loading'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed || isLoading) return
    onSubmit(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-fog bg-white p-5 shadow-sm sm:p-6"
    >
      <label htmlFor="trip-prompt" className="font-display text-lg font-semibold text-ocean">
        Where to next?
      </label>
      <p className="mt-1 text-sm text-ocean/70">
        Describe your destination, trip length, and what matters to you.
      </p>
      <textarea
        id="trip-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={4}
        placeholder="Plan a 4-day trip to Tokyo focused on food, culture and neighborhoods."
        className="mt-4 w-full min-w-0 resize-y rounded-xl border border-fog bg-mist/50 px-4 py-3 text-ink placeholder:text-ink/40 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || prompt.trim().length === 0}
        className="mt-4 w-full min-w-0 rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors motion-safe-transition hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral/40 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isLoading ? 'Mapping your route…' : 'Build itinerary'}
      </button>
    </form>
  )
}
