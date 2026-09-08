import "../App.css";
import { useEffect, useState } from "react";
import API_URL from "../config";

function Mitigacao({
  setPage,
  setCardSelecionado,
  setPaginaAnterior
}) {

  const [cards, setCards] = useState([]);

  const [publicacoes, setPublicacoes] = useState([]);

  useEffect(() => {

    fetch(
      `${API_URL}/cards/mitigacao`
    )
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.log(err));

  }, []);

  useEffect(() => {

  fetch(`${API_URL}/publicacoes/mitigacao`)

    .then(res => res.json())

    .then(data => setPublicacoes(data))

    .catch(err =>
      console.log("Erro ao carregar publicações:", err)
    );

}, []);

  return (

    <div className="content" id="content">

      {/* HERO */}

      <div className="hero">

        <h1>
          Portal Climático da Guiné-Bissau
        </h1>

        <p>

         A mitigação é importante para a Guiné-Bissau ao reduzir emissões e promover um desenvolvimento sustentável. 
         Mesmo com baixas emissões, ações em florestas, energia e uso da terra são essenciais e abrem acesso a financiamento climático.

        </p>

      </div>

      {/* CARDS */}

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

                      setCardSelecionado(
                        card.id
                      );

                      setPaginaAnterior(
                        "mitigacao"
                      );

                      setPage(
                        "pagina_detalhe"
                      );

                    }

                    /* Link externo */

                    else if (
                      card.tipo_link ===
                      "externo"
                    ) {

                      window.open(
                        card.link,
                        "_blank"
                      );

                    }

                    /* Página interna */

                    else if (
                      card.link
                    ) {

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
              📚 Submissões de Ações Climáticas
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

                {card.imagem_card && (

                  <img
                    src={`${API_URL}/uploads/${card.imagem_card}`}
                    alt={card.titulo}
                    className="card-image"
                  />

                )}


                <div className="card-header">
                  {card.titulo}
                </div>


                <div className="card-body">

                  {card.conteudo?.length > 150
                    ? card.conteudo.substring(0, 150) + "..."
                    : card.conteudo}

                </div>


                {(card.pagina_detalhe || card.link) && (

                  <div className="card-footer">

                    <button
                      className="btn-card"
                      onClick={() => {

                        if (card.pagina_detalhe) {

                          setCardSelecionado(card.id);
                          setPaginaAnterior("mitigacao");
                          setPage("pagina_detalhe");

                        }

                        else if (card.tipo_link === "externo") {

                          window.open(
                            card.link,
                            "_blank"
                          );

                        }

                        else if (card.link) {

                          setPage(card.link);

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

export default Mitigacao;