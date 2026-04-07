import { useState } from "react";
import logo from "../assets/logo2-.png";

function Menu({ setPage }) {
  const [open, setOpen] = useState(null);

  const toggleMenu = (name) => {
    setOpen(open === name ? null : name);
  };

  const go = (page) => {
    setPage(page);
    setOpen(null);
  };

  return (
    <div className="menu" id="menu">

      {/* LOGO */}
     <div className="menu-logo" onClick={() => go("home")}>
      <img src={logo} alt="logo" />
      <span className="logo-text">
        Plataforma 
        Climático
      </span>
    </div>

      {/* ITENS */}
      <div className="menu-items">

        {/* HOME */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("home")}
          onClick={() => toggleMenu("home")}
        >
          <span onClick={() => go("home")}>HOME</span>
        </div>

        {/* ADAPTAÇÃO */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("adaptacao")}
          onClick={() => toggleMenu("adaptacao")}
        >
          <span onClick={() => go("adaptacao")}>ADAPTAÇÃO</span>

          {open === "adaptacao" && (
            <div className="submenu">
              <div onClick={() => go("seguimento_nap")}>
                Seguimento do NAP
              </div>
              <div onClick={() => go("mapas_climatologia")}>
                Mapas de Climatologia
              </div>
              <div onClick={() => go("mapas_riscos")}>
                Mapas de risco climático
              </div>
            </div>
          )}
        </div>

        {/* MITIGAÇÃO */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("mitigacao")}
          onClick={() => toggleMenu("mitigacao")}
        >
          <span onClick={() => go("mitigacao")}>MITIGAÇÃO</span>
        </div>

        {/* ENGAJAMENTO */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("engajamento")}
          onClick={() => toggleMenu("engajamento")}
        >
          <span onClick={() => go("engajamento")}>ENGAJAMENTO</span>

          {open === "engajamento" && (
            <div className="submenu">
              <div onClick={() => go("form_submissao")}>
                Submissões de Ações Climáticas
              </div>
            </div>
          )}
        </div>

        {/* BIBLIOTECA */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("biblioteca")}
          onClick={() => toggleMenu("biblioteca")}
        >
          <span onClick={() => go("biblioteca")}>BIBLIOTECA</span>
        </div>

        {/* CONTATO */}
        <div
          className="menu-item"
          onMouseEnter={() => setOpen("contato")}
          onClick={() => toggleMenu("contato")}
        >
          <span onClick={() => go("contato")}>CONTATO</span>
        </div>

      </div>

      {/* BOTÃO ENTRAR */}
      <div className="menu-login">
        <button onClick={() => alert("Login aqui")}>
          🔒 Entrar
        </button>
      </div>

    </div>
  );
}

export default Menu;