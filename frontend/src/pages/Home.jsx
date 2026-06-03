import "../App.css";
import { useEffect, useState } from "react";

function Home({

  setPage,

  setCardSelecionado,

  setPaginaAnterior

}) {

  const [cards, setCards] = useState([]);

  useEffect(() => {

    fetch(
      "http://localhost:3000/cards/home"
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

          O principal hub para a ação e transparência climática,
          acesso a dados, relatórios e mapas relevantes para a
          adaptação na Guiné-Bissau

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

                src={
                  `http://localhost:3000/uploads/${card.imagem_card}`
                }

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

            {/* BOTAO */}

            {card.pagina_detalhe && (

              <div className="card-footer">

                <button

                  className="btn-card"

                  onClick={() => {

                    setCardSelecionado(card.id);

                    setPaginaAnterior("home");

                    setPage("pagina_detalhe");

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

export default Home;