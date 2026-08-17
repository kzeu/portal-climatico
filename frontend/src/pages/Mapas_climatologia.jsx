import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const API_URL = "http://localhost:3000";


/* =========================
   MAPA
========================= */

function MapaItem({
    file,
    campo,
    titulo,
    classificacoes
}) {

    const [data, setData] = useState(null);

    useEffect(() => {

        if (!file) {
            return;
        }

       fetch(`${API_URL}/maps/${file}`)
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

        layer.bindPopup(nome);

        layer.bindTooltip(nome, {
            permanent: false,
            direction: "center"
        });

    };


    return (

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
                            Legenda
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

        </div>

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

            {/* HERO */}

            <div className="hero">

                <h1>
                    Mapas de Climatologia
                </h1>

                <p>
                    Visualização das projeções
                    climáticas para a
                    Guiné-Bissau.
                </p>

            </div>


            {/* FILTROS */}

            <div
                style={{
                    marginTop: "10px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "20px",
                        marginBottom: "15px"
                    }}
                >

                   {/* INDICADOR */}
                   
                   {/* TIPO */}

                    <select
                        value={tipoSelecionado}
                        onChange={(e) => {

                            setTipoSelecionado(
                                e.target.value
                            );

                            setIndicadorSelecionado("");
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

                        {tipos.map(
                            (tipo) => (

                                <option
                                    key={tipo}
                                    value={tipo}
                                >
                                    {tipo}
                                </option>

                            )
                        )}

                    </select>
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


                    {/* PERÍODO */}

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


                    {/* SSP */}

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


                    {/* PERCENTIL */}

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


            {/* MAPA */}

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
                        mapaAtual.campo
                    }

                    classificacoes={
                        classificacoes
                    }
                />

            )}

        </div>

    );

}
export default Mapas_climatologia;