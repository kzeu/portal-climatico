import { useState } from "react";

function Biblioteca() {

  const dados = [
    {
      titulo: "Primeira NDC da Guiné (submissão atualizada)",
      tipo: "Nationally determined contributions (NDCs)",
      link: "https://unfccc.int/documents/497521"
    },
    {
      titulo: "Primeira NDC da Guiné-Bissau (Arquivada)",
      tipo:"Nationally determined contributions (NDCs)",
      link: "https://unfccc.int/documents/497511"
    },
    {
      titulo: "Relatório Bienal de Transparência (BTR) - BTR1 | documento narrativo",
      tipo: "Relatórios Bienais de Transparência (BTR)",
      link: "https://unfccc.int/documents/645093"
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

      <select onChange={(e) => setFiltro(e.target.value)}>
        <option value="">Todos</option>
        <option value="Nationally determined contributions (NDCs)">NDC</option>
        <option value="Biennial Transparency reports (BTR)">BTR</option>
        <option value="National communications (NC)">NC</option>
      </select>

      <div className="lista">
        {dadosFiltrados.map((item, index) => (
          <div key={index} className="item">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.titulo}
            </a>
            <p>{item.tipo}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Biblioteca;