import { useState } from "react";
import brasao from "../assets/brasao.svg.png";

function Header() {

  const [search, setSearch] = useState("");

  return (
    <div className="header"id ="header">


      {/* BARRA SUPERIOR */}

       <div className="super-bar">
        <div className="super-bar-inner">
          PORTAL CLIMÁTICO
        </div>
      </div>

  

      <div className="header-top">


        {/* LEFT */}

        <div className="header-left">

          <img src={brasao} className="logo-img" />

          <div className="titles">

            <div className="country">
              República da Guiné-Bissau
            </div>

            <div>
              Ministério do Ambiente e Ação Climática
            </div>

            <div>
              Instituto Nacional do Ambiente
            </div>

          </div>

        </div>



        {/* RIGHT */}

        <div className="header-right">


          <div className="search-box">

            <input
              className="search-input"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

           <span className="search-icon">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>

          </span>

          </div>


          <select className="lang">
            <option>PT</option>
            <option>EN</option>
          </select>



        </div>


      </div>

    </div>
  );
}

export default Header;