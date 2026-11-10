<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import Parceiros from "../components/Parceiros";
import CardPortal from "../components/CardPortal";
import SectionTitle from "../components/SectionTitle";
import Icon from "../components/Icon";
import { EmptyState, ErrorState, SkeletonGrid } from "../components/StatusStates";
import { pathForPage } from "../navigation";
import { formatarData } from "../locale";
import { srcImagem, srcSetImagem } from "../media";
import { urlApi } from "../config";
import { pedirJson } from "../rede";

const slidesPadrao = [
  {
    id: 1,
    imagem: "/images/territorio/manguezais.webp",
    pequeno: "Bem-vindo ao futuro sustentável",
    titulo: "Portal Climático da Guiné-Bissau",
    texto: "O principal hub para ação e transparência climática, com dados, relatórios e mapas para adaptação e mitigação.",
    botaoPrincipal: "Explorar mapas",
    linkPrincipal: "mapas_climatologia",
    botaoSecundario: "Saiba mais",
    linkSecundario: "adaptacao"
  },
  {
    id: 2,
    imagem: "/images/territorio/arrozais.webp",
    pequeno: "Adaptação climática",
    titulo: "Construindo comunidades mais resilientes",
    texto: "Conheça estratégias e ações para enfrentar os impactos das mudanças climáticas.",
    botaoPrincipal: "Conheça a Adaptação",
    linkPrincipal: "adaptacao",
    botaoSecundario: "Explorar mapas",
    linkSecundario: "mapas_climatologia"
  },
  {
    id: 3,
    imagem: "/images/territorio/cajus.webp",
    pequeno: "Mitigação",
    titulo: "Um futuro de baixo carbono",
    texto: "Descubra soluções e iniciativas para reduzir emissões na Guiné-Bissau.",
    botaoPrincipal: "Conheça a Mitigação",
    linkPrincipal: "mitigacao",
    botaoSecundario: "Ver biblioteca",
    linkSecundario: "biblioteca"
  }
];

const atalhos = [
  {
    to: "/adaptacao",
    titulo: "Adaptação",
    texto: "Resiliência das comunidades e ecossistemas.",
    imagem: "/images/territorio/manguezais.webp"
  },
  { to: "/mitigacao", titulo: "Mitigação", texto: "Redução de emissões e baixo carbono." },
  { to: "/mapas/climatologia", titulo: "Mapas e dados", texto: "Indicadores climáticos para decisão." },
  { to: "/biblioteca", titulo: "Biblioteca", texto: "Relatórios, estudos e documentos." }
];

function itemAtivo(item) {
  return item.ativo === true || item.ativo === 1 || item.ativo === "1" || item.ativo === "true";
}

function ligacaoExterna(link, tipoLink) {
  const destino = !link ? "" : link === "mapas" ? "mapas_climatologia" : link;
  return tipoLink === "externo" || /^https?:\/\//i.test(destino);
}

function HeroAcao({ link, tipoLink = "interno", className, children, principal = false }) {
  const destino = !link ? "" : link === "mapas" ? "mapas_climatologia" : link;
  if (!destino) return null;
  const externo = ligacaoExterna(destino, tipoLink);
  const icone = externo ? <Icon name="external" /> : principal ? <Icon name="arrow" /> : null;
  if (externo) {
    const href = /^https?:\/\//i.test(destino) ? destino : destino;
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        {icone}
      </a>
    );
  }
  return (
    <Link className={className} to={pathForPage(destino)}>
      {children}
      {icone}
    </Link>
  );
}

