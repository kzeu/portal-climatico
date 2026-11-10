export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="cards home-cards-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="ui-skeleton portal-card" key={i} />
      ))}
    </div>
  );
}

export function EmptyState({ titulo = "Ainda não há conteúdos", texto }) {
  return (
    <div className="ui-empty" role="status">
      <strong>{titulo}</strong>
      {texto ? <p>{texto}</p> : null}
    </div>
  );
}

export function ErrorState({ texto = "Não foi possível carregar os dados. Tente novamente.", onRetry }) {
  return (
    <div className="ui-error" role="alert">
      <p>{texto}</p>
      {onRetry ? (
        <button type="button" className="ui-retry" onClick={onRetry}>
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export function AvisoSemEnvio({ email = "info@portaldoclima.gw" }) {
  return (
    <>
      Não foi possível enviar agora. Escreva para{" "}
      <a href={`mailto:${email}`}>{email}</a>.
    </>
  );
}
