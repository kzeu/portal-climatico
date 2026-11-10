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
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))
          .map((item) => ({
            id: item.id,
            imagem: item.imagem || "",
            pequeno: item.pequeno || "",
            titulo: item.titulo || "",
            texto: item.texto || "",
            botaoPrincipal: item.botao_principal || "",
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
