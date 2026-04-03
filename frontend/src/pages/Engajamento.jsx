function Engajamento({setPage}) {
  return (
    <div className="content" id="content">

      {/* HERO */}

      <div className="hero">
        <h1>Portal Climático da Guiné-Bissau</h1>

        <p>
         A ação climática cabe a todos nós. Refere-se aos esforços do país para reduzir os riscos climáticos e as emissões de gases de efeito estufa, ao mesmo tempo em que fortalece a resiliência em setores-chave como agricultura, zonas costeiras, água e ecossistemas. 

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


        <div className="card">
        
          <div className="card-header">Mitigação</div>
          <div className="card-body">
            Inventário de Gases de Efeito Estufa
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

        

        <div className="card">
          <div className="card-header">Treinamento em Transparência Climática</div>

          <div className="card-body">
           [Em desenvolvimento] - Oportunidade treinamento online para stakeholders da Guiné-Bissau sobre a preparação de inventários de Gases de Efeito Estufa (GEE) 
.
          </div>
        </div>

        <div className="card">
          <div className="card-header">Chamada para propostas</div>
          <div className="card-body">
            [Em desenvolvimento] .
          </div>
        </div>




        <div className="card">
          <div className="card-header">Eventos</div>
          <div className="card-body">
            [Em desenvolvimento] .
          </div>
        </div>

     

        <div className="card" onClick={() => window.open("https://coastal.gw/", "_blank")}>
          <div className="card-header">Projeto COASTAL</div>

          <div className="card-body">
            PNUD GEF: Reforço de Capacidades de Adaptação e de Resiliência ...

          </div>
        </div>

        <div className="card">
          <div className="card-header">Novo Projeto GEF em preparação</div>

          <div className="card-body">
            ....
          </div>
        </div>

        <div className="card">
          <div className="card-header">Preparação nacional para a COP</div>

          <div className="card-body">
          ....
          </div>
        </div>


        <div className="card">
          <div className="card-header">Novidades do INA</div>
          <div className="card-body">
            ....
          </div>
        </div>

      </div>



    </div>
  );
}

export default Engajamento;