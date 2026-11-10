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
