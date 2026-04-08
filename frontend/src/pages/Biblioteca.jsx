import { useState } from "react";
import "../App.css";

function Biblioteca({ setPage }) {


  const dados = [

    {
    titulo: "Primeira NDC da Guiné (submissão atualizada)",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "12/out/21",
    link: "https://unfccc.int/documents/497521"
  },
  {
    titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 4",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "17 Nov 2025",
    link: "https://unfccc.int/documents/654402"
  },
  {
    titulo: "Primeira NDC da Guiné-Bissau (Arquivada)",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "22/out/18",
    link: "https://unfccc.int/documents/497511"
  },
  {
    titulo: "Relatório Bienal de Transparência (BTR) - BTR1. CTF-FTC |planilhas de dados estruturados",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "14/ago/25",
    link: "https://unfccc.int/documents/649217"
  },

  {
    titulo: "Guiné-Bissau. 2024 Documento de Inventário Nacional (NID)",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "26-Dec-24",
    link: "https://unfccc.int/documents/645094"
  },
  {
    titulo: "Relatório Bienal de Transparência (BTR) - BTR1. CTF-FTC |planilhas de dados estruturados",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "14/ago/25",
    link: "https://unfccc.int/documents/649217"
  },
  {
    titulo: "Relatório Bienal de Transparência (BTR) - BTR1 | documento narrativo",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "26-Dec-24",
    link: "https://unfccc.int/documents/645093"
  },
  {
    titulo: "Guiné-Bissau. 2024 Relatório Bienal de Transparência (BTR). BTR1. CTF-NDC",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "25-Dec-24",
    link: "https://unfccc.int/documents/645095"
  },
  {
    titulo: "Guiné-Bissau. Relatório Bienal de Atualização (BUR). BUR 1",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "22-Sep-20",
    link: "https://unfccc.int/documents/251917"
  },
  {
    titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 3",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "9-Mar-18",
    link: "https://unfccc.int/documents/64689"
  },
  {
    titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 2",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "29-Oct-11",
    link: "https://unfccc.int/documents/79689"
  },
  {
    titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 1",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "1-Dec-05",
    link: "https://unfccc.int/documents/106948"
  },
  {
    titulo: "Guiné-Bissau. 2024 Tabela Comum de Reporte (CRT). [Guiné-Bissau. 2024 Relatório Bienal de Transparência (BTR). BTR1. CTF-NDC (2024)]",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "25-Dec-24",
    link: "https://unfccc.int/documents/645312"
  },
  {
    titulo: "Relatório FREL sobre a avaliação técnica do nível de referência de emissões florestais proposto pela Guiné-Bissau (submetido em 2019)",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "15-Jan-20",
    link: "https://unfccc.int/documents/209416"
  },
  
  {
    titulo: "Programa Nacional de Ação para a Adaptação às Mudanças Climáticas (NAPA) - histórico",
    tipo: "Mapa estático",
    data: "16/dez/06",
    pagina: "mapas_climatologia"
  }
];

  const [filtro, setFiltro] = useState("");

  const dadosFiltrados = filtro
    ? dados.filter(item => item.tipo === filtro)
    : dados;

  return (
    <div className="content" id="content">

      {/* HERO */}
      <div className="hero">
        <h1>Biblioteca Climática</h1>
        <p>
          A Biblioteca do Portal Climático reúne documentos, relatórios e estudos
          relevantes sobre mudanças climáticas na Guiné-Bissau.
        </p>
      </div>

      {/* FILTRO */}
      <div style={{ marginBottom: "15px" }}>
        <select
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
        </select>
      </div>

      {/* TABELA */}
     <table className="tabela-biblioteca">

  <thead>
    <tr>
      <th>#</th>
      <th>Documento</th>
      <th>Tipo</th>
      <th>Data</th> {/* NOVA COLUNA */}
      <th>Acesso</th>
    </tr>
  </thead>

  <tbody>
    {dadosFiltrados.map((item, index) => (
      <tr key={index}>

        <td>{index + 1}</td>

        <td className="col-titulo">
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.titulo}
            </a>
          ) : (
            <span onClick={() => setPage(item.pagina)}>
              {item.titulo}
            </span>
          )}
        </td>

        <td>{item.tipo}</td>

        {/* NOVA COLUNA DATA */}
        <td>{item.data}</td>

        <td>
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-link">
              🔗 Acessar
            </a>
          ) : (
            <span className="btn-link" onClick={() => setPage(item.pagina)}>
              🔗 Ver página
            </span>
          )}
        </td>

      </tr>
    ))}
  </tbody>

</table>

    </div>
  );
}

export default Biblioteca;