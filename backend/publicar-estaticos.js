const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const mapas = require("./mapas-ficheiros");

const PUBLICO = path.join(__dirname, "../frontend/public");
const DADOS = path.join(PUBLICO, "dados");
const UPLOADS = path.join(PUBLICO, "uploads");
const MAPAS = path.join(UPLOADS, "mapas");

function copiar(origem, destino) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(origem, destino);
}

async function main() {
  fs.mkdirSync(path.join(DADOS, "classificacoes"), { recursive: true });
  fs.mkdirSync(MAPAS, { recursive: true });

  const linhas = mapas.linhas();
  fs.writeFileSync(path.join(DADOS, "mapas-filtros.json"), JSON.stringify(linhas));

  const codigos = [...new Set(linhas.map((linha) => linha.codigo))];
  for (const codigo of codigos) {
    fs.writeFileSync(
      path.join(DADOS, "classificacoes", `${codigo}.json`),
      JSON.stringify(mapas.classificacoesDe(codigo))
    );
  }

  const ficheirosMapa = [...new Set(linhas.map((linha) => linha.arquivo))];
  for (const nome of ficheirosMapa) {
    copiar(path.join(__dirname, "uploads/mapas", nome), path.join(MAPAS, nome));
  }

  const cliente = new Client({
    user: "postgres",
    password: "123",
    database: "climate",
    host: "127.0.0.1",
    port: 5433
  });
  await cliente.connect();

  const biblioteca = await cliente.query(`
    SELECT id, titulo, tipo, data, link, pagina, ordem, arquivo, nome_arquivo
    FROM biblioteca
    WHERE ativo = true
    ORDER BY ordem, id
  `);
  fs.writeFileSync(path.join(DADOS, "biblioteca.json"), JSON.stringify(biblioteca.rows));

  for (const item of biblioteca.rows) {
    if (!item.arquivo) continue;
    const origem = path.join(__dirname, "uploads", item.arquivo);
    if (!fs.existsSync(origem)) continue;
    copiar(origem, path.join(UPLOADS, item.arquivo));
    item.bytes = fs.statSync(origem).size;
  }

  const rodape = await cliente.query("SELECT * FROM configuracoes_rodape WHERE id = 1");
  fs.writeFileSync(path.join(DADOS, "rodape.json"), JSON.stringify(rodape.rows[0] || {}));
  fs.writeFileSync(path.join(DADOS, "banners-herois.json"), "[]");
  fs.writeFileSync(path.join(DADOS, "vazio.json"), "[]");

  await cliente.end();
  console.log(`Mapas: ${ficheirosMapa.length} ficheiros, ${linhas.length} combinações.`);
  console.log(`Biblioteca: ${biblioteca.rows.length} documentos.`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
