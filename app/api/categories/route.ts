import { connection } from "next/server"

import { getCategories } from "@/lib/events-repository"
import { jsonError, jsonOk, preflight } from "@/lib/http"

export async function GET() {
  await connection()

  try {
    const categories = await getCategories()

    return jsonOk(categories, {
      meta: {
        total: categories.length,
      },
    })
  } catch (error) {
    console.error("[api/categories] failed to load categories", error)

    return jsonError(
      "DATA_UNAVAILABLE",
      "Não foi possível carregar as categorias.",
      500,
    )
  }
}

export async function OPTIONS() {
  return preflight()
}
