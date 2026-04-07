import { useState, useEffect } from "react";


import Menu from "./components/Menu";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Adaptacao from "./pages/Adaptacao";
import Mitigacao from "./pages/Mitigacao";
import Biblioteca from "./pages/Biblioteca";
import Engajamento from "./pages/Engajamento";
import Contato from "./pages/Contato";
import Seguimento_Nap from "./pages/Seguimento_nap";
import Mapas_climatologia from "./pages/Mapas_climatologia";
import Mapas_riscos from "./pages/Mapas_riscos";
import Form_submissao_climatica from "./pages/Form_submissao_climatica"

import "./App.css";

function App() {

  const [page, setPage] = useState("home");


  //AJUSTAR ALTURA AUTOMATICAMENTE

useEffect(() => {



}, [page]);


  let Content;

  if (page === "adaptacao") Content = <Adaptacao setPage={setPage} />;
else if (page === "mitigacao") Content = <Mitigacao setPage={setPage} />;
else if (page === "biblioteca") Content = <Biblioteca setPage={setPage} />;
else if (page === "engajamento") Content = <Engajamento setPage={setPage} />;
else if (page === "contato") Content = <Contato setPage={setPage} />;
else if (page === "seguimento_nap") Content = <Seguimento_Nap setPage={setPage} />;
else if (page === "mapas_climatologia") Content = <Mapas_climatologia setPage={setPage} />;
else if (page === "mapas_riscos") Content = <Mapas_riscos setPage={setPage} />;
else if (page === "form_submissao") Content = <Form_submissao_climatica setPage={setPage} />;
else Content = <Home setPage={setPage} />;


  return (
    <div>

      

      <Menu setPage={setPage} />

      {Content}

      <Footer />

    </div>
  );

}

export default App;