import "../App.css";

import pnud from "../assets/pnud.jpeg";
import gcf from "../assets/gcf.jpeg";
import ministerio from "../assets/ministerio.png";

function Parceiros() {
  return (
    <section className="parceiros">

      <div className="parceiros-container">

        <div className="parceiros-titulo">
          APOIO:
        </div>

        <div className="parceiros-logos">

          {/* PNUD */}
         <div className="parceiro parceiro-pnud">
            <img src={pnud} alt="PNUD" />
          </div>

          {/* Separador */}
          <div className="parceiro-separador"></div>

          {/* GREEN CLIMATE FUND */}
         <div className="parceiro parceiro-gcf">
          <img
            src={gcf}
            alt="Green Climate Fund"
          />
        </div>

          {/* Separador */}
          <div className="parceiro-separador"></div>

          {/* INA */}
          <div className="parceiro parceiro-texto">
            <strong>Instituto Nacional</strong>
            <strong>do Ambiente</strong>
            <strong>INA</strong>
          </div>

          {/* Separador */}
          <div className="parceiro-separador"></div>

         {/* MINISTÉRIO */}
          <div className="parceiro parceiro-ministerio">

            <img
              src={ministerio}
              alt="Ministério do Ambiente e Ação Climática"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Parceiros;