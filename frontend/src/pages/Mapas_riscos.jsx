import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import Icon from "../components/Icon";
import mapa from "../assets/Map1.webp";

export default function Mapas_riscos() {
  return (
    <PageShell className="full-page">
      <HeroPage pagina="mapas_riscos" />
      <figure className="mapa-estatico">
        <figcaption className="mapa-estatico-nota">
          <span>
            Imagem de referência dos riscos climáticos no território. Não é um mapa interativo:
            para indicadores, períodos e cenários, use os mapas de climatologia.
          </span>
          <Link to="/mapas/climatologia" className="btn-ghost">
            Consultar mapas de climatologia
          </Link>
          <a href={mapa} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Abrir imagem em tamanho real
            <Icon name="external" />
          </a>
        </figcaption>
        <div className="mapa-zoom">
          <img src={mapa} alt="Mapa de risco climático da Guiné-Bissau" width="1147" height="1026" />
        </div>
      </figure>
    </PageShell>
  );
}
