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

        <span onClick={() => go("mitigacao")}>
          MITIGAÇÃO
        </span>

        {open === "mitigacao" && (
          <div className="submenu">

           

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

        <span onClick={() => go("biblioteca")}>
          BIBLIOTECA
        </span>

        {open === "biblioteca" && (
          <div className="submenu">

            

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

           

          </div>
        )}

      </div>

    </div>
  );
}

export default Menu;