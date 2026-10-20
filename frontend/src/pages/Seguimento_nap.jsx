import "../App.css";
import HeroDinamico from "../components/HeroDinamico";
import { useEffect, useState } from "react";
import API_URL from "../config";

function Seguimento_nap({
  setPage,
  setCardSelecionado,
  setPaginaAnterior
}) {
  const [cards, setCards] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/cards/seguimento_nap`)
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os cards.");
        return res.json();
      })
      .then((data) => setCards(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar cards:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/publicacoes/seguimento_nap`)
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar publicações.");
        return res.json();
      })
      .then((data) => setPublicacoes(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar publicações:", err));
  }, []);

  function isDetalhe(card) {
    return card.pagina_detalhe === true ||
      card.pagina_detalhe === 1 ||
      card.pagina_detalhe === "1" ||
      card.pagina_detalhe === "sim" ||
      card.tipo_link === "publicacao";
  }

  function abrirCard(card, paginaAnterior = "seguimento_nap") {
    const detalhe = isDetalhe(card);
    const externo = !detalhe && card.tipo_link === "externo";

    if (detalhe) {
      setCardSelecionado(card.id);
      setPaginaAnterior(paginaAnterior);
      setPage("pagina_detalhe");
    } else if (externo && card.link) {
      const url = /^https?:\/\//i.test(card.link) ? card.link : `https://${card.link}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (card.link) {
      setPaginaAnterior(paginaAnterior);
      setPage(card.link);
    }
  }

  function renderCard(card, isPublication = false) {
    const temImagem = Boolean(card.imagem_card);
    const detalhe = isDetalhe(card);
    const externo = !detalhe && card.tipo_link === "externo";
    const informativo = !detalhe && card.tipo_link === "nenhum";
    const icone = informativo ? "i" : detalhe || externo ? "↗" : "→";
    const rotulo = detalhe ? "Publicação / conteúdo completo" : externo ? "Link externo" : informativo ? "Conteúdo informativo" : "Página interna";

    return (
      <article
        className={`card portal-card ${temImagem ? "portal-card-image" : "portal-card-soft"} ${isPublication ? "publication-card" : ""}`}
        key={`${isPublication ? "pub" : "card"}-${card.id}`}
      >
        {temImagem && <>
          <img
            src={`${API_URL}/uploads/${card.imagem_card}`}
            alt={card.titulo || ""}
            className="portal-card-background"
            loading="lazy"
          />
          <div className="portal-card-overlay" />
        </>}
        <div className="portal-card-content">
          <div className="portal-card-topline">
            <span className="portal-card-kind">{isPublication ? "PUBLICAÇÃO" : detalhe ? "PUBLICAÇÃO" : externo ? "LINK EXTERNO" : informativo ? "INFORMATIVO" : "PORTAL"}</span>
            <span className="portal-card-destination" title={rotulo} aria-label={rotulo}>{icone}</span>
          </div>
          {isPublication && card.data_publicacao && (
            <div className="publication-card-meta">
              <span aria-hidden="true">▦</span>
              <span>Publicado em</span>
              <time dateTime={String(card.data_publicacao).slice(0, 10)}>
                {new Date(`${String(card.data_publicacao).slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR")}
              </time>
            </div>
          )}
          <h3 className="portal-card-title">{card.titulo}</h3>
          {card.conteudo && (
            <p className="portal-card-description">
              {card.conteudo.length > 200 ? `${card.conteudo.substring(0, 200).trimEnd()}…` : card.conteudo}
            </p>
          )}
          <div className="portal-card-bottom">
            {informativo ? (
              <span className="portal-card-action portal-card-action-static" aria-label="Card apenas informativo">
                Apenas informativo <span aria-hidden="true">ⓘ</span>
              </span>
            ) : (
              <button
                type="button"
                className="portal-card-action"
                disabled={!detalhe && !card.link}
                onClick={() => abrirCard(card, "seguimento_nap")}
              >
                {isPublication ? (externo ? "Acessar link" : detalhe ? "Ler publicação" : "Explorar página") : externo ? "Abrir link" : detalhe ? "Ler" : "Abrir"}
                <span aria-hidden="true">{icone}</span>
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Exclui publicações da grade fixa; a seção abaixo continua separada.
  const cardsFixos = cards.filter((card) => !isDetalhe(card));

  return (
    <div className="content portal-modern-page" id="content">
      <HeroDinamico pagina="nap" setPage={setPage} setPaginaAnterior={setPaginaAnterior} />

      <section className="home-areas">
        <div className="home-section-title">
          <div className="home-section-kicker">🌿 EXPLORAR CONTEÚDOS</div>
          <h2>Seguimento do NAP</h2>
        </div>
        <div className="cards home-cards-grid">
          {cardsFixos.map((card) => renderCard(card))}
        </div>
      </section>

      {publicacoes.length > 0 && (
        <section className="home-areas publicacoes-section">
          <div className="home-section-title">
            <div className="home-section-kicker">📚 PUBLICAÇÕES</div>
            <h2>Publicações</h2>
          </div>
          <div className="cards home-cards-grid publication-cards-grid">
            {[...publicacoes]
              .sort((a, b) => {
                const dataA = a.data_publicacao ? new Date(String(a.data_publicacao).slice(0, 10) + "T00:00:00").getTime() : 0;
                const dataB = b.data_publicacao ? new Date(String(b.data_publicacao).slice(0, 10) + "T00:00:00").getTime() : 0;
                return dataB - dataA;
              })
              .map((card) => renderCard(card, true))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Seguimento_nap;
