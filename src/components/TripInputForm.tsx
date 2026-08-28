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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="trip-prompt" className="block text-sm font-medium text-slate-700">
          Describe your trip
        </label>
        <textarea
          id="trip-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          placeholder="Plan a 4 day trip to Tokyo focused on food, culture and neighborhoods."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || prompt.trim().length === 0}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Planning…' : 'Plan trip'}
      </button>
    </form>
  )
}
