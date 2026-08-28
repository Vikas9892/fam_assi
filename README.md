# AI Trip Planner

## Overview

AI Trip Planner turns a free-form travel request into a structured, day-by-day itinerary. You describe where you want to go — destination, length, interests, pace — and the app sends that prompt to an LLM through a secure backend. The response is parsed as JSON, validated against a shared schema, and rendered as interactive UI components rather than a chat transcript.

The frontend lets you browse days, expand stop details, remove stops, and reorder them locally. Edits stay in React state and never trigger another AI call.

## Features

- Free-form trip input via textarea
- Structured AI itinerary generation through Groq
- Zod schema validation on every API response
- One automatic repair attempt when the model returns bad JSON
- Interactive day navigation with tabs
- Expandable stop descriptions
- Remove stops from the itinerary
- Reorder stops within a day (up/down)
- Retry on failure without retyping the prompt
- Request race protection and 20-second client timeout
- Previous itinerary preserved when a later request fails
- Mobile-friendly layout down to 320px width

## Tech Stack

- **React** — UI components and local itinerary state
- **TypeScript** — type safety across frontend and shared schema
- **Vite** — dev server and production bundling
- **Tailwind CSS** — styling and responsive layout
- **Groq** — LLM provider (`llama-3.3-70b-versatile`)
- **Zod** — runtime validation and inferred TypeScript types
- **Vercel serverless functions** — secure API proxy in `api/plan-trip.ts`

## Architecture

```
User input
  → React (useTripPlanner hook)
  → POST /api/plan-trip
  → Vercel serverless proxy
  → Groq API (JSON mode)
  → JSON parsing + fence stripping
  → Zod validation (+ one repair retry)
  → React state
  → Interactive itinerary UI
```

The Groq API key lives only in server-side environment variables (`GROQ_API_KEY`). The browser never receives it. All AI calls go through the Vercel function, which validates responses before returning them to the client.

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Add your Groq API key to `.env.local`:

```
GROQ_API_KEY=your_key_here
```

Run the frontend:

```bash
npm run dev
```

For full-stack local development including the API route, use the Vercel CLI:

```bash
npx vercel dev
```

## Usage

Enter a prompt like:

> Plan a 4-day trip to Tokyo focused on food, neighborhoods, culture and a relaxed pace.

Click **Build itinerary**. Once loaded, switch between days, expand stops for details, remove items you do not want, or reorder stops within a day.

## Error Handling

| Code | Meaning |
|------|---------|
| `malformed_json` | The model returned text that could not be parsed as JSON |
| `invalid_schema` | JSON parsed but failed Zod validation (wrong shape or types) |
| `rate_limited` | Groq returned HTTP 429 |
| `timeout` | Client-side 20-second timeout via AbortController |
| `upstream_failure` | Groq unreachable or server misconfigured |
| `network` | Browser fetch failed (offline, CORS in dev, etc.) |

**Stale responses:** Each submit increments a `requestId`. Only the latest request can update state. Combined with `AbortController`, older in-flight requests cannot overwrite newer results.

**Preserved itinerary:** If you already have a valid itinerary and a subsequent request fails, the previous itinerary stays visible while an error banner explains what went wrong.

## Known Limitations

- No persistence between browser sessions
- Itinerary edits are local only (not synced or saved)
- Only one server-side repair retry per request
- Generated travel details may be inaccurate — verify before booking
- Requires `vercel dev` or deployment for API routes during local development

## AI Usage

TODO: Add an honest description of exactly what AI tools were used for during development.

## Time Spent

TODO: Record actual time spent on this project.

## Future Improvements

- Local storage or database persistence
- Drag-and-drop stop reordering
- Refinement prompts ("make day 2 more relaxed")
- Richer stop types (lodging, flights, budget estimates)
- Export to PDF or calendar
