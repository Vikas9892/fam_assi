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
      className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isLoading}
        className="mt-3 rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Retry
      </button>
    </div>
  )
}
