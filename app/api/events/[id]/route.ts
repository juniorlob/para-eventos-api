import type { NextRequest } from "next/server"

import { getEventById } from "@/lib/events-repository"
import { getPublicBaseUrl, jsonError, jsonOk, preflight } from "@/lib/http"
import { toAbsoluteEvent } from "@/lib/serializers"

interface EventRouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: EventRouteContext) {
  const { id } = await context.params
  const baseUrl = getPublicBaseUrl(request)

  try {
    const event = await getEventById(id)

    if (!event) {
      return jsonError(
        "EVENT_NOT_FOUND",
        `Evento "${id}" não encontrado.`,
        404,
      )
    }

    return jsonOk(toAbsoluteEvent(event, baseUrl))
  } catch (error) {
    console.error("[api/events/:id] failed to load event", error)

    return jsonError(
      "DATA_UNAVAILABLE",
      "Não foi possível carregar o evento.",
      500,
    )
  }
}

export async function OPTIONS() {
  return preflight()
}
