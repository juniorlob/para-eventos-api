import { NextResponse } from "next/server"

import type { PaginationMeta } from "./types"

const CORS_ORIGIN = process.env.CORS_ORIGIN?.trim() || "*"

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
}

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  }
}

interface OkOptions {
  status?: number
  meta?: PaginationMeta | Record<string, unknown>
  cache?: boolean
}

export function jsonOk<T>(data: T, options: OkOptions = {}) {
  return NextResponse.json(
    options.meta === undefined ? { data } : { data, meta: options.meta },
    {
      status: options.status ?? 200,
      headers: {
        ...corsHeaders(),
        ...(options.cache === false ? NO_STORE_HEADERS : CACHE_HEADERS),
      },
    },
  )
}

export function jsonError(code: string, message: string, status: number) {
  return NextResponse.json(
    { error: { code, message } },
    {
      status,
      headers: {
        ...corsHeaders(),
        ...NO_STORE_HEADERS,
      },
    },
  )
}

export function preflight() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  })
}
