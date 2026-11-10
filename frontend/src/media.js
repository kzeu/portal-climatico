const FOTOS_COM_SRCSET = new Set([
  "/images/territorio/manguezais.webp",
  "/images/territorio/arrozais.webp",
  "/images/territorio/cajus.webp"
]);

export function caminhoImagem(imagem) {
  if (!imagem) return "";
  if (/^https?:\/\//i.test(imagem)) return imagem;
  return imagem.startsWith("/") ? imagem : `/${imagem}`;
}

export function srcSetImagem(imagem) {
  const caminho = caminhoImagem(imagem);
  if (caminho === "/images/hero/hero-1.webp") {
    return "/images/hero/hero-1-800.webp 800w, /images/hero/hero-1.webp 1600w";
  }
  if (FOTOS_COM_SRCSET.has(caminho)) {
    return `${caminho.replace(/\.webp$/, "-800.webp")} 800w, ${caminho} 1600w`;
  }
  return undefined;
}

export function srcImagem(imagem) {
  const caminho = caminhoImagem(imagem);
  const conjunto = srcSetImagem(caminho);
  if (!conjunto) return caminho;
  return conjunto.split(",")[0].trim().split(/\s+/)[0];
}

export const LIMITE_IMAGEM_KB = 300;

export function avisoTamanhoImagem(arquivo) {
  if (!arquivo || !arquivo.size) return "";
  const kb = arquivo.size / 1024;
  if (kb <= LIMITE_IMAGEM_KB) return "";
  return `Esta imagem tem ${Math.round(kb)} KB. Prefira até ${LIMITE_IMAGEM_KB} KB (WebP/JPG) para ligações lentas.`;
}
