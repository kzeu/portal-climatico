const API_URL = import.meta.env.DEV
  ? `http://${window.location.hostname}:3000`
  : "";

<<<<<<< HEAD
const FICHEIROS = {
  "/clima/mapas-filtros": "/dados/mapas-filtros.json",
  "/biblioteca": "/dados/biblioteca.json",
  "/configuracoes/rodape": "/dados/rodape.json",
  "/banners-herois": "/dados/banners-herois.json"
};

// Em produção os dados públicos vêm de ficheiros estáticos, publicados com o site.
export function urlApi(caminho) {
  if (import.meta.env.DEV) return `${API_URL}${caminho}`;
  if (caminho.startsWith("/uploads/")) return caminho;
  if (caminho.startsWith("/clima/classificacoes/")) {
    const codigo = caminho.split("/").pop();
    return `/dados/classificacoes/${encodeURIComponent(codigo)}.json`;
  }
  if (FICHEIROS[caminho]) return FICHEIROS[caminho];
  if (caminho.startsWith("/cards/") || caminho.startsWith("/publicacoes/")) {
    return "/dados/vazio.json";
  }
  return caminho;
}

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
export default API_URL;