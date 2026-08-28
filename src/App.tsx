import { ItineraryView } from './components/ItineraryView'
import { StatusBanner } from './components/StatusBanner'
import { TripInputForm } from './components/TripInputForm'
import { useTripPlanner } from './hooks/useTripPlanner'

function App() {
  const {
    status,
    itinerary,
    error,
    activeDay,
    submit,
    retry,
    setActiveDay,
    removeStop,
    moveStop,
  } = useTripPlanner()

  const isLoading = status === 'loading'
  const showEmptyState = !itinerary && !error && !isLoading

  return (
    <main className="page-enter mx-auto min-h-screen w-full max-w-3xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean/60">
          Trip planner
        </p>
        <h1 className="font-display text-4xl font-semibold text-ocean sm:text-5xl">
          Chart your journey
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
          Turn a rough travel idea into a structured day-by-day route you can
          browse, trim, and reorder.
        </p>
      </header>

      <TripInputForm status={status} onSubmit={submit} />

      {isLoading && (
        <p className="mt-6 text-center text-sm text-ocean/70 sm:text-left" aria-live="polite">
          Tracing your route…
        </p>
      )}

      {error && (
        <StatusBanner error={error} onRetry={retry} isLoading={isLoading} />
      )}

      {showEmptyState && (
        <section className="mt-10 rounded-2xl border border-dashed border-ocean/25 bg-white/60 px-6 py-12 text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-ocean/10 text-ocean"
          >
            ✦
          </div>
          <h2 className="font-display text-xl font-semibold text-ocean">
            Your map starts here
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">
            Share a destination, number of days, and what you want from the trip.
            We will return a structured itinerary — not a chat transcript.
          </p>
        </section>
      )}

      {itinerary && (
        <ItineraryView
          itinerary={itinerary}
          activeDay={activeDay}
          onSelectDay={setActiveDay}
          onRemoveStop={removeStop}
          onMoveStop={moveStop}
        />
      )}
    </main>
  )
}

export default App
