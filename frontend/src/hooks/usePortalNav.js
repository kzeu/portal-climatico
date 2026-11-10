import { useLocation, useNavigate } from "react-router-dom";
import { pathForPage } from "../navigation";

export function usePortalNav() {
  const navigate = useNavigate();
  const location = useLocation();

  function go(page) {
    if (!page) return;
    const destino = pathForPage(page);
    if (/^https?:\/\//i.test(destino)) {
      window.open(destino, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(destino);
  }

  function goDetail(id, from) {
    if (!id) return;
    const origem = from || location.pathname;
    navigate(`/pagina/${id}?de=${encodeURIComponent(origem)}`, {
      state: { from: origem }
    });
  }

  function openExternal(url) {
    if (!url) return;
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return { go, goDetail, openExternal, navigate, location };
}
