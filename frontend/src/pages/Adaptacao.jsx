import "../App.css";
import { useEffect, useState } from "react";

function Adaptacao({
  setPage,
  setCardSelecionado,
  setPaginaAnterior
}) {

  const [cards, setCards] = useState([]);

  useEffect(() => {

    fetch(
      "http://localhost:3000/cards/adaptacao"
    )
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="content" id="content">

      {/* HERO */}

      <div className="hero">

        <h1>
          Portal Climático da Guiné-Bissau
        </h1>

        <p>

          A adaptação é essencial para a
          Guiné-Bissau devido à sua elevada
          vulnerabilidade a impactos como a
          subida do nível do mar, inundações
          e variabilidade das chuvas.

          Esses riscos afetam setores vitais
          como agricultura, água e zonas
          costeiras.

          Fortalecer a adaptação permite
          reduzir perdas, proteger populações
          vulneráveis e promover um
          desenvolvimento mais resiliente.

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
                src={`http://localhost:3000/uploads/${card.imagem_card}`}
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

            {/* BOTÃO SAIBA MAIS */}

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
                        "adaptacao"
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

    </div>

  );

}

export default Adaptacao;