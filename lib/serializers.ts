import type { Event } from "./types"

function toAbsoluteUrl(value: string | undefined, baseUrl: string) {
  if (!value || !value.startsWith("/")) {
    return value
  }

  return `${baseUrl}${value}`
}

/**
 * Converts the relative asset paths of an event into absolute URLs, so clients
 * hosted on another domain can load the images directly from this API.
 *
 * The JSON dataset keeps relative paths; only the HTTP response is rewritten.
 */
export function toAbsoluteEvent(event: Event, baseUrl: string): Event {
  return {
    ...event,
    imageUrl: toAbsoluteUrl(event.imageUrl, baseUrl) ?? event.imageUrl,
    banner: toAbsoluteUrl(event.banner, baseUrl),
  }
}
