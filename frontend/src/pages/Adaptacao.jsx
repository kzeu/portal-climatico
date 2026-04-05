function Adaptacao({ setPage }) {
   return (
    <div className="content" id="content">

      {/* HERO */}

      <div className="hero">
        <h1>Portal Climático da Guiné-Bissau</h1>

        <p>
         A adaptação é essencial para a Guiné-Bissau devido à sua elevada vulnerabilidade a impactos como a subida do nível do mar, inundações e variabilidade das chuvas. Esses riscos afetam setores vitais como agricultura, água e zonas costeiras. Fortalecer a adaptação permite reduzir perdas, proteger populações vulneráveis e promover um desenvolvimento mais resiliente.
        </p>
      </div>


      {/* CARDS PRINCIPAIS */}

      <div className="cards">

        <div className="card"onClick={() => setPage("seguimento_nap")}>
        
          <div className="card-header">Seguimento do NAP</div>
          <div className="card-body">
            Plano Nacional de Adaptação às Mudanças Climáticas
          </div>
        </div>

        <div className="card" onClick={() => setPage("mapas_climatologia")}>
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

        <div className="card"   onClick={() => window.open("https://interactive-atlas.ipcc.ch/", "_blank")}>
          
          <div className="card-header">Atlas de projeções climáticos do IPCC</div>
          <div className="card-body">
            O Atlas Interativo do Grupo de Trabalho I (WGI) do IPCC O Atlas Interativo...

          </div>
        </div>

       

         <div className="card">
          <div className="card-header">Formulário de submissão de Ação Climática</div>
          <div className="card-body">
            A ação climática cabe a todos nós. Refere-se aos esforços do país para reduzir os riscos climáticos e as emissões de gases de efeito estufa, ao mesmo tempo em que fortalece a resiliência em setores-chave como agricultura, zonas costeiras, água e ecossistemas. 
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
          <div className="card-header">Chamadas para propostas</div>
          <div className="card-body">
            [Em desenvolvimento].
          </div>
        </div>


        <div className="card">
          <div className="card-header">Eventos</div>
          <div className="card-body">
            * Jovens e Mulheres na Ação Climática
            * Workshop de validação do NAP

          </div>
        </div>


        <div className="card"  onClick={() => window.open("https://coastal.gw/", "_blank")}>
          <div className="card-header">Projeto COASTAL</div>

          <div className="card-body">
            PNUD GEF: Reforço de Capacidades de Adaptação e de Resiliência das Comunidades Vulneráveis das Zonas Costeiras da Guiné-Bissau aos Riscos Climáticos.

          </div>
        </div>


        <div className="card">
          <div className="card-header">Projeto COASTAL</div>

          <div className="card-body">
            PNUD GEF: Reforço de Capacidades de Adaptação e de Resiliência das Comunidades Vulneráveis das Zonas Costeiras da Guiné-Bissau aos Riscos Climáticos.

          </div>
        </div>

        <div className="card">
          <div className="card-header">Projeto COASTAL</div>

          <div className="card-body">
            PNUD GEF: Reforço de Capacidades de Adaptação e de Resiliência das Comunidades Vulneráveis das Zonas Costeiras da Guiné-Bissau aos Riscos Climáticos.

          </div>
        </div>


        <div className="card">
          <div className="card-header">Preparação nacional para a COP</div>

          <div className="card-body">
           
          </div>
        </div>


        <div className="card">
          <div className="card-header">Índice ND-GAIN sobre Risco Climático</div>

          <div className="card-body">
            Guiné-Bissau está na posição 181 do ranking mundial ND-GAIN de 187 países. O Índice ND-GAIN (Notre Dame Global Adaptation Initiative) é um indicador global que avalia a vulnerabilidade dos países às mudanças climáticas e a sua capacidade de adaptação.
          </div>
        </div>


         <div className="card">
          <div className="card-header">Novidades do INA</div>

          <div className="card-body">
           
          </div>
        </div>





      </div>


          </div>
  );
}

export default Adaptacao;