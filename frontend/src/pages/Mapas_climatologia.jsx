import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HeroPage from "../components/HeroPage";
import PageShell from "../components/PageShell";
import { ErrorState } from "../components/StatusStates";
import { formatarNumero } from "../locale";
import { urlApi } from "../config";
import { pedirJson } from "../rede";
import { exportarCsv, exportarExcel, exportarGeoJson } from "../exportarTabela";

const cacheGeoJson = new Map();
const geoJsonEmCurso = new Map();

function pedirGeoJson(file) {
  if (cacheGeoJson.has(file)) {
    return { promise: Promise.resolve(cacheGeoJson.get(file)), abandonar() {} };
  }
  const emCurso = geoJsonEmCurso.get(file);
  if (emCurso) return emCurso;

  const controlador = new AbortController();
  const promise = pedirJson(urlApi(`/uploads/mapas/${file}`), controlador.signal)
    .then((json) => {
      cacheGeoJson.set(file, json);
      if (geoJsonEmCurso.get(file)?.promise === promise) geoJsonEmCurso.delete(file);
      return json;
    })
    .catch((erro) => {
      if (geoJsonEmCurso.get(file)?.promise === promise) geoJsonEmCurso.delete(file);
      throw erro;
    });

  const pedido = {
    promise,
    abandonar() {
      if (cacheGeoJson.has(file)) return;
      if (geoJsonEmCurso.get(file)?.promise !== promise) return;
      controlador.abort();
      geoJsonEmCurso.delete(file);
    }
  };
  geoJsonEmCurso.set(file, pedido);
  return pedido;
}

function regioesDoMapa(json, campo) {
  return (json.features || []).map((feature, index) => ({
    id: `${nomeRegiao(feature.properties)}-${index}`,
    nome: nomeRegiao(feature.properties),
    valor: Number(feature.properties?.[campo])
  }));
}

function normalizarPercentil(valor) {
  const numero = Number(String(valor || "").trim().replace("%", "").replace(",", "."));
  if (Number.isNaN(numero)) return "";
  return numero > 1 ? numero / 100 : numero;
}

function igual(a, b) {
  return String(a || "").toLowerCase() === String(b || "").toLowerCase();
}

function unicos(lista) {
  return [...new Set(lista.filter((item) => item !== null && item !== undefined && item !== ""))];
}

function nomeRegiao(props) {
  return props?.adm1_name || "Região";
}

function MapaItem({ file, campo, titulo, classificacoes, periodo, onRegioes }) {
  const [data, setData] = useState(() => (file ? cacheGeoJson.get(file) || null : null));
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!file || cacheGeoJson.get(file)) return undefined;
    let ativo = true;
    const pedido = pedirGeoJson(file);
    pedido.promise
      .then((json) => {
        if (!ativo) return;
        setData(json);
      })
      .catch((falha) => {
        if (!ativo || falha?.name === "AbortError") return;
        setErro("Não foi possível carregar este mapa. Escolha outra combinação ou tente novamente.");
        onRegioes({ file, regioes: [] });
      });
    return () => {
      ativo = false;
      pedido.abandonar();
    };
  }, [file, tentativa, onRegioes]);

  useEffect(() => {
    if (!data) return;
    onRegioes({ file, regioes: regioesDoMapa(data, campo) });
  }, [data, campo, file, onRegioes]);

  const style = (feature) => {
    const valor = Number(feature.properties?.[campo]);
    const classificacao = classificacoes.find((item) => (
      valor >= Number(item.minimo) && valor <= Number(item.maximo)
    ));
    return {
      fillColor: classificacao?.cor || "#cccccc",
      color: "#333",
      weight: 1,
      fillOpacity: 0.8
    };
  };

  const onEachFeature = (feature, layer) => {
    const nome = nomeRegiao(feature.properties);
    const valor = Number(feature.properties?.[campo]);
    const valorFormatado = Number.isFinite(valor) ? formatarNumero(valor) : "Sem dados";
    const conteudo = `<strong>${nome}</strong><br/>Valor: <strong>${valorFormatado}</strong>`;
    layer.bindPopup(conteudo);
    layer.bindTooltip(conteudo, {
      permanent: false,
      direction: "top",
      sticky: true,
      className: "mapa-tooltip"
    });
  };

  return (
    <figure className="mapa-figura">
      <h2>{titulo}</h2>
      {erro ? (
        <ErrorState
          texto={erro}
          onRetry={() => {
            setErro("");
            setData(null);
            setTentativa((atual) => atual + 1);
          }}
        />
      ) : null}
      <div className="mapa-frame">
        {!data && !erro ? <p className="mapa-a-carregar" role="status">A carregar este mapa…</p> : null}
        <MapContainer
          key={file}
          center={[11.8, -15]}
          zoom={8}
          className="mapa-leaflet"
        >
          {data ? (
            <GeoJSON key={campo} data={data} style={style} onEachFeature={onEachFeature} />
          ) : null}
        </MapContainer>
        {classificacoes.length > 0 ? (
          <div className="mapa-legenda">
            <strong>Anomalia do conjunto face à linha de base histórica</strong>
            <p>
              A cor mostra a classe do indicador
              {periodo ? ` no período ${periodo}` : ""}.
            </p>
            <ul>
              {classificacoes.map((item) => (
                <li key={item.id}>
                  <span className="mapa-legenda-cor" style={{ background: item.cor }} aria-hidden="true" />
                  <span>
                    Classe {item.classe} ({formatarNumero(item.minimo)} – {formatarNumero(item.maximo)})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <figcaption className="mapa-fonte">
        Fonte: World Bank Group. Climate Change Knowledge Portal (CCKP): Guiné-Bissau — projeções climáticas.{" "}
        <a
          href="https://climateknowledgeportal.worldbank.org/country/guinea-bissau/climate-data-projections"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir a fonte
        </a>
        . Consultado em 25 de julho de 2026.
      </figcaption>
    </figure>
  );
}

export default function Mapas_climatologia() {
  const [params, setParams] = useSearchParams();
  const [dadosFiltros, setDadosFiltros] = useState([]);
  const [estado, setEstado] = useState("loading");
  const [tentativaFiltros, setTentativaFiltros] = useState(0);
  const [tentativaLegenda, setTentativaLegenda] = useState(0);
  const [legenda, setLegenda] = useState({ codigo: "", dados: [], estado: "idle" });
  const [tabela, setTabela] = useState({ file: "", regioes: [] });
  const [erroExportacao, setErroExportacao] = useState("");

  const guardarRegioes = useCallback((payload) => setTabela(payload), []);

  useEffect(() => {
    const controlador = new AbortController();
    let ativo = true;
    pedirJson(urlApi("/clima/mapas-filtros"), controlador.signal)
      .then((dados) => {
        if (!ativo) return;
        setDadosFiltros(Array.isArray(dados) ? dados : []);
        setEstado("ok");
      })
      .catch((erro) => {
        if (!ativo || erro?.name === "AbortError") return;
        setEstado("erro");
      });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [tentativaFiltros]);

  useEffect(() => {
    if (estado !== "ok" || dadosFiltros.length === 0) return;
    const tipos = unicos(dadosFiltros.map((item) => item.tipo));
    if (tipos.length === 0) return;

    const tipo = tipos.includes(params.get("tipo")) ? params.get("tipo") : tipos[0];
    const doTipo = dadosFiltros.filter((item) => item.tipo === tipo);
    const indicadores = [...new Map(doTipo.map((item) => [item.codigo, item])).values()];
    const indicadorParam = params.get("indicador") || "";
    const indicador = indicadores.some((item) => igual(item.codigo, indicadorParam))
      ? indicadorParam
      : indicadores[0]?.codigo || "";

    const doIndicador = doTipo.filter((item) => igual(item.codigo, indicador));
    const periodos = unicos(doIndicador.map((item) => item.period)).map(String);
    const periodo = periodos.includes(String(params.get("periodo") || ""))
      ? String(params.get("periodo"))
      : periodos[0] || "";

    const doPeriodo = doIndicador.filter((item) => String(item.period) === periodo);
    const cenarios = unicos(doPeriodo.map((item) => item.scenario)).map(String);
    const cenario = cenarios.includes(String(params.get("cenario") || ""))
      ? String(params.get("cenario"))
      : cenarios[0] || "";

    const doCenario = doPeriodo.filter((item) => String(item.scenario) === cenario);
    const percentis = unicos(doCenario.map((item) => item.uncertainty)).map(String);
    const percentilParam = params.get("percentil") || "";
    const percentil = percentis.some((item) => normalizarPercentil(item) === normalizarPercentil(percentilParam))
      ? percentilParam
      : percentis[0] || "";

    const mapas = doCenario.filter((item) => (
      normalizarPercentil(item.uncertainty) === normalizarPercentil(percentil)
    ));
    const mapaParam = params.get("mapa") || "";
    const mapa = mapas.some((item) => item.arquivo === mapaParam)
      ? mapaParam
      : mapas[0]?.arquivo || "";

    const seguinte = { tipo, indicador, periodo, cenario, percentil, mapa };
    const atual = {
      tipo: params.get("tipo") || "",
      indicador: params.get("indicador") || "",
      periodo: params.get("periodo") || "",
      cenario: params.get("cenario") || "",
      percentil: params.get("percentil") || "",
      mapa: params.get("mapa") || ""
    };
    if (JSON.stringify(atual) === JSON.stringify(seguinte)) return;
    setParams(seguinte, { replace: true });
  }, [dadosFiltros, estado, params, setParams]);

  function definir(chave, valor, apagar) {
    setParams((atual) => {
      const proximo = new URLSearchParams(atual);
      if (valor) proximo.set(chave, valor);
      else proximo.delete(chave);
      apagar.forEach((nome) => proximo.delete(nome));
      return proximo;
    }, { replace: true });
  }

  const tipo = params.get("tipo") || "";
  const indicador = params.get("indicador") || "";
  const periodo = params.get("periodo") || "";
  const cenario = params.get("cenario") || "";
  const percentil = params.get("percentil") || "";
  const mapaArquivo = params.get("mapa") || "";

  const tipos = unicos(dadosFiltros.map((item) => item.tipo));
  const doTipo = dadosFiltros.filter((item) => !tipo || item.tipo === tipo);
  const indicadores = [...new Map(doTipo.map((item) => [item.codigo, item])).values()];
  const doIndicador = doTipo.filter((item) => !indicador || igual(item.codigo, indicador));
  const periodos = unicos(doIndicador.map((item) => item.period)).map(String);
  const doPeriodo = doIndicador.filter((item) => !periodo || String(item.period) === periodo);
  const cenarios = unicos(doPeriodo.map((item) => item.scenario)).map(String);
  const doCenario = doPeriodo.filter((item) => !cenario || String(item.scenario) === cenario);
  const percentis = unicos(doCenario.map((item) => item.uncertainty)).map(String);
  const mapasSelecionados = doCenario.filter((item) => (
    !percentil || normalizarPercentil(item.uncertainty) === normalizarPercentil(percentil)
  ));
  const mapaAtual = mapasSelecionados.find((item) => item.arquivo === mapaArquivo) || mapasSelecionados[0];
  const indicadorAtual = indicadores.find((item) => igual(item.codigo, indicador));

  useEffect(() => {
    const codigo = mapaAtual?.codigo;
    if (!codigo) return undefined;
    const controlador = new AbortController();
    let ativo = true;
    pedirJson(urlApi(`/clima/classificacoes/${codigo}`), controlador.signal)
      .then((dados) => {
        if (!ativo) return;
        setLegenda({ codigo, dados: Array.isArray(dados) ? dados : [], estado: "ok" });
      })
      .catch((erro) => {
        if (!ativo || erro?.name === "AbortError") return;
        setLegenda({ codigo, dados: [], estado: "erro" });
      });
    return () => {
      ativo = false;
      controlador.abort();
    };
  }, [mapaAtual?.codigo, tentativaLegenda]);

  const classificacoes = legenda.codigo === mapaAtual?.codigo ? legenda.dados : [];
  const estadoLegenda = !mapaAtual?.codigo
    ? "idle"
    : legenda.codigo === mapaAtual.codigo
      ? legenda.estado
      : "loading";
  const regioes = tabela.file === mapaAtual?.arquivo ? tabela.regioes : [];
  const metaExportacao = {
    indicador: indicadorAtual?.nome || mapaAtual?.codigo || "",
    codigo: mapaAtual?.codigo || indicador || "",
    tipo,
    periodo,
    cenario,
    percentil
  };

  function descarregar(formato) {
    setErroExportacao("");
    try {
      if (formato === "csv") exportarCsv(regioes, metaExportacao);
      else if (formato === "xlsx") exportarExcel(regioes, metaExportacao);
      else if (formato === "geojson") {
        exportarGeoJson(mapaAtual?.arquivo).catch((erro) => {
          setErroExportacao(erro?.message || "Não foi possível descarregar o mapa.");
        });
      }
    } catch (erro) {
      setErroExportacao(erro?.message || "Não foi possível descarregar os dados.");
    }
  }

  return (
    <PageShell className="full-page">
      <HeroPage pagina="mapas_climatologia" />
      <div className="mapa-layout">
        <div className="mapa-sheet">
          <section className="mapa-painel-filtros" aria-labelledby="titulo-filtros-mapa">
            <div>
              <h2 id="titulo-filtros-mapa">Escolher mapa</h2>
              <p className="mapa-info-texto">
                Escolha o indicador, o período, o cenário e o percentil.
                O endereço desta página guarda a seleção, para a poder partilhar.
              </p>
            </div>

            {tipos.length > 0 ? (
              <div className="mapa-tipos" role="group" aria-label="Tipo de indicador">
                {tipos.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="mapa-tipo-btn"
                    aria-pressed={tipo === item}
                    onClick={() => definir("tipo", item, ["indicador", "periodo", "cenario", "percentil", "mapa"])}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mapa-filtros">
              <div className="mapa-filtro">
                <label htmlFor="mapa-indicador">Indicador</label>
                <select
                  id="mapa-indicador"
                  value={indicador}
                  onChange={(e) => definir("indicador", e.target.value, ["periodo", "cenario", "percentil", "mapa"])}
                >
                  {indicadores.map((item) => (
                    <option key={item.codigo} value={item.codigo}>
                      {item.nome ? `${item.nome} (${item.codigo})` : item.codigo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mapa-filtro">
                <label htmlFor="mapa-periodo">Período</label>
                <select
                  id="mapa-periodo"
                  value={periodo}
                  onChange={(e) => definir("periodo", e.target.value, ["cenario", "percentil", "mapa"])}
                >
                  {periodos.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="mapa-filtro">
                <label htmlFor="mapa-cenario">Cenário</label>
                <select
                  id="mapa-cenario"
                  value={cenario}
                  onChange={(e) => definir("cenario", e.target.value, ["percentil", "mapa"])}
                >
                  {cenarios.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="mapa-filtro">
                <label htmlFor="mapa-percentil">Percentil</label>
                <select
                  id="mapa-percentil"
                  value={percentil}
                  onChange={(e) => definir("percentil", e.target.value, ["mapa"])}
                >
                  {percentis.map((item) => (
                    <option key={item} value={item}>
                      {formatarNumero(normalizarPercentil(item) * 100)}%
                    </option>
                  ))}
                </select>
              </div>
              {mapasSelecionados.length > 1 ? (
                <div className="mapa-filtro">
                  <label htmlFor="mapa-variante">Mapa desta seleção</label>
                  <select
                    id="mapa-variante"
                    value={mapaAtual?.arquivo || ""}
                    onChange={(e) => definir("mapa", e.target.value, [])}
                  >
                    {mapasSelecionados.map((item) => (
                      <option key={item.arquivo} value={item.arquivo}>
                        {item.titulo_pt || item.arquivo}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            <p className="mapa-contador" aria-live="polite">
              <span className="mapa-contador-numero">{dadosFiltros.length}</span>
              <span>{dadosFiltros.length === 1 ? "mapa disponível" : "mapas disponíveis"}</span>
            </p>

            <div className="mapa-exportacao">
              <h3 className="mapa-exportacao-titulo">Descarregar dados</h3>
              <p className="mapa-info-texto">
                Exporte os valores da seleção atual em CSV ou Excel, ou o ficheiro GeoJSON do mapa.
              </p>
              <div className="mapa-tabela-acoes">
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={regioes.length === 0}
                  onClick={() => descarregar("csv")}
                >
                  CSV
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={regioes.length === 0}
                  onClick={() => descarregar("xlsx")}
                >
                  Excel
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  disabled={!mapaAtual?.arquivo}
                  onClick={() => descarregar("geojson")}
                >
                  GeoJSON
                </button>
              </div>
              {regioes.length === 0 && mapaAtual ? (
                <p className="mapa-exportacao-aviso" role="status">A carregar valores por região…</p>
              ) : null}
              {erroExportacao ? (
                <p className="mapa-exportacao-erro" role="alert">{erroExportacao}</p>
              ) : null}
            </div>
          </section>
        </div>

        <div className="mapa-canvas">
          {estado === "loading" ? <p role="status">A carregar mapas…</p> : null}
          {estado === "erro" ? (
            <ErrorState
              texto="Não foi possível carregar os mapas. Tente novamente."
              onRetry={() => {
                setEstado("loading");
                setTentativaFiltros((atual) => atual + 1);
              }}
            />
          ) : null}
          {estado === "ok" && !mapaAtual ? (
            <div className="ui-empty">
              <strong>Nenhum mapa disponível para esta seleção.</strong>
              <p>Escolha outro indicador, período, cenário ou percentil.</p>
            </div>
          ) : null}
          {estadoLegenda === "erro" ? (
            <ErrorState
              texto="O mapa foi encontrado, mas a legenda de cores não carregou."
              onRetry={() => {
                setLegenda((atual) => ({ ...atual, dados: [], estado: "loading" }));
                setTentativaLegenda((valor) => valor + 1);
              }}
            />
          ) : null}
          {mapaAtual ? (
            <MapaItem
              key={`${mapaAtual.arquivo}-${mapaAtual.codigo}`}
              file={mapaAtual.arquivo}
              campo={mapaAtual.campo}
              titulo={mapaAtual.titulo_pt || indicadorAtual?.nome || mapaAtual.codigo}
              classificacoes={classificacoes}
              periodo={periodo}
              onRegioes={guardarRegioes}
            />
          ) : null}
          {regioes.length > 0 ? (
            <div className="mapa-tabela-wrap">
              <div className="mapa-tabela-cabecalho">
                <h3>Valores por região</h3>
                <div className="mapa-tabela-acoes">
                  <button type="button" className="btn-ghost" onClick={() => descarregar("csv")}>
                    Descarregar CSV
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => descarregar("xlsx")}>
                    Descarregar Excel
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => descarregar("geojson")}>
                    Descarregar GeoJSON
                  </button>
                </div>
              </div>
              <table className="mapa-tabela">
                <caption>
                  {indicadorAtual?.nome || mapaAtual?.codigo || "Indicador"}
                  {periodo ? `, período ${periodo}` : ""}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Região</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {regioes.map((regiao) => (
                    <tr key={regiao.id}>
                      <th scope="row">{regiao.nome}</th>
                      <td>{Number.isFinite(regiao.valor) ? formatarNumero(regiao.valor) : "Sem dados"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
