import type { NextRequest } from "next/server"

import { getEventById } from "@/lib/events-repository"
import { jsonError, jsonOk, preflight } from "@/lib/http"

interface EventRouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: EventRouteContext) {
  const { id } = await context.params

  try {
    const event = await getEventById(id)

    if (!event) {
      return jsonError(
        "EVENT_NOT_FOUND",
        `Evento "${id}" não encontrado.`,
        404,
      )
    }

    return jsonOk(event)
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
