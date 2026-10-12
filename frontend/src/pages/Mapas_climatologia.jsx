import HeroDinamico from "../components/HeroDinamico";
import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import API_URL from "../config";


/* =========================
   MAPA
========================= */

function MapaItem({
    file,
    campo,
    titulo,
    classificacoes,
    tipos,
    tipoSelecionado,
    setTipoSelecionado
}) {

    const [data, setData] = useState(null);

    useEffect(() => {

        if (!file) {
            return;
        }

       fetch(`${API_URL}/uploads/mapas/${file}`)
            .then((res) => res.json())
            .then((json) => {
                setData(json);
            })
            .catch((erro) => {
                console.error(
                    "Erro ao carregar GeoJSON:",
                    erro
                );
            });

    }, [file]);


    function getNome(props) {

        return (
            props.adm1_name ||
            "Região"
        );

    }

           const style = (feature) => {

    const valor =
        Number(
            feature.properties?.[campo]
        );


    const classificacao =
        classificacoes.find(
            (item) => {

                const minimo =
                    Number(item.minimo);

                const maximo =
                    Number(item.maximo);

                return (
                    valor >= minimo &&
                    valor <= maximo
                );

            }
        );


    console.log(
        "Região:",
        feature.properties?.adm1_name,
        "Campo:",
        campo,
        "Valor:",
        valor,
        "Cor:",
        classificacao?.cor
    );


    return {

        fillColor:
            classificacao?.cor ||
            "#cccccc",

        color: "#333",

        weight: 1,

        fillOpacity: 0.8

    };

};


    const onEachFeature = (
        feature,
        layer
    ) => {

        const nome =
            getNome(
                feature.properties
            );

        const valor =
            Number(
                feature.properties?.[campo]
            );

        const valorFormatado =
            Number.isFinite(valor)
                ? valor.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2
                })
                : "Sem dados";

        const conteudo =
            `<strong>${nome}</strong><br/>` +
            `Valor: <strong>${valorFormatado}</strong>`;

        layer.bindPopup(conteudo);

        layer.bindTooltip(conteudo, {
            permanent: false,
            direction: "top",
            sticky: true,
            className: "mapa-tooltip"
        });

    };


    return (

        <>
            <style>{`
                .mapa-tipos {
                    position: absolute;
                    top: 110px;
                    left: 20px;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .mapa-info-filtros {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin: 18px 0 14px;
                    padding: 16px 18px;
                    border: 1px solid #dbe5ef;
                    border-radius: 12px;
                    background: #ffffff;
                    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.05);
                }

                .mapa-info-texto {
                    color: #334155;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                }

                .mapa-contador {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    flex-shrink: 0;
                    padding: 9px 13px;
                    border-radius: 999px;
                    background: #e6f4f1;
                    color: #0f766e;
                    font-size: 13px;
                    font-weight: 700;
                }

                .mapa-contador-numero {
                    font-size: 18px;
                    line-height: 1;
                }

                .mapa-filtros {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    align-items: flex-end;
                    margin-top: 20px;
                    margin-bottom: 15px;
                }

                .mapa-filtro {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .mapa-filtro label {
                    font-size: 11px;
                    font-weight: 800;
                    color: #0f766e;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding-left: 3px;
                }

                .mapa-filtro select {
                    min-width: 145px;
                    padding: 10px 34px 10px 12px;
                    border: 1px solid #d5dddd;
                    border-radius: 9px;
                    background: white;
                    color: #183b3a;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                    box-shadow: 0 2px 7px rgba(0,0,0,0.08);
                    transition: all 0.2s ease;
                }

                .mapa-filtro select:hover,
                .mapa-filtro select:focus {
                    border-color: #0f766e;
                    box-shadow: 0 3px 10px rgba(15,118,110,0.16);
                }

                .mapa-tipo-btn {
                    min-width: 175px;
                    padding: 13px 18px;
                    border: 0;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.96);
                    color: #183b3a;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 15px;
                    font-weight: 700;
                    text-align: left;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.22);
                    transition: all 0.2s ease;
                }

                .mapa-tipo-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.28);
                }

                .mapa-tipo-btn.ativo {
                    background: #0f766e;
                    color: white;
                    box-shadow: 0 5px 18px rgba(15,118,110,0.38);
                }

                .mapa-tipo-icone {
                    font-size: 22px;
                    line-height: 1;
                }

                .mapa-tooltip {
                    border: 0 !important;
                    border-radius: 10px !important;
                    padding: 9px 12px !important;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.25) !important;
                    font-size: 13px !important;
                    line-height: 1.4 !important;
                }

                @media (max-width: 700px) {
                    .mapa-tipos {
                        top: 52px;
                        left: 12px;
                        gap: 7px;
                    }

                    .mapa-tipo-btn {
                        min-width: 145px;
                        padding: 10px 13px;
                        font-size: 13px;
                        border-radius: 10px;
                    }

                    .mapa-tipo-icone {
                        font-size: 19px;
                    }

                    .mapa-filtros {
                        gap: 8px;
                    }

                    .mapa-filtro select {
                        min-width: 130px;
                        font-size: 13px;
                        padding: 9px 30px 9px 10px;
                    }

                    .mapa-filtro label {
                        font-size: 10px;
                    }
                }
            `}</style>

            <div
                style={{
                    marginTop: "10px"
                }}
            >

            <h3
                style={{
                    marginBottom: "10px"
                }}
            >
                {titulo}
            </h3>


            <MapContainer
                key={file}
                center={[
                    11.80,
                    -15.00
                ]}
                zoom={8}
                style={{
                    height: "400px",
                    width: "100%",
                    borderRadius: "10px"
                }}
            >

                {/* BOTÕES DE TIPO - DENTRO DO MAPA */}
                <div className="mapa-tipos">
                    {tipos.map((tipo) => (
                        <button
                            key={tipo}
                            type="button"
                            className={`mapa-tipo-btn ${
                                tipoSelecionado === tipo ? "ativo" : ""
                            }`}
                            onClick={() => setTipoSelecionado(tipo)}
                        >
                            <span className="mapa-tipo-icone">
                                {String(tipo).toLowerCase().includes("precip")
                                    ? "🌧️"
                                    : "🌡️"}
                            </span>
                            <span>{tipo}</span>
                        </button>
                    ))}
                </div>

                {data && (

                    <GeoJSON
                        data={data}
                        style={style}
                        onEachFeature={
                            onEachFeature
                        }
                    />

                )}

                {classificacoes.length > 0 && (

                    <div
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 1000,
                            background: "white",
                            padding: "12px 15px",
                            borderRadius: "8px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,0.25)",
                            fontSize: "13px",
                            minWidth: "170px"
                        }}
                    >

                        <strong
                            style={{
                                display: "block",
                                marginBottom: "8px"
                            }}
                        >
                            Ensemble anomaly<br />
                            compared to historical baseline
                        </strong>

                        {classificacoes.map(
                            (item) => (

                                <div
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "5px"
                                    }}
                                >

                                    <span
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            background:
                                                item.cor,
                                            display: "inline-block",
                                            marginRight: "8px",
                                            border:
                                                "1px solid #777"
                                        }}
                                    />

                                    <span>
                                        Classe {item.classe}
                                        {" "}
                                        ({item.minimo} – {item.maximo})
                                    </span>

                                </div>

                            )
                        )}

                      

                    </div>

                      

                )}

            </MapContainer>

            <div>
            Fonte: World Bank Group. (n.d.). <i>Climate Change Knowledge Portal (CCKP): Guinea-Bissau – Climate Data Projections.</i>
            Retrieved from:
    <a href="https://climateknowledgeportal.worldbank.org/country/guinea-bissau/climate-data-projections" target="_blank">
        https://climateknowledgeportal.worldbank.org/country/guinea-bissau/climate-data-projections
    </a>
        (Accessed on 25 Jul 2026).
    </div>

        </div>

        </>

    );

}


