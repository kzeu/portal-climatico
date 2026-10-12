import { useEffect, useState } from "react";
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
  const dadosFiltrados = dados.filter((item) => {
    const correspondeTipo = !filtro || item.tipo === filtro;
    const textoPesquisavel = Object.values(item)
      .filter((valor) => valor !== null && valor !== undefined)
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
