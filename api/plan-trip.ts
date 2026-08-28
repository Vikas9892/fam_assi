import type { VercelRequest, VercelResponse } from '@vercel/node'
import { itinerarySchema } from './lib/schema'

const MODEL = process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b'
const TEMPERATURE = 0.4
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

type GroqMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are a travel itinerary planner. Return ONLY valid JSON with no markdown, no commentary, and no code fences.

The JSON must match this exact structure:
{
  "destination": "City or region name",
  "days": [
    {
      "day": 1,
      "label": "Short theme for the day",
      "stops": [
        {
          "id": "d1-s1",
          "time": "9:00 AM",
          "title": "Stop name",
          "description": "1-2 sentences about this stop",
          "category": "food"
        }
      ]
    }
  ]
}

Rules:
- "destination" is a non-empty string
- "days" is a non-empty array; each day has a unique "day" number starting at 1
- Each day has a "label" and a non-empty "stops" array
- Stop "id" must follow the pattern d{dayNumber}-s{stopNumber} (e.g. d1-s1, d1-s2, d2-s1)
- "category" must be exactly one of: food, sight, activity, transport, rest
- "time" is optional but recommended
- Create a realistic number of stops per day based on the user's request
- Infer trip length from the user's prompt when possible`

type ErrorCode = 'malformed_json' | 'invalid_schema'

type ParseOutcome =
  | { ok: true; data: ReturnType<typeof itinerarySchema.parse> }
  | { ok: false; code: ErrorCode; message: string }

function stripJsonFence(text: string): string {
  const trimmed = text.trim()
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return match ? match[1].trim() : trimmed
}

function parseAndValidate(raw: string): ParseOutcome {
  let parsed: unknown

  try {
    parsed = JSON.parse(stripJsonFence(raw))
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Response was not valid JSON'
    return { ok: false, code: 'malformed_json', message }
  }

  const result = itinerarySchema.safeParse(parsed)
  if (!result.success) {
    return {
      ok: false,
      code: 'invalid_schema',
      message: result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; '),
    }
  }

  return { ok: true, data: result.data }
}

function isInvalidPrompt(prompt: unknown): prompt is string {
  return typeof prompt !== 'string' || prompt.trim().length === 0
}

function buildRepairMessages(
  userPrompt: string,
  failure: ParseOutcome & { ok: false },
): GroqMessage[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
    {
      role: 'assistant',
      content: 'The previous response failed validation.',
    },
    {
      role: 'user',
      content: `Your previous JSON response failed with this error (${failure.code}): ${failure.message}

Return corrected JSON only. No markdown fences, no explanation. Match the schema exactly.`,
    },
  ]
}

async function requestItinerary(
  apiKey: string,
  messages: GroqMessage[],
): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: TEMPERATURE,
      response_format: { type: 'json_object' },
      messages,
    }),
  })

  if (response.status === 429) {
    throw { status: 429 }
  }

  if (!response.ok) {
    throw new Error(`Groq API returned ${response.status}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Model returned an empty response')
  }

  return content
}

function isRateLimitError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === 429
  )
}

function isUpstreamError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes('timeout') ||
      msg.includes('network') ||
      msg.includes('econnrefused') ||
      msg.includes('fetch failed')
    )
  }
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } })
  }

  const { prompt } = req.body ?? {}

  if (isInvalidPrompt(prompt)) {
    return res.status(400).json({
      error: { message: 'A non-empty prompt string is required' },
    })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(502).json({
      error: {
        code: 'upstream_failure',
        message: 'Server is missing GROQ_API_KEY configuration',
      },
    })
  }

  const trimmedPrompt = prompt.trim()
  const initialMessages: GroqMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: trimmedPrompt },
  ]

  try {
    let raw = await requestItinerary(apiKey, initialMessages)
    let outcome = parseAndValidate(raw)

    if (!outcome.ok) {
      const repairMessages = buildRepairMessages(trimmedPrompt, outcome)
      raw = await requestItinerary(apiKey, repairMessages)
      outcome = parseAndValidate(raw)
    }

    if (!outcome.ok) {
      return res.status(422).json({
        error: {
          code: outcome.code,
          message: outcome.message,
        },
      })
    }

    return res.status(200).json(outcome.data)
  } catch (error) {
    if (isRateLimitError(error)) {
      return res.status(429).json({
        error: {
          code: 'rate_limited',
          message: 'Groq rate limit reached. Try again shortly.',
        },
      })
    }

    if (isUpstreamError(error)) {
      return res.status(502).json({
        error: {
          code: 'upstream_failure',
          message: 'Could not reach the AI provider',
        },
      })
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected server error'

    return res.status(502).json({
      error: {
        code: 'upstream_failure',
        message,
      },
    })
  }
}
