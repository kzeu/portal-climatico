import "../App.css";
import HeroDinamico from "../components/HeroDinamico";
import mapa from "../assets/Map1.jpg";

function Mapas_riscos() {
  return (
    <div className="content full-page" id="content">

      {/* HERO — conteúdo carregado do cadastro Banners e Heros */}
      <HeroDinamico pagina="mapas_riscos" />

      {/* IMAGEM FULL */}
      <div className="mapa-full">

        <img src={mapa} alt="Mapa de risco climático" />

      </div>

    </div>
  );
}

export default Mapas_riscos;
