import { Link } from "react-router-dom";
import API_URL from "../config";
import { pathForPage } from "../navigation";
import Icon from "./Icon";

function classificarCard(card) {
  const detalhe =
    card.pagina_detalhe === true ||
    card.pagina_detalhe === 1 ||
    card.pagina_detalhe === "1" ||
    card.pagina_detalhe === "sim" ||
    card.tipo_link === "publicacao";
  const externo = !detalhe && card.tipo_link === "externo";
  const informativo = !detalhe && (card.tipo_link === "nenhum" || (!card.link && !detalhe));
  const interno = !detalhe && !externo && !informativo && Boolean(card.link);
  return { detalhe, externo, informativo, interno };
}

function emFrase(texto) {
  if (!texto || texto !== texto.toUpperCase()) return texto;
  const minusculo = texto.toLocaleLowerCase("pt");
  return minusculo.charAt(0).toLocaleUpperCase("pt") + minusculo.slice(1);
}

function rotuloTipo({ detalhe, externo, informativo }, forcar) {
  if (forcar) return emFrase(forcar);
  if (detalhe) return "Publicação";
  if (externo) return "Link externo";
  if (informativo) return "Informativo";
  return "Página do portal";
}

function urlExterna(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function destinoDoCard(card, classes, from) {
  if (classes.detalhe && card.id) {
    return { tipo: "interno", to: `/pagina/${card.id}`, state: { from } };
  }
  if (classes.externo && card.link) {
    return { tipo: "externo", href: urlExterna(card.link) };
  }
  if (card.link) {
    const caminho = pathForPage(card.link);
    if (/^https?:\/\//i.test(caminho)) return { tipo: "externo", href: caminho };
    return { tipo: "interno", to: caminho };
  }
  return null;
}

export default function CardPortal({
  card,
  from = "/",
  kind,
  actionLabel,
  preview = false,
  meta,
  onOpen,
  variant
}) {
  const classes = classificarCard(card);
  const { detalhe, externo, informativo } = classes;
  const srcImagem = card.imagemPreview
    ? card.imagemPreview
    : card.imagem_card
      ? `${API_URL}/uploads/${card.imagem_card}`
      : "";

  const destino = informativo ? null : destinoDoCard(card, classes, from);
  const externa = destino?.tipo === "externo";
  const accionavel = !preview && (Boolean(onOpen) || Boolean(destino));

  const descricao = card.conteudo
    ? card.conteudo.length > 200
      ? `${card.conteudo.substring(0, 200).trimEnd()}…`
      : card.conteudo
    : "";

  const capa = variant === "capa";
  const botaoTexto = actionLabel
    || (capa ? "Abrir" : externo || externa ? "Abrir link" : detalhe ? "Ler publicação" : "Abrir página");
  const classeCard = [
    "card",
    "portal-card",
    srcImagem ? "portal-card-image" : "portal-card-soft",
    accionavel ? "is-link" : "",
    informativo ? "is-info" : "",
    capa ? "is-capa" : ""
  ].filter(Boolean).join(" ");

  const destinoInterno = destino?.tipo === "interno" && destino.to?.startsWith("/pagina/")
    ? `${destino.to}?de=${encodeURIComponent(from)}`
    : destino?.to;

  const iconeAcao = (
    <Icon name={externa || externo ? "external" : "arrow"} className={externa || externo ? "is-external" : ""} />
  );
  const acao = !informativo && (accionavel || preview) ? (
    capa ? (
      <span className="portal-card-capa-abrir">
        {botaoTexto}
        {iconeAcao}
      </span>
    ) : (
      <div className="portal-card-bottom">
        <span className="portal-card-action">
          {botaoTexto}
          {iconeAcao}
        </span>
      </div>
    )
  ) : null;

  const corpo = capa ? (
    <>
      {srcImagem ? (
        <div className="portal-card-media">
          <img src={srcImagem} alt="" width="640" height="360" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="portal-card-capa-top">
        <p className="portal-card-kind">{rotuloTipo(classes, kind)}</p>
        {!informativo ? (
          <span className="portal-card-capa-go" aria-hidden="true">
            <Icon name={externa || externo ? "external" : "arrow"} className={externa || externo ? "is-external" : ""} />
          </span>
        ) : null}
      </div>
      <h3 className="portal-card-title">{card.titulo}</h3>
      {descricao ? <p className="portal-card-description">{descricao}</p> : null}
      {meta ? <div className="publication-card-meta">{meta}</div> : null}
      {acao}
    </>
  ) : (
    <>
      {srcImagem ? (
        <div className="portal-card-media">
          <img src={srcImagem} alt="" width="640" height="360" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="portal-card-content">
        <p className="portal-card-kind">{rotuloTipo(classes, kind)}</p>
        <h3 className="portal-card-title">{card.titulo}</h3>
        {descricao ? <p className="portal-card-description">{descricao}</p> : null}
        {meta ? <div className="publication-card-meta">{meta}</div> : null}
        {acao}
      </div>
    </>
  );

  const nomeAcao = `${botaoTexto}: ${card.titulo}`;
  let envoltorio = corpo;
  if (accionavel && onOpen) {
    envoltorio = (
      <button type="button" className="portal-card-link btn-link-text" onClick={onOpen} aria-label={nomeAcao}>
        {corpo}
      </button>
    );
  } else if (accionavel && externa) {
    envoltorio = (
      <a className="portal-card-link" href={destino.href} target="_blank" rel="noopener noreferrer" aria-label={`${nomeAcao} (abre numa nova aba)`}>
        {corpo}
      </a>
    );
  } else if (accionavel && destinoInterno) {
    envoltorio = (
      <Link className="portal-card-link" to={destinoInterno} state={destino.state} aria-label={nomeAcao}>
        {corpo}
      </Link>
    );
  }

  return (
    <article className={classeCard}>
      {envoltorio}
    </article>
  );
}
