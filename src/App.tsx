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
    <main className="page-enter mx-auto min-h-screen w-full max-w-3xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10">
      <AppHeader onNewTrip={reset} showNewTrip={Boolean(itinerary)} />

      {itinerary && (
        <TripInputForm status={status} onSubmit={submit} variant="compact" />
      )}

      {isLoading && <LoadingExperience />}

      {error && <StatusBanner error={error} onRetry={retry} isLoading={isLoading} />}

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
