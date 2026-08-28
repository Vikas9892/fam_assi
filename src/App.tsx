import { ItineraryView } from './components/ItineraryView'
import { TripInputForm } from './components/TripInputForm'
import { useTripPlanner } from './hooks/useTripPlanner'

function App() {
  const { status, itinerary, error, submit } = useTripPlanner()

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">AI Trip Planner</h1>
        <p className="mt-1 text-slate-600">
          Describe where you want to go — get a structured day-by-day itinerary.
        </p>
      </header>

      <TripInputForm status={status} onSubmit={submit} />

      {status === 'loading' && (
        <p className="mt-6 text-sm text-slate-600">Building your itinerary…</p>
      )}

      {status === 'error' && error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error.message}
        </p>
      )}

      {itinerary && <ItineraryView itinerary={itinerary} />}
    </main>
  )
}

export default App
