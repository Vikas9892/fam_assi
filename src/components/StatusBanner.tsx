import type { PlannerError } from '../hooks/useTripPlanner'

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
  const message = ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES.unknown

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-4 text-sm text-coral-dark"
    >
      <p className="font-medium">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isLoading}
        className="mt-3 min-h-11 rounded-lg bg-coral px-4 py-2.5 text-xs font-semibold text-white transition-colors motion-safe-transition hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Try again
      </button>
    </div>
  )
}
