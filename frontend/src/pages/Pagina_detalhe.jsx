import "../App.css";
import { useEffect, useState } from "react";
import API_URL from "../config";

function Pagina_detalhe({ cardId, setPage,paginaAnterior }) {

  const [pagina, setPagina] = useState(null);
  const [imagens, setImagens] = useState([]);

  useEffect(() => {

    fetch(
      `${API_URL}/pagina/${cardId}`
    )

      .then(res => res.json())

      .then(async (data) => {

        setPagina(data);

        const respostaImagens = await fetch(
          `${API_URL}/pagina-imagens/${data.id}`
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

  const nomePagina = {

  home: "Home",

  adaptacao: "Adaptação",

  mitigacao: "Mitigação",

  biblioteca: "Biblioteca",

  engajamento: "Engajamento",

  contato: "Contato"

}[paginaAnterior] || "Home";

  return (

    <div className="content">

      <div className="pagina-noticia">

        {/* VOLTAR */}

        <button
          className="btn-voltar"
          onClick={() => setPage(paginaAnterior)}
        >
          ← Voltar
        </button>

        {/* BREADCRUMB */}

        <div className="breadcrumb">

          <span
            className="breadcrumb-link"
            onClick={() => setPage(paginaAnterior)}
          >
            {nomePagina}
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
                    `${API_URL}/uploads/${img.imagem}`
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