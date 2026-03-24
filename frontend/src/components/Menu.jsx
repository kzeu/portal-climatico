import { useState } from "react";

function Menu({ setPage }) {

  const [open, setOpen] = useState(null);

  const toggleMenu = (name) => {
    if (open === name) {
      setOpen(null);
    } else {
      setOpen(name);
    }
  };

  const go = (page) => {
    setPage(page);
    setOpen(null);
  };

  return (

    <div className="menu" id="menu">

      {/* HOME */}

      <div
        className="menu-item"
        onMouseEnter={() => setOpen("home")}
        onClick={() => toggleMenu("home")}
      >

        <span onClick={() => go("home")}>
          HOME
        </span>

        {open === "home" && (
          <div className="submenu">

            <div onClick={() => go("home")}>
              Introdução
            </div>

            <div onClick={() => go("home")}>
              Destaques
            </div>

          </div>
        )}

      </div>



      {/* ADAPTAÇÃO */}

      <div
        className="menu-item"
        onMouseEnter={() => setOpen("adaptacao")}
        onClick={() => toggleMenu("adaptacao")}
      >

        <span onClick={() => go("adaptacao")}>
          ADAPTAÇÃO
        </span>

        {open === "adaptacao" && (
          <div className="submenu">

            <div onClick={() => go("adaptacao")}>
              Plano Nacional
            </div>

            <div onClick={() => go("adaptacao")}>
              Projetos
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

        <span onClick={() => go("mitigacao")}>
          MITIGAÇÃO
        </span>

        {open === "mitigacao" && (
          <div className="submenu">

            <div onClick={() => go("mitigacao")}>
              Inventário
            </div>

            <div onClick={() => go("mitigacao")}>
              Políticas
            </div>

          </div>
        )}

      </div>



      {/* ENGAJAMENTO */}

      <div
        className="menu-item"
        onMouseEnter={() => setOpen("engajamento")}
        onClick={() => toggleMenu("engajamento")}
      >

        <span onClick={() => go("engajamento")}>
          ENGAJAMENTO
        </span>

        {open === "engajamento" && (
          <div className="submenu">

            <div onClick={() => go("engajamento")}>
              Eventos
            </div>

            <div onClick={() => go("engajamento")}>
              Participação
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

        <span onClick={() => go("biblioteca")}>
          BIBLIOTECA
        </span>

        {open === "biblioteca" && (
          <div className="submenu">

            <div onClick={() => go("biblioteca")}>
              Documentos
            </div>

            <div onClick={() => go("biblioteca")}>
              Relatórios
            </div>

          </div>
        )}

      </div>



      {/* CONTATO */}

      <div
        className="menu-item"
        onMouseEnter={() => setOpen("contato")}
        onClick={() => toggleMenu("contato")}
      >

        <span onClick={() => go("contato")}>
          CONTATO
        </span>

        {open === "contato" && (
          <div className="submenu">

            <div onClick={() => go("contato")}>
              Fale conosco
            </div>

            <div onClick={() => go("contato")}>
              Localização
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Menu;