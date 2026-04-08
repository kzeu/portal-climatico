import { useState } from "react";
import logo from "../assets/logo2-.png";

function Menu({ setPage }) {
  const [menuMobile, setMenuMobile] = useState(false);
  const [open, setOpen] = useState(null);

  const toggleMenu = (name) => {
    setOpen(open === name ? null : name);
  };

  const go = (page) => {
    setPage(page);
    setOpen(null);
    setMenuMobile(false); // 👈 fecha menu no mobile
  };

  return (
    <div className="menu" id="menu">

      <div className="menu-inner">

        {/* LOGO */}
        <div className="menu-logo" onClick={() => go("home")}>
          <img src={logo} alt="logo" />
          <span className="logo-text">
            Portal<br />Climático
          </span>
        </div>

        {/* BOTÃO MOBILE */}
        <div
          className="menu-toggle"
          onClick={() => setMenuMobile(!menuMobile)}
        >
          ☰
        </div>

        {/* ITENS */}
        <div className={`menu-items ${menuMobile ? "active" : ""}`}>

          {/* HOME */}
          <div className="menu-item">
            <span onClick={() => go("home")}>HOME</span>
          </div>

          {/* ADAPTAÇÃO */}
          <div className="menu-item">
            <span onClick={() => toggleMenu("adaptacao")}>
              ADAPTAÇÃO
              <span className={`arrow ${open === "adaptacao" ? "open" : ""}`}>
                ▾
              </span>
            </span>

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
          <div className="menu-item">
            <span onClick={() => go("mitigacao")}>MITIGAÇÃO</span>
          </div>

          {/* ENGAJAMENTO */}
          <div className="menu-item">
            <span onClick={() => toggleMenu("engajamento")}>
              ENGAJAMENTO
              <span className={`arrow ${open === "engajamento" ? "open" : ""}`}>
                ▾
              </span>
            </span>

            {open === "engajamento" && (
              <div className="submenu">
                <div onClick={() => go("form_submissao")}>
                  Submissões de Ações Climáticas
                </div>
              </div>
            )}
          </div>

          {/* BIBLIOTECA */}
          <div className="menu-item">
            <span onClick={() => go("biblioteca")}>BIBLIOTECA</span>
          </div>

          {/* CONTATO */}
          <div className="menu-item">
            <span onClick={() => go("contato")}>CONTATO</span>
          </div>

          {/* LOGIN MOBILE */}
          <div className="menu-login mobile">
            <button onClick={() => alert("Login aqui")}>
              🔒 ENTRAR
            </button>
          </div>

        </div>

        {/* LOGIN DESKTOP */}
        <div className="menu-login desktop">
          <button onClick={() => alert("Login aqui")}>
            🔒 ENTRAR
          </button>
        </div>

      </div>

    </div>
  );
}

export default Menu;