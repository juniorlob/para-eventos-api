import type { NextRequest } from "next/server"

import { getAllEvents } from "@/lib/events-repository"
import { getPublicBaseUrl, jsonError, jsonOk, preflight } from "@/lib/http"
import { normalizeText, parseEventsQuery } from "@/lib/query"
import { toAbsoluteEvent } from "@/lib/serializers"

export async function GET(request: NextRequest) {
  const parsed = parseEventsQuery(request.nextUrl.searchParams)

  if (!parsed.ok) {
    return jsonError(parsed.code, parsed.message, 400)
  }

  const { q, categories, featured, limit, offset } = parsed.query
  const baseUrl = getPublicBaseUrl(request)

  try {
    let events = await getAllEvents()

    if (featured) {
      events = events.filter((event) => Boolean(event.banner))
    }

    if (categories.length > 0) {
      events = events.filter((event) => categories.includes(event.category))
    }

    if (q) {
      const needle = normalizeText(q)

      events = events.filter((event) => normalizeText(event.title).includes(needle))
    }

    const total = events.length
    const page = events.slice(offset, offset + limit)

    return jsonOk(
      page.map((event) => toAbsoluteEvent(event, baseUrl)),
      {
        meta: {
          total,
          count: page.length,
          limit,
          offset,
        },
      },
    )
  } catch (error) {
    console.error("[api/events] failed to load events", error)

    return jsonError(
      "DATA_UNAVAILABLE",
      "Não foi possível carregar os eventos.",
      500,
    )
  }
}

export async function OPTIONS() {
  return preflight()
}
