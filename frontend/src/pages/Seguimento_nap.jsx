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

  /* =========================
     CARDS FIXOS
     ========================= */

  useEffect(() => {

    fetch(`${API_URL}/cards/seguimento_nap`)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.log("Erro ao carregar cards:", err));

  }, []);

  /* =========================
     PUBLICAÇÕES
     ========================= */

  useEffect(() => {

    fetch(`${API_URL}/publicacoes/seguimento_nap`)
      .then(res => res.json())
      .then(data => setPublicacoes(data))
      .catch(err =>
        console.log("Erro ao carregar publicações:", err)
      );

  }, []);

  return (

    <div className="content" id="content">

      {/* HERO — conteúdo carregado do cadastro Banners e Heros */}
      <HeroDinamico pagina="nap" setPage={setPage} setPaginaAnterior={setPaginaAnterior} />


      {/* =========================
          CARDS FIXOS
          ========================= */}

      <div className="cards">

        {cards.map((card) => (

          <div
            className="card"
            key={card.id}
          >

            {/* IMAGEM */}

            {card.imagem_card && (

              <img
                src={`${API_URL}/uploads/${card.imagem_card}`}
                alt={card.titulo}
                className="card-image"
              />

            )}


            {/* TITULO */}

            <div className="card-header">

              {card.titulo}

            </div>


            {/* TEXTO */}

            <div className="card-body">

              {card.conteudo?.length > 150
                ? card.conteudo.substring(0, 150) + "..."
                : card.conteudo}

            </div>


            {/* BOTÃO */}

            {(card.pagina_detalhe || card.link) && (

              <div className="card-footer">

                <button
                  className="btn-card"

                  onClick={() => {

                    /* Página detalhe */

                    if (card.pagina_detalhe) {

                      setCardSelecionado(card.id);

                      setPaginaAnterior(
                        "seguimento_nap"
                      );

                      setPage(
                        "pagina_detalhe"
                      );

                    }

                    /* Link externo */

                    else if (
                      card.tipo_link === "externo"
                    ) {

                      window.open(
                        card.link,
                        "_blank"
                      );

                    }

                    /* Página interna */

                    else if (card.link) {

                      setPage(
                        card.link
                      );

                    }

                  }}
                >

                  Saiba Mais

                </button>

              </div>

            )}

          </div>

        ))}

      </div>


      {/* =====================================================
          PUBLICAÇÕES
      ====================================================== */}

      {publicacoes.length > 0 && (

        <section className="home-areas publicacoes-section">

          <div className="home-section-title">

            <div className="home-section-kicker">
              📚 PUBLICAÇÕES
            </div>

            <h2>
              Publicações
            </h2>

          </div>


          <div className="cards">

            {publicacoes.map((card) => (

              <div
                className="card"
                key={card.id}
              >

                {/* IMAGEM */}

                {card.imagem_card && (

                  <img
                    src={`${API_URL}/uploads/${card.imagem_card}`}
                    alt={card.titulo}
                    className="card-image"
                  />

                )}


                {/* TITULO */}

                <div className="card-header">

                  {card.titulo}

                </div>


                {/* TEXTO */}

                <div className="card-body">

                  {card.conteudo?.length > 150
                    ? card.conteudo.substring(0, 150) + "..."
                    : card.conteudo}

                </div>


                {/* BOTÃO */}

                {(card.pagina_detalhe || card.link) && (

                  <div className="card-footer">

                    <button
                      className="btn-card"

                      onClick={() => {

                        /* Página detalhe */

                        if (card.pagina_detalhe) {

                          setCardSelecionado(card.id);

                          setPaginaAnterior(
                            "seguimento_nap"
                          );

                          setPage(
                            "pagina_detalhe"
                          );

                        }

                        /* Link externo */

                        else if (
                          card.tipo_link === "externo"
                        ) {

                          window.open(
                            card.link,
                            "_blank"
                          );

                        }

                        /* Página interna */

                        else if (card.link) {

                          setPage(
                            card.link
                          );

                        }

                      }}
                    >

                      Saiba Mais

                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        </section>

      )}

    </div>

  );

}

export default Seguimento_nap;
