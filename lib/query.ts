import { CATEGORIES, type Category } from "./types"

export const DEFAULT_LIMIT = 50
export const MAX_LIMIT = 100

export interface EventsQuery {
  q?: string
  categories: Category[]
  featured: boolean
  limit: number
  offset: number
}

export type ParseEventsQueryResult =
  | { ok: true; query: EventsQuery }
  | { ok: false; code: string; message: string }

/**
 * Normalizes text for search: lowercases and removes diacritics, so "verao"
 * matches "Verão".
 */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function parseInteger(value: string): number | null {
  if (value.trim() === "") return null

  const parsed = Number(value)

  if (!Number.isInteger(parsed)) return null

  return parsed
}

export function parseEventsQuery(params: URLSearchParams): ParseEventsQueryResult {
  const q = params.get("q")?.trim()

  const categoryParams = params
    .getAll("category")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter((value) => value !== "")

  const categories: Category[] = []

  for (const categoryParam of categoryParams) {
    const match = CATEGORIES.find(
      (value) => normalizeText(value) === normalizeText(categoryParam),
    )

    if (!match) {
      return {
        ok: false,
        code: "INVALID_CATEGORY",
        message: `Categoria inválida: "${categoryParam}".`,
      }
    }

    if (!categories.includes(match)) {
      categories.push(match)
    }
  }

  const featuredParam = params.get("featured")?.trim().toLowerCase()
  let featured = false

  if (featuredParam) {
    if (featuredParam !== "true" && featuredParam !== "false") {
      return {
        ok: false,
        code: "INVALID_FEATURED",
        message: 'O parâmetro "featured" deve ser "true" ou "false".',
      }
    }

    featured = featuredParam === "true"
  }

  const limitParam = params.get("limit")
  const limit = limitParam === null ? DEFAULT_LIMIT : parseInteger(limitParam)

  if (limit === null || limit < 1 || limit > MAX_LIMIT) {
    return {
      ok: false,
      code: "INVALID_LIMIT",
      message: `O parâmetro "limit" deve ser um inteiro entre 1 e ${MAX_LIMIT}.`,
    }
  }

  const offsetParam = params.get("offset")
  const offset = offsetParam === null ? 0 : parseInteger(offsetParam)

  if (offset === null || offset < 0) {
    return {
      ok: false,
      code: "INVALID_OFFSET",
      message: 'O parâmetro "offset" deve ser um inteiro maior ou igual a 0.',
    }
  }

  return {
    ok: true,
    query: {
      q: q || undefined,
      categories,
      featured,
      limit,
      offset,
    },
  }
}
