import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NaoEncontrada() {
  return (
    <PageShell>
      <div className="nao-encontrada">
        <h1 tabIndex={-1}>Esta página não existe</h1>
        <p>O endereço não corresponde a nenhuma página do portal. Pode voltar ao início ou procurar um documento na biblioteca.</p>
        <div className="nao-encontrada-acoes">
          <Link className="btn-enviar" to="/">Ir para o início</Link>
          <Link className="btn-ghost" to="/biblioteca">Abrir a biblioteca</Link>
        </div>
      </div>
    </PageShell>
  );
}
