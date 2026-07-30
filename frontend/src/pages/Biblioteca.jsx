import { useEffect, useState } from "react";
import API_URL from "../config";
import "../App.css";

function Biblioteca({ setPage }) {

  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");

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

  const dadosFiltrados = filtro
    ? dados.filter(item => item.tipo === filtro)
    : dados;

  return (

    <div className="content" id="content">

      {/* HERO */}
      <div className="hero">
        <h1>Biblioteca Climática</h1>

        <p>
          A Biblioteca do Portal Climático reúne documentos,
          relatórios e estudos relevantes sobre mudanças
          climáticas na Guiné-Bissau.
        </p>
      </div>

      {/* FILTRO */}

      <div style={{ marginBottom: "15px" }}>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            borderRadius: "10px",
            padding: "8px",
            border: "1px solid #ccc"
          }}
        >

          <option value="">Todos</option>

          <option value="Relatório Nacional para a UNFCCC">
            Relatórios UNFCCC
          </option>

          <option value="Mapa estático">
            Mapas
          </option>

          <option value="Estudo">
            Estudos
          </option>

          <option value="Publicação">
            Publicações
          </option>

        </select>

      </div>

      {/* TABELA */}

      <div className="biblioteca-grid">

    {dadosFiltrados.length === 0 ? (

        <div className="sem-documentos">
            Nenhum documento encontrado.
        </div>

    ) : (

        dadosFiltrados.map((item) => (

            <div className="biblioteca-card" key={item.id}>

                <div className="biblioteca-icone">

                    {item.tipo === "Mapa estático" && "🗺️"}
                    {item.tipo === "Estudo" && "📘"}
                    {item.tipo === "Publicação" && "📚"}
                    {item.tipo === "Relatório Nacional para a UNFCCC" && "🌍"}

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