import "../App.css";
import "../styles/admin.css";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Admin_cards from "./Admin_cards";
import Admin_usuarios from "./Admin_usuarios";
import Admin_biblioteca from "./Admin_biblioteca";
import Admin_mapas from "./Admin_mapas";

import Admin_metadados from "./Admin_metadados";

import Admin_Submissoes from "./Admin_Submissoes";

import Admin_banners from "./Admin_banners";
import Admin_configuracoes from "./Admin_configuracoes";
import Admin_mensagens from "./Admin_mensagens";

const SECOES_ADMIN = [
  { id: "cards", label: "Cards" },
  { id: "banners", label: "Banners e Heros" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "mapas", label: "Mapas Climáticos" },
  { id: "metadados", label: "Metadados dos Mapas" },
  { id: "submissoes", label: "Submissões Climáticas" },
  { id: "usuarios", label: "Usuários" },
  { id: "mensagens", label: "Mensagens" },
  { id: "configuracoes", label: "Configurações" }
];

function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("cards");

  if (localStorage.getItem("logado") !== "sim") {
    return <Navigate to="/login" replace />;
  }

  function sair() {
    localStorage.removeItem("logado");
    navigate("/");
  }

  return (

    <main className="admin-layout" id="conteudo" tabIndex={-1}>

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <h1 className="admin-sidebar-title" tabIndex={-1}>
          Painel Admin
        </h1>

        <nav aria-label="Secções do painel">
          <ul className="admin-nav">
            {SECOES_ADMIN.map((secao) => (
              <li key={secao.id}>
                <button
                  type="button"
                  className={`admin-menu-item ${menu === secao.id ? "active" : ""}`}
                  aria-current={menu === secao.id ? "page" : undefined}
                  onClick={() => setMenu(secao.id)}
                >
                  {secao.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="btn-sair"
          onClick={sair}
        >
          Sair
        </button>

      </aside>

      {/* CONTEÚDO */}

      <div className="admin-page">

        {menu === "cards" && (

          <Admin_cards />

        )}

        
        {menu === "banners" && (
          <Admin_banners />
        )}


        {menu === "biblioteca" && (

          <Admin_biblioteca />

        )}

        {menu=== "mapas" && (
        <Admin_mapas />
         )}

         {menu === "metadados" && (
            <Admin_metadados />
        )}

        {menu === "submissoes" && (
          <Admin_Submissoes />
        )}

        {menu === "usuarios" && (

          <Admin_usuarios />

        )}

        {menu === "mensagens" && (
          <Admin_mensagens />
        )}

        {menu === "configuracoes" && <Admin_configuracoes />}

      </div>

    </main>

  );

}

export default Admin;