import "../App.css";
import { useState, useEffect } from "react";
import API_URL from "../config";

function Admin_usuarios() {

  const [usuarios, setUsuarios] = useState([]);

  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({

    nome: "",
    usuario: "",
    senha: "",
    perfil: "usuario"

  });

 async function carregarUsuarios() {

  const resposta = await fetch(
     `${API_URL}/usuarios`
  );

  const dados = await resposta.json();

  setUsuarios(dados);

}
  useEffect(() => {

    carregarUsuarios();

  }, []);

  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  }

  async function salvar(e) {

    e.preventDefault();

    if (editando) {

      await fetch(

        `${API_URL}/usuarios/${editando}`,

        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form)

        }

      );

    } else {

            await fetch(

          `${API_URL}/usuarios`,

          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(form)

          }

        );

    }

    limparFormulario();

    carregarUsuarios();

  }

  async function excluir(id) {

    const confirmar = window.confirm(
      "Deseja excluir este usuário?"
    );

    if (!confirmar) return;

    await fetch(

      `${API_URL}/usuarios/${id}`,

      {

        method: "DELETE"

      }

    );

    carregarUsuarios();

  }

  function limparFormulario() {

    setEditando(null);

    setForm({

      nome: "",
      usuario: "",
      senha: "",
      perfil: "usuario"

    });

  }

  return (

    <div className="admin-card">

      <div className="admin-header">

        <h2>
          Cadastro de Usuários
        </h2>

      </div>

      <form
        className="admin-form"
        onSubmit={salvar}
      >

        <div>

          <label>Nome</label>

          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Usuário</label>

          <input
            type="text"
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Senha</label>

          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Perfil</label>

          <select
            name="perfil"
            value={form.perfil}
            onChange={handleChange}
          >

            <option value="usuario">
              Usuário
            </option>

            <option value="admin">
              Administrador
            </option>

          </select>

        </div>

        <div className="full-width botoes-form">

          <button
            type="submit"
            className="btn-enviar"
          >

            {editando
              ? "Atualizar"
              : "Salvar"}

          </button>

          <button
            type="button"
            className="btn-enviar"
            onClick={limparFormulario}
          >

            Limpar

          </button>

        </div>

      </form>

      <table className="admin-table">

        <thead>

          <tr>

            <th>Nome</th>
            <th>Usuário</th>
            <th>Perfil</th>
            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          {usuarios.map((u) => (

            <tr key={u.id}>

              <td>{u.nome}</td>

              <td>{u.usuario}</td>

              <td>{u.perfil}</td>

              <td>

                <div className="acoes-card">

                  <button

                    className="btn-editar"

                    onClick={() => {

                      setEditando(u.id);

                      setForm({

                        nome: u.nome,
                        usuario: u.usuario,
                        senha: "",
                        perfil: u.perfil

                      });

                    }}

                  >

                    Editar

                  </button>

                  <button

                    className="btn-excluir"

                    onClick={() =>
                      excluir(u.id)
                    }

                  >

                    Excluir

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

export default Admin_usuarios;