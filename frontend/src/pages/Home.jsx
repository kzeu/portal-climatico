import "../App.css";

function Home({ setPage }) {
  return (
    <div className="content" id="content">

      {/* HERO */}

      <div className="hero">
        <h1>Portal Climático da Guiné-Bissau</h1>

        <p>
         O principal hub para a ação e transparência climática, acesso a dados, relatórios e mapas relevantes para a adaptação na Guiné-Bissau
        </p>
      </div>


      {/* CARDS PRINCIPAIS */}

      <div className="cards">

        <div className="card" onClick={() => setPage("seguimento_nap")}>
        
          <div className="card-header">Seguimento do NAP</div>
          <div className="card-body">
            Plano Nacional de Adaptação às Mudanças Climáticas
          </div>
        </div>

        <div className="card"  onClick={() => setPage("mapas_climatologia")}>
          <div className="card-header">Climatologia</div>
          <div className="card-body">
            Sequência de mapas de climatologia da Guiné-Bissau com projeções extraídas no Climate Change Knowledge Portal (CCKP) do Banco Mundial.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Mapas de Risco Climático</div>
          <div className="card-body">
            [Em desenvolvimento] - Resultados de consultorias apoiadas pelo projeto PNUD GCF para a formulação do NAP da Guiné-Bissau
          </div>
        </div>

        <div className="card">
          <div className="card-header">Atlas de projeções climáticas do IPCC</div>
          <div className="card-body">
           O Atlas Interativo do Grupo de Trabalho I (WGI) do IPCC O Atlas Interativo..
          </div>
        </div>

        <div className="card">
          <div className="card-header">Mitigação</div>
          <div className="card-body">
            Inventário de Gases de Efeito Estufa.
          </div>
        </div>


        <div className="card">
          <div className="card-header">Formulário de submissão de Ação Climática</div>
          <div className="card-body">
            A ação climática cabe a todos nós. Refere-se aos esforços do país para reduzir os riscos climáticos e as emissões de gases de efeito estufa, ao mesmo tempo em que fortalece a resiliência em setores-chave como agricultura, zonas costeiras, água e ecossistemas. 
          </div>
        </div>

        <div className="card">
          <div className="card-header">Relatórios Nacionais</div>
          <div className="card-body">
            Veja os relatórios nacionais da Guiné-Bissau para a UNFCCC
          </div>
        </div>

      {/*  <div className="card">
          <div className="card-header">Transparência Climática</div>
          <div className="card-body">
            [Em desenvolvimento] Programas de capacitação e transparência climática.
          </div>
        </div> */}

        {/*<div className="card">
          <div className="card-header">Chamadas e Projetos</div>
          <div className="card-body">
            [Em desenvolvimento] Oportunidades, financiamentos e projetos climáticos.
          </div>
        </div>*/}

      </div>



    </div>
  );
}

export default Home;