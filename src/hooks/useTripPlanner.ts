import { useCallback, useReducer, useRef } from 'react'
import type { Itinerary } from '../lib/schema'

export type PlannerStatus = 'idle' | 'loading' | 'success' | 'error'

export type PlannerErrorCode =
  | 'rate_limited'
  | 'malformed_json'
  | 'invalid_schema'
  | 'timeout'
  | 'upstream_failure'
  | 'network'
  | 'unknown'

export type PlannerError = {
  code: PlannerErrorCode
  message: string
}

type PlannerState = {
  status: PlannerStatus
  itinerary: Itinerary | null
  error: PlannerError | null
  activeDay: number
}

type PlannerAction =
  | { type: 'submit_start' }
  | { type: 'submit_success'; itinerary: Itinerary }
  | { type: 'submit_error'; error: PlannerError }
  | { type: 'reset' }
  | { type: 'set_active_day'; day: number }
  | { type: 'remove_stop'; stopId: string }
  | { type: 'move_stop'; stopId: string; direction: 'up' | 'down' }

const REQUEST_TIMEOUT_MS = 20_000

const initialState: PlannerState = {
  status: 'idle',
  itinerary: null,
  error: null,
  activeDay: 1,
}

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'submit_start':
      return { ...state, status: 'loading', error: null }

    case 'submit_success':
      return {
        ...state,
        status: 'success',
        itinerary: action.itinerary,
        error: null,
        activeDay: action.itinerary.days[0]?.day ?? 1,
      }

    case 'submit_error':
      return {
        ...state,
        status: state.itinerary ? 'success' : 'error',
        error: action.error,
      }

    case 'reset':
      return { ...initialState }

    case 'set_active_day':
      return { ...state, activeDay: action.day }

    case 'remove_stop': {
      if (!state.itinerary) return state

      const days = state.itinerary.days.map((day) => ({
        ...day,
        stops: day.stops.filter((stop) => stop.id !== action.stopId),
      }))

      return {
        ...state,
        itinerary: { ...state.itinerary, days },
      }
    }

    case 'move_stop': {
      if (!state.itinerary) return state

      const days = state.itinerary.days.map((day) => {
        const index = day.stops.findIndex((stop) => stop.id === action.stopId)
        if (index === -1) return day

        const targetIndex = action.direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= day.stops.length) return day

        const stops = [...day.stops]
        ;[stops[index], stops[targetIndex]] = [stops[targetIndex], stops[index]]

        return { ...day, stops }
      })

      return {
        ...state,
        itinerary: { ...state.itinerary, days },
      }
    }

    default:
      return state
  }
}

function isPlannerErrorCode(value: unknown): value is PlannerErrorCode {
  return (
    value === 'rate_limited' ||
    value === 'malformed_json' ||
    value === 'invalid_schema' ||
    value === 'timeout' ||
    value === 'upstream_failure' ||
    value === 'network' ||
    value === 'unknown'
  )
}

async function parseErrorResponse(response: Response): Promise<PlannerError> {
  try {
    const data: unknown = await response.json()

    if (
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'object' &&
      (data as { error: Record<string, unknown> }).error !== null
    ) {
      const apiError = (data as { error: Record<string, unknown> }).error
      const code = isPlannerErrorCode(apiError.code) ? apiError.code : 'unknown'
      const message =
        typeof apiError.message === 'string' ? apiError.message : 'Request failed'

      return { code, message }
    }
  } catch {
    // fall through to generic error
  }

  return { code: 'unknown', message: 'Request failed' }
}

export function useTripPlanner() {
  const [state, dispatch] = useReducer(plannerReducer, initialState)
  const requestIdRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastPromptRef = useRef<string>('')

  const submit = useCallback(async (prompt: string) => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    let timedOut = false
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    const requestId = ++requestIdRef.current
    lastPromptRef.current = prompt

    dispatch({ type: 'submit_start' })

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      })

      if (requestId !== requestIdRef.current) return

      if (!response.ok) {
        const apiError = await parseErrorResponse(response)
        dispatch({ type: 'submit_error', error: apiError })
        return
      }

      const data: unknown = await response.json()

      if (requestId !== requestIdRef.current) return

      dispatch({ type: 'submit_success', itinerary: data as Itinerary })
    } catch (error) {
      if (requestId !== requestIdRef.current) return

      if (error instanceof DOMException && error.name === 'AbortError') {
        if (!timedOut) return

        dispatch({
          type: 'submit_error',
          error: {
            code: 'timeout',
            message: 'Request timed out after 20 seconds',
          },
        })
        return
      }

      dispatch({
        type: 'submit_error',
        error: {
          code: 'network',
          message: 'Network request failed',
        },
      })
    } finally {
      window.clearTimeout(timeoutId)

      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }, [])

  const retry = useCallback(() => {
    if (lastPromptRef.current) {
      void submit(lastPromptRef.current)
    }
  }, [submit])

  const setActiveDay = useCallback((day: number) => {
    dispatch({ type: 'set_active_day', day })
  }, [])

  const removeStop = useCallback((stopId: string) => {
    dispatch({ type: 'remove_stop', stopId })
  }, [])

  const moveStop = useCallback((stopId: string, direction: 'up' | 'down') => {
    dispatch({ type: 'move_stop', stopId, direction })
  }, [])

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    requestIdRef.current += 1
    lastPromptRef.current = ''
    dispatch({ type: 'reset' })
  }, [])

  return {
    status: state.status,
    itinerary: state.itinerary,
    error: state.error,
    activeDay: state.activeDay,
    submit,
    retry,
    reset,
    setActiveDay,
    removeStop,
    moveStop,
  }
}
