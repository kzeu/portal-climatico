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
  // Por enquanto está fixo.
  // Depois vamos buscar estes dados do banco pelo Admin.
  // =========================================================

  const heroSlides = [

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

  function navegarHero(link) {

    if (!link) return;

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
          backgroundImage: `url("${slide.imagem}")`
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
                onClick={() => navegarHero(slide.linkPrincipal)}
              >

                {slide.botaoPrincipal}

                <span>→</span>

              </button>


              <button
                className="home-hero-btn secondary"
                onClick={() => navegarHero(slide.linkSecundario)}
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


        </div>


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

              {card.pagina_detalhe && (

                <div className="card-footer">


                  <button
                    className="btn-card"
                    onClick={() => {


                      if (card.pagina_detalhe) {

                        setCardSelecionado(card.id);

                        setPaginaAnterior("home");

                        setPage("pagina_detalhe");

                      }


                      else if (card.tipo_link === "externo") {

                        window.open(
                          card.link,
                          "_blank"
                        );

                      }


                      else {

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

                <div className="card-footer">

                  <button
                    className="btn-card"
                    onClick={() => {

                      if (card.pagina_detalhe) {

                        setCardSelecionado(card.id);
                        setPaginaAnterior("home");
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

              </div>

            ))}

          </div>

        </section>

      )}


   <Parceiros />



    </div>

  );

}


export default Home;