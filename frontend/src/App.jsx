<<<<<<< HEAD
import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import { documentTitle } from "./navigation";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Adaptacao = lazy(() => import("./pages/Adaptacao"));
const Mitigacao = lazy(() => import("./pages/Mitigacao"));
const Biblioteca = lazy(() => import("./pages/Biblioteca"));
const Engajamento = lazy(() => import("./pages/Engajamento"));
const Contato = lazy(() => import("./pages/Contato"));
const SeguimentoNap = lazy(() => import("./pages/Seguimento_nap"));
const MapasClimatologia = lazy(() => import("./pages/Mapas_climatologia"));
const MapasRiscos = lazy(() => import("./pages/Mapas_riscos"));
const FormSubmissao = lazy(() => import("./pages/Form_submissao_climatica"));
const PaginaDetalhe = lazy(() => import("./pages/Pagina_detalhe"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const NaoEncontrada = lazy(() => import("./pages/NaoEncontrada"));

function ScrollAndTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = documentTitle(location.pathname);
    const raiz = document.documentElement;
    const anterior = raiz.style.scrollBehavior;
    raiz.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    raiz.style.scrollBehavior = anterior;
    const heading = document.querySelector("h1");
    if (heading) heading.focus();
  }, [location.pathname]);

  return null;
}

function PageFallback() {
  return (
    <main className="content page-shell" id="conteudo" aria-busy="true">
      <div className="ui-skeleton hero-page" aria-hidden="true" />
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Menu />
      <ScrollAndTitle />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adaptacao" element={<Adaptacao />} />
          <Route path="/mitigacao" element={<Mitigacao />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/engajamento" element={<Engajamento />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/seguimento-nap" element={<SeguimentoNap />} />
          <Route path="/mapas" element={<Navigate to="/mapas/climatologia" replace />} />
          <Route path="/mapas/climatologia" element={<MapasClimatologia />} />
          <Route path="/mapas/riscos" element={<MapasRiscos />} />
          <Route path="/submissao" element={<FormSubmissao />} />
          <Route path="/pagina/:cardId" element={<PaginaDetalhe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin_cards" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
=======
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
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
