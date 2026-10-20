import "../App.css";
import { useEffect, useState } from "react";
import API_URL from "../config";

function Pagina_detalhe({ cardId, setPage, paginaAnterior }) {
  const [pagina, setPagina] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPagina() {
      setCarregando(true);
      setErro("");
      setPagina(null);
      setImagens([]);

      try {
        const resposta = await fetch(`${API_URL}/pagina/${cardId}`);
        if (!resposta.ok) {
          throw new Error("Não foi possível carregar esta página.");
        }

        const dados = await resposta.json();
        if (!dados || !dados.id) {
          throw new Error("O conteúdo solicitado não foi encontrado.");
        }

        let listaImagens = [];
        try {
          const respostaImagens = await fetch(`${API_URL}/pagina-imagens/${dados.id}`);
          if (respostaImagens.ok) {
            const dadosImagens = await respostaImagens.json();
            listaImagens = Array.isArray(dadosImagens) ? dadosImagens : [];
          }
        } catch (erroImagens) {
          // A página continua disponível mesmo se a galeria não puder ser carregada.
          console.warn("Não foi possível carregar a galeria:", erroImagens);
        }

        if (ativo) {
          setPagina(dados);
          setImagens(listaImagens);
        }
      } catch (erroCarregamento) {
        if (ativo) {
          setErro(erroCarregamento.message || "Ocorreu um erro ao carregar o conteúdo.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    if (cardId !== undefined && cardId !== null) {
      carregarPagina();
    } else {
      setErro("Não foi informado qual conteúdo deve ser exibido.");
      setCarregando(false);
    }

    return () => {
      ativo = false;
    };
  }, [cardId]);

  const paginasNomes = {
    home: "Home",
    adaptacao: "Adaptação",
    mitigacao: "Mitigação",
    biblioteca: "Biblioteca",
    engajamento: "Engajamento",
    contato: "Contato",
  };
  const nomePagina = paginasNomes[paginaAnterior] || "Home";

  function formatarData(data) {
    if (!data) return "Data não informada";
    const dataObj = new Date(data);
    if (Number.isNaN(dataObj.getTime())) return "Data não informada";
    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="content">
      <article className="pagina-noticia">
        <button
          type="button"
          className="btn-voltar"
          onClick={() => setPage(paginaAnterior)}
          aria-label={`Voltar para ${nomePagina}`}
        >
          ← Voltar
        </button>

        {carregando ? (
          <div className="pagina-estado" role="status" aria-live="polite">
            <span aria-hidden="true">⏳</span>
            <p>Carregando conteúdo...</p>
          </div>
        ) : erro ? (
          <div className="pagina-estado pagina-estado-erro" role="alert">
            <h2>Não foi possível abrir esta página</h2>
            <p>{erro}</p>
            <button type="button" className="btn-voltar" onClick={() => setPage(paginaAnterior)}>
              Voltar para {nomePagina}
            </button>
          </div>
        ) : pagina ? (
          <>
            <nav className="breadcrumb" aria-label="Navegação estrutural">
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => setPage(paginaAnterior)}
              >
                {nomePagina}
              </button>
              <span className="sep" aria-hidden="true">›</span>
              <span aria-current="page">{pagina.titulo || "Detalhes do conteúdo"}</span>
            </nav>

            <header className="detalhe-cabecalho">
              <p className="detalhe-sobretitulo">Portal Climático da Guiné-Bissau</p>
              <h1 className="titulo-noticia">
                {pagina.titulo || "Conteúdo sem título"}
              </h1>
              <div className="data-publicacao">
                <strong>Publicado em:</strong> {formatarData(pagina.data_publicacao)}
              </div>
            </header>

            {imagens.length > 0 && (
              <section className="galeria-noticia" aria-label="Galeria de imagens">
                <h2 className="detalhe-secao-titulo">Galeria de imagens</h2>
                <div className="galeria-grid">
                  {imagens.map((img, index) => (
                    <figure className="detalhe-figura" key={img.id || img.imagem || index}>
                      <img
                        src={`${API_URL}/uploads/${img.imagem}`}
                        alt={img.descricao || `Imagem ${index + 1} de ${pagina.titulo || "conteúdo"}`}
                        className="galeria-img"
                        loading="lazy"
                      />
                      {img.descricao && <figcaption>{img.descricao}</figcaption>}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="detalhe-corpo" aria-label="Conteúdo completo">
              <h2 className="detalhe-secao-titulo">Sobre este conteúdo</h2>
              <div className="texto-noticia">
                {pagina.texto ? (
                  pagina.texto
                ) : (
                  <p>Não há descrição disponível para este conteúdo.</p>
                )}
              </div>
            </section>
          </>
        ) : null}
      </article>
    </div>
  );
}

export default Pagina_detalhe;
