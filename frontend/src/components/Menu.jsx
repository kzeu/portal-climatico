<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";
import Icon from "./Icon";

const SECOES = [
  { to: "/", label: "Início", end: true },
  {
    id: "adaptacao",
    to: "/adaptacao",
    label: "Adaptação",
    prefixos: ["/adaptacao", "/seguimento-nap"],
    filhos: [
      { to: "/seguimento-nap", label: "Seguimento do NAP" }
    ]
  },
  {
    id: "mapas",
    to: "/mapas/climatologia",
    label: "Mapas",
    prefixos: ["/mapas/"],
    filhos: [
      { to: "/mapas/climatologia", label: "Mapas de climatologia" },
      { to: "/mapas/riscos", label: "Mapas de risco climático" }
    ]
  },
  { to: "/mitigacao", label: "Mitigação" },
  {
    id: "engajamento",
    to: "/engajamento",
    label: "Engajamento",
    prefixos: ["/engajamento", "/submissao"],
    filhos: [{ to: "/submissao", label: "Submissões de ações climáticas" }]
  },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/contato", label: "Contato" }
];

function classeLink(ativo) {
  return ativo ? "menu-link is-active" : "menu-link";
}

function Menu() {
  const location = useLocation();
  const navRef = useRef(null);
  // Menus guardam a rota em que foram abertos: ao mudar de página fecham sozinhos.
  const [mobileAbertoEm, setMobileAbertoEm] = useState(null);
  const [dropdown, setDropdown] = useState({ id: null, em: null });
  const menuMobile = mobileAbertoEm === location.pathname;
  const dropdownAberto = dropdown.em === location.pathname ? dropdown.id : null;
  const logado = typeof window !== "undefined" && localStorage.getItem("logado") === "sim";

  function setMenuMobile(aberto) {
    setMobileAbertoEm(aberto ? location.pathname : null);
  }

  function setDropdownAberto(id) {
    setDropdown({ id, em: id ? location.pathname : null });
  }

  function fechar() {
    setMenuMobile(false);
    setDropdownAberto(null);
  }

  function toggleDropdown(nome) {
    setDropdownAberto(dropdownAberto === nome ? null : nome);
  }

  useEffect(() => {
    document.body.classList.toggle("menu-aberto", menuMobile);
    return () => document.body.classList.remove("menu-aberto");
  }, [menuMobile]);

  useEffect(() => {
    if (!menuMobile && !dropdownAberto) return undefined;

    function onKeyDown(e) {
      if (e.key !== "Escape") return;
      if (dropdownAberto) {
        const botao = navRef.current?.querySelector(`[aria-controls="submenu-${dropdownAberto}"]`);
        setDropdown({ id: null, em: null });
        botao?.focus();
        return;
      }
      setMobileAbertoEm(null);
      document.querySelector(".menu-toggle")?.focus();
    }

    function onPointerDown(e) {
      if (!navRef.current?.contains(e.target)) setDropdown({ id: null, em: null });
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuMobile, dropdownAberto]);

  const destinoLogin = logado ? "/admin" : "/login";
  const textoLogin = logado ? "Admin" : "Entrar";

  return (
    <header className="menu" id="menu">
      <a className="skip-link" href="#conteudo">Saltar para o conteúdo</a>
      <div className="menu-inner container">
        <NavLink to="/" className="menu-logo" aria-label="Portal Climático da Guiné-Bissau — início" onClick={fechar}>
          <img src={logo} alt="" width="480" height="320" />
        </NavLink>

        <nav
          id="menu-items"
          ref={navRef}
          className={`menu-items ${menuMobile ? "active" : ""}`}
          aria-label="Principal"
        >
          <ul className="menu-list">
            {SECOES.map((secao) => {
              if (!secao.filhos) {
                return (
                  <li className="menu-item" key={secao.to}>
                    <NavLink
                      to={secao.to}
                      end={secao.end}
                      className={({ isActive }) => classeLink(isActive)}
                      onClick={fechar}
                    >
                      {secao.label}
                    </NavLink>
                  </li>
                );
              }

              const aberto = dropdownAberto === secao.id;
              const atual = secao.prefixos.some((prefixo) => location.pathname.startsWith(prefixo));

              return (
                <li
                  key={secao.to}
                  className={`menu-item menu-dropdown ${aberto ? "open" : ""} ${atual ? "is-current" : ""}`}
                >
                  <div className="menu-row">
                    <NavLink
                      to={secao.to}
                      className={({ isActive }) => classeLink(isActive || atual)}
                      onClick={fechar}
                    >
                      {secao.label}
                    </NavLink>
                    <button
                      type="button"
                      className="arrow-btn"
                      aria-expanded={aberto}
                      aria-controls={`submenu-${secao.id}`}
                      onClick={() => toggleDropdown(secao.id)}
                    >
                      <span className="visually-hidden">Páginas de {secao.label}</span>
                      <Icon name="chevronDown" />
                    </button>
                  </div>
                  <ul className="submenu" id={`submenu-${secao.id}`}>
                    {secao.filhos.map((filho) => (
                      <li key={filho.to}>
                        <NavLink to={filho.to} onClick={fechar}>
                          {filho.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div className="menu-login mobile">
            <NavLink to={destinoLogin} className="btn-entrar" onClick={fechar}>
              {textoLogin}
            </NavLink>
          </div>
        </nav>

        <div className="menu-login desktop">
          <NavLink to={destinoLogin} className="btn-entrar" onClick={fechar}>
            {textoLogin}
          </NavLink>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuMobile}
          aria-controls="menu-items"
          onClick={() => setMenuMobile(!menuMobile)}
        >
          <span className="visually-hidden">{menuMobile ? "Fechar menu" : "Abrir menu"}</span>
          <Icon name={menuMobile ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

export default Menu;
=======
import { useState } from "react";
import logo from "../assets/logo2-.png";

function Menu({ setPage }) {

  const [menuMobile, setMenuMobile] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  

  const go = (page) => {

  setPage(page);

  setMenuMobile(false);

};

  const abrirAdmin = () => {

    const logado =
      localStorage.getItem("logado");

    if (logado === "sim") {

      go("admin");

    } else {

      go("login");

    }

  };

  return (

    <div className="menu" id="menu">

      <div className="menu-inner">

        {/* LOGO */}

        <div
          className="menu-logo"
          onClick={() => go("home")}
        >

          <img src={logo} alt="logo" />

         

        </div>

        {/* BOTÃO MOBILE */}

        <div
          className="menu-toggle"
          onClick={() =>
            setMenuMobile(!menuMobile)
          }
        >

          ☰

        </div>

        {/* MENU */}

        <div
          className={`menu-items ${
            menuMobile
              ? "active"
              : ""
          }`}
        >

          {/* HOME */}

          <div className="menu-item">

            <span
              onClick={() =>
                go("home")
              }
            >

              HOME

            </span>

          </div>

          {/* ADAPTAÇÃO */}

        

            <div
              className={`menu-item menu-dropdown ${
                dropdownAberto === "adaptacao" ? "open" : ""
              }`}
            >

              <span
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setDropdownAberto(
                      dropdownAberto === "adaptacao"
                        ? null
                        : "adaptacao"
                    );
                  } else {
                    go("adaptacao");
                  }
                }}
              >
                ADAPTAÇÃO

                <span className="arrow">
                  ▾
                </span>
              </span>

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

            </div>

          {/* MITIGAÇÃO */}

          <div className="menu-item">

            <span
              onClick={() =>
                go("mitigacao")
              }
            >

              MITIGAÇÃO

            </span>

          </div>

        
          
                {/* ENGAJAMENTO */}

                <div
                  className={`menu-item menu-dropdown ${
                    dropdownAberto === "engajamento" ? "open" : ""
                  }`}
                >

                  <span
                    onClick={() => {
                      if (window.innerWidth <= 768) {
                        setDropdownAberto(
                          dropdownAberto === "engajamento"
                            ? null
                            : "engajamento"
                        );
                      } else {
                        go("engajamento");
                      }
                    }}
                  >
                    ENGAJAMENTO

                    <span className="arrow">
                      ▾
                    </span>
                  </span>

                  <div className="submenu">

                    <div onClick={() => go("form_submissao")}>
                      Submissões de Ações Climáticas
                    </div>

                  </div>

                </div>

          {/* BIBLIOTECA */}

          <div className="menu-item">

            <span
              onClick={() =>
                go("biblioteca")
              }
            >

              BIBLIOTECA

            </span>

          </div>

          {/* CONTATO */}

          <div className="menu-item">

            <span
              onClick={() =>
                go("contato")
              }
            >

              CONTATO

            </span>

          </div>

          {/* LOGIN MOBILE */}

          <div className="menu-login mobile">

            <button
              onClick={abrirAdmin}
            >

              {localStorage.getItem(
                "logado"
              ) === "sim"

                ? "🔒 ADMIN"

                : "🔒 ENTRAR"}

            </button>

          </div>

        </div>

        {/* LOGIN DESKTOP */}

        <div className="menu-login desktop">

          <button
            onClick={abrirAdmin}
          >

            {localStorage.getItem(
              "logado"
            ) === "sim"

              ? "🔒 ADMIN"

              : "🔒 ENTRAR"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default Menu;
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
