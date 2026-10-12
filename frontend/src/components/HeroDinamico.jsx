import { useEffect, useState } from "react";
import API_URL from "../config";

function HeroDinamico({ pagina, tituloPadrao, textoPadrao, setPage, setPaginaAnterior }) {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarHero() {
      try {
        const response = await fetch(`${API_URL}/banners-herois`);
        if (!response.ok) throw new Error("Falha ao carregar os Heros.");

        const dados = await response.json();
        const encontrado = dados
          .filter((item) =>
            item.tipo === "hero" &&
            item.pagina === pagina &&
            (item.ativo === true || item.ativo === 1 || item.ativo === "1" || item.ativo === "true")
          )
          .sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0))[0];

        if (ativo) setHero(encontrado || null);
      } catch (erro) {
        console.error(`Erro ao carregar Hero da página ${pagina}:`, erro);
      }
    }

    carregarHero();
    return () => { ativo = false; };
  }, [pagina]);

  function obterImagem(imagem) {
    if (!imagem) return "";
    if (/^https?:\/\//i.test(imagem)) return imagem;
    return `${window.location.origin}${imagem.startsWith("/") ? "" : "/"}${imagem}`;
  }

  // O Hero é exibido somente quando existe cadastro ativo para esta página.
  if (!hero) return null;

  return (
    <div
      className="hero"
      style={hero?.imagem ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url("${obterImagem(hero.imagem)}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff"
      } : undefined}
    >
      <h1>{hero.titulo}</h1>
      {hero.texto && <p>{hero.texto}</p>}
    </div>
  );
}

export default HeroDinamico;
