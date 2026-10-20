import "../App.css";
import Parceiros from "../components/Parceiros";
import { useEffect, useState } from "react";
import API_URL from "../config";

function Home({
  setPage,
  setCardSelecionado,
  setPaginaAnterior
}) {

  // =========================================================
  // CARDS DA HOME
  // =========================================================

  const [cards, setCards] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);

  // =========================================================
  // HERO
  // Conteúdo de reserva caso ainda não existam slides ativos no cadastro.
  // =========================================================

  const slidesPadrao = [

    {
      id: 1,

      imagem:  "/images/hero/hero-1.png",

      pequeno: "BEM-VINDO AO FUTURO SUSTENTÁVEL",

      titulo: "Portal Climático da Guiné-Bissau",

      texto:
        "O principal hub para ação e transparência climática, acesso a dados, relatórios e mapas relevantes para a adaptação e mitigação na Guiné-Bissau.",

      botaoPrincipal: "Explorar o Portal",

      linkPrincipal: "mapas",

      botaoSecundario: "Saiba mais",

      linkSecundario: "adaptacao"
    },

    {
      id: 2,

      imagem: "/images/hero/hero-2.jpg",

      pequeno: "ADAPTAÇÃO CLIMÁTICA",

      titulo: "Construindo comunidades mais resilientes",

      texto:
        "Conheça estratégias e ações para enfrentar os impactos das mudanças climáticas e fortalecer a resiliência das comunidades.",

      botaoPrincipal: "Conheça a Adaptação",

      linkPrincipal: "adaptacao",

      botaoSecundario: "Explorar",

      linkSecundario: "mapas"
    },

    {
      id: 3,

      imagem: "/images/hero/hero-3.jpg",

      pequeno: "MITIGAÇÃO",

      titulo: "Um futuro de baixo carbono",

      texto:
        "Descubra soluções, informações e iniciativas para reduzir emissões e contribuir para um futuro climático mais sustentável.",

      botaoPrincipal: "Conheça a Mitigação",

      linkPrincipal: "mitigacao",

      botaoSecundario: "Saiba mais",

      linkSecundario: "biblioteca"
    },

    {
      id: 4,

      imagem: "/images/hero/hero-4.jpg",

      pequeno: "MAPAS E DADOS",

      titulo: "Dados climáticos para decisões melhores",

      texto:
        "Explore mapas, indicadores e informações climáticas para compreender os riscos e apoiar decisões para a Guiné-Bissau.",

      botaoPrincipal: "Explorar Mapas",

      linkPrincipal: "mapas",

      botaoSecundario: "Ver Biblioteca",

      linkSecundario: "biblioteca"
    },

    {
      id: 5,

      imagem: "/images/hero/hero-5.jpg",

      pequeno: "CONHECIMENTO",

      titulo: "Informação para transformar",

      texto:
        "Acesse publicações, relatórios, estudos e documentos relacionados ao clima e ao desenvolvimento sustentável.",

      botaoPrincipal: "Acessar Biblioteca",

      linkPrincipal: "biblioteca",

      botaoSecundario: "Explorar",

      linkSecundario: "mapas"
    }

  ];


  const [heroSlides, setHeroSlides] = useState(slidesPadrao);

  // Carrega os slides cadastrados no mesmo painel Banners e Heros.
  useEffect(() => {
    let ativo = true;

    async function carregarSlidesHome() {
      try {
        const response = await fetch(`${API_URL}/banners-herois`);
        if (!response.ok) {
          throw new Error("Não foi possível carregar os slides da Home.");
        }

        const dados = await response.json();
        const slides = dados
          .filter((item) =>
            item.tipo === "slide" &&
            item.pagina === "home" &&
            (item.ativo === true || item.ativo === 1 ||
              item.ativo === "1" || item.ativo === "true")
          )
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
          .map((item) => ({
            id: item.id,
            imagem: item.imagem || "",
            pequeno: item.pequeno || "",
            titulo: item.titulo || "",
            texto: item.texto || "",
            botaoPrincipal: item.botao_principal || "",
            linkPrincipal: item.link_principal || "",
            tipoLinkPrincipal: item.tipo_link_principal || "interno",
            botaoSecundario: item.botao_secundario || "",
            linkSecundario: item.link_secundario || "",
            tipoLinkSecundario: item.tipo_link_secundario || "interno"
          }));

        if (ativo && slides.length > 0) {
          setHeroSlides(slides);
          setSlideAtual(0);
        }
      } catch (erro) {
        console.error("Erro ao carregar slides da Home:", erro);
        // Mantém os slides padrão para a Home não ficar vazia se a API falhar.
      }
    }

    carregarSlidesHome();
    return () => {
      ativo = false;
    };
  }, []);

  function obterImagemHero(imagem) {
    if (!imagem) return "";
    if (imagem.startsWith("http://") || imagem.startsWith("https://")) {
      return imagem;
    }
    return `${window.location.origin}${imagem.startsWith("/") ? "" : "/"}${imagem}`;
  }

  // =========================================================
  // SLIDE ATUAL
  // =========================================================

  const [slideAtual, setSlideAtual] = useState(0);


  // =========================================================
  // BUSCAR CARDS
  // =========================================================

  useEffect(() => {

    fetch(`${API_URL}/cards/home`)

      .then(res => res.json())

      .then(data => {

        setCards(data);

      })

      .catch(err => {

        console.log("Erro ao carregar cards:", err);

      });

  }, []);


  useEffect(() => {

  fetch(`${API_URL}/publicacoes/home`)

    .then(res => res.json())

    .then(data => {

      setPublicacoes(data);

    })

    .catch(err => {

      console.log("Erro ao carregar publicações:", err);

    });

}, []);


  // =========================================================
  // SLIDER AUTOMÁTICO
  // =========================================================

  useEffect(() => {

    const intervalo = setInterval(() => {

      setSlideAtual((atual) => {

        if (atual === heroSlides.length - 1) {

          return 0;

        }

        return atual + 1;

      });

    }, 7000);

    return () => clearInterval(intervalo);

  }, [heroSlides.length]);


  // =========================================================
  // PRÓXIMO SLIDE
  // =========================================================

  function proximoSlide() {

    setSlideAtual((atual) => {

      if (atual === heroSlides.length - 1) {

        return 0;

      }

      return atual + 1;

    });

  }


  // =========================================================
  // SLIDE ANTERIOR
  // =========================================================

  function slideAnterior() {

    setSlideAtual((atual) => {

      if (atual === 0) {

        return heroSlides.length - 1;

      }

      return atual - 1;

    });

  }


  // =========================================================
  // IR PARA UMA PÁGINA
  // =========================================================

  function navegarHero(link, tipoLink = "interno") {
    if (!link) return;

    if (tipoLink === "externo" || link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }

    setPaginaAnterior("home");
    setPage(link);
  }


  const slide = heroSlides[slideAtual];


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="content home-page" id="content">


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="home-hero"
        style={{
          backgroundImage: slide.imagem
            ? `url("${obterImagemHero(slide.imagem)}")`
            : undefined
        }}
      >

        {/* CAMADA ESCURA */}

        <div className="home-hero-overlay"></div>


        {/* CONTEÚDO */}

        <div className="home-hero-content">


          {/* LADO ESQUERDO */}

          <div className="home-hero-text">


            <div className="home-hero-small">

              {slide.pequeno}

            </div>


            <h1>

              {slide.titulo}

            </h1>


            <p>

              {slide.texto}

            </p>


            <div className="home-hero-buttons">


              <button
                className="home-hero-btn primary"
                onClick={() => navegarHero(slide.linkPrincipal, slide.tipoLinkPrincipal)}
              >

                {slide.botaoPrincipal}

                <span>→</span>

              </button>


              <button
                className="home-hero-btn secondary"
                onClick={() => navegarHero(slide.linkSecundario, slide.tipoLinkSecundario)}
              >

                {slide.botaoSecundario}

                <span>→</span>

              </button>


            </div>


          </div>


          {/* =================================================
              PAINEL DIREITO
          ================================================== */}

       { /*  <div className="home-hero-panel">


            <div className="hero-panel-item">


              <div className="hero-panel-icon">

                🌱

              </div>


              <div>

                <strong>

                  ADAPTAÇÃO

                </strong>

                <p>

                  Estratégias para construir comunidades resilientes e ecossistemas adaptados.

                </p>

              </div>


            </div>


            <div className="hero-panel-item">


              <div className="hero-panel-icon">

                🌡️

              </div>


              <div>

                <strong>

                  MITIGAÇÃO

                </strong>

                <p>

                  Soluções para reduzir emissões e combater as mudanças climáticas.

                </p>

              </div>


            </div>


            <div className="hero-panel-item">


              <div className="hero-panel-icon">

                🗺️

              </div>


              <div>

                <strong>

                  MAPAS E DADOS

                </strong>

                <p>

                  Mapas interativos e dados climáticos para decisões informadas.

                </p>

              </div>


            </div>


          </div> */}


        </div>


        {/* ===================================================
            SETA ESQUERDA
        ==================================================== */}

        <button
          className="hero-arrow hero-arrow-left"
          onClick={slideAnterior}
          aria-label="Slide anterior"
        >

          ‹

        </button>


        {/* ===================================================
            SETA DIREITA
        ==================================================== */}

        <button
          className="hero-arrow hero-arrow-right"
          onClick={proximoSlide}
          aria-label="Próximo slide"
        >

          ›

        </button>


        {/* ===================================================
            INDICADORES
        ==================================================== */}

        <div className="hero-dots">


          {heroSlides.map((item, index) => (

            <button
              key={item.id}
              className={
                index === slideAtual
                  ? "hero-dot active"
                  : "hero-dot"
              }
              onClick={() => setSlideAtual(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />

          ))}


        </div>


      </section>



      {/* =====================================================
          ÁREAS DE ATUAÇÃO
      ====================================================== */}

      <section className="home-areas">


        <div className="home-section-title">


          <div className="home-section-kicker">

            🌿 O QUE VOCÊ PODE ENCONTRAR

          </div>


          <h2>
            Explore nossas áreas de atuação
          </h2>
          <p className="home-section-description">
            Acesse as áreas permanentes do portal, com mapas, informações e conteúdos sobre o clima na Guiné-Bissau.
          </p>


        </div>


                <div className="cards home-cards-grid">
                        
                {cards
                  .filter((card) => {
                    const detalhe =
                      card.pagina_detalhe === true ||
                      card.pagina_detalhe === 1 ||
                      card.pagina_detalhe === "1" ||
                      card.pagina_detalhe === "sim" ||
                      card.tipo_link === "publicacao";

                    return !detalhe;
                  })
                  .map((card) => {

            const temImagem = Boolean(card.imagem_card);
            const detalhe = card.pagina_detalhe === true || card.pagina_detalhe === 1 || card.pagina_detalhe === "1" || card.pagina_detalhe === "sim" || card.tipo_link === "publicacao";
            const externo = !detalhe && card.tipo_link === "externo";
            const informativo = !detalhe && card.tipo_link === "nenhum";
            const icone = informativo ? "i" : detalhe || externo ? "↗" : "→";
            const rotulo = detalhe ? "Publicação / conteúdo completo" : externo ? "Link externo" : informativo ? "Conteúdo informativo" : "Página interna";
            return (
              <article className={`card portal-card ${temImagem ? "portal-card-image" : "portal-card-soft"}`} key={card.id}>
                {temImagem && <>
                  <img src={`${API_URL}/uploads/${card.imagem_card}`} alt="" className="portal-card-background" loading="lazy" />
                  <div className="portal-card-overlay" />
                </>}
                <div className="portal-card-content">
                  <div className="portal-card-topline">
                    <span className="portal-card-kind">{detalhe ? "PUBLICAÇÃO" : externo ? "LINK EXTERNO" : informativo ? "INFORMATIVO" : "PORTAL"}</span>
                    <span className="portal-card-destination" title={rotulo} aria-label={rotulo}>{icone}</span>
                  </div>
                  <h3 className="portal-card-title">{card.titulo}</h3>
                  {card.conteudo && <p className="portal-card-description">
                    {card.conteudo.length > 200 ? `${card.conteudo.substring(0, 200).trimEnd()}…` : card.conteudo}
                  </p>}
                  <div className="portal-card-bottom">
                    {informativo ? (
                      <span className="portal-card-action portal-card-action-static" aria-label="Card apenas informativo">
                        Apenas informativo <span aria-hidden="true">ⓘ</span>
                      </span>
                    ) : (
                      <button type="button" className="portal-card-action" disabled={!detalhe && !card.link}
                        onClick={() => {
                          if (detalhe) {
                            setCardSelecionado(card.id);
                            setPaginaAnterior("home");
                            setPage("pagina_detalhe");
                          } else if (externo && card.link) {
                            window.open(card.link, "_blank", "noopener,noreferrer");
                          } else if (card.link) {
                            setPaginaAnterior("home");
                            setPage(card.link);
                          }
                        }}>
                        {externo ? "Abrir link" : detalhe ? "Ler" : "Abrir"}
                        <span aria-hidden="true">{icone}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>


      </section>

            {/* =====================================================
          PUBLICAÇÕES
      ====================================================== */}

      {publicacoes.length > 0 && (

        <section className="home-areas publicacoes-section">

          <div className="home-section-title">
            <div className="home-section-kicker">
              📚 CONHECIMENTO E AÇÃO CLIMÁTICA
            </div>
            <h2>Publicações e iniciativas</h2>
            <p className="home-section-description">
              Acompanhe conteúdos enviados e disponibilizados no portal, como notícias, eventos, projetos, relatórios e outras iniciativas.
            </p>
          </div>


                    <div className="cards home-cards-grid publication-cards-grid">
            {[...publicacoes]
              .sort((a, b) => {
                const dataA = a.data_publicacao ? new Date(String(a.data_publicacao).slice(0, 10) + "T00:00:00").getTime() : 0;
                const dataB = b.data_publicacao ? new Date(String(b.data_publicacao).slice(0, 10) + "T00:00:00").getTime() : 0;
                return dataB - dataA;
              })
              .map((card) => {
              const temImagem = Boolean(card.imagem_card);
              const detalhe = card.pagina_detalhe === true || card.pagina_detalhe === 1 || card.pagina_detalhe === "1" || card.pagina_detalhe === "sim" || card.tipo_link === "publicacao";
              const externo = !detalhe && card.tipo_link === "externo";
              const informativo = !detalhe && card.tipo_link === "nenhum";
              const data = card.data_publicacao
                ? new Date(`${String(card.data_publicacao).slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR")
                : "";
              return (
                <article className={`card portal-card publication-card ${temImagem ? "portal-card-image" : "portal-card-soft"}`} key={card.id}>
                  {temImagem && <>
                    <img src={`${API_URL}/uploads/${card.imagem_card}`} alt="" className="portal-card-background" loading="lazy" />
                    <div className="portal-card-overlay" />
                  </>}
                  <div className="portal-card-content">
                    <div className="portal-card-topline">
                      <span className="portal-card-kind">PUBLICAÇÃO</span>
                      <span className="portal-card-destination" title={detalhe ? "Página de publicação" : externo ? "Link externo" : informativo ? "Apenas informativo" : "Página interna"}>
                        {informativo ? "i" : detalhe || externo ? "↗" : "→"}
                      </span>
                    </div>
                    {data && <div className="publication-card-meta"><span aria-hidden="true">▦</span><span>Publicado em</span> <time dateTime={String(card.data_publicacao).slice(0, 10)}>{data}</time></div>}
                    <h3 className="portal-card-title">{card.titulo}</h3>
                    {card.conteudo && <p className="portal-card-description">
                      {card.conteudo.length > 200 ? `${card.conteudo.substring(0, 200).trimEnd()}…` : card.conteudo}
                    </p>}
                    <div className="portal-card-bottom">
                      {informativo ? (
                        <span className="portal-card-action portal-card-action-static">Apenas informativo <span aria-hidden="true">ⓘ</span></span>
                      ) : (
                        <button type="button" className="portal-card-action" disabled={!detalhe && !card.link}
                          onClick={() => {
                            if (detalhe) {
                              setCardSelecionado(card.id);
                              setPaginaAnterior("home");
                              setPage("pagina_detalhe");
                            } else if (externo && card.link) {
                              window.open(card.link, "_blank", "noopener,noreferrer");
                            } else if (card.link) {
                              setPaginaAnterior("home");
                              setPage(card.link);
                            }
                          }}>
                          {externo ? "Acessar link" : detalhe ? "Ler publicação" : "Explorar página"}
                          <span aria-hidden="true">{detalhe || externo ? "↗" : "→"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </section>

      )}


   <Parceiros />



    </div>

  );

}


export default Home;