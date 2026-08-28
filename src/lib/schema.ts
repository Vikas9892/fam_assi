import { z } from 'zod'

export const stopCategorySchema = z.enum([
  'food',
  'sight',
  'activity',
  'transport',
  'rest',
])

export const stopSchema = z.object({
  id: z.string(),
  time: z.string().optional(),
  title: z.string(),
  description: z.string(),
  category: stopCategorySchema,
})

export const daySchema = z.object({
  day: z.number(),
  label: z.string(),
  stops: z.array(stopSchema),
})

export const itinerarySchema = z.object({
  destination: z.string(),
  days: z.array(daySchema),
})

export type StopCategory = z.infer<typeof stopCategorySchema>
export type Stop = z.infer<typeof stopSchema>
export type Day = z.infer<typeof daySchema>
export type Itinerary = z.infer<typeof itinerarySchema>
