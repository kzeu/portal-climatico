<<<<<<< HEAD
import pnud from "../assets/pnud.webp";
=======
import "../App.css";

import pnud from "../assets/pnud.jpeg";
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
import gcf from "../assets/gcf.jpeg";
import ministerio from "../assets/ministerio.png";

function Parceiros() {
  return (
<<<<<<< HEAD
    <section className="parceiros" aria-labelledby="titulo-parceiros">
      <div className="parceiros-container">
        <h2 className="parceiros-titulo" id="titulo-parceiros">Apoio</h2>

        <ul className="parceiros-logos">
          <li className="parceiro parceiro-pnud">
            <img src={pnud} alt="PNUD" width="60" height="122" loading="lazy" />
          </li>

          <li className="parceiro parceiro-gcf">
            <img src={gcf} alt="Green Climate Fund" width="400" height="400" loading="lazy" />
          </li>

          <li className="parceiro parceiro-texto">
            <strong>Instituto Nacional do Ambiente</strong>
            <span>INA</span>
          </li>

          <li className="parceiro parceiro-ministerio">
            <img
              src={ministerio}
              alt="Ministério do Ambiente e Ação Climática"
              width="372"
              height="197"
              loading="lazy"
            />
          </li>
        </ul>
      </div>
=======
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

>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
    </section>
  );
}

<<<<<<< HEAD
export default Parceiros;
=======
export default Parceiros;
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
