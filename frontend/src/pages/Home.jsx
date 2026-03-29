import "../App.css";

function Home() {
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

        <div className="card">
        
          <div className="card-header">Seguimento do NAP</div>
          <div className="card-body">
            Plano Nacional de Adaptação às Mudanças Climáticas
          </div>
        </div>

        <div className="card">
          <div className="card-header">Mapas de Climatologia</div>
          <div className="card-body">
            Sequência de mapas de climatologia da Guiné-Bissau com projeções climáticas.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Mapas de Risco Climático</div>
          <div className="card-body">
            [Em desenvolvimento] Resultados de estudos e análises climáticas do país.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Atlas do IPCC</div>
          <div className="card-body">
            Acesso ao atlas interativo do IPCC com dados globais e regionais.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Mitigação</div>
          <div className="card-body">
            Inventário de Gases de Efeito Estufa e políticas climáticas nacionais.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Relatórios Nacionais</div>
          <div className="card-body">
            Relatórios oficiais submetidos à UNFCCC pela Guiné-Bissau.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Transparência Climática</div>
          <div className="card-body">
            [Em desenvolvimento] Programas de capacitação e transparência climática.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Chamadas e Projetos</div>
          <div className="card-body">
            [Em desenvolvimento] Oportunidades, financiamentos e projetos climáticos.
          </div>
        </div>

      </div>



    </div>
  );
}

export default Home;