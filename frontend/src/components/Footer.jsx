import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import { telefoneHref, urlArquivo, useRodape } from "../hooks/useRodape";

const NAVEGACAO = [
  { to: "/adaptacao", label: "Adaptação" },
  { to: "/seguimento-nap", label: "Seguimento do NAP" },
  { to: "/mitigacao", label: "Mitigação" },
  { to: "/mapas/climatologia", label: "Mapas de climatologia" },
  { to: "/mapas/riscos", label: "Mapas de risco" },
  { to: "/engajamento", label: "Engajamento" },
  { to: "/submissao", label: "Submeter uma ação" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/contato", label: "Contato" }
];

function Footer() {
  const config = useRodape();

  const redes = [
    { url: config.facebook_url, label: "Facebook" },
    { url: config.instagram_url, label: "Instagram" },
    { url: config.twitter_url, label: "X" },
    { url: config.linkedin_url, label: "LinkedIn" }
  ].filter((rede) => rede.url);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo" aria-label="Portal Climático da Guiné-Bissau — início">
            <img src={logo} alt="" width="480" height="320" loading="lazy" />
          </Link>
        </div>

        <div className="footer-columns">
          <nav className="footer-col" aria-labelledby="rodape-navegacao">
            <h2 id="rodape-navegacao">Navegação</h2>
            <ul>
              {NAVEGACAO.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2>Sobre o Portal</h2>
            <ul>
              <li>
                {config.sobre_pdf ? (
                  <a href={urlArquivo(config.sobre_pdf)} target="_blank" rel="noopener noreferrer">
                    Portal Climático da Guiné-Bissau
                  </a>
                ) : (
                  "Portal Climático da Guiné-Bissau"
                )}
              </li>
              {config.politica_pdf ? (
                <li>
                  <a href={urlArquivo(config.politica_pdf)} target="_blank" rel="noopener noreferrer">
                    Política de Privacidade
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          {redes.length > 0 ? (
            <div className="footer-col">
              <h2>Redes sociais</h2>
              <ul>
                {redes.map((rede) => (
                  <li key={rede.label}>
                    <a href={rede.url} target="_blank" rel="noopener noreferrer">{rede.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="footer-col">
            <h2>Contato</h2>
            <ul>
              {config.email ? (
                <li>Email: <a href={`mailto:${config.email}`}>{config.email}</a></li>
              ) : null}
              {config.telefone ? (
                <li>
                  Tel: <a href={telefoneHref(config.telefone)}>{config.telefone}</a>
                </li>
              ) : null}
              <li><Link to="/contato">Formulário de contato</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © Instituto Nacional do Ambiente - Guiné-Bissau, {new Date().getFullYear()}.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
