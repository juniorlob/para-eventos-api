# Pará Eventos API (BFF)

BFF em [Next.js](https://nextjs.org) (App Router + TypeScript) que expõe os
eventos culturais do app **ParáEventos**. Nesta primeira versão os dados vêm de
um arquivo JSON local, com uma camada de acesso isolada para facilitar a troca
por um banco de dados no futuro.

## Requisitos

- Node.js 20.9+ (testado com Node 24)
- npm

## Como executar

```bash
npm install
cp .env.example .env.local   # opcional, para configurar CORS
npm run dev
```

A API sobe em `http://localhost:3000`. A página inicial lista os endpoints
disponíveis para teste manual.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Valida os dados e gera o build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Checa os tipos com TypeScript |
| `npm run validate:data` | Valida `data/events.json` e as imagens referenciadas |

## Endpoints

### `GET /api/events`

Lista paginada de eventos.

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `q` | string | Busca no título (ignora acentos e maiúsculas) |
| `category` | string | Filtra por uma ou mais categorias separadas por vírgula (`show`, `Religioso`, `teatro`, `culinario`, `museu`, `palestras`). Semântica OR |
| `featured` | boolean | `true` retorna apenas eventos com banner |
| `limit` | inteiro | Itens por página, de 1 a 100 (padrão: 50) |
| `offset` | inteiro | Itens a pular (padrão: 0) |

Exemplos:

```bash
curl "http://localhost:3000/api/events"
curl "http://localhost:3000/api/events?category=teatro"
curl "http://localhost:3000/api/events?category=show,teatro"
curl "http://localhost:3000/api/events?category=show&category=museu"
curl "http://localhost:3000/api/events?q=verao"
curl "http://localhost:3000/api/events?featured=true"
curl "http://localhost:3000/api/events?limit=5&offset=10"
```

Resposta:

```json
{
  "data": [
    {
      "id": "show-mangueirao-2027",
      "title": "Show Nacional - Verão Amazônico 2027",
      "category": "show",
      "date": "2027-02-23",
      "time": "18:00",
      "location": "Estádio Olímpico do Pará - Mangueirão, Belém-PA",
      "description": "...",
      "imageUrl": "/images/eventos/show-mangueirao-2027.png",
      "banner": "/images/banners/festival-no-mangueirao.jpeg"
    }
  ],
  "meta": {
    "total": 23,
    "count": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### `GET /api/events/[id]`

Retorna um evento pelo `id`.

```bash
curl "http://localhost:3000/api/events/show-mangueirao-2027"
```

Retorna `404` com `EVENT_NOT_FOUND` quando o id não existe.

### `GET /api/categories`

Retorna as categorias e a quantidade de eventos em cada uma.

```json
{
  "data": [
    { "value": "show", "count": 4 },
    { "value": "Religioso", "count": 3 }
  ],
  "meta": { "total": 6 }
}
```

### `GET /api/health`

```json
{
  "data": {
    "status": "ok",
    "events": 23,
    "timestamp": "2026-11-06T21:00:00.000Z"
  }
}
```

## Formato de erro

```json
{
  "error": {
    "code": "INVALID_CATEGORY",
    "message": "Categoria inválida: \"cinema\"."
  }
}
```

Códigos usados: `INVALID_CATEGORY`, `INVALID_FEATURED`, `INVALID_LIMIT`,
`INVALID_OFFSET`, `EVENT_NOT_FOUND`, `DATA_UNAVAILABLE`.

## Dados

- `data/events.json`: 23 eventos com os campos `id`, `title`, `category`, `date`,
  `time`, `location`, `description`, `imageUrl` e `banner` (opcional).
- `public/images/eventos` e `public/images/banners`: imagens servidas pela API.
- `scripts/validate-data.mjs`: garante ids únicos, campos obrigatórios, formato de
  data/hora e existência dos arquivos de imagem.

Em desenvolvimento o JSON é relido a cada requisição, então editar o arquivo não
exige reiniciar o servidor. Em produção a lista é mantida em memória.

## CORS

O app Vue em dev roda em `http://localhost:5173`. Configure a origem permitida em
`.env.local`:

```env
CORS_ORIGIN=http://localhost:5173
```

O valor padrão é `*`.

## Próximos passos

- Consumir a API no app Vue (proxy do Vite para `/api`).
- Substituir `lib/events-repository.ts` por um repositório de banco de dados
  quando o JSON deixar de ser suficiente.
