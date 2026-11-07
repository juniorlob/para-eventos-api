export default function Home() {
  return (
    <main className="home">
      <header className="hero">
        <span className="badge">BFF</span>
        <h1>para-eventos-api</h1>
        <p>
          API de eventos culturais do Pará. Os dados são servidos inicialmente a
          partir de <code>data/events.json</code> e podem ser consumidos pelo app
          Vue em desenvolvimento.
        </p>
      </header>

      <section>
        <h2>Endpoints</h2>
        <ul className="endpoints">
          <li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/events">
              <code>GET /api/events</code>
            </a>
            <span>Lista paginada de eventos com busca e filtros.</span>
          </li>
          <li>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/events/show-mangueirao-2027">
              <code>GET /api/events/[id]</code>
            </a>
            <span>Detalhe de um evento pelo id.</span>
          </li>
          <li>
            <a href="/api/categories">
              <code>GET /api/categories</code>
            </a>
            <span>Categorias disponíveis e quantidade de eventos.</span>
          </li>
          <li>
            <a href="/api/health">
              <code>GET /api/health</code>
            </a>
            <span>Status da API e total de eventos carregados.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2>Filtros de <code>/api/events</code></h2>
        <pre>
          <code>{`/api/events?q=teatro
/api/events?category=show
/api/events?featured=true
/api/events?limit=10&offset=0
/api/events?category=museu&q=amazonia&limit=5`}</code>
        </pre>
      </section>

      <footer>
        Respostas no formato <code>{`{ data, meta }`}</code> e erros no formato{" "}
        <code>{`{ error: { code, message } }`}</code>.
      </footer>
    </main>
  )
}
