import { useEffect, useState } from "react";
<<<<<<< HEAD
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

=======
import API_URL from "../config";
import "../App.css";

import HeroDinamico from "../components/HeroDinamico";
function Biblioteca({ setPage }) {

  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  // Ignora diferenças entre maiúsculas, minúsculas e acentos.
  function normalizar(valor) {
    return String(valor ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

  useEffect(() => {

    async function carregarBiblioteca() {

      try {

        const response = await fetch(`${API_URL}/biblioteca`);

        if (!response.ok) {
          throw new Error("Erro ao carregar biblioteca.");
        }

        const resultado = await response.json();

        if (Array.isArray(resultado)) {
          setDados(resultado);
        } else {
          console.error("A API não retornou uma lista:", resultado);
          setDados([]);
        }

      } catch (erro) {

        console.error("Erro ao carregar biblioteca:", erro);
        setDados([]);

      }

    }

    carregarBiblioteca();

  }, []);

  // As categorias vêm dos próprios registros, evitando opções fixas
  // que possam não corresponder aos tipos existentes no banco.
  const tiposDisponiveis = [...new Set(
    dados.map((item) => item.tipo).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));

  // Pesquisa em todos os campos textuais retornados pela API, incluindo
  // título, tipo, data, nome do arquivo, descrição e link, quando existirem.
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
  const dadosFiltrados = dados.filter((item) => {
    const correspondeTipo = !filtro || item.tipo === filtro;
    const textoPesquisavel = Object.values(item)
      .filter((valor) => valor !== null && valor !== undefined)
<<<<<<< HEAD
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
=======
      .map((valor) => typeof valor === "object" ? JSON.stringify(valor) : String(valor))
      .join(" ");
    const correspondePesquisa = !normalizar(pesquisa) ||
      normalizar(textoPesquisavel).includes(normalizar(pesquisa));

    return correspondeTipo && correspondePesquisa;
  });

  return (

    <div className="content" id="content">

      {/* HERO cadastrado no painel Banners e Heros */}
      <HeroDinamico pagina="biblioteca" setPage={setPage} />

      {/* PESQUISA E FILTROS */}
      <section
        aria-label="Pesquisar na biblioteca"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "end",
          gap: "12px",
          margin: "20px 0",
          padding: "16px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          boxShadow: "0 3px 12px rgba(15, 23, 42, 0.05)"
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <label htmlFor="pesquisa-biblioteca" style={{ display: "block", fontWeight: 700, marginBottom: "7px" }}>
            Pesquisar documentos
          </label>
          <input
            id="pesquisa-biblioteca"
            type="search"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Digite título, assunto, tipo, ano ou nome do arquivo..."
            aria-label="Pesquisar em todos os conteúdos da biblioteca"
            style={{
              boxSizing: "border-box",
              width: "100%",
              minHeight: "42px",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "9px",
              outlineOffset: "2px"
            }}
          />
        </div>

        <div style={{ flex: "0 1 230px" }}>
          <label htmlFor="filtro-tipo-biblioteca" style={{ display: "block", fontWeight: 700, marginBottom: "7px" }}>
            Tipo de conteúdo
          </label>
          <select
            id="filtro-tipo-biblioteca"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              boxSizing: "border-box",
              width: "100%",
              minHeight: "42px",
              padding: "10px 12px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              background: "#fff"
            }}
          >
            <option value="">Todos os tipos</option>
            {tiposDisponiveis.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {(pesquisa || filtro) && (
          <button
            type="button"
            onClick={() => { setPesquisa(""); setFiltro(""); }}
            style={{
              minHeight: "42px",
              padding: "10px 14px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              cursor: "pointer"
            }}
          >
            Limpar filtros
          </button>
        )}

        <p aria-live="polite" style={{ flex: "1 0 100%", margin: 0, color: "#475569", fontSize: "14px" }}>
          {dadosFiltrados.length} {dadosFiltrados.length === 1 ? "documento encontrado" : "documentos encontrados"}
        </p>
      </section>

            {/* TABELA */}

      <div className="biblioteca-grid">

    {dadosFiltrados.length === 0 ? (

        <div className="sem-documentos">
            Nenhum documento encontrado com esses critérios. Tente outros termos ou limpe os filtros.
        </div>

    ) : (

        dadosFiltrados.map((item) => (

            <div className="biblioteca-card" key={item.id}>

              

                <div className="biblioteca-icone">

                    {item.tipo === "Mapa estático" && "🗺️"}
                    {item.tipo === "Estudo" && "📘"}
                    {item.tipo === "Publicação" && "📚"}
                    {item.tipo === "Relatório Nacional para a UNFCCC" && "🌍"}
                    {!(["Mapa estático", "Estudo", "Publicação", "Relatório Nacional para a UNFCCC"].includes(item.tipo)) && "📄"}

                </div>

                <h3>{item.titulo}</h3>

                <span className="biblioteca-tipo">
                    {item.tipo}
                </span>

                <div className="biblioteca-data">
                    📅 {item.data}
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
                            📥 Download
                        </a>

                    ) : item.link ? (

                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-biblioteca"
                        >
                            🔗 Acessar
                        </a>

                    ) : (

                        <button
                            className="btn-biblioteca"
                            onClick={() => setPage(item.pagina)}
                        >
                            📄 Ver página
                        </button>

                    )}

                </div>

              </div> 
           

        ))

    )}

</div>

    </div>

  );

}

export default Biblioteca;
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
