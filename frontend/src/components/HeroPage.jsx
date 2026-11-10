import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { breadcrumbFor } from "../navigation";
import { srcImagem, srcSetImagem } from "../media";
import { urlApi } from "../config";
import { pedirJson } from "../rede";

const FALLBACKS = {
  adaptacao: {
    titulo: "Adaptação",
    texto: "Estratégias e ações para enfrentar os impactos climáticos e fortalecer a resiliência na Guiné-Bissau.",
    imagem: "/images/territorio/arrozais.webp"
  },
  mitigacao: {
    titulo: "Mitigação",
    texto: "Informação e iniciativas para reduzir emissões e avançar rumo a um futuro de baixo carbono.",
    imagem: "/images/territorio/cajus.webp"
  },
  biblioteca: {
    titulo: "Biblioteca",
    texto: "Publicações, relatórios, estudos e documentos sobre clima e desenvolvimento sustentável.",
    imagem: "/images/territorio/rio-cacheu.webp"
  },
  engajamento: {
    titulo: "Engajamento",
    texto: "Participe: submeta ações climáticas para análise e publicação no portal.",
    imagem: "/images/territorio/caminho-costeiro.webp"
  },
  nap: {
    titulo: "Seguimento do NAP",
    texto: "Acompanhe o Plano Nacional de Adaptação às Mudanças Climáticas da Guiné-Bissau.",
    imagem: "/images/territorio/pescador.webp"
  },
  mapas_climatologia: {
    titulo: "Mapas de climatologia",
    texto: "Explore indicadores, períodos e cenários climáticos para apoiar decisões.",
    imagem: "/images/territorio/savana-chuva.webp"
  },
  mapas_riscos: {
    titulo: "Mapas de risco climático",
    texto: "Visualização estática dos riscos climáticos no território nacional.",
    imagem: "/images/territorio/bancos-areia.webp"
  },
  submissao_climatica: {
    titulo: "Submissão de ações climáticas",
    texto: "Envie eventos, projetos, publicações e outras iniciativas para análise do portal.",
    imagem: "/images/territorio/agricultor-arroz.webp"
  },
  contato: {
    titulo: "Contato",
    texto: "Envie dúvidas ou sugestões. A mensagem chega à equipa do portal.",
    imagem: "/images/territorio/bijagos.webp"
  }
};

function itemAtivo(item) {
  return item.ativo === true || item.ativo === 1 || item.ativo === "1" || item.ativo === "true";
}

export default function HeroPage({ pagina, tituloPadrao, textoPadrao }) {
  const { pathname } = useLocation();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;

    async function carregarHero() {
      try {
        const dados = await pedirJson(urlApi("/banners-herois"), controlador.signal);
        const encontrado = dados
          .filter((item) => item.tipo === "hero" && item.pagina === pagina && itemAtivo(item))
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))[0];
        if (ativo) setHero(encontrado || null);
      } catch (erro) {
        if (!ativo || erro?.name === "AbortError") return;
        console.error(`Erro ao carregar Hero da página ${pagina}:`, erro);
      }
    }

    carregarHero();
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [pagina]);

  const fallback = FALLBACKS[pagina] || {
    titulo: tituloPadrao || "",
    texto: textoPadrao || ""
  };
  const titulo = hero?.titulo || fallback.titulo;
  const texto = hero?.texto || fallback.texto;
  const imagemBruta = hero?.imagem || fallback.imagem || "";

  if (!titulo) return null;

  const trilho = breadcrumbFor(pathname);

  return (
    <section className="hero-page">
      {imagemBruta ? (
        <img
          className="hero-page-photo"
          src={srcImagem(imagemBruta)}
          srcSet={srcSetImagem(imagemBruta)}
          sizes="100vw"
          alt=""
          width="1600"
          height="900"
          decoding="async"
          fetchPriority="high"
        />
      ) : null}
      <div className="hero-page-overlay" />
      <div className="hero-page-inner">
        {trilho.length > 1 ? (
          <nav className="breadcrumb" aria-label="Trilho de navegação">
            <ol>
              {trilho.map((item, index) => (
                <li key={item.to}>
                  {index < trilho.length - 1 ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    <span aria-current="page">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 tabIndex={-1}>{titulo}</h1>
        {texto ? <p>{texto}</p> : null}
      </div>
    </section>
  );
}
