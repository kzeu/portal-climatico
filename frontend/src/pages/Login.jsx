import { useState } from "react";
import "../App.css";
import API_URL from "../config";

function Login({ setPage }) {

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function entrar() {

    const resposta = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          senha
        })
      }
    );

    const dados = await resposta.json();

        if (dados.sucesso) {

        localStorage.setItem(
          "logado",
          "sim"
        );

        setPage("admin");

      }

  }

  return (

    <div className="login-page">

      <div className="login-box">

        <h2>Entrar</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <button onClick={entrar}>
          Entrar
        </button>

      </div>

    </div>

  );

}

export default Login;