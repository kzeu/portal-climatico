import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import CardPortal from "../components/CardPortal";
import SectionTitle from "../components/SectionTitle";
import { EmptyState, ErrorState, SkeletonGrid } from "../components/StatusStates";
import { urlApi } from "../config";
import { pedirJson } from "../rede";

export default function SecaoCards({
  secao,
  heroPagina,
  from,
  titulo = "Explore"
}) {
  const [cards, setCards] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);
  const [estado, setEstado] = useState("loading");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    Promise.all([
      pedirJson(urlApi(`/cards/${secao}`), controlador.signal),
      pedirJson(urlApi(`/publicacoes/${secao}`), controlador.signal)
    ])
      .then(([listaCards, listaPubs]) => {
        if (!ativo) return;
        setCards(Array.isArray(listaCards) ? listaCards : []);
        setPublicacoes(Array.isArray(listaPubs) ? listaPubs : []);
        setEstado("ok");
      })
      .catch((erro) => {
        if (!ativo || erro?.name === "AbortError") return;
        setEstado("erro");
      });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [secao, tentativa]);

  return (
    <PageShell>
      <HeroPage pagina={heroPagina} />
      <section className="home-areas" aria-labelledby={`titulo-${secao}`}>
        <SectionTitle id={`titulo-${secao}`} title={titulo} />
        {estado === "loading" ? <SkeletonGrid /> : null}
        {estado === "erro" ? (
          <ErrorState onRetry={() => {
            setEstado("loading");
            setTentativa((atual) => atual + 1);
          }} />
        ) : null}
        {estado === "ok" && cards.length === 0 ? (
          <EmptyState texto="Ainda não há cards publicados nesta secção." />
        ) : null}
        {estado === "ok" && cards.length > 0 ? (
          <div className="cards home-cards-grid">
            {cards.map((card) => (
              <CardPortal key={card.id} card={card} from={from} />
            ))}
          </div>
        ) : null}
      </section>

      {publicacoes.length > 0 ? (
        <section className="home-areas publicacoes-section" aria-labelledby={`publicacoes-${secao}`}>
          <SectionTitle
            id={`publicacoes-${secao}`}
            title="Publicações"
            description="Conteúdos publicados a partir das submissões de ações climáticas."
          />
          <div className="cards home-cards-grid publication-cards-grid">
            {publicacoes.map((card) => (
              <CardPortal key={card.id} card={card} from={from} kind="Publicação" actionLabel="Ler publicação" />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
