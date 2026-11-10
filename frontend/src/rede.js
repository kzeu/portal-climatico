const TEMPO_MS = 12000;

function comTempo(sinalExterno) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_MS);
  const aoAbortar = () => controlador.abort();

  if (sinalExterno) {
    if (sinalExterno.aborted) aoAbortar();
    else sinalExterno.addEventListener("abort", aoAbortar, { once: true });
  }

  return {
    signal: controlador.signal,
    cancelar() {
      clearTimeout(temporizador);
      sinalExterno?.removeEventListener("abort", aoAbortar);
    }
  };
}

async function lerCorpoJson(resposta) {
  const tipo = resposta.headers.get("content-type") || "";
  if (tipo.includes("text/html")) {
    const erro = new Error("nao-json");
    erro.code = "nao-json";
    throw erro;
  }
  try {
    return await resposta.json();
  } catch {
    const erro = new Error("nao-json");
    erro.code = "nao-json";
    throw erro;
  }
}

export function semApi(erro) {
  return erro?.code === "nao-json";
}

export async function enviarPedido(url, opcoes = {}, sinal) {
  const pedido = comTempo(sinal);
  try {
    const resposta = await fetch(url, { ...opcoes, signal: pedido.signal });
    const dados = await lerCorpoJson(resposta);
    return { resposta, dados };
  } finally {
    pedido.cancelar();
  }
}

export async function pedirJson(url, sinal) {
  const { resposta, dados } = await enviarPedido(url, {}, sinal);
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || "Não foi possível carregar os dados.");
    erro.code = "http";
    throw erro;
  }
  return dados;
}
