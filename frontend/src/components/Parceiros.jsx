import pnud from "../assets/pnud.webp";
import gcf from "../assets/gcf.jpeg";
import ministerio from "../assets/ministerio.png";

function Parceiros() {
  return (
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
    </section>
  );
}

export default Parceiros;
