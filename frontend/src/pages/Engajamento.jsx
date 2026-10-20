import "../App.css";
import HeroDinamico from "../components/HeroDinamico";

function Engajamento({ setPage, setPaginaAnterior }) {
  const cards = [
    {
      titulo: "Seguimento do NAP",
      conteudo: "Plano Nacional de Adaptação às Mudanças Climáticas",
      link: "seguimento_nap"
    },
    {
      titulo: "Mitigação",
      conteudo: "Inventário de Gases de Efeito Estufa",
      link: "mitigacao"
    },
    {
      titulo: "Formulário de submissão de Ação Climática",
      conteudo: "A ação climática cabe a todos nós. Refere-se aos esforços do país para reduzir os riscos climáticos e as emissões de gases de efeito estufa, ao mesmo tempo em que fortalece a resiliência em setores-chave como agricultura, zonas costeiras, água e ecossistemas."
    },
    {
      titulo: "Relatórios Nacionais",
      conteudo: "Veja os relatórios nacionais da Guiné-Bissau para a UNFCCC"
    },
    {
      titulo: "Treinamento em Transparência Climática",
      conteudo: "[Em desenvolvimento] Oportunidade de treinamento online para stakeholders da Guiné-Bissau sobre a preparação de inventários de Gases de Efeito Estufa (GEE)."
    },
    {
      titulo: "Chamada para propostas",
      conteudo: "[Em desenvolvimento]"
    },
    {
      titulo: "Eventos",
      conteudo: "[Em desenvolvimento]"
    },
    {
      titulo: "Projeto COASTAL",
      conteudo: "PNUD GEF: Reforço de Capacidades de Adaptação e de Resiliência...",
      externo: "https://coastal.gw/"
    },
    {
      titulo: "Novo Projeto GEF em preparação",
      conteudo: "[Em desenvolvimento]"
    },
    {
      titulo: "Preparação nacional para a COP",
      conteudo: "[Em desenvolvimento]"
    },
    {
      titulo: "Novidades do INA",
      conteudo: "[Em desenvolvimento]"
    }
  ];

  function abrir(card) {
    if (card.externo) {
      window.open(card.externo, "_blank", "noopener,noreferrer");
    } else if (card.link) {
      setPaginaAnterior?.("engajamento");
      setPage(card.link);
    }
  }

  return (
    <div className="content portal-modern-page" id="content">
      <HeroDinamico pagina="engajamento" setPage={setPage} setPaginaAnterior={setPaginaAnterior} />

      <section className="home-areas">
        <div className="home-section-title">
          <div className="home-section-kicker">🌿 PARTICIPAÇÃO E AÇÃO CLIMÁTICA</div>
          <h2>Engajamento</h2>
          <p className="home-section-description">
            Conheça iniciativas, projetos e oportunidades de participação na ação climática.
          </p>
        </div>

        <div className="cards home-cards-grid">
          {cards.map((card, index) => {
            const clicavel = Boolean(card.link || card.externo);
            const externo = Boolean(card.externo);
            return (
              <article
                className="card portal-card portal-card-soft"
                key={card.titulo}
                role={clicavel ? "link" : undefined}
              >
                <div className="portal-card-content">
                  <div className="portal-card-topline">
                    <span className="portal-card-kind">{externo ? "LINK EXTERNO" : card.link ? "PORTAL" : "INFORMATIVO"}</span>
                    <span className="portal-card-destination" aria-hidden="true">{externo ? "↗" : card.link ? "→" : "i"}</span>
                  </div>
                  <h3 className="portal-card-title">{card.titulo}</h3>
                  <p className="portal-card-description">{card.conteudo}</p>
                  <div className="portal-card-bottom">
                    {clicavel ? (
                      <button className="portal-card-action" type="button" onClick={() => abrir(card)}>
                        {externo ? "Abrir link" : "Explorar"}
                        <span aria-hidden="true">{externo ? "↗" : "→"}</span>
                      </button>
                    ) : (
                      <span className="portal-card-action portal-card-action-static">Conteúdo informativo <span aria-hidden="true">ⓘ</span></span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Engajamento;
