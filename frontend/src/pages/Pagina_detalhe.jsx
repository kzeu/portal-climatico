import "../App.css";
import { useEffect, useState } from "react";

function Pagina_detalhe({ cardId, setPage }) {

  const [pagina, setPagina] = useState(null);
  const [imagens, setImagens] = useState([]);

  useEffect(() => {

    fetch(
      `http://localhost:3000/pagina/${cardId}`
    )

      .then(res => res.json())

      .then(async (data) => {

        setPagina(data);

        const respostaImagens = await fetch(
          `http://localhost:3000/pagina-imagens/${data.id}`
        );

        const imagensData =
          await respostaImagens.json();

        setImagens(imagensData);

      })

      .catch(err => console.log(err));

  }, [cardId]);

  if (!pagina) {

    return (

      <div className="content">

        <div className="pagina-noticia">

          Carregando...

        </div>

      </div>

    );

  }

  return (

    <div className="content">

      <div className="pagina-noticia">

        {/* VOLTAR */}

        <button
          className="btn-voltar"
          onClick={() => setPage("home")}
        >
          ← Voltar
        </button>

        {/* BREADCRUMB */}

        <div className="breadcrumb">

          <span
            className="breadcrumb-link"
            onClick={() => setPage("home")}
          >
            Home
          </span>

          <span className="sep">
            ›
          </span>

          <span>
            {pagina.titulo}
          </span>

        </div>

        {/* TITULO */}

        <h1 className="titulo-noticia">

          {pagina.titulo}

        </h1>

        {/* DATA */}

        <div className="data-publicacao">

          <strong>
            Data de publicação:
          </strong>

          {" "}

          {new Date(
            pagina.data_publicacao
          ).toLocaleDateString("pt-BR")}

        </div>

        {/* GALERIA */}

        {imagens.length > 0 && (

          <div className="galeria-noticia">

            <div className="galeria-grid">

              {imagens.map((img, index) => (

                <img

                  key={index}

                  src={
                    `http://localhost:3000/uploads/${img.imagem}`
                  }

                  alt={`Foto ${index + 1}`}

                  className="galeria-img"

                />

              ))}

            </div>

          </div>

        )}

        {/* TEXTO */}

        <div className="texto-noticia">

          {pagina.texto}

        </div>

      </div>

    </div>

  );

}

export default Pagina_detalhe;