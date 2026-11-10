import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import { telefoneHref, useRodape } from "../hooks/useRodape";
import API_URL from "../config";
import { enviarPedido, semApi } from "../rede";
import { AvisoSemEnvio } from "../components/StatusStates";

export default function Contato() {
  const config = useRodape();
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });
  const [estado, setEstado] = useState("idle");
  const [erro, setErro] = useState("");
  const sucessoRef = useRef(null);

  useEffect(() => {
    if (estado === "ok") sucessoRef.current?.focus();
  }, [estado]);

  function alterar(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setEstado("sending");
    try {
      const { resposta, dados } = await enviarPedido(`${API_URL}/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível enviar a mensagem.");
      setEstado("ok");
      setForm({ nome: "", email: "", assunto: "", mensagem: "" });
    } catch (err) {
      setEstado("idle");
      if (semApi(err)) {
        setErro("sem-api");
        return;
      }
      const mensagem = err?.name === "AbortError" || err?.name === "TimeoutError"
        ? "Não foi possível enviar agora. Verifique a ligação e tente novamente."
        : (err.message || "Erro ao enviar a mensagem.");
      setErro(mensagem);
    }
  }

  return (
    <PageShell>
      <HeroPage pagina="contato" />

      <div className="contato-layout">
        <aside className="contato-canais" aria-labelledby="titulo-canais">
          <h2 id="titulo-canais">Outros canais</h2>
          <p>Também pode contactar a equipa do portal diretamente.</p>
          <dl className="contato-lista">
            {config.email ? (
              <div>
                <dt>E-mail</dt>
                <dd><a href={`mailto:${config.email}`}>{config.email}</a></dd>
              </div>
            ) : null}
            {config.telefone ? (
              <div>
                <dt>Telefone</dt>
                <dd><a href={telefoneHref(config.telefone)}>{config.telefone}</a></dd>
              </div>
            ) : null}
          </dl>
        </aside>

        <div className="form-container">
          <h2>Enviar mensagem</h2>
          <p className="form-subtitle">Todos os campos são obrigatórios.</p>

          {estado === "ok" ? (
            <div className="ui-success" role="status" tabIndex={-1} ref={sucessoRef}>Mensagem enviada. Obrigado pelo contacto.</div>
          ) : null}
          {erro ? (
            <div className="ui-error" role="alert">
              {erro === "sem-api" ? <AvisoSemEnvio email={config.email || "info@portaldoclima.gw"} /> : <p>{erro}</p>}
            </div>
          ) : null}

          <form className="form" onSubmit={enviar}>
            <div className="form-grid">
              <div className="campo">
                <label htmlFor="contato-nome">Nome completo</label>
                <input id="contato-nome" name="nome" type="text" autoComplete="name" value={form.nome} onChange={alterar} required />
              </div>

              <div className="campo">
                <label htmlFor="contato-email">E-mail</label>
                <input id="contato-email" name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={alterar} required />
              </div>

              <div className="campo campo-2">
                <label htmlFor="contato-assunto">Assunto</label>
                <input id="contato-assunto" name="assunto" type="text" value={form.assunto} onChange={alterar} required />
              </div>

              <div className="campo campo-2">
                <label htmlFor="contato-mensagem">Mensagem</label>
                <textarea id="contato-mensagem" name="mensagem" rows="6" value={form.mensagem} onChange={alterar} required />
              </div>
            </div>

            <button type="submit" className="btn-enviar" disabled={estado === "sending"}>
              {estado === "sending" ? "A enviar…" : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
