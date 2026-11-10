import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import API_URL from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha })
      });
      const dados = await resposta.json();
      if (!resposta.ok || !dados.sucesso) {
        throw new Error(dados.erro || "Utilizador ou senha incorretos.");
      }
      localStorage.setItem("logado", "sim");
      navigate("/admin");
    } catch (err) {
      setErro(err.message || "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <PageShell>
      <div className="login-page">
        <form className="login-box" onSubmit={entrar}>
          <h1 tabIndex={-1}>Entrar</h1>
          <p>Acesso ao painel de gestão do portal.</p>
          {erro ? <div className="ui-error" role="alert">{erro}</div> : null}
          <div className="campo">
            <label htmlFor="login-usuario">Utilizador</label>
            <input
              id="login-usuario"
              type="text"
              autoComplete="username"
              spellCheck={false}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="campo">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-enviar" disabled={enviando}>
            {enviando ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
