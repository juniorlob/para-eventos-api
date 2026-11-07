import { connection } from "next/server"

import { getAllEvents } from "@/lib/events-repository"
import { jsonError, jsonOk, preflight } from "@/lib/http"

export async function GET() {
  await connection()

  try {
    const events = await getAllEvents()

    return jsonOk(
      {
        status: "ok",
        events: events.length,
        timestamp: new Date().toISOString(),
      },
      { cache: false },
    )
  } catch (error) {
    console.error("[api/health] failed to load events", error)

    return jsonError(
      "DATA_UNAVAILABLE",
      "Não foi possível carregar os dados da API.",
      500,
    )
  }
}

export async function OPTIONS() {
  return preflight()
}
