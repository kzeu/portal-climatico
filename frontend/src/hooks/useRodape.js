import { useEffect, useState } from "react";
import API_URL, { urlApi } from "../config";
import { pedirJson } from "../rede";

const PADRAO = {
  sobre_texto: "Portal Climático da Guiné-Bissau",
  facebook_url: "https://www.facebook.com/portaldoclima.gw",
  instagram_url: "https://www.instagram.com/portaldoclima.gw",
  twitter_url: "https://x.com/portaldoclima_gw",
  email: "info@portaldoclima.gw",
  telefone: ""
};

// Um único pedido partilhado entre o rodapé e a página de contato.
let pedido = null;

function carregarRodape() {
  if (!pedido) {
    pedido = pedirJson(urlApi("/configuracoes/rodape"))
      .catch((erro) => {
        pedido = null;
        throw erro;
      });
  }
  return pedido;
}

export function urlArquivo(caminho) {
  if (!caminho) return "";
  return /^https?:\/\//i.test(caminho) ? caminho : `${API_URL}${caminho}`;
}

export function telefoneVisivel(telefone) {
  const texto = String(telefone || "").trim();
  if (!texto || /x/i.test(texto)) return "";
  return texto;
}

export function telefoneHref(telefone) {
  return `tel:${String(telefone).replace(/[^\d+]/g, "")}`;
}

export function useRodape() {
  const [config, setConfig] = useState(PADRAO);

  useEffect(() => {
    let ativo = true;
    carregarRodape()
      .then((dados) => {
        if (ativo && dados) {
          setConfig((atual) => ({
            ...atual,
            ...dados,
            telefone: telefoneVisivel(dados.telefone)
          }));
        }
      })
      .catch((erro) => {
        console.error("Erro ao carregar configurações do rodapé:", erro);
      });
    return () => {
      ativo = false;
    };
  }, []);

  return config;
}