function Home() {
  const [cards, setCards] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);
  const [estadoCards, setEstadoCards] = useState("loading");
  const [tentativaCards, setTentativaCards] = useState(0);
  const [heroSlides, setHeroSlides] = useState(slidesPadrao);
  const [slidesRemotos, setSlidesRemotos] = useState(false);
  const [slideAtual, setSlideAtual] = useState(0);
  const [reduzirMovimento, setReduzirMovimento] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [emFoco, setEmFoco] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzirMovimento(media.matches);
    const onChange = () => setReduzirMovimento(media.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    async function carregarSlidesHome() {
      try {
        const dados = await pedirJson(urlApi("/banners-herois"), controlador.signal);
        const slides = dados
          .filter((item) => item.tipo === "slide" && item.pagina === "home" && itemAtivo(item))
=======
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
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
          .map((item) => ({
            id: item.id,
            imagem: item.imagem || "",
            pequeno: item.pequeno || "",
            titulo: item.titulo || "",
            texto: item.texto || "",
            botaoPrincipal: item.botao_principal || "",
<<<<<<< HEAD
            linkPrincipal: item.link_principal === "mapas" ? "mapas_climatologia" : item.link_principal || "",
            tipoLinkPrincipal: item.tipo_link_principal || "interno",
            botaoSecundario: item.botao_secundario || "",
            linkSecundario: item.link_secundario === "mapas" ? "mapas_climatologia" : item.link_secundario || "",
            tipoLinkSecundario: item.tipo_link_secundario || "interno"
          }));
        if (ativo && slides.length > 0) {
          setHeroSlides(slides);
          setSlidesRemotos(true);
          setSlideAtual(0);
        }
      } catch (erro) {
        if (!ativo || erro?.name === "AbortError") return;
        console.error("Erro ao carregar slides da Home:", erro);
      }
    }
    carregarSlidesHome();
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    Promise.all([
      pedirJson(urlApi("/cards/home"), controlador.signal),
      pedirJson(urlApi("/publicacoes/home"), controlador.signal)
    ])
      .then(([listaCards, listaPubs]) => {
        if (!ativo) return;
        setCards(Array.isArray(listaCards) ? listaCards : []);
        setPublicacoes(Array.isArray(listaPubs) ? listaPubs : []);
        setEstadoCards("ok");
      })
      .catch((erro) => {
        if (!ativo || erro?.name === "AbortError") return;
        setEstadoCards("erro");
      });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [tentativaCards]);

  const destaques = slidesRemotos ? heroSlides : heroSlides.slice(1);
  const slide = destaques[Math.min(slideAtual, Math.max(destaques.length - 1, 0))] || null;
  const variosSlides = destaques.length > 1;
  const autoplayAtivo = variosSlides && !reduzirMovimento && !pausado;
  const fotoInicio = slidesPadrao[0].imagem;

  useEffect(() => {
    if (reduzirMovimento || pausado || emFoco || destaques.length < 2) return undefined;
    const intervalo = setInterval(() => {
      setSlideAtual((atual) => (atual === destaques.length - 1 ? 0 : atual + 1));
    }, 7000);
    return () => clearInterval(intervalo);
  }, [destaques.length, reduzirMovimento, pausado, emFoco]);

  function slideAnterior() {
    setSlideAtual((atual) => (atual === 0 ? destaques.length - 1 : atual - 1));
  }

  function proximoSlide() {
    setSlideAtual((atual) => (atual === destaques.length - 1 ? 0 : atual + 1));
  }

  return (
    <PageShell className="home-page" wide>
      <section className="home-hero" aria-labelledby="titulo-portal">
        <img
          className="home-hero-photo"
          src={srcImagem(fotoInicio)}
          srcSet={srcSetImagem(fotoInicio)}
          sizes="100vw"
          alt=""
          width="1600"
          height="900"
          decoding="async"
          fetchPriority="high"
        />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <div className="home-hero-text">
            <p className="home-hero-small">Guiné-Bissau</p>
            <h1 id="titulo-portal" tabIndex={-1}>Portal Climático da Guiné-Bissau</h1>
            <p>
              Dados, mapas e documentos para acompanhar a adaptação e a mitigação no país.
            </p>
            <div className="home-hero-buttons">
              <Link className="home-hero-btn primary" to="/mapas/climatologia">
                Consultar mapas
                <Icon name="arrow" />
              </Link>
              <a className="home-hero-btn secondary" href="#areas-principais">
                Explorar temas
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="areas-principais" className="home-areas areas-capa" aria-labelledby="titulo-areas-portal">
        <p className="areas-capa-kicker">Áreas do portal</p>
        <h2 id="titulo-areas-portal">Explore as áreas de atuação</h2>
        <ul className="areas-capa-grid">
          {atalhos.map((item) => (
            <li key={item.to}>
              <CardPortal
                variant="capa"
                kind="Portal"
                actionLabel="Abrir"
                card={{
                  titulo: item.titulo,
                  conteudo: item.texto,
                  link: item.to,
                  tipo_link: "interno",
                  imagemPreview: item.imagem || ""
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      {slide ? (
        <section
          className="home-hero home-hero-destaques"
          aria-roledescription="carrossel"
          aria-label="Destaques do portal"
          onMouseEnter={() => setEmFoco(true)}
          onMouseLeave={() => setEmFoco(false)}
          onFocus={(e) => {
            if (e.target.closest("button, a")) setEmFoco(true);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setEmFoco(false);
          }}
        >
          {slide.imagem ? (
            <img
              key={slide.id}
              className="home-hero-photo"
              src={srcImagem(slide.imagem)}
              srcSet={srcSetImagem(slide.imagem)}
              sizes="(max-width: 1200px) calc(100vw - 2 * clamp(16px, 4vw, 32px)), 1200px"
              alt=""
              width="1600"
              height="900"
              decoding="async"
              loading="lazy"
            />
          ) : null}
          <div className="home-hero-overlay" />
          <div className="home-hero-content">
            <div
              key={slide.id}
              className="home-hero-text"
              role={variosSlides ? "group" : undefined}
              aria-roledescription={variosSlides ? "slide" : undefined}
              aria-label={variosSlides ? `${slideAtual + 1} de ${destaques.length}` : undefined}
              aria-live={autoplayAtivo && !emFoco ? "off" : "polite"}
            >
              <p className="home-hero-small">Destaques</p>
              <h2>{slide.titulo}</h2>
              {slide.texto ? <p>{slide.texto}</p> : null}
              {slide.botaoPrincipal || slide.botaoSecundario ? (
                <div className="home-hero-buttons">
                  {slide.botaoPrincipal ? (
                    <HeroAcao
                      className="home-hero-btn primary"
                      link={slide.linkPrincipal}
                      tipoLink={slide.tipoLinkPrincipal}
                      principal
                    >
                      {slide.botaoPrincipal}
                    </HeroAcao>
                  ) : null}
                  {slide.botaoSecundario ? (
                    <HeroAcao
                      className="home-hero-btn secondary"
                      link={slide.linkSecundario}
                      tipoLink={slide.tipoLinkSecundario}
                    >
                      {slide.botaoSecundario}
                    </HeroAcao>
                  ) : null}
                </div>
              ) : null}
            </div>

            {variosSlides ? (
              <div className="hero-controls">
                <button className="hero-arrow" type="button" onClick={slideAnterior} aria-label="Destaque anterior">
                  <Icon name="chevronLeft" />
                </button>
                <div className="hero-dots">
                  {destaques.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={index === slideAtual ? "hero-dot active" : "hero-dot"}
                      onClick={() => setSlideAtual(index)}
                      aria-label={`Ir para o destaque ${index + 1}`}
                      aria-current={index === slideAtual ? "true" : undefined}
                    />
                  ))}
                </div>
                <button className="hero-arrow" type="button" onClick={proximoSlide} aria-label="Próximo destaque">
                  <Icon name="chevronRight" />
                </button>
                {!reduzirMovimento ? (
                  <button
                    className="hero-pause"
                    type="button"
                    onClick={() => setPausado((atual) => !atual)}
                    aria-label={pausado ? "Retomar rotação dos destaques" : "Pausar rotação dos destaques"}
                  >
                    <Icon name={pausado ? "play" : "pause"} />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="home-areas" aria-labelledby="titulo-areas">
        <SectionTitle id="titulo-areas" title="Conteúdos em destaque" />
        {estadoCards === "loading" ? <SkeletonGrid /> : null}
        {estadoCards === "erro" ? (
          <ErrorState onRetry={() => {
            setEstadoCards("loading");
            setTentativaCards((atual) => atual + 1);
          }} />
        ) : null}
        {estadoCards === "ok" && cards.length === 0 ? (
          <EmptyState texto="Os conteúdos da página inicial serão publicados em breve." />
        ) : null}
        {estadoCards === "ok" && cards.length > 0 ? (
          <div className="cards home-cards-grid">
            {cards.map((card) => (
              <CardPortal key={card.id} card={card} from="/" />
            ))}
          </div>
        ) : null}
      </section>

      {publicacoes.length > 0 ? (
        <section className="home-areas publicacoes-section" aria-labelledby="titulo-publicacoes">
          <SectionTitle
            id="titulo-publicacoes"
            title="Publicações"
            description="Conteúdos publicados a partir das submissões de ações climáticas."
          />
          <div className="cards home-cards-grid publication-cards-grid">
            {publicacoes.map((card) => {
              const data = formatarData(card.data_publicacao);
              return (
                <CardPortal
                  key={card.id}
                  card={card}
                  from="/"
                  kind="Publicação"
                  actionLabel="Ler publicação"
                  meta={data ? <><Icon name="calendar" /> <time dateTime={String(card.data_publicacao).slice(0, 10)}>{data}</time></> : null}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <Parceiros />
    </PageShell>
  );
}

export default Home;
=======
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
                  // Cards enviados pelo Formulário de Submissão Climática
                  // aparecem na seção de publicações, não nos cards fixos.
                  .filter((card) => String(card.origem || "").toLowerCase() !== "submissao")
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
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
