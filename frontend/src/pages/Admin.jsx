import "../App.css";
import { useState } from "react";

import Admin_cards from "./Admin_cards";
import Admin_usuarios from "./Admin_usuarios";
import Admin_biblioteca from "./Admin_biblioteca";
import Admin_mapas from "./Admin_mapas";

import Admin_metadados from "./Admin_metadados";

import Admin_Submissoes from "./Admin_Submissoes";

import Admin_banners from "./Admin_banners";
import Admin_configuracoes from "./Admin_configuracoes";

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

        {menu === "configuracoes" && <Admin_configuracoes />}

      </div>

    </div>

  );

}

export default Admin;