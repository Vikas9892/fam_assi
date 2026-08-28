import type { Itinerary } from '../lib/schema'

type ItineraryViewProps = {
  itinerary: Itinerary
}

export function ItineraryView({ itinerary }: ItineraryViewProps) {
  return (
    <section className="mt-8 space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{itinerary.destination}</h2>
      </header>

      {itinerary.days.map((day) => (
        <article key={day.day} className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="font-medium text-slate-900">
            Day {day.day}: {day.label}
          </h3>
          <ul className="mt-3 space-y-3">
            {day.stops.map((stop) => (
              <li key={stop.id} className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  {stop.time && (
                    <span className="text-sm text-slate-500">{stop.time}</span>
                  )}
                  <span className="font-medium text-slate-900">{stop.title}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs uppercase text-slate-600">
                    {stop.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{stop.description}</p>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}
