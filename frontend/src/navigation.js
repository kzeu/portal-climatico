export const PAGE_PATHS = {
  home: "/",
  adaptacao: "/adaptacao",
  mitigacao: "/mitigacao",
  biblioteca: "/biblioteca",
  engajamento: "/engajamento",
  contato: "/contato",
  seguimento_nap: "/seguimento-nap",
  mapas_climatologia: "/mapas/climatologia",
  mapas: "/mapas/climatologia",
  mapas_riscos: "/mapas/riscos",
  form_submissao: "/submissao",
  login: "/login",
  admin: "/admin",
  admin_cards: "/admin"
};

export const PAGE_LABELS = {
  "/": "Início",
  "/adaptacao": "Adaptação",
  "/mitigacao": "Mitigação",
  "/biblioteca": "Biblioteca",
  "/engajamento": "Engajamento",
  "/contato": "Contato",
  "/seguimento-nap": "Seguimento do NAP",
  "/mapas/climatologia": "Mapas de climatologia",
  "/mapas/riscos": "Mapas de risco",
  "/submissao": "Submissão climática",
  "/login": "Entrar",
  "/admin": "Painel admin"
};

export function pathForPage(page) {
  if (!page) return "/";
  const chave = String(page).trim();
  if (/^https?:\/\//i.test(chave)) return chave;
  if (chave.startsWith("/")) return chave;
  return PAGE_PATHS[chave] || `/${chave}`;
}

export function documentTitle(pathname) {
  if (pathname.startsWith("/pagina/")) {
    return "Publicação · Portal Climático da Guiné-Bissau";
  }
  if (pathname === "/") {
    return "Portal Climático da Guiné-Bissau";
  }
  const label = PAGE_LABELS[pathname];
  if (!label) {
    return "Página não encontrada · Portal Climático da Guiné-Bissau";
  }
  return `${label} · Portal Climático da Guiné-Bissau`;
}

export function labelForPath(pathname) {
  if (pathname.startsWith("/pagina/")) return "Publicação";
  return PAGE_LABELS[pathname] || "Início";
}

// Secção-mãe de cada subpágina, espelhando os submenus do cabeçalho.
const PAGE_PARENTS = {
  "/seguimento-nap": "/adaptacao",
  "/mapas/riscos": "/mapas/climatologia",
  "/submissao": "/engajamento"
};

const ORIGENS_PUBLICACAO = {
  "/": "home",
  "/adaptacao": "adaptacao",
  "/mitigacao": "mitigacao",
  "/engajamento": "engajamento",
  "/seguimento-nap": "seguimento_nap"
};

export function origemSegura(valor) {
  if (typeof valor !== "string" || !valor.startsWith("/") || valor.startsWith("//")) return "/";
  return PAGE_LABELS[valor] ? valor : "/";
}

export function secaoDaOrigem(pathname) {
  return ORIGENS_PUBLICACAO[origemSegura(pathname)] || "";
}

export function breadcrumbFor(pathname) {
  if (!pathname || pathname === "/") return [];
  const trilho = [{ to: "/", label: PAGE_LABELS["/"] }];
  const pai = PAGE_PARENTS[pathname];
  if (pai) trilho.push({ to: pai, label: PAGE_LABELS[pai] });
  trilho.push({ to: pathname, label: labelForPath(pathname) });
  return trilho;
}
