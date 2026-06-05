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
import Form_submissao_climatica from "./pages/Form_submissao_climatica";
import Admin_cards from "./pages/Admin_cards";
import Pagina_detalhe from "./pages/Pagina_detalhe";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

import "./App.css";

function App() {

  // ALTERE PARA "home" QUANDO TERMINAR OS TESTES
  const [page, setPage] = useState("home");

  const [cardSelecionado, setCardSelecionado] = useState(null);

  const [paginaAnterior, setPaginaAnterior] = useState("home");

  useEffect(() => {

  }, [page]);

  let Content;

  if (page === "adaptacao")

  Content = (

    <Adaptacao

      setPage={setPage}

      setCardSelecionado={
        setCardSelecionado
      }

      setPaginaAnterior={
        setPaginaAnterior
      }

    />

  );

else if (page === "mitigacao") {

  Content = (

    <Mitigacao

      setPage={setPage}

      setCardSelecionado={
        setCardSelecionado
      }

      setPaginaAnterior={
        setPaginaAnterior
      }

    />

  );

}

  else if (page === "biblioteca") {

    Content = (
      <Biblioteca
        setPage={setPage}
      />
    );

  }

  else if (page === "engajamento") {

    Content = (
      <Engajamento
        setPage={setPage}
      />
    );

  }

  else if (page === "contato") {

    Content = (
      <Contato
        setPage={setPage}
      />
    );

  }

  else if (page === "seguimento_nap") {

    Content = (
      <Seguimento_Nap
        setPage={setPage}
      />
    );

  }

  else if (page === "mapas_climatologia") {

    Content = (
      <Mapas_climatologia
        setPage={setPage}
      />
    );

  }

  else if (page === "mapas_riscos") {

    Content = (
      <Mapas_riscos
        setPage={setPage}
      />
    );

  }

  else if (page === "form_submissao") {

    Content = (
      <Form_submissao_climatica
        setPage={setPage}
      />
    );

  }

  else if (page === "pagina_detalhe") {

    Content = (

      <Pagina_detalhe

        cardId={cardSelecionado}

        setPage={setPage}

        paginaAnterior={paginaAnterior}

      />

    );

  }

  else if (page === "admin_cards") {

    Content = (
      <Admin_cards
        setPage={setPage}
      />
    );

  }

   else if (page === "admin") {

    Content = (
      <Admin
        setPage={setPage}
      />
    );

  }

  else if (page === "login") {

  Content = (

    <Login
      setPage={setPage}
    />

  );

}

  else {

    Content = (

      <Home

        setPage={setPage}

        setCardSelecionado={setCardSelecionado}

        setPaginaAnterior={setPaginaAnterior}

      />

    );

  }

  return (

    <div>

      <Menu
        setPage={setPage}
      />

      {Content}

      <Footer />

    </div>

  );

}

export default App;