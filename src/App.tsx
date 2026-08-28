import { AppHeader } from './components/AppHeader'
import { EmptyState } from './components/EmptyState'
import { ItineraryView } from './components/ItineraryView'
import { LoadingExperience } from './components/LoadingExperience'
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
    reset,
    setActiveDay,
    removeStop,
    moveStop,
  } = useTripPlanner()

  const isLoading = status === 'loading'
  const showEmptyState = !itinerary && !isLoading

  return (
    <main className="page-enter mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <AppHeader onNewTrip={reset} showNewTrip={Boolean(itinerary)} />

      {itinerary && (
        <div className="min-w-0">
          <TripInputForm status={status} onSubmit={submit} variant="compact" />
        </div>
      )}

      {isLoading && !itinerary && <LoadingExperience />}

      {isLoading && itinerary && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ocean" aria-live="polite">
          <span className="loading-pulse size-2 shrink-0 rounded-full bg-coral" aria-hidden="true" />
          Planning your route…
        </p>
      )}

      {error && (
        <StatusBanner
          error={error}
          onRetry={retry}
          isLoading={isLoading}
          hasExistingItinerary={Boolean(itinerary)}
        />
      )}

      {showEmptyState && <EmptyState status={status} onSubmit={submit} />}

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