/* =========================
   PRINCIPAL
========================= */

function Mapas_climatologia() {

    // ==========================================
    // DADOS DOS MAPAS + FILTROS
    // ==========================================

    const [
        dadosFiltros,
        setDadosFiltros
    ] = useState([]);

    // Quantidade total de combinações de mapas disponíveis.
    const quantidadeMapas = dadosFiltros.length;


    // ==========================================
    // FILTROS
    // ==========================================

    const [
    indicadorSelecionado,
    setIndicadorSelecionado
    ] = useState("");

    const [
        tipoSelecionado,
        setTipoSelecionado
    ] = useState("");

    const [
        filtroPeriodo,
        setFiltroPeriodo
    ] = useState("");

    const [
        filtroSSP,
        setFiltroSSP
    ] = useState("");

    const [
        filtroPercentil,
        setFiltroPercentil
    ] = useState("");


    // ==========================================
    // CLASSIFICAÇÕES
    // ==========================================

    const [
        classificacoes,
        setClassificacoes
    ] = useState([]);


    // ==========================================
    // CARREGAR DADOS DOS FILTROS
    // ==========================================

    useEffect(() => {

        async function carregarDadosFiltros() {

            try {

                const response = await fetch(
                    `${API_URL}/clima/mapas-filtros`
                );

                const dados =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        dados.erro ||
                        "Erro ao carregar dados dos filtros."
                    );

                }

                console.log(
                    "DADOS DOS FILTROS:",
                    dados
                );

                setDadosFiltros(dados);

            } catch (erro) {

                console.error(
                    "Erro ao carregar dados dos filtros:",
                    erro
                );

                setDadosFiltros([]);

            }

        }

        carregarDadosFiltros();

    }, []);


    // ==========================================
    // TIPOS
    // ==========================================

    const tipos = [
        ...new Set(
            dadosFiltros
                .map(
                    (item) => item.tipo
                )
                .filter(Boolean)
        )
    ];


    // ==========================================
    // SELECIONAR PRIMEIRO TIPO
    // ==========================================

    useEffect(() => {

        if (
            tipos.length > 0 &&
            !tipoSelecionado
        ) {

            setTipoSelecionado(
                tipos[0]
            );

        }

    }, [
        tipos,
        tipoSelecionado
    ]);


    // ==========================================
    // DADOS DO TIPO
    // ==========================================

    const dadosTipo =
        dadosFiltros.filter(
            (item) =>
                !tipoSelecionado ||
                item.tipo === tipoSelecionado
        );


        const indicadoresTipo = [
            ...new Map(
                dadosTipo.map((item) => [
                    item.codigo,
                    item
                ])  
            ).values()
        ];


        // ==========================================
            // SELECIONAR PRIMEIRO INDICADOR
            // ==========================================

            useEffect(() => {

                if (
                    indicadoresTipo.length === 0
                ) {

                    setIndicadorSelecionado("");

                    return;

                }

                if (
                    !indicadoresTipo.some(
                        (item) =>
                            String(item.codigo).toLowerCase() ===
                            String(indicadorSelecionado).toLowerCase()
                    )
                ) {

                    setIndicadorSelecionado(
                        String(
                            indicadoresTipo[0].codigo
                        )
                    );

                }

            }, [
                tipoSelecionado,
                indicadoresTipo,
                indicadorSelecionado
            ]);



            // ==========================================
            // DADOS DO INDICADOR
            // ==========================================

            const dadosIndicador =
                dadosTipo.filter(
                    (item) =>
                        !indicadorSelecionado ||
                        String(item.codigo).toLowerCase() ===
                        String(indicadorSelecionado).toLowerCase()
                );


    // ==========================================
    // PERÍODOS
    // ==========================================

        const periodos = [
            ...new Set(
                dadosIndicador
                    .map(
                        (item) => item.period
                    )
                    .filter(Boolean)
            )
        ];


    // ==========================================
    // SELECIONAR PRIMEIRO PERÍODO
    // ==========================================

    useEffect(() => {

        if (
            periodos.length === 0
        ) {

            setFiltroPeriodo("");

            return;

        }

        if (
            !periodos.includes(
                filtroPeriodo
            )
        ) {

            setFiltroPeriodo(
                periodos[0]
            );

        }

    }, [
        tipoSelecionado,
        periodos,
        filtroPeriodo
    ]);


    // ==========================================
    // DADOS DO PERÍODO
    // ==========================================

   const dadosPeriodo =
    dadosIndicador.filter(
            (item) =>
                !filtroPeriodo ||
                String(item.period) ===
                String(filtroPeriodo)
        );


    // ==========================================
    // SSP
    // ==========================================

    const ssps = [
        ...new Set(
            dadosPeriodo
                .map(
                    (item) => item.scenario
                )
                .filter(Boolean)
        )
    ];


    // ==========================================
    // SELECIONAR PRIMEIRO SSP
    // ==========================================

    useEffect(() => {

        if (
            ssps.length === 0
        ) {

            setFiltroSSP("");

            return;

        }

        if (
            !ssps.includes(
                filtroSSP
            )
        ) {

            setFiltroSSP(
                ssps[0]
            );

        }

    }, [
        filtroPeriodo,
        ssps,
        filtroSSP
    ]);


    // ==========================================
    // DADOS DO SSP
    // ==========================================

    const dadosSSP =
        dadosPeriodo.filter(
            (item) =>
                !filtroSSP ||
                String(item.scenario) ===
                String(filtroSSP)
        );


    // ==========================================
    // PERCENTIS
    // ==========================================

    const percentis = [
        ...new Set(
            dadosSSP
                .map(
                    (item) => item.uncertainty
                )
                .filter(Boolean)
        )
    ];


    // ==========================================
    // NORMALIZAR PERCENTIL
    // ==========================================

    const normalizarPercentil = (
        valor
    ) => {

        const texto =
            String(valor || "")
                .trim()
                .replace("%", "")
                .replace(",", ".");

        const numero =
            Number(texto);

        if (
            Number.isNaN(numero)
        ) {

            return "";

        }

        if (
            numero > 1
        ) {

            return numero / 100;

        }

        return numero;

    };


    // ==========================================
    // SELECIONAR PRIMEIRO PERCENTIL
    // ==========================================

    useEffect(() => {

        if (
            percentis.length === 0
        ) {

            setFiltroPercentil("");

            return;

        }

        if (
            !percentis.includes(
                filtroPercentil
            )
        ) {

            setFiltroPercentil(
                percentis[0]
            );

        }

    }, [
        filtroSSP,
        percentis,
        filtroPercentil
    ]);


    // ==========================================
    // MAPA CORRESPONDENTE
    // ==========================================

    const mapasSelecionados =
        dadosFiltros.filter(
            (item) => {

                const indicadorOk =
                !indicadorSelecionado ||
                String(item.codigo).toLowerCase() ===
                String(indicadorSelecionado).toLowerCase();

                const tipoOk =
                    !tipoSelecionado ||
                    item.tipo ===
                    tipoSelecionado;


                const periodoOk =
                    !filtroPeriodo ||
                    String(item.period) ===
                    String(filtroPeriodo);


                const sspOk =
                    !filtroSSP ||
                    String(item.scenario) ===
                    String(filtroSSP);


                const percentilOk =
                    !filtroPercentil ||
                    normalizarPercentil(
                        item.uncertainty
                    ) ===
                    normalizarPercentil(
                        filtroPercentil
                    );


                return (
                    indicadorOk &&
                    tipoOk &&
                    periodoOk &&
                    sspOk &&
                    percentilOk
                );

            }
        );


    // ==========================================
    // PRIMEIRO MAPA ENCONTRADO
    // ==========================================

    const mapaAtual =
        mapasSelecionados[0];


    // ==========================================
    // CLASSIFICAÇÕES DO INDICADOR
    // ==========================================

    useEffect(() => {

        async function carregarClassificacoes() {

            if (
                !mapaAtual?.codigo
            ) {

                setClassificacoes([]);

                return;

            }

            try {

                console.log(
                    "INDICADOR PARA CLASSIFICAÇÃO:",
                    mapaAtual.codigo
                );

                const response =
                    await fetch(
                        `${API_URL}/clima/classificacoes/${mapaAtual.codigo}`
                    );


                const dados =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        dados.erro ||
                        "Erro ao carregar classificações."
                    );

                }


                console.log(
                    "CLASSIFICAÇÕES:",
                    dados
                );


                setClassificacoes(
                    dados
                );

            } catch (erro) {

                console.error(
                    "Erro ao carregar classificações:",
                    erro
                );

                setClassificacoes([]);

            }

        }

        carregarClassificacoes();

    }, [
        mapaAtual?.codigo
    ]);


    // ==========================================
    // TELA
    // ==========================================

    return (

        <div
            className="content"
            id="content"
        >

            {/* HERO — conteúdo carregado do cadastro Banners e Heros */}
            <HeroDinamico pagina="mapas_climatologia" />


            {/* FILTROS */}

            <div
                style={{
                    marginTop: "10px"
                }}
            >

                <section
                    className="mapa-painel-filtros"
                    aria-label="Informações e filtros dos mapas de climatologia"
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce7e8",
                        borderRadius: "12px",
                        padding: "16px 18px",
                        marginBottom: "18px",
                        boxShadow: "0 3px 12px rgba(15, 23, 42, 0.05)"
                    }}
                >
                    <div
                        className="mapa-info-filtros"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            flexWrap: "wrap",
                            marginBottom: "12px"
                        }}
                    >
                        <p
                            className="mapa-info-texto"
                            style={{
                                margin: 0,
                                flex: "1 1 320px",
                                color: "#475569",
                                lineHeight: 1.5,
                                fontSize: "14px"
                            }}
                        >
                            Explore os mapas climáticos. Escolha o indicador, o período,
                            o cenário e o percentil para consultar a projeção desejada.
                        </p>
                        <div
                            className="mapa-contador"
                            aria-live="polite"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                borderRadius: "999px",
                                background: "#e6f4f1",
                                color: "#0f766e",
                                fontSize: "13px",
                                fontWeight: 600,
                                whiteSpace: "nowrap"
                            }}
                        >
                            <span aria-hidden="true">🗺️</span>
                            <span className="mapa-contador-numero">{quantidadeMapas}</span>
                            <span>{quantidadeMapas === 1 ? "mapa disponível" : "mapas disponíveis"}</span>
                        </div>
                    </div>

                    <div className="mapa-filtros">

                    <div className="mapa-filtro">
                        <label>Indicador</label>
                        <select
                        value={
                            indicadorSelecionado
                        }
                        onChange={(e) => {

                            setIndicadorSelecionado(
                                e.target.value
                            );

                            setFiltroPeriodo("");
                            setFiltroSSP("");
                            setFiltroPercentil("");

                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border:
                                "1px solid #ccc"
                        }}
                    >

                        {indicadoresTipo.map(
                            (indicador) => (

                                <option
                                    key={indicador.codigo}
                                    value={indicador.codigo}
                                >
                                    {indicador.codigo}
                                </option>

                            )
                        )}

                    </select>
                    </div>

                    <div className="mapa-filtro">
                        <label>Período</label>
                        <select
                        value={
                            filtroPeriodo
                        }
                        onChange={(e) => {

                            setFiltroPeriodo(
                                e.target.value
                            );

                            setFiltroSSP("");
                            setFiltroPercentil("");

                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border:
                                "1px solid #ccc"
                        }}
                    >


                        {periodos.map(
                            (periodo) => (

                                <option
                                    key={periodo}
                                    value={periodo}
                                >
                                    {periodo}
                                </option>

                            )
                        )}

                    </select>
                    </div>

                    <div className="mapa-filtro">
                        <label>Cenário</label>
                        <select
                        value={
                            filtroSSP
                        }
                        onChange={(e) => {

                            setFiltroSSP(
                                e.target.value
                            );

                            setFiltroPercentil("");

                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border:
                                "1px solid #ccc"
                        }}
                    >

                       

                        {ssps.map(
                            (ssp) => (

                                <option
                                    key={ssp}
                                    value={ssp}
                                >
                                    {ssp}
                                </option>

                            )
                        )}

                    </select>
                    </div>

                    <div className="mapa-filtro">
                        <label>Percentil</label>
                        <select
                        value={
                            filtroPercentil
                        }
                        onChange={(e) => {

                            setFiltroPercentil(
                                e.target.value
                            );

                        }}
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border:
                                "1px solid #ccc"
                        }}
                    >

                    

                        {percentis.map(
                            (percentil) => (

                                <option
                                    key={percentil}
                                    value={percentil}
                                >
                                    {
                                        normalizarPercentil(
                                            percentil
                                        ) * 100
                                    }%
                                </option>

                            )
                        )}

                    </select>
                    </div>

                    </div>
                </section>

            </div>

            


            {/* MAPA */}

            {dadosFiltros.length === 0 && (
                <div style={{
                    padding: "24px",
                    marginTop: "12px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    textAlign: "center"
                }}>
                    <strong>Nenhum mapa disponível para esta seleção.</strong>
                    <p style={{ marginBottom: 0 }}>
                        Experimente selecionar outro indicador, período, cenário ou percentil.
                    </p>
                </div>
            )}

            {mapaAtual && classificacoes.length > 0 && (

                <MapaItem
                    key={`${mapaAtual.arquivo}-${mapaAtual.codigo}-${classificacoes.length}`}

                    file={
                        mapaAtual.arquivo
                    }

                    campo={
                        mapaAtual.campo
                    }

                    titulo={
                         mapaAtual.titulo_pt
                    }

                    classificacoes={
                        classificacoes
                    }

                    tipos={
                        tipos
                    }

                    tipoSelecionado={
                        tipoSelecionado
                    }

                    setTipoSelecionado={
                        setTipoSelecionado
                    }
                />

            )}

        </div>

    );

}
export default Mapas_climatologia;