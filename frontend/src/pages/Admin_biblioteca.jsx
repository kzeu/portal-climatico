import { useEffect, useState } from "react";
import API_URL from "../config";
import "../App.css";

function Admin_biblioteca() {

  const [dados, setDados] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    tipo: "Relatório Nacional para a UNFCCC",
    data: "",
    link: "",
    pagina: "",
    ordem: 0
  });

  const [editando, setEditando] = useState(null);

  const [arquivo, setArquivo] = useState(null);


  async function carregarBiblioteca() {
    try {
      const response = await fetch(
        `${API_URL}/biblioteca`
      );

      const resultado = await response.json();

      setDados(resultado);

    } catch (erro) {
      console.error(erro);
    }
  }

useEffect(() => {
  async function carregar() {
    try {
      const response = await fetch(`${API_URL}/biblioteca`);
      const resultado = await response.json();
      setDados(resultado);
    } catch (erro) {
      console.error(erro);
    }
  }

  carregar();
}, []);



  function alterarCampo(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }


  async function salvar(e) {

    e.preventDefault();

    try {

        const url = editando
            ? `${API_URL}/biblioteca/${editando}`
            : `${API_URL}/biblioteca`;

        const metodo = editando
            ? "PUT"
            : "POST";

        const formData = new FormData();

        formData.append("titulo", form.titulo);
        formData.append("tipo", form.tipo);
        formData.append("data", form.data);
        formData.append("link", form.link);
        formData.append("pagina", form.pagina);
        formData.append("ordem", form.ordem);

        if (arquivo) {

            formData.append("arquivo", arquivo);

        }

        const response = await fetch(url, {

            method: metodo,

            body: formData

        });

        const resultado = await response.json();

        if (!response.ok) {

            alert(resultado.erro || "Erro ao salvar");

            return;

        }

        alert(

            editando
                ? "Documento atualizado!"
                : "Documento cadastrado!"

        );

        limparFormulario();

        carregarBiblioteca();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao salvar");

    }

}


  function editar(item) {

    setEditando(item.id);

    setForm({
      titulo: item.titulo || "",
      tipo: item.tipo || "",
      data: item.data || "",
      link: item.link || "",
      pagina: item.pagina || "",
      ordem: item.ordem || 0
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  async function excluir(id) {

    const confirmar = window.confirm(
      "Deseja realmente excluir este documento?"
    );

    if (!confirmar) return;

    try {

      await fetch(
        `${API_URL}/biblioteca/${id}`,
        {
          method: "DELETE"
        }
      );

      carregarBiblioteca();

    } catch (erro) {
      console.error(erro);
    }
  }


  function limparFormulario() {

    setEditando(null);

    // Limpa o arquivo selecionado
    setArquivo(null);

    setForm({
        titulo: "",
        tipo: "Relatório Nacional para a UNFCCC",
        data: "",
        link: "",
        pagina: "",
        ordem: 0
    });

}


  


  return (

    <div className="admin-card">

      <h1>Biblioteca</h1>

      <p>
        Gerenciamento dos documentos da biblioteca climática.
      </p>


    <form onSubmit={salvar}>

    <div className="form-grid">

        <div className="campo campo-2">

            <label>Título</label>

            <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={alterarCampo}
                required
            />

        </div>

        <div className="campo">

            <label>Tipo</label>

            <select
                name="tipo"
                value={form.tipo}
                onChange={alterarCampo}
            >
                <option value="Relatório Nacional para a UNFCCC">
                    Relatório Nacional para a UNFCCC
                </option>

                <option value="Mapa estático">
                    Mapa estático
                </option>

                <option value="Estudo">
                    Estudo
                </option>

                <option value="Publicação">
                    Publicação
                </option>

            </select>

        </div>

        <div className="campo">

            <label>Data</label>

            <input
                type="text"
                name="data"
                value={form.data}
                onChange={alterarCampo}
                placeholder="Ex: 17 Nov 2025"
            />

        </div>

        <div className="campo">

            <label>Ordem</label>

            <input
                type="number"
                name="ordem"
                value={form.ordem}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo campo-2">

            <label>Link Externo</label>

            <input
                type="url"
                name="link"
                value={form.link}
                onChange={alterarCampo}
                placeholder="https://..."
            />

        </div>

            <div className="campo campo-2">

              <label>Página Interna</label>

              <input
                  type="text"
                  name="pagina"
                  value={form.pagina}
                  onChange={alterarCampo}
                  placeholder="Ex.: mapas_climatologia"
              />

          </div>

          <div className="campo campo-2">

              <label>Arquivo</label>

              <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                  onChange={(e)=>setArquivo(e.target.files[0])}
              />

          </div>

        <div
            className="campo campo-2"
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                flexDirection: "row"
            }}
        >

            <button type="submit">

                {editando
                    ? "Salvar Alterações"
                    : "Cadastrar Documento"}

            </button>

            {editando && (

                <button
                    type="button"
                    onClick={limparFormulario}
                >

                    Cancelar

                </button>

            )}

        </div>

    </div>

</form>


      <hr />


      <h2>Documentos cadastrados</h2>

      <table className="tabela-biblioteca">

        <thead>
          <tr>
            <th>#</th>
            <th>Documento</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {dados.map((item, index) => (

            <tr key={item.id}>

              <td>{index + 1}</td>

              <td>
                {item.titulo}
              </td>

              <td>
                {item.tipo}
              </td>

              <td>
                {item.data}
              </td>

          <td>

                <div className="acoes-card">

                    <button
                        className="btn-editar"
                        type="button"
                        onClick={() => editar(item)}
                    >
                        ✏️ Editar
                    </button>

                    <button
                        className="btn-excluir"
                        type="button"
                        onClick={() => excluir(item.id)}
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Admin_biblioteca;