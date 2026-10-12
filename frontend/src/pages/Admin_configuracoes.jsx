import { useEffect, useState } from "react";
import API_URL from "../config";

const estiloCampo = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "16px"
};

const estiloInput = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box"
};

function Admin_configuracoes() {
  const [form, setForm] = useState({
    sobre_texto: "Portal Climático da Guiné-Bissau",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    email: "info@clima.gb",
    telefone: "+245 XXX XXX",
    sobre_pdf: "",
    sobre_pdf_nome: "",
    politica_pdf: "",
    politica_pdf_nome: ""
  });
  const [arquivoSobre, setArquivoSobre] = useState(null);
  const [arquivoPolitica, setArquivoPolitica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const resposta = await fetch(`${API_URL}/configuracoes/rodape`);
        if (!resposta.ok) throw new Error("Não foi possível carregar as configurações.");
        const dados = await resposta.json();
        if (ativo) setForm(prev => ({ ...prev, ...dados }));
      } catch (e) {
        if (ativo) setErro(e.message || "Erro ao carregar configurações.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  function alterar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");
    setErro("");

    try {
      const dados = new FormData();
      ["sobre_texto", "facebook_url", "instagram_url", "linkedin_url", "email", "telefone"]
        .forEach(campo => dados.append(campo, form[campo] || ""));
      if (arquivoSobre) dados.append("sobre_pdf", arquivoSobre);
      if (arquivoPolitica) dados.append("politica_pdf", arquivoPolitica);

      const resposta = await fetch(`${API_URL}/configuracoes/rodape`, {
        method: "PUT",
        body: dados
      });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível salvar.");

      setForm(prev => ({ ...prev, ...resultado.configuracoes }));
      setArquivoSobre(null);
      setArquivoPolitica(null);
      setMensagem("Configurações do rodapé salvas com sucesso.");
    } catch (e) {
      setErro(e.message || "Erro ao salvar configurações.");
    } finally {
      setSalvando(false);
    }
  }

  const urlArquivo = caminho => {
    if (!caminho) return "";
    return /^https?:\/\//i.test(caminho) ? caminho : `${API_URL}${caminho}`;
  };

  if (carregando) return <div><h2>Configurações do rodapé</h2><p>Carregando...</p></div>;

  return (
    <div style={{ maxWidth: "900px" }}>
      <h2>Configurações do rodapé</h2>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Edite os contatos, redes sociais e documentos exibidos no rodapé do portal.
      </p>

      {mensagem && <div role="status" style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", background: "#dcfce7", color: "#166534" }}>{mensagem}</div>}
      {erro && <div role="alert" style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", background: "#fee2e2", color: "#991b1b" }}>{erro}</div>}

      <form onSubmit={salvar} style={{ background: "#fff", padding: "22px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h3>Sobre o Portal</h3>
        <label style={estiloCampo}>
        </label>

        <label style={estiloCampo}>
          <span>PDF — Sobre o Portal</span>
          <input style={estiloInput} type="file" accept="application/pdf,.pdf" onChange={e => setArquivoSobre(e.target.files?.[0] || null)} />
          {arquivoSobre && <small>Arquivo selecionado: {arquivoSobre.name}</small>}
          {!arquivoSobre && form.sobre_pdf && <small>PDF atual: {form.sobre_pdf_nome || "Documento cadastrado"} — <a href={urlArquivo(form.sobre_pdf)} target="_blank" rel="noreferrer">Abrir PDF</a></small>}
        </label>

        <h3 style={{ marginTop: "28px" }}>Política de Privacidade</h3>
        <label style={estiloCampo}>
          <span>PDF — Política de Privacidade</span>
          <input style={estiloInput} type="file" accept="application/pdf,.pdf" onChange={e => setArquivoPolitica(e.target.files?.[0] || null)} />
          {arquivoPolitica && <small>Arquivo selecionado: {arquivoPolitica.name}</small>}
          {!arquivoPolitica && form.politica_pdf && <small>PDF atual: {form.politica_pdf_nome || "Documento cadastrado"} — <a href={urlArquivo(form.politica_pdf)} target="_blank" rel="noreferrer">Abrir PDF</a></small>}
        </label>

        <h3 style={{ marginTop: "28px" }}>Redes Sociais</h3>
        <label style={estiloCampo}>
          <span>Link do Facebook</span>
          <input style={estiloInput} type="url" placeholder="https://facebook.com/..." value={form.facebook_url || ""} onChange={e => alterar("facebook_url", e.target.value)} />
        </label>
        <label style={estiloCampo}>
          <span>Link do Instagram</span>
          <input style={estiloInput} type="url" placeholder="https://instagram.com/..." value={form.instagram_url || ""} onChange={e => alterar("instagram_url", e.target.value)} />
        </label>
        <label style={estiloCampo}>
          <span>Link do LinkedIn</span>
          <input style={estiloInput} type="url" placeholder="https://linkedin.com/..." value={form.linkedin_url || ""} onChange={e => alterar("linkedin_url", e.target.value)} />
        </label>

        <h3 style={{ marginTop: "28px" }}>Contato</h3>
        <label style={estiloCampo}>
          <span>E-mail</span>
          <input style={estiloInput} type="email" value={form.email || ""} onChange={e => alterar("email", e.target.value)} />
        </label>
        <label style={estiloCampo}>
          <span>Telefone</span>
          <input style={estiloInput} type="tel" placeholder="+245 ..." value={form.telefone || ""} onChange={e => alterar("telefone", e.target.value)} />
        </label>

        <button type="submit" disabled={salvando} style={{ padding: "11px 18px", border: 0, borderRadius: "8px", background: "#0f766e", color: "#fff", fontWeight: 700, cursor: salvando ? "wait" : "pointer" }}>
          {salvando ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}

export default Admin_configuracoes;
