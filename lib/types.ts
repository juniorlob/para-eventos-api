export const CATEGORIES = [
  "show",
  "Religioso",
  "teatro",
  "culinario",
  "museu",
  "palestras",
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Event {
  id: string
  title: string
  category: Category
  date: string
  time: string
  location: string
  description: string
  imageUrl: string
  banner?: string
}

export interface PaginationMeta {
  total: number
  count: number
  limit: number
  offset: number
}

export interface CategorySummary {
  value: Category
  count: number
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}
