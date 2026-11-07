import { readFile, access } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const DATA_FILE = path.join(ROOT, "data", "events.json")
const PUBLIC_DIR = path.join(ROOT, "public")

const CATEGORIES = ["show", "Religioso", "teatro", "culinario", "museu", "palestras"]
const REQUIRED_STRING_FIELDS = [
  "id",
  "title",
  "date",
  "time",
  "location",
  "description",
  "imageUrl",
]

const errors = []

function fail(message) {
  errors.push(message)
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0
}

async function fileExists(publicPath) {
  if (!publicPath.startsWith("/")) return false

  try {
    await access(path.join(PUBLIC_DIR, publicPath))
    return true
  } catch {
    return false
  }
}

async function validate() {
  let events

  try {
    events = JSON.parse(await readFile(DATA_FILE, "utf8"))
  } catch (error) {
    console.error(`Não foi possível ler ${path.relative(ROOT, DATA_FILE)}.`)
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }

  if (!Array.isArray(events)) {
    console.error("data/events.json deve conter um array de eventos.")
    process.exit(1)
  }

  const ids = new Set()

  for (const [index, event] of events.entries()) {
    const label = `evento #${index + 1}${isNonEmptyString(event?.id) ? ` (${event.id})` : ""}`

    if (typeof event !== "object" || event === null) {
      fail(`${label}: deve ser um objeto.`)
      continue
    }

    for (const field of REQUIRED_STRING_FIELDS) {
      if (!isNonEmptyString(event[field])) {
        fail(`${label}: campo "${field}" é obrigatório e deve ser uma string não vazia.`)
      }
    }

    if (!CATEGORIES.includes(event.category)) {
      fail(`${label}: categoria inválida "${event.category}".`)
    }

    if (isNonEmptyString(event.date) && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      fail(`${label}: "date" deve estar no formato YYYY-MM-DD.`)
    }

    if (isNonEmptyString(event.time) && !/^\d{2}:\d{2}$/.test(event.time)) {
      fail(`${label}: "time" deve estar no formato HH:MM.`)
    }

    if (isNonEmptyString(event.id)) {
      if (ids.has(event.id)) {
        fail(`${label}: id duplicado.`)
      }

      ids.add(event.id)
    }

    if (isNonEmptyString(event.imageUrl) && !(await fileExists(event.imageUrl))) {
      fail(`${label}: imagem não encontrada em public${event.imageUrl}.`)
    }

    if (event.banner !== undefined) {
      if (!isNonEmptyString(event.banner)) {
        fail(`${label}: "banner" deve ser uma string não vazia quando presente.`)
      } else if (!(await fileExists(event.banner))) {
        fail(`${label}: banner não encontrado em public${event.banner}.`)
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} problema(s) encontrado(s):\n`)

    for (const error of errors) {
      console.error(`- ${error}`)
    }

    process.exit(1)
  }

  const featured = events.filter((event) => event.banner).length

  console.log(`OK: ${events.length} eventos válidos (${featured} em destaque).`)
}

await validate()
