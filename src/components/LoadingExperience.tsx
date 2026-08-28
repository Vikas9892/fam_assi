import { useEffect, useState } from 'react'

const LOADING_MESSAGES = [
  'Planning your route…',
  'Finding the right rhythm…',
  'Building your itinerary…',
]

export function LoadingExperience() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const intervalId = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length)
    }, 2400)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section aria-live="polite" aria-busy="true" className="mt-8 space-y-4">
      <div className="flex items-center gap-3">
        <span className="loading-pulse size-2.5 rounded-full bg-coral" aria-hidden="true" />
        <p className="text-sm font-medium text-ocean">{LOADING_MESSAGES[messageIndex]}</p>
      </div>

      <div className="space-y-4">
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton h-24 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-36 rounded-xl" />
          <div className="skeleton h-36 rounded-xl" />
        </div>
        <div className="skeleton h-32 rounded-xl" />
      </div>
    </section>
  )
}
