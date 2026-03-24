import { useState, useEffect } from "react";

import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Adaptacao from "./pages/Adaptacao";
import Mitigacao from "./pages/Mitigacao";
import Biblioteca from "./pages/Biblioteca";
import Engajamento from "./pages/Engajamento";
import Contato from "./pages/Contato";

import "./App.css";

function App() {

  const [page, setPage] = useState("home");


  //AJUSTAR ALTURA AUTOMATICAMENTE

  useEffect(() => {

    function ajustarAltura() {

      const header = document.getElementById("header");
      const menu = document.getElementById("menu");
      const content = document.getElementById("content");

      if (header && menu && content) {

        const h = header.offsetHeight;
        const m = menu.offsetHeight;

        content.style.paddingTop = (h + m + 10) + "px";

      }

    }

    ajustarAltura();

    window.addEventListener("resize", ajustarAltura);

    return () => window.removeEventListener("resize", ajustarAltura);

  }, [page]);


  let Content;

  if (page === "adaptacao") Content = <Adaptacao />;
  else if (page === "mitigacao") Content = <Mitigacao />;
  else if (page === "biblioteca") Content = <Biblioteca />;
  else if (page === "engajamento") Content = <Engajamento />;
  else if (page === "contato") Content = <Contato />;
  else Content = <Home />;


  return (
    <div>

      <Header />

      <Menu setPage={setPage} />

      {Content}

      <Footer />

    </div>
  );

}

export default App;