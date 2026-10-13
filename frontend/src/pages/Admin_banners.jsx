
import { useEffect, useState } from "react";
import API_URL from "../config";
import "../App.css";



const FORM_INICIAL = {
  tipo: "slide",
  pagina: "home",
  pequeno: "",
  titulo: "",
  texto: "",
  imagem: "",
  botao_principal: "",
  link_principal: "",
  tipo_link_principal: "interno",
  botao_secundario: "",
  link_secundario: "",
  tipo_link_secundario: "interno",
  ordem: 0,
  ativo: true
};

function Admin_banners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
    const [arquivoImagem, setArquivoImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState("");
  const [removerImagem, setRemoverImagem] = useState(false);



const paginasInternas = [
  { value: "adaptacao", label: "Adaptação" },
  { value: "nap", label: "Seguimento do NAP" },
  { value: "mitigacao", label: "Mitigação" },
  { value: "mapas_climatologia", label: "Mapas de Climatologia" },
  { value: "mapas_riscos", label: "Mapas de Riscos" },
  { value: "engajamento", label: "Engajamento" },
  { value: "submissao_climatica", label: "Submissão Climática" },
  { value: "biblioteca", label: "Biblioteca" }
];


  async function carregarBanners() {
    try {
      setErro("");

      const response = await fetch(`${API_URL}/banners-herois`);

      if (!response.ok) {
        throw new Error("Falha ao consultar a API.");
      }

      const dados = await response.json();
      setBanners(dados);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar os banners.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarBanners();
  }, []);

  function alterarCampo(e) {
    const { name, value, type, checked } = e.target;

    if (name === "tipo") {
      setForm((anterior) => ({
        ...anterior,
        tipo: value,
        pagina: value === "hero"
          ? (anterior.pagina === "home" ? "adaptacao" : anterior.pagina)
          : anterior.pagina,
        ordem: value === "hero" ? 0 : (anterior.ordem || banners.length + 1),
        pequeno: value === "hero" ? "" : anterior.pequeno,
        botao_principal: value === "hero" ? "" : anterior.botao_principal,
        link_principal: value === "hero" ? "" : anterior.link_principal,
        tipo_link_principal: value === "hero" ? "interno" : anterior.tipo_link_principal,
        botao_secundario: value === "hero" ? "" : anterior.botao_secundario,
        link_secundario: value === "hero" ? "" : anterior.link_secundario,
        tipo_link_secundario: value === "hero" ? "interno" : anterior.tipo_link_secundario
      }));
      return;
    }

    setForm((anterior) => ({
      ...anterior,
      [name]:
        type === "checkbox"
          ? checked
          : name === "ordem"
            ? Number(value)
            : value
    }));
  }

  
function selecionarImagem(e) {
  const arquivo = e.target.files?.[0];

  if (!arquivo) return;

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!tiposPermitidos.includes(arquivo.type)) {
    setErro("Selecione uma imagem JPG, PNG ou WEBP.");
    e.target.value = "";
    return;
  }

  if (arquivo.size > 5 * 1024 * 1024) {
    setErro("A imagem deve ter no máximo 5 MB.");
    e.target.value = "";
    return;
  }

  setArquivoImagem(arquivo);
  setPreviewImagem(URL.createObjectURL(arquivo));
  setRemoverImagem(false);
  setErro("");
}


  function novoBanner() {
    setForm({
      ...FORM_INICIAL,
      ordem: banners.length + 1
    });
    setEditando(null);
    setMensagem("");
    setErro("");
    setArquivoImagem(null);
    setPreviewImagem("");
    setRemoverImagem(false);
  }

  function editarBanner(banner) {
    setForm({
      ...FORM_INICIAL,
      ...banner
    });

    setEditando(banner.id);
    setMensagem("");
    setErro("");
    setArquivoImagem(null);
    setPreviewImagem("");
    setRemoverImagem(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const url = editando
        ? `${API_URL}/banners-herois/${editando}`
        : `${API_URL}/banners-herois`;

      
        const formData = new FormData();

        Object.entries(form).forEach(([chave, valor]) => {
          formData.append(chave, String(valor ?? ""));
        });

        if (arquivoImagem) {
          formData.set("imagem", arquivoImagem);
        }

        formData.set("remover_imagem", String(removerImagem));

        const response = await fetch(url, {
          method: editando ? "PUT" : "POST",
          body: formData
        });


      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.erro || "Não foi possível salvar."
        );
      }

      setMensagem(
        editando
          ? "Banner atualizado com sucesso!"
          : "Banner cadastrado com sucesso!"
      );

      setForm(FORM_INICIAL);
      setEditando(null);
      setArquivoImagem(null);
      setPreviewImagem("");
      setRemoverImagem(false);
      await carregarBanners();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Erro ao salvar banner.");
    }
  }

  async function excluirBanner(id) {
    if (!window.confirm("Deseja realmente excluir este banner?")) {
      return;
    }

    setMensagem("");
    setErro("");

    try {
      const response = await fetch(
        `${API_URL}/banners-herois/${id}`,
        { method: "DELETE" }
      );

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.erro || "Não foi possível excluir."
        );
      }

      if (editando === id) {
        setForm(FORM_INICIAL);
        setEditando(null);
        setArquivoImagem(null);
        setPreviewImagem("");
        setRemoverImagem(false);
      }

      setMensagem("Banner excluído com sucesso!");
      await carregarBanners();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Erro ao excluir banner.");
    }
  }

  return (
    <div className="admin-banners">
      <div className="admin-banners-header">
      <div>
        <h2>Banners e Heros</h2>
        <p>
          Gerencie os slides da Home e os heróis das demais páginas.
        </p>
      </div>

      <button
        type="button"
        className="btn-novo-banner"
        onClick={novoBanner}
      >
        + Novo banner
      </button>
    </div>

      {mensagem && (
        <p style={{ color: "green" }}>{mensagem}</p>
      )}

      {erro && (
        <p style={{ color: "red" }}>{erro}</p>
      )}

      <form className="admin-banners-form" onSubmit={salvar}>
        <h3>
          {editando
            ? `Editando banner #${editando}`
            : "Cadastrar novo banner"}
        </h3>

        <div>
          <label>Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={alterarCampo}
            required
          >
            <option value="slide">Slide da Home</option>
            <option value="hero">Herói de página</option>
          </select>
        </div>

        <div>
          <label>Página</label>
          <select
            name="pagina"
            value={form.pagina}
            onChange={alterarCampo}
            required
          >
            {form.tipo === "slide" && <option value="home">Home</option>}
            {paginasInternas.map((pagina) => (
              <option key={pagina.value} value={pagina.value}>
                {pagina.label}
              </option>
            ))}
          </select>
        </div>

        {form.tipo === "slide" && (
          <div>
            <label>Texto pequeno</label>
            <input
              name="pequeno"
              value={form.pequeno || ""}
              onChange={alterarCampo}
            />
          </div>
        )}

        <div>
          <label>Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={alterarCampo}
            required
          />
        </div>

        <div>
          <label>Texto descritivo</label>
          <textarea
            name="texto"
            value={form.texto || ""}
            onChange={alterarCampo}
            rows={4}
          />
        </div>
       
        <div>
          <label>Selecionar imagem do computador</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selecionarImagem}
          />
          <small>JPG, PNG ou WEBP. Máximo de 5 MB.</small>
        </div>

        {editando && (
          <div style={{ margin: "10px 0 16px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              disabled={(!form.imagem && !previewImagem && !arquivoImagem) || removerImagem}
              onClick={() => {
                setForm((anterior) => ({ ...anterior, imagem: "" }));
                setArquivoImagem(null);
                setPreviewImagem("");
                setRemoverImagem(true);
                setErro("");
              }}
              style={{
                backgroundColor: "#b42318",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 14px",
                cursor: ((!form.imagem && !previewImagem && !arquivoImagem) || removerImagem) ? "not-allowed" : "pointer",
                opacity: ((!form.imagem && !previewImagem && !arquivoImagem) || removerImagem) ? 0.55 : 1
              }}
            >
              {removerImagem ? "Imagem marcada para remoção" : "Remover imagem"}
            </button>
            {removerImagem && (
              <span style={{ color: "#b42318", fontSize: "14px" }}>
                A remoção será aplicada ao clicar em Salvar alterações.
              </span>
            )}
          </div>
        )}

        {(previewImagem || form.imagem) && !removerImagem && (
          <div style={{ margin: "12px 0" }}>
            <p>
              {previewImagem
                ? "Pré-visualização da nova imagem:"
                : "Imagem atual:"}
            </p>
            <img
              src={
                previewImagem ||
                ((form.imagem || "").startsWith("http")
                  ? form.imagem
                  : `${window.location.origin}${(form.imagem || "").startsWith("/") ? "" : "/"}${form.imagem || ""}`)
              }
              alt="Pré-visualização do banner"
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "220px",
                objectFit: "cover",
                borderRadius: "8px",
                display: "block",
                marginBottom: "10px"
              }}
            />
          </div>
        )}

        {removerImagem && (
          <p style={{ color: "#b42318", margin: "12px 0" }}>
            A imagem será removida ao salvar. Se mudar de ideia, selecione uma nova imagem.
          </p>
        )}

        {form.tipo === "slide" && (
          <>
            <h3>Botão principal</h3>

            <div>
              <label>Texto do botão</label>
              <input
                name="botao_principal"
                value={form.botao_principal || ""}
                onChange={alterarCampo}
                placeholder="Ex.: Conheça o projeto"
              />
            </div>

            <div>
              <label>Tipo de link principal</label>
              <select
                name="tipo_link_principal"
                value={form.tipo_link_principal || "interno"}
                onChange={alterarCampo}
              >
                <option value="interno">Página do portal</option>
                <option value="externo">Site externo</option>
              </select>
            </div>

            <div>
              <label>
                {form.tipo_link_principal === "interno"
                  ? "Página de destino"
                  : "URL externa"}
              </label>

              {form.tipo_link_principal === "interno" ? (
                <select
                  name="link_principal"
                  value={form.link_principal || ""}
                  onChange={alterarCampo}
                >
                  <option value="">Selecione uma página...</option>
                  {paginasInternas.map((pagina) => (
                    <option key={pagina.value} value={pagina.value}>
                      {pagina.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="link_principal"
                  value={form.link_principal || ""}
                  onChange={alterarCampo}
                  placeholder="https://..."
                />
              )}
            </div>

            <h3>Botão secundário</h3>

            <div>
              <label>Texto do botão</label>
              <input
                name="botao_secundario"
                value={form.botao_secundario || ""}
                onChange={alterarCampo}
                placeholder="Ex.: Saiba mais"
              />
            </div>

            <div>
              <label>Tipo de link secundário</label>
              <select
                name="tipo_link_secundario"
                value={form.tipo_link_secundario || "interno"}
                onChange={alterarCampo}
              >
                <option value="interno">Página do portal</option>
                <option value="externo">Site externo</option>
              </select>
            </div>

            <div>
              <label>
                {form.tipo_link_secundario === "interno"
                  ? "Página de destino"
                  : "URL externa"}
              </label>

              {form.tipo_link_secundario === "interno" ? (
                <select
                  name="link_secundario"
                  value={form.link_secundario || ""}
                  onChange={alterarCampo}
                >
                  <option value="">Selecione uma página...</option>
                  {paginasInternas.map((pagina) => (
                    <option key={pagina.value} value={pagina.value}>
                      {pagina.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="link_secundario"
                  value={form.link_secundario || ""}
                  onChange={alterarCampo}
                  placeholder="https://..."
                />
              )}
            </div>

          </>
        )}

        {form.tipo === "slide" && (
          <div>
            <label>Ordem de exibição</label>
            <input
              type="number"
              name="ordem"
              value={form.ordem}
              onChange={alterarCampo}
            />
          </div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              name="ativo"
              checked={Boolean(form.ativo)}
              onChange={alterarCampo}
            />
            Banner ativo
          </label>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit">
            {editando ? "Salvar alterações" : "Cadastrar banner"}
          </button>

          {editando && (
            <button
              type="button"
              onClick={novoBanner}
              style={{ marginLeft: "8px" }}
            >
              Cancelar edição
            </button>
          )}

          {!editando && (
            <button
              type="button"
              onClick={novoBanner}
              style={{ marginLeft: "8px" }}
            >
              Limpar formulário
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "24px 0" }} />

      <h3>Banners cadastrados</h3>

      {carregando && <p>Carregando banners...</p>}

      {!carregando && banners.length === 0 && (
        <p>Nenhum banner cadastrado.</p>
      )}
<div className="admin-banners-lista">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="admin-banners-card"
        >
          <strong>{banner.titulo}</strong>

          <p>
            Tipo: {banner.tipo} | Página: {banner.pagina}
          </p>

          <p>
            Ordem: {banner.ordem} |{" "}
            {banner.ativo ? "Ativo" : "Inativo"}
          </p>

         
        <div className="admin-banners-acoes">
          <button
            type="button"
            className="btn-editar"
            onClick={() => editarBanner(banner)}
          >
            Editar
          </button>

          <button
            type="button"
            className="btn-excluir"
            onClick={() => excluirBanner(banner.id)}
          >
            Excluir
          </button>
        </div>

        </div>
      ))}
    </div>
      
    </div>
  );
}

export default Admin_banners;
