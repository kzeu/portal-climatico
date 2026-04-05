import "../App.css";
import mapa from "../assets/Map1.jpg";

function Mapas_riscos() {
  return (
    <div className="content full-page" id="content">

      {/* HERO */}
      <div className="hero">
        <h1>Mapas de Risco Climático</h1>

        <p>
          [Em desenvolvimento] - Resultados de consultorias apoiadas pelo projeto PNUD GCF para a formulação do NAP da Guiné-Bissau
        </p>
      </div>

      {/* IMAGEM FULL */}
      <div className="mapa-full">

        <img src={mapa} alt="Mapa de risco climático" />

      </div>

    </div>
  );
}

export default Mapas_riscos;
