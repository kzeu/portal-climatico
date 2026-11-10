const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const HOST = "127.0.0.1";
const PORTA = 5433;
const UTILIZADOR = "postgres";
const SENHA = "123";
const BASE = "climate";
const PASTA_DADOS = path.join(__dirname, "data", "pg");
const PASTA_UPLOADS = path.join(__dirname, "uploads");

const ligacao = {
  host: HOST,
  port: PORTA,
  user: UTILIZADOR,
  password: SENHA
};

let cluster = null;

async function liga(base, timeout = 2000) {
  const cliente = new Client({
    ...ligacao,
    database: base,
    connectionTimeoutMillis: timeout
  });
  await cliente.connect();
  return cliente;
}

async function baseDisponivel() {
  try {
    const cliente = await liga(BASE, 1500);
    await cliente.end();
    return true;
  } catch (erro) {
    if (erro.code === "ECONNREFUSED") return false;
    throw erro;
  }
}

async function subirCluster() {
  const { default: EmbeddedPostgres } = await import("embedded-postgres");
  fs.mkdirSync(PASTA_DADOS, { recursive: true });
  cluster = new EmbeddedPostgres({
    databaseDir: PASTA_DADOS,
    port: PORTA,
    user: UTILIZADOR,
    password: SENHA,
    persistent: true,
    onLog: () => {}
  });

  const jaInicializado = fs.existsSync(path.join(PASTA_DADOS, "PG_VERSION"));
  if (!jaInicializado) {
    console.log("A criar o agrupamento PostgreSQL local…");
    await cluster.initialise();
  }

  console.log("A iniciar PostgreSQL na porta 5433…");
  await cluster.start();

  const admin = await liga("postgres");
  const existe = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [BASE]);
  if (existe.rowCount === 0) {
    await admin.query(`CREATE DATABASE ${BASE}`);
  }
  await admin.end();
}

async function aplicarEsquema(cliente) {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await cliente.query(sql);
}

const DOCUMENTOS = {
  "1785417417616.pdf": ["Estratégia e Plano de Ação Nacional para a Diversidade Biológica 2025–2030", "Plano"],
  "1785417459571.pdf": ["Estratégia e Plano de Acção Nacional para a Biodiversidade", "Plano"],
  "1785417486777.pdf": ["Vulnerabilidade da zona costeira da Guiné-Bissau face às alterações climáticas — relatório final, 2023", "Relatório"],
  "1785417507039.pdf": ["Relatório cartográfico sobre a vulnerabilidade da zona costeira da Guiné-Bissau, 2023", "Relatório"],
  "1785417758813.pdf": ["Estratégia e Plano de Acção Nacional para a Biodiversidade", "Plano"],
  "1785417844388.pdf": ["Vulnerabilidade da zona costeira da Guiné-Bissau face às alterações climáticas — relatório final, 2023", "Relatório"],
  "1785417930265.pdf": ["Vulnerabilidade da zona costeira da Guiné-Bissau face às alterações climáticas — relatório final, 2023", "Relatório"],
  "1785417968061.pdf": ["Relatório cartográfico sobre a vulnerabilidade da zona costeira da Guiné-Bissau, 2023", "Relatório"],
  "1785417999242.pdf": ["Estudo socioeconómico e antropológico das populações no âmbito do projeto COASTAL, maio de 2022", "Estudo"],
  "1785418025714.pdf": ["Diagnóstico do quadro institucional para o ordenamento e a gestão da zona costeira", "Relatório"],
  "1785418046825.pdf": ["Políticas para a consideração dos riscos climáticos na gestão integrada das zonas costeiras", "Relatório"],
  "1785418067242.pdf": ["Estudo sobre políticas fiscais relacionadas com soluções para a zona costeira, janeiro de 2025", "Estudo"],
  "1785418091312.pdf": ["Estratégia de financiamento e plano de investimento para a gestão integrada da zona costeira", "Plano"],
  "1785418117355.pdf": ["Plano estratégico e de ação para a Gestão Integrada da Zona Costeira, março de 2025", "Plano"],
  "1785418142755.pdf": ["Estudo sobre o reforço e a harmonização do quadro legislativo e da coordenação institucional, maio de 2025", "Estudo"],
  "1785418176738.pdf": ["Avaliação Ambiental e Social Estratégica da zona costeira da Guiné-Bissau — relatório final, novembro de 2023", "Relatório"],
  "1785418393973.pdf": ["Bubaque: quadro de ação para a resiliência 2023–2033", "Plano"],
  "1785418434988.pdf": ["Cacine: quadro de ação para a resiliência 2023–2033", "Plano"],
  "1785418464114.pdf": ["Mansoa: quadro de ação para a resiliência 2023–2033", "Plano"],
  "1785418492309.pdf": ["São Domingos: quadro de ação para a resiliência 2023–2033", "Plano"],
  "1785418525539.pdf": ["Programa Nacional de Ação de Adaptação às alterações climáticas, dezembro de 2006", "Plano"],
  "1785418554412.pdf": ["Plano de Ação Nacional no Sector das Energias Renováveis (PANER) 2015–2030", "Plano"],
  "1785418575354.pdf": ["Plano Estratégico de Desenvolvimento das Pescas da Guiné-Bissau 2015–2020", "Plano"],
  "1785418599273.pdf": ["Estratégia e Plano de Acção Nacional para a Biodiversidade", "Plano"],
  "1785418624007.pdf": ["Estratégia Nacional de Gestão de Riscos de Catástrofes, junho de 2013", "Plano"],
  "1785418655635.pdf": ["Contribuição Nacionalmente Determinada atualizada no âmbito do Acordo de Paris, outubro de 2021", "Plano"],
  "1785418683739.pdf": ["Terceira Comunicação Nacional à Convenção-Quadro das Nações Unidas sobre Alterações Climáticas, janeiro de 2018", "Relatório"],
  "1785418707720.pdf": ["Segunda Comunicação Nacional sobre alterações climáticas na Guiné-Bissau, fevereiro de 2011", "Relatório"]
};

