const fs = require("fs");
const path = require("path");

const PASTA = path.join(__dirname, "uploads", "mapas");

const INDICADORES = [
  { ficheiro: /Hd30_ref_updated/i, codigo: "HD30", nome: "Dias com temperatura acima de 30 °C", tipo: "Calor" },
  { ficheiro: /Hd40_ref_updated/i, codigo: "HD40", nome: "Dias com temperatura acima de 40 °C", tipo: "Calor" },
  { ficheiro: /Tmax_ref_updated/i, codigo: "TMAX", nome: "Temperatura máxima", tipo: "Temperatura" },
  { ficheiro: /Tmean_ref_updated/i, codigo: "TMED", nome: "Temperatura média", tipo: "Temperatura" },
  { ficheiro: /P5d_ref_updated/i, codigo: "P5D", nome: "Precipitação máxima em 5 dias", tipo: "Precipitação" },
  { ficheiro: /Pch_ref_updated/i, codigo: "PCH", nome: "Variação da precipitação", tipo: "Precipitação" }
];

const CENARIOS = { 2: "SSP2-4.5", 3: "SSP3-7.0", 5: "SSP5-8.5" };
const PERIODOS = { 40: "2040-2059", 60: "2060-2079" };
const CORES = ["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"];

let cache = null;

function semBase(erro) {
  const codigo = erro && (erro.code || "");
  const mensagem = erro && erro.message ? erro.message : "";
  return codigo === "ECONNREFUSED" || mensagem.includes("ECONNREFUSED");
}

function escolherFicheiros() {
  const nomes = fs.readdirSync(PASTA).filter((nome) => nome.endsWith(".geojson"));
  return INDICADORES.map((indicador) => {
    const candidatos = nomes
      .filter((nome) => indicador.ficheiro.test(nome))
      .map((nome) => ({
        nome,
        mtime: fs.statSync(path.join(PASTA, nome)).mtimeMs
      }))
      .sort((a, b) => b.mtime - a.mtime);
    return candidatos[0] ? { ...indicador, arquivo: candidatos[0].nome } : null;
  }).filter(Boolean);
}

function lerCatalogo() {
  if (cache) return cache;
  const linhas = [];
  const valores = {};

  escolherFicheiros().forEach((indicador, indiceIndicador) => {
    const geo = JSON.parse(fs.readFileSync(path.join(PASTA, indicador.arquivo), "utf8"));
    const props = geo.features?.[0]?.properties || {};
    const campos = Object.keys(props).filter((campo) => /s[235]p[59]y(40|60)$/.test(campo));
    valores[indicador.codigo] = [];

    campos.forEach((campo, ordem) => {
      const partes = campo.match(/s([235])p([59])y(40|60)$/);
      if (!partes) return;
      const cenario = CENARIOS[partes[1]];
      const percentil = partes[2] === "5" ? "0.5" : "0.9";
      const periodo = PERIODOS[partes[3]];
      geo.features.forEach((feature) => {
        const valor = Number(feature.properties?.[campo]);
        if (Number.isFinite(valor)) valores[indicador.codigo].push(valor);
      });
      linhas.push({
        map_code: campo,
        variable_short: indicador.codigo,
        period: periodo,
        scenario: cenario,
        uncertainty: percentil,
        titulo_pt: `${indicador.nome}, ${periodo}, ${cenario}`,
        mapa_id: linhas.length + 1,
        indicador_id: indiceIndicador + 1,
        arquivo: indicador.arquivo,
        campo,
        ordem,
        codigo: indicador.codigo,
        nome: indicador.nome,
        tipo: indicador.tipo
      });
    });
  });

  cache = { linhas, valores };
  return cache;
}

function classificacoesDe(codigo) {
  const { valores } = lerCatalogo();
  const nums = valores[codigo] || [];
  if (!nums.length) return [];
  const minimo = Math.min(...nums);
  const maximo = Math.max(...nums);
  if (minimo === maximo) {
    return [{ id: 1, classe: 1, minimo, maximo, cor: CORES[2], codigo }];
  }
  const passo = (maximo - minimo) / CORES.length;
  return CORES.map((cor, indice) => ({
    id: indice + 1,
    classe: indice + 1,
    minimo: minimo + passo * indice,
    maximo: indice === CORES.length - 1 ? maximo : minimo + passo * (indice + 1),
    cor,
    codigo
  }));
}

module.exports = {
  semBase,
  linhas: () => lerCatalogo().linhas,
  classificacoesDe
};
