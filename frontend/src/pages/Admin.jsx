import "../App.css";
import { useState } from "react";

import Admin_cards from "./Admin_cards";
import Admin_usuarios from "./Admin_usuarios";
import Admin_biblioteca from "./Admin_biblioteca";

function Admin({ setPage }) {

  const [menu, setMenu] = useState("cards");

  function sair() {

    localStorage.removeItem(
      "logado"
    );

    setPage("home");

  }

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <h2>
          Painel Admin
        </h2>

        <div
          className={`admin-menu-item ${
            menu === "cards"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("cards")
          }
        >
          Cards
        </div>

        <div
          className={`admin-menu-item ${
            menu === "biblioteca"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("biblioteca")
          }
        >
          Biblioteca
        </div>

        <div
          className={`admin-menu-item ${
            menu === "usuarios"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("usuarios")
          }
        >
          Usuários
        </div>

         <div
          className={`admin-menu-item ${
            menu === "usuarios"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("usuarios")
          }
        >
          Contatos Recebidos
        </div>

        <div
          className={`admin-menu-item ${
            menu === "configuracoes"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("configuracoes")
          }
        >
          Configurações
        </div>

        <button
          className="btn-sair"
          onClick={sair}
        >
          Sair
        </button>

      </div>

      {/* CONTEÚDO */}

      <div className="admin-page">

        {menu === "cards" && (

          <Admin_cards />

        )}

        {menu === "biblioteca" && (

          <Admin_biblioteca />

        )}

        {menu === "usuarios" && (

          <Admin_usuarios />

        )}

        {menu === "configuracoes" && (

          <div>

            <h2>
              Configurações
            </h2>

            <p>
              Em desenvolvimento...
            </p>

          </div>

        )}

      </div>

    </div>

  );

}

export default Admin;