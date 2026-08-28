import { useEffect, useState } from 'react'
import { getDestinationImageUrl } from '../lib/images'
import { formatDestinationHeading, getItineraryStats } from '../lib/itineraryStats'
import type { Itinerary } from '../lib/schema'

type DestinationHeroProps = {
  itinerary: Itinerary
}

export function DestinationHero({ itinerary }: DestinationHeroProps) {
  const stats = getItineraryStats(itinerary)
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getDestinationImageUrl(itinerary.destination)

  useEffect(() => {
    setImageFailed(false)
  }, [itinerary.destination])

  return (
    <section className="overflow-hidden rounded-2xl border border-fog bg-white shadow-sm">
      <div className="relative aspect-[5/2] min-h-40 w-full bg-gradient-to-br from-ocean/20 via-ocean/10 to-sand-dark sm:aspect-[3/1]">
        {!imageFailed && (
          <img
            src={imageUrl}
            alt={`Scenery representing ${itinerary.destination}`}
            loading="eager"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="image-zoom absolute inset-0 size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-wide text-white sm:text-4xl">
            {formatDestinationHeading(itinerary.destination)}
          </h2>
          <p className="mt-2 text-sm font-medium text-white/90">
            {stats.totalDays} {stats.totalDays === 1 ? 'DAY' : 'DAYS'} · {stats.totalStops}{' '}
            {stats.totalStops === 1 ? 'STOP' : 'STOPS'}
          </p>
        </div>
      </div>
    </section>
  )
}
