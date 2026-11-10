import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import CardPortal from "../components/CardPortal";
import SectionTitle from "../components/SectionTitle";

const destinos = [
  {
    id: "submissao",
    titulo: "Submissão de ação climática",
    conteudo: "Envie eventos, projetos, publicações e outras iniciativas para análise e publicação no portal.",
    link: "form_submissao",
    tipo_link: "interno"
  },
  {
    id: "coastal",
    titulo: "Projeto COASTAL",
    conteudo: "PNUD GEF: reforço de capacidades de adaptação e de resiliência nas zonas costeiras.",
    link: "https://coastal.gw/",
    tipo_link: "externo"
  }
];

export default function Engajamento() {
  return (
    <PageShell>
      <HeroPage pagina="engajamento" />
      <section className="home-areas" aria-labelledby="titulo-engajamento">
        <SectionTitle id="titulo-engajamento" title="Como se envolver" />
        <p className="engajamento-nota">
          O seguimento do Plano Nacional de Adaptação está na secção Adaptação.{" "}
          <Link to="/seguimento-nap">Abrir o seguimento do NAP</Link>
        </p>
        <div className="cards home-cards-grid">
          {destinos.map((card) => (
            <CardPortal key={card.id} card={card} from="/engajamento" />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
