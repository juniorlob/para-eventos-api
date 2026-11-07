import { readFile } from "node:fs/promises"
import path from "node:path"

import { CATEGORIES, type Category, type CategorySummary, type Event } from "./types"

const DATA_FILE = path.join(process.cwd(), "data", "events.json")

let cachedEvents: Event[] | null = null

function isEvent(value: unknown): value is Event {
  if (typeof value !== "object" || value === null) return false

  const event = value as Record<string, unknown>

  return (
    typeof event.id === "string" &&
    event.id.length > 0 &&
    typeof event.title === "string" &&
    typeof event.category === "string" &&
    (CATEGORIES as readonly string[]).includes(event.category) &&
    typeof event.date === "string" &&
    typeof event.time === "string" &&
    typeof event.location === "string" &&
    typeof event.description === "string" &&
    typeof event.imageUrl === "string" &&
    (event.banner === undefined || typeof event.banner === "string")
  )
}

function assertEvents(value: unknown): Event[] {
  if (!Array.isArray(value)) {
    throw new Error("data/events.json must contain an array of events")
  }

  const events = value.filter(isEvent)

  if (events.length !== value.length) {
    throw new Error("data/events.json contains invalid events")
  }

  const ids = new Set<string>()

  for (const event of events) {
    if (ids.has(event.id)) {
      throw new Error(`data/events.json contains a duplicated id: ${event.id}`)
    }

    ids.add(event.id)
  }

  return events
}

/**
 * Reads the events from the JSON file.
 *
 * In development the file is re-read on every request so the JSON can be edited
 * without restarting the server. In production the parsed list is cached in
 * memory for the lifetime of the process.
 *
 * This is the only place that knows where the data comes from, so swapping the
 * JSON file for a database later only requires changing this module.
 */
export async function getAllEvents(): Promise<Event[]> {
  if (process.env.NODE_ENV !== "development" && cachedEvents) {
    return cachedEvents
  }

  const raw = await readFile(DATA_FILE, "utf8")
  const events = assertEvents(JSON.parse(raw))

  cachedEvents = events

  return events
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const events = await getAllEvents()

  return events.find((event) => event.id === id)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const events = await getAllEvents()

  return events.filter((event) => typeof event.banner === "string" && event.banner.length > 0)
}

export async function getCategories(): Promise<CategorySummary[]> {
  const events = await getAllEvents()

  return CATEGORIES.map((value) => ({
    value,
    count: events.filter((event) => event.category === value).length,
  })).filter((category) => category.count > 0) satisfies CategorySummary[]
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value)
}
