import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import CardPortal from "../components/CardPortal";
import { ErrorState } from "../components/StatusStates";
import Icon from "../components/Icon";
import { labelForPath, origemSegura, secaoDaOrigem } from "../navigation";
import { formatarData } from "../locale";
import API_URL, { urlApi } from "../config";
import { pedirJson } from "../rede";

export default function Pagina_detalhe() {
  const { cardId } = useParams();
  const location = useLocation();
  const [params] = useSearchParams();
  const origem = origemSegura(params.get("de") || location.state?.from || "/");
  const [carregado, setCarregado] = useState({ id: "", pagina: null, imagens: [], erro: "" });
  const [relacao, setRelacao] = useState({ chave: "", lista: [] });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    pedirJson(`${API_URL}/pagina/${cardId}`, controlador.signal)
      .then(async (data) => {
        if (!ativo) return;
        let imagensData = [];
        try {
          imagensData = await pedirJson(`${API_URL}/pagina-imagens/${data.id}`, controlador.signal);
        } catch (erro) {
          if (!ativo || erro?.name === "AbortError") return;
          imagensData = [];
        }
        if (!ativo) return;
        setCarregado({
          id: String(cardId),
          pagina: data,
          imagens: Array.isArray(imagensData) ? imagensData : [],
          erro: ""
        });
      })
      .catch((err) => {
        if (!ativo || err?.name === "AbortError") return;
        const texto = err?.code === "nao-json" || err?.name === "TimeoutError"
          ? "Não foi possível carregar esta publicação. Tente novamente mais tarde."
          : (err.message || "Não foi possível carregar esta publicação.");
        setCarregado({
          id: String(cardId),
          pagina: null,
          imagens: [],
          erro: texto
        });
      });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [cardId, tentativa]);

  useEffect(() => {
    const secao = secaoDaOrigem(origem);
    if (!secao) return undefined;
    const controlador = new AbortController();
    let ativo = true;
    const chave = `${origem}:${cardId}`;
    Promise.all([
      pedirJson(urlApi(`/publicacoes/${secao}`), controlador.signal).catch(() => []),
      pedirJson(urlApi(`/cards/${secao}`), controlador.signal).catch(() => [])
    ]).then(([pubs, cards]) => {
      if (!ativo) return;
      const lista = [...(Array.isArray(pubs) ? pubs : []), ...(Array.isArray(cards) ? cards : [])];
      const vistos = new Set();
      const outros = lista.filter((item) => {
        if (!item?.id || String(item.id) === String(cardId) || vistos.has(item.id)) return false;
        vistos.add(item.id);
        return true;
      }).slice(0, 3);
      setRelacao({ chave, lista: outros });
    });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [origem, cardId]);

  const pagina = carregado.id === String(cardId) ? carregado.pagina : null;
  const imagens = carregado.id === String(cardId) ? carregado.imagens : [];
  const erro = carregado.id === String(cardId) ? carregado.erro : "";
  const relacionados = secaoDaOrigem(origem) && relacao.chave === `${origem}:${cardId}` ? relacao.lista : [];

  const rotuloAnterior = labelForPath(origem);

  if (erro) {
    return (
      <PageShell>
        <div className="pagina-noticia">
          <ErrorState
            texto={erro}
            onRetry={() => {
              setCarregado({ id: "", pagina: null, imagens: [], erro: "" });
              setTentativa((atual) => atual + 1);
            }}
          />
          <Link className="btn-ghost" to={origem}>Voltar para {rotuloAnterior}</Link>
        </div>
      </PageShell>
    );
  }

  if (!pagina) {
    return (
      <PageShell>
        <p className="pagina-noticia pagina-carregando" role="status">A carregar publicação…</p>
      </PageShell>
    );
  }

  const dataPublicacao = formatarData(pagina.data_publicacao);

  return (
    <PageShell>
      <article className="pagina-noticia">
        <nav className="breadcrumb" aria-label="Trilho de navegação">
          <ol>
            {origem !== "/" ? (
              <li><Link to="/">Início</Link></li>
            ) : null}
            <li>
              <Link to={origem}>{rotuloAnterior}</Link>
            </li>
            <li><span aria-current="page">{pagina.titulo}</span></li>
          </ol>
        </nav>
        <h1 className="titulo-noticia" tabIndex={-1}>{pagina.titulo}</h1>
        {dataPublicacao ? (
          <p className="data-publicacao">
            Publicado em <time dateTime={String(pagina.data_publicacao).slice(0, 10)}>{dataPublicacao}</time>
          </p>
        ) : null}
        {imagens.length > 0 ? (
          <div className="galeria-noticia">
            <ul className="galeria-grid">
              {imagens.map((img, index) => (
                <li key={img.id || index}>
                  <img
                    src={`${API_URL}/uploads/${img.imagem}`}
                    alt={imagens.length > 1 ? `Imagem ${index + 1} de ${imagens.length}: ${pagina.titulo}` : pagina.titulo}
                    className="galeria-img"
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="texto-noticia">{pagina.texto}</div>
        <div className="pagina-noticia-rodape">
          <Link className="btn-ghost" to={origem}>
            <Icon name="chevronLeft" /> Voltar para {rotuloAnterior}
          </Link>
        </div>
      </article>
      {relacionados.length > 0 ? (
        <section className="home-areas publicacoes-section" aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados">Na mesma secção</h2>
          <div className="cards home-cards-grid">
            {relacionados.map((card) => (
              <CardPortal key={card.id} card={card} from={origem} actionLabel="Ler publicação" />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
