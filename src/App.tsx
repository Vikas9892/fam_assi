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
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">AI Trip Planner</h1>
        <p className="mt-1 text-slate-600">
          Describe where you want to go — get a structured day-by-day itinerary.
        </p>
      </header>

      <TripInputForm status={status} onSubmit={submit} />

      {isLoading && (
        <p className="mt-6 text-sm text-slate-600" aria-live="polite">
          Building your itinerary…
        </p>
      )}

      {error && (
        <StatusBanner error={error} onRetry={retry} isLoading={isLoading} />
      )}

      {showEmptyState && (
        <section className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <h2 className="text-lg font-medium text-slate-800">No itinerary yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell us your destination, how many days, and what you care about — food,
            culture, pace, neighborhoods — and we will build a day-by-day plan.
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
