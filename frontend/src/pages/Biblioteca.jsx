import { useState } from "react";

function Biblioteca({setPage}) {

  const dados = [
    {
      titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 4 | Comunicações Nacionais (NC) | 17-Nov-2025",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/654402"
    },
    {
      titulo: "Relatório Bienal de Transparência (BTR) - BTR1. CTF-FTC |planilhas de dados estruturados | Formatos Tabulares Comuns – Apoio (CTF-S) | 14-Aug-2025",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/649217"

    },
    {
      titulo: "Relatório Bienal de Transparência (BTR) - BTR1 | documento narrativo | Relatórios Bienais de Transparência (BTR) | 26-Dec-2024",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/645093"
    },

     {
      titulo: "Guiné-Bissau. 2024 Documento de Inventário Nacional (NID) | Documento de Inventário Nacional (NID) | 26-Dec-2024",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/645094"
    },

     {
      titulo: "Guiné-Bissau. 2024 Relatório Bienal de Transparência (BTR). BTR1. CTF-NDC | Formatos Tabulares Comuns – Progresso (CTF-P) | 25-Dec-2024",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/645095"
    },

     {
      titulo: "Guiné-Bissau. 2024 Tabela Comum de Reporte (CRT). [Guiné-Bissau. 2024 Relatório Bienal de Transparência (BTR). BTR1. CTF-NDC (2024)] | Tabelas Comuns de Reporte (CRT) | 25-Dec-2024",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/645312"
    },

     {
      titulo: "Primeira NDC da Guiné (submissão atualizada) | Contribuições Nacionalmente Determinadas (NDCs) | 12-Oct-2021",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/497521"
    },

     {
      titulo: "Relatório FREL sobre a avaliação técnica do nível de referência de emissões florestais proposto pela Guiné-Bissau (submetido em 2019) | Estudo Florestal | 15-Jan-2020",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/209416"
    },

     {
      titulo: "Primeira NDC da Guiné-Bissau (Arquivada) | Contribuições Nacionalmente Determinadas (NDCs) | 22-Oct-2018",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/497511"
    },

     {
      titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 3 | Comunicações Nacionais (NC) | 09-Mar-2018",
      tipo: "Relatório Nacional para a UNFCCC)",
      link: "https://unfccc.int/documents/64689"
    },

     {
      titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 2 | Comunicações Nacionais (NC) | 29-Oct-2011",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/79689"
    },

     {
      titulo: "Programa Nacional de Ação para a Adaptação às Mudanças Climáticas (NAPA) - histórico | Estratégia nacional para adaptação | 16-Dec-2006",
      tipo: "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/resource/docs/napa/gnb01.pdf"
    },

     {
      titulo: "Guiné-Bissau. Relatório Bienal de Atualização (BUR). BUR 1 | Relatórios Bienais de Atualização (BUR) | 22-Sep-2020",
      tipo:"Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/251917"
    },

     {
      titulo: "Guiné-Bissau. Comunicação Nacional (NC). NC 1 | Comunicações Nacionais (NC) | 01-Dec-2005",
      tipo:  "Relatório Nacional para a UNFCCC",
      link: "https://unfccc.int/documents/106948"
    },


     {
      titulo: "Mapa: Climatologia e riscos para o novo projeto GEF8 BD (somente como exemplo para o protótipo)",
      tipo: "Mapa estático",
      pagina: "mapas_climatologia"
    }


    
  ];

  const [filtro, setFiltro] = useState("");

  const dadosFiltrados = filtro
    ? dados.filter(item => item.tipo === filtro)
    : dados;

  return (
    <div className="content" id="content">

      <div className="hero">
        <h1>Biblioteca Climática</h1>
        <p>
        A Biblioteca do Portal Climático reúne documentos, relatórios, estudos e publicações relevantes sobre mudanças climáticas na Guiné-Bissau. Este espaço facilita o acesso a informações oficiais e científicas, apoiando a tomada de decisão, a pesquisa e o desenvolvimento de políticas climáticas. 
        </p>
      </div>

      <select onChange={(e) => setFiltro(e.target.value)}
         style={{
                borderRadius: "10px",
                padding: "8px",
                border: "1px solid #ccc"
              }}>
        <option value="">Todos</option>
        <option value="Relatório Nacional para a UNFCCC">Relatório Nacional para a UNFCCC</option>
        <option value="Relatórios de consultoria selecionados">Relatórios de consultoria selecionados</option>
        <option value="Projeto climático de mais de 6 meses">Projeto climático de mais de 6 meses</option>
        <option value="Publicação">Publicação</option>
        <option value="Relatório">Relatório</option>
        <option value="Base de dados">Base de dados</option>
        <option value="Mapa estático">Mapa estático</option>
        <option value="Outros">Outros</option>
      </select>

      <div className="lista">
        {dadosFiltrados.map((item, index) => (
          <div key={index} className="item">

            {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer", color: "blue" }}>
              {item.titulo}
            </a>
          ) : (
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setPage(item.pagina)}
            >
              {item.titulo}
            </span>
)}
            

            
            <p>{item.tipo}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Biblioteca;