import { useCallback, useState } from 'react'
import type { Itinerary } from '../lib/schema'

export type PlannerStatus = 'idle' | 'loading' | 'success' | 'error'

export type PlannerError = {
  code: string
  message: string
}

export function useTripPlanner() {
  const [status, setStatus] = useState<PlannerStatus>('idle')
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [error, setError] = useState<PlannerError | null>(null)

  const submit = useCallback(async (prompt: string) => {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data: unknown = await response.json()

      if (!response.ok) {
        const apiError =
          typeof data === 'object' &&
          data !== null &&
          'error' in data &&
          typeof (data as { error: unknown }).error === 'object' &&
          (data as { error: PlannerError }).error !== null
            ? (data as { error: PlannerError }).error
            : { code: 'unknown', message: 'Request failed' }

        setError(apiError)
        setStatus('error')
        return
      }

      setItinerary(data as Itinerary)
      setStatus('success')
    } catch {
      setError({ code: 'network', message: 'Network request failed' })
      setStatus('error')
    }
  }, [])

  return {
    status,
    itinerary,
    error,
    submit,
  }
}
