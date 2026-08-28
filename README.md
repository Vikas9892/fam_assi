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
- **Groq** — LLM provider (`openai/gpt-oss-120b`; migrated from deprecated `llama-3.3-70b-versatile`)
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

I used **Cursor (AI-assisted IDE)** during development, following a phased implementation plan that I created for the project.

### Development tools

- **Cursor Agent** — scaffolding, feature implementation from the phased plan, refactoring, debugging assistance, and reviewing implementation approaches
- **Groq API** — runtime AI provider for the product itself; generates structured travel itineraries from free-form user input (separate from development tooling)
- **Manual development and testing** — reviewing generated changes, running the app locally, testing user flows, debugging integration issues, and manual UI polish

### How I used AI during development

The project was built in phases rather than generating the entire application in a single step.

1. **Foundation** — Vite + React + TypeScript scaffold and Zod itinerary schema
2. **Backend** — Vercel serverless proxy, Groq integration, JSON-mode responses, Zod validation, and one repair attempt for invalid AI output
3. **Frontend** — React components and `useTripPlanner` hook for the input → API → itinerary flow
4. **Interactivity** — day navigation, expandable stop cards, remove stops, and local reordering
5. **Reliability** — request cancellation, stale-response protection, client-side timeout, retry behavior, and distinct error states per failure mode
6. **Visual design** — initial visual design system and component styling
7. **Manual polish (Phase 5.5)** — copy, spacing, and visual adjustments done by hand; AI-generated styling was reviewed rather than treated as final
8. **Debugging and submission prep** — Groq model migration (`llama-3.3-70b-versatile` → `openai/gpt-oss-120b`), blank-page fix, Node 24/fetch compatibility, and Vercel rewrite configuration

### What I personally verified

I reviewed the generated implementation and tested locally instead of assuming generated code was correct.

Main flow verified end to end:

`user input → backend proxy → Groq → JSON parsing → Zod validation → React state → interactive itinerary`

I also checked failure handling: preserving an existing itinerary when a later request fails, and preventing stale responses from overwriting newer ones.

Phase 5.5 polish was done manually rather than delegated to the AI tool.

### What AI did not do

AI assistance did not replace final responsibility for the project. I was responsible for:

- configuring the local API key via environment variables
- running and testing the application
- reviewing generated code and changes
- debugging issues during development
- manually polishing the UI
- deciding what to include and what to leave out
- writing this AI-usage disclosure
- recording actual development time

I did not use AI-generated code as a substitute for understanding the architecture. The decisions I need to explain in an interview include the server-side API proxy, structured JSON handling, Zod validation, repair retry, request cancellation, stale-response protection, and local itinerary state management.

## Time Spent

**Approximately 8 hours of active development time.**

| Phase | Approx. time | What I worked on |
| --- | ---: | --- |
| Foundation | ~30 min | Vite/React/TypeScript setup, Tailwind, Zod schema |
| Backend | ~1 hr | Groq proxy, JSON mode, validation and repair handling |
| Happy path | ~45 min | Input form, API integration, itinerary rendering |
| Interactivity | ~45 min | Day tabs, expand/collapse, remove and reorder |
| Reliability | ~1 hr 15 min | Timeout, AbortController, stale-response protection, errors and retry |
| Visual design | ~45 min | Travel-focused visual system and component styling |
| Manual polish | ~30 min | Copy, spacing, and visual adjustments |
| Mobile / accessibility | ~30 min | Responsive layout, focus states, touch targets |
| README / submission prep | ~30 min | Documentation, production build, final cleanup |
| Debugging / testing | ~1 hr | API/model migration, blank-page fix, Vercel config, end-to-end testing |
| **Total** | **~8 hours** | |

These are approximate active-work estimates, not exact stopwatch measurements. I prioritized core assignment requirements over extra features.

Reliability took longer than the basic UI because AI output cannot be treated as trusted application data. The implementation had to handle malformed JSON, schema mismatches, slow and failed requests, rate limiting, and older requests completing after newer ones.

## Future Improvements

- Local storage or database persistence
- Drag-and-drop stop reordering
- Refinement prompts ("make day 2 more relaxed")
- Richer stop types (lodging, flights, budget estimates)
- Export to PDF or calendar
