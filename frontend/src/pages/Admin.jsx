import "../App.css";
<<<<<<< HEAD
import "../styles/admin.css";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
=======
import { useState } from "react";
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

import Admin_cards from "./Admin_cards";
import Admin_usuarios from "./Admin_usuarios";
import Admin_biblioteca from "./Admin_biblioteca";
import Admin_mapas from "./Admin_mapas";

import Admin_metadados from "./Admin_metadados";

import Admin_Submissoes from "./Admin_Submissoes";

import Admin_banners from "./Admin_banners";
import Admin_configuracoes from "./Admin_configuracoes";
<<<<<<< HEAD
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
=======

function Admin({ setPage }) {

  const [menu, setMenu] = useState("cards");

  function sair() {

    localStorage.removeItem(
      "logado"
    );

    setPage("home");

>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
  }

  return (

<<<<<<< HEAD
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
=======
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
            menu === "banners" ? "active" : ""
          }`}
          onClick={() => setMenu("banners")}
        >
          Banners e Heros
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
            menu === "mapas"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("mapas")
          }
        >
          Mapas Climáticos
        </div>

        <div
            className={`admin-menu-item ${
                menu === "metadados"
                    ? "active"
                    : ""
            }`}
            onClick={() =>
                setMenu("metadados")
            }
        >
            Metadados dos Mapas
        </div>

        <div
          className={`admin-menu-item ${
            menu === "submissoes"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenu("submissoes")
          }
        >
          Submissões Climáticas
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
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
          className="btn-sair"
          onClick={sair}
        >
          Sair
        </button>

<<<<<<< HEAD
      </aside>
=======
      </div>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

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

<<<<<<< HEAD
        {menu === "mensagens" && (
          <Admin_mensagens />
        )}

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
        {menu === "configuracoes" && <Admin_configuracoes />}

      </div>

<<<<<<< HEAD
    </main>
=======
    </div>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

  );

}

export default Admin;