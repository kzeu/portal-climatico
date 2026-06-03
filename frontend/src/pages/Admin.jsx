import "../App.css";
import { useState } from "react";

import Admin_cards from "./Admin_cards";
import Admin_usuarios from "./Admin_usuarios";
import Admin_biblioteca from "./Admin_biblioteca";

function Admin() {

  const [menu, setMenu] = useState("cards");

  return (

    <div className="admin-layout">

      <div className="admin-sidebar">

        <h2>Painel Admin</h2>

        <div
          className="admin-menu-item"
          onClick={() => setMenu("cards")}
        >
          Cards
        </div>

        <div
          className="admin-menu-item"
          onClick={() => setMenu("biblioteca")}
        >
          Biblioteca
        </div>

        <div
          className="admin-menu-item"
          onClick={() => setMenu("usuarios")}
        >
          Usuários
        </div>

      </div>

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

      </div>

    </div>

  );

}

export default Admin;