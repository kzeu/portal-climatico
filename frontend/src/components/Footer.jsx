<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import logo from "../assets/logo2-.png";
import API_URL from "../config";

function Footer() {
  const [config, setConfig] = useState({
    sobre_texto: "Portal Climático da Guiné-Bissau",
    email: "info@clima.gb",
    telefone: "+245 XXX XXX"
  });

  useEffect(() => {
    let ativo = true;

    fetch(`${API_URL}/configuracoes/rodape`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API do rodapé respondeu ${res.status}`);
        }
        return res.json();
      })
      .then((dados) => {
        if (ativo && dados) setConfig((atual) => ({ ...atual, ...dados }));
      })
      .catch((erro) => {
        // Mantém os textos básicos visíveis enquanto a rota do backend não estiver disponível.
        console.error("Erro ao carregar configurações do rodapé:", erro);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const urlArquivo = (caminho) => {
    if (!caminho) return "";
    return /^https?:\/\//i.test(caminho) ? caminho : `${API_URL}${caminho}`;
  };

  const temSobrePdf = Boolean(config.sobre_pdf);
  const temPoliticaPdf = Boolean(config.politica_pdf);
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
<<<<<<< HEAD
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
=======
          <img src={logo} alt="Portal Climático da Guiné-Bissau" />
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Sobre o Portal</h4>
            <p>
              {temSobrePdf ? (
                <a href={urlArquivo(config.sobre_pdf)} target="_blank" rel="noopener noreferrer">
                  Portal Climático da Guiné-Bissau
                </a>
              ) : (
                "Portal Climático da Guiné-Bissau"
              )}
            </p>
            <p>
              {temPoliticaPdf ? (
                <a href={urlArquivo(config.politica_pdf)} target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>
              ) : (
                "Política de Privacidade"
              )}
            </p>
          </div>

         
      
        <div className="footer-col">
          <h4>Redes Sociais</h4>

          <p>
            {config.facebook_url ? (
              <a href={config.facebook_url} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ verticalAlign: "middle", marginRight: "6px", fill: "currentColor" }}>
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.3V13h2.8v8h3.4z" />
                </svg>
                Facebook
              </a>
            ) : (
              <span>Facebook</span>
            )}
          </p>

          <p>
            {config.instagram_url ? (
              <a href={config.instagram_url} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ verticalAlign: "middle", marginRight: "6px", fill: "none", stroke: "currentColor", strokeWidth: 2 }}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            ) : (
              <span>Instagram</span>
            )}
          </p>

          <p>
            {config.linkedin_url ? (
              <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ verticalAlign: "middle", marginRight: "6px", fill: "currentColor" }}>
                  <path d="M5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3.5 9h3.4v11.5H3.5zM9 9h3.2v1.6h.1A3.5 3.5 0 0 1 15.5 8.8c3.5 0 4.1 2.3 4.1 5.2v6.5h-3.4v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.9H9z" />
                </svg>
                LinkedIn
              </a>
            ) : (
              <span>LinkedIn</span>
            )}
          </p>
        </div>



          <div className="footer-col">
            <h4>Contato</h4>
            {config.email ? (
              <p>Email: <a href={`mailto:${config.email}`}>{config.email}</a></p>
            ) : null}
            {config.telefone ? (
              <p>
                Tel:{" "}
                <a href={`tel:${String(config.telefone).replace(/[^\d+]/g, "")}`}>
                  {config.telefone}
                </a>
              </p>
            ) : null}
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
          </div>
        </div>
      </div>

      <div className="footer-bottom">
<<<<<<< HEAD
        <p>
          © Instituto Nacional do Ambiente - Guiné-Bissau, {new Date().getFullYear()}.
          Todos os direitos reservados.
        </p>
=======
        © Instituto Nacional do Ambiente - Guiné-Bissau, {new Date().getFullYear()}.
        Todos os direitos reservados.
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
      </div>
    </footer>
  );
}

export default Footer;
