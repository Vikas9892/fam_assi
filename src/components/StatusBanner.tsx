import type { PlannerError } from '../hooks/useTripPlanner'

const ERROR_HEADINGS: Record<PlannerError['code'], string> = {
  rate_limited: 'Rate limit reached',
  malformed_json: 'Response could not be parsed',
  invalid_schema: 'Unexpected response format',
  timeout: 'Request timed out',
  upstream_failure: 'Service unavailable',
  network: 'Connection problem',
  unknown: 'Something went wrong',
}

const ERROR_MESSAGES: Record<PlannerError['code'], string> = {
  rate_limited: 'Groq is rate-limiting us. Wait a few seconds and try again.',
  malformed_json: "The AI response wasn't valid JSON. Please try again.",
  invalid_schema: 'The AI returned data in an unexpected format. Please try again.',
  timeout: 'That request took too long. Try again.',
  upstream_failure: 'The AI service could not be reached. Please try again.',
  network: 'Check your connection and try again.',
  unknown: 'Something went wrong. Please try again.',
}

type StatusBannerProps = {
  error: PlannerError
  onRetry: () => void
  isLoading: boolean
}

export function StatusBanner({ error, onRetry, isLoading }: StatusBannerProps) {
  const heading = ERROR_HEADINGS[error.code] ?? ERROR_HEADINGS.unknown
  const message = ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES.unknown

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-6 overflow-hidden rounded-xl border border-coral/25 bg-white shadow-sm"
    >
      <div className="border-b border-coral/15 bg-coral/8 px-4 py-3 sm:px-5">
        <p className="font-display text-lg font-semibold text-coral-dark">{heading}</p>
      </div>
      <div className="px-4 py-4 sm:px-5">
        <p className="text-sm leading-relaxed text-ink/80">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="btn-press mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-white motion-safe-transition hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">↻</span>
          Try again
        </button>
      </div>
    </div>
  )
}
