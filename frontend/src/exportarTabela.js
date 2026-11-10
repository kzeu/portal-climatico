import * as XLSX from "xlsx";

const COLUNAS = [
  "Região",
  "Valor",
  "Indicador",
  "Código",
  "Tipo",
  "Período",
  "Cenário",
  "Percentil"
];

function slugParte(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "dados";
}

export function nomeFicheiroClimatologia(meta, extensao) {
  const partes = [
    "climatologia",
    meta?.codigo,
    meta?.periodo,
    meta?.cenario
  ].map(slugParte);
  return `${partes.join("-")}.${extensao}`;
}

export function linhasExportacao(regioes, meta = {}) {
  return (regioes || []).map((regiao) => ({
    Região: regiao.nome ?? "",
    Valor: Number.isFinite(regiao.valor) ? regiao.valor : "",
    Indicador: meta.indicador ?? "",
    Código: meta.codigo ?? "",
    Tipo: meta.tipo ?? "",
    Período: meta.periodo ?? "",
    Cenário: meta.cenario ?? "",
    Percentil: meta.percentil ?? ""
  }));
}

function escaparCsv(valor) {
  const texto = String(valor ?? "");
  if (/[",\n\r]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

function descarregarBlob(blob, nome) {
  const url = URL.createObjectURL(blob);
  const ligacao = document.createElement("a");
  ligacao.href = url;
  ligacao.download = nome;
  ligacao.rel = "noopener";
  ligacao.style.display = "none";
  document.body.appendChild(ligacao);
  ligacao.click();
  // Revogar só depois do browser iniciar a descarga.
  window.setTimeout(() => {
    ligacao.remove();
    URL.revokeObjectURL(url);
  }, 1500);
}

export function exportarCsv(regioes, meta = {}) {
  if (!regioes?.length) {
    throw new Error("Não há dados de regiões para exportar.");
  }
  const linhas = linhasExportacao(regioes, meta);
  const corpo = [
    COLUNAS.join(","),
    ...linhas.map((linha) => COLUNAS.map((coluna) => escaparCsv(linha[coluna])).join(","))
  ].join("\r\n");
  const blob = new Blob(["\uFEFF" + corpo], { type: "text/csv;charset=utf-8" });
  descarregarBlob(blob, nomeFicheiroClimatologia(meta, "csv"));
}

export function exportarExcel(regioes, meta = {}) {
  if (!regioes?.length) {
    throw new Error("Não há dados de regiões para exportar.");
  }
  const linhas = linhasExportacao(regioes, meta);
  const folha = XLSX.utils.json_to_sheet(linhas, { header: COLUNAS });
  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, folha, "Climatologia");
  const dados = XLSX.write(livro, { bookType: "xlsx", type: "array" });
  const blob = new Blob([dados], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
  descarregarBlob(blob, nomeFicheiroClimatologia(meta, "xlsx"));
}

export async function exportarGeoJson(arquivo) {
  if (!arquivo) {
    throw new Error("Nenhum mapa selecionado para exportar.");
  }
  const resposta = await fetch(`/uploads/mapas/${encodeURIComponent(arquivo)}`);
  if (!resposta.ok) {
    throw new Error("Não foi possível obter o ficheiro do mapa.");
  }
  const blob = await resposta.blob();
  const nome = String(arquivo).split("/").pop() || "mapa.geojson";
  descarregarBlob(blob, nome);
}