function fichaDoDocumento(nome, indice) {
  if (DOCUMENTOS[nome]) {
    return { titulo: DOCUMENTOS[nome][0], tipo: DOCUMENTOS[nome][1] };
  }
  return { titulo: `Documento ${indice}`, tipo: "Publicação" };
}

async function semearBiblioteca(cliente) {
  const atual = await cliente.query("SELECT COUNT(*)::int AS n FROM biblioteca");
  if (atual.rows[0].n > 0) return;

  const ficheiros = fs.readdirSync(PASTA_UPLOADS)
    .filter((nome) => nome.toLowerCase().endsWith(".pdf"))
    .sort();

  for (let indice = 0; indice < ficheiros.length; indice += 1) {
    const nome = ficheiros[indice];
    const ficha = fichaDoDocumento(nome, indice + 1);
    await cliente.query(
      `INSERT INTO biblioteca (titulo, tipo, ordem, arquivo, nome_arquivo, ativo)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [ficha.titulo, ficha.tipo, indice + 1, nome, nome]
    );
  }

  if (ficheiros.length > 0) {
    console.log(`Biblioteca: ${ficheiros.length} documentos registados a partir dos ficheiros.`);
  }
}

async function corrigirTitulosBiblioteca(cliente) {
  for (const [arquivo, [titulo, tipo]] of Object.entries(DOCUMENTOS)) {
    await cliente.query(
      `UPDATE biblioteca SET titulo = $1, tipo = $2 WHERE arquivo = $3 AND (titulo IS DISTINCT FROM $1 OR tipo IS DISTINCT FROM $2)`,
      [titulo, tipo, arquivo]
    );
  }
}

async function semearClima(cliente) {
  const atual = await cliente.query("SELECT COUNT(*)::int AS n FROM clima_indicadores");
  if (atual.rows[0].n > 0) return;

  const mapas = require("./mapas-ficheiros");
  const linhas = mapas.linhas();
  const indicadores = new Map();
  for (const linha of linhas) {
    if (!indicadores.has(linha.codigo)) indicadores.set(linha.codigo, linha);
  }

  const ids = new Map();
  for (const linha of indicadores.values()) {
    const criado = await cliente.query(
      `INSERT INTO clima_indicadores (codigo, nome, tipo, arquivo, ativo)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id`,
      [linha.codigo, linha.nome, linha.tipo, linha.arquivo]
    );
    ids.set(linha.codigo, criado.rows[0].id);
  }

  for (const linha of linhas) {
    const id = ids.get(linha.codigo);
    await cliente.query(
      `INSERT INTO climate_map_metadata
        (indicator_id, map_code, geojson_field, variable_full, variable_short, period, scenario, uncertainty, titulo_pt)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, linha.map_code, linha.campo, linha.nome, linha.codigo, linha.period, linha.scenario, linha.uncertainty, linha.titulo_pt]
    );
    await cliente.query(
      `INSERT INTO clima_mapas (codigo, indicador_id, periodo, ssp, percentil, campo, arquivo, ordem)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [linha.codigo, id, linha.period, linha.scenario, linha.uncertainty, linha.campo, linha.arquivo, linha.ordem]
    );
  }

  for (const codigo of ids.keys()) {
    for (const classe of mapas.classificacoesDe(codigo)) {
      await cliente.query(
        `INSERT INTO clima_classificacoes (codigo, classe, minimo, maximo, cor)
         VALUES ($1,$2,$3,$4,$5)`,
        [codigo, classe.classe, classe.minimo, classe.maximo, classe.cor]
      );
    }
  }

  console.log(`Mapas: ${linhas.length} combinações carregadas a partir dos GeoJSON.`);
}

async function garantirBanco() {
  if (!(await baseDisponivel())) {
    await subirCluster();
  }

  const cliente = await liga(BASE, 8000);
  try {
    await aplicarEsquema(cliente);
    await semearBiblioteca(cliente);
    await corrigirTitulosBiblioteca(cliente);
    await semearClima(cliente);
  } finally {
    await cliente.end();
  }

  console.log("Base climate pronta.");
}

module.exports = { garantirBanco };
