import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import { EmptyState, ErrorState } from "../components/StatusStates";
import Icon from "../components/Icon";
import { pathForPage } from "../navigation";
import { formatarTamanho } from "../locale";
import API_URL, { urlApi } from "../config";
import { pedirJson } from "../rede";

function normalizar(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function iconeTipo(tipo) {
  return tipo === "Mapa estático" ? "map" : "file";
}

export default function Biblioteca() {
  const [dados, setDados] = useState([]);
  // Pesquisa e filtro são espelhados na URL (?q=…&tipo=…) para poderem ser partilhados.
  // O estado local responde de imediato; a URL só acompanha (evita perder teclas).
  const [params, setParams] = useSearchParams();
  const [pesquisa, setPesquisaLocal] = useState(() => params.get("q") || "");
  const [filtro, setFiltroLocal] = useState(() => params.get("tipo") || "");

  function espelharNaUrl(chave, valor) {
    setParams((atual) => {
      const proximo = new URLSearchParams(atual);
      if (valor) proximo.set(chave, valor);
      else proximo.delete(chave);
      return proximo;
    }, { replace: true });
  }

  function setPesquisa(valor) {
    setPesquisaLocal(valor);
    espelharNaUrl("q", valor);
  }

  function setFiltro(valor) {
    setFiltroLocal(valor);
    espelharNaUrl("tipo", valor);
  }

  function limparFiltros() {
    setPesquisaLocal("");
    setFiltroLocal("");
    setParams({}, { replace: true });
  }
  const [estado, setEstado] = useState("loading");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    async function carregarBiblioteca() {
      try {
        const resultado = await pedirJson(urlApi("/biblioteca"), controlador.signal);
        if (!ativo) return;
        setDados(Array.isArray(resultado) ? resultado : []);
        setEstado("ok");
      } catch (erro) {
        if (!ativo || erro?.name === "AbortError") return;
        console.error("Erro ao carregar biblioteca:", erro);
        setEstado("erro");
      }
    }
    carregarBiblioteca();
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [tentativa]);

  const tiposDisponiveis = [...new Set(dados.map((item) => item.tipo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const dadosFiltrados = dados.filter((item) => {
    const correspondeTipo = !filtro || item.tipo === filtro;
    const textoPesquisavel = Object.values(item)
      .filter((valor) => valor !== null && valor !== undefined)
      .map((valor) => (typeof valor === "object" ? JSON.stringify(valor) : String(valor)))
      .join(" ");
    const correspondePesquisa = !normalizar(pesquisa) ||
      normalizar(textoPesquisavel).includes(normalizar(pesquisa));
    return correspondeTipo && correspondePesquisa;
  });

  const contagemPorTipo = dados.reduce((mapa, item) => {
    if (item.tipo) mapa[item.tipo] = (mapa[item.tipo] || 0) + 1;
    return mapa;
  }, {});

  return (
    <PageShell>
      <HeroPage pagina="biblioteca" />

      <section className="biblioteca-toolbar" role="search" aria-label="Pesquisar na biblioteca">
        <div className="campo-grow">
          <label htmlFor="pesquisa-biblioteca">Pesquisar documentos</label>
          <div className="campo-search">
            <Icon name="search" />
            <input
              id="pesquisa-biblioteca"
              type="search"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Título, assunto, tipo, ano ou ficheiro…"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="biblioteca-toolbar-meta">
          <p className="biblioteca-count" aria-live="polite">
            {estado === "loading"
              ? "A carregar…"
              : `${dadosFiltrados.length} ${dadosFiltrados.length === 1 ? "documento" : "documentos"}`}
          </p>
          {(pesquisa || filtro) ? (
            <button type="button" className="btn-ghost" onClick={limparFiltros}>
              Limpar filtros
            </button>
          ) : null}
        </div>
      </section>

      {tiposDisponiveis.length > 0 ? (
        <div className="chip-row" role="group" aria-label="Filtrar por tipo">
          <button type="button" className="chip" aria-pressed={filtro === ""} onClick={() => setFiltro("")}>
            Todos <span className="chip-count">{dados.length}</span>
          </button>
          {tiposDisponiveis.map((tipo) => (
            <button
              key={tipo}
              type="button"
              className="chip"
              aria-pressed={filtro === tipo}
              onClick={() => setFiltro(tipo)}
            >
              {tipo} <span className="chip-count">{contagemPorTipo[tipo]}</span>
            </button>
          ))}
        </div>
      ) : null}

      {estado === "loading" ? <div className="ui-skeleton" aria-hidden="true" /> : null}
      {estado === "erro" ? (
        <ErrorState onRetry={() => {
          setEstado("loading");
          setTentativa((atual) => atual + 1);
        }} />
      ) : null}
      {estado === "ok" && dadosFiltrados.length === 0 ? (
        <EmptyState titulo="Nenhum documento encontrado" texto="Tente outros termos ou limpe os filtros." />
      ) : null}

      {dadosFiltrados.length > 0 ? (
        <ul className="biblioteca-grid">
          {dadosFiltrados.map((item) => {
            const tamanho = formatarTamanho(item.bytes);
            return (
            <li className="biblioteca-card" key={item.id}>
              <div className="biblioteca-icone" aria-hidden="true">
                <Icon name={iconeTipo(item.tipo)} />
              </div>
              <div className="biblioteca-info">
                <h3>{item.titulo}</h3>
                {item.tipo || item.data ? (
                  <p className="biblioteca-meta">
                    {item.tipo ? <span className="biblioteca-tipo">{item.tipo}</span> : null}
                    {item.data ? <span className="biblioteca-data">{item.data}</span> : null}
                  </p>
                ) : null}
              </div>
              <div className="biblioteca-footer">
                {item.arquivo ? (
                  <a
                    href={`${API_URL}/uploads/${item.arquivo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={item.nome_arquivo}
                    className="btn-biblioteca"
                  >
                    Descarregar{tamanho ? `, ${tamanho}` : ""}
                    <span className="visually-hidden">: {item.titulo}</span>
                  </a>
                ) : item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-biblioteca">
                    Abrir<span className="visually-hidden">: {item.titulo} (abre numa nova aba)</span>
                    <Icon name="external" />
                  </a>
                ) : item.pagina ? (
                  <Link to={pathForPage(item.pagina)} className="btn-biblioteca">
                    Ver página<span className="visually-hidden">: {item.titulo}</span>
                  </Link>
                ) : null}
              </div>
            </li>
            );
          })}
        </ul>
      ) : null}
    </PageShell>
  );
}
