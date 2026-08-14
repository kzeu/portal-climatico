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

    const [
        mapaSelecionado,
        setMapaSelecionado
    ] = useState("");


    const [
        mapas,
        setMapas
    ] = useState([]);

    const [
    indicadores,
    setIndicadores
] = useState([]);

const [
    indicadorSelecionado,
    setIndicadorSelecionado
] = useState("");


    const [
        carregandoMapas,
        setCarregandoMapas
    ] = useState(true);

    const [
            classificacoes,
            setClassificacoes
        ] = useState([]);

        const [filtroPeriodo, setFiltroPeriodo] =
    useState("");

const [filtroSSP, setFiltroSSP] =
    useState("");

const [filtroPercentil, setFiltroPercentil] =
    useState("");


    useEffect(() => {

    async function carregarIndicadores() {

        try {

            const response = await fetch(
                `${API_URL}/clima/indicadores`
            );

            const dados =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    dados.erro ||
                    "Erro ao carregar indicadores."
                );

            }

            console.log(
                "INDICADORES:",
                dados
            );

            setIndicadores(dados);

            if (dados.length > 0) {

                setIndicadorSelecionado(
                    String(dados[0].id)
                );

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar indicadores:",
                erro
            );

        }

    }

    carregarIndicadores();

}, []);

    /* =========================
       BUSCAR MAPAS
    ========================= */

    useEffect(() => {

        async function carregarMapas() {

            if (!indicadorSelecionado) {
                    return;
                }

            try {

                const response =
                    await fetch(
                        `${API_URL}/clima/mapas/${indicadorSelecionado}`
                    );


                const dados =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        dados.erro ||
                        "Erro ao carregar mapas."
                    );

                }


                console.log(
                    "MAPAS:",
                    dados
                );


                setMapas(dados);


                if (
                    dados.length > 0
                ) {

                    setMapaSelecionado(
                        String(
                            dados[0].id
                        )
                    );

                }

            }

            catch (erro) {

                console.error(
                    "Erro:",
                    erro
                );

            }

            finally {

                setCarregandoMapas(
                    false
                );

            }

        }


        carregarMapas();

    }, [indicadorSelecionado]);

        useEffect(() => {

            async function carregarClassificacoes() {

                if (!indicadorSelecionado) {
                    return;
                }

                try {

                    const indicador =
                        indicadores.find(
                            (item) =>
                                String(item.id) ===
                                String(indicadorSelecionado)
                        );

                    if (!indicador) {
                        return;
                    }

                    console.log(
                        "INDICADOR PARA CLASSIFICAÇÃO:",
                        indicador
                    );

                    const response =
                        await fetch(
                            `${API_URL}/clima/classificacoes/${indicador.codigo}`
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

                    setClassificacoes(dados);

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
            indicadorSelecionado,
            indicadores
        ]);

const periodos = [
    ...new Set(
        mapas
            .map((mapa) => mapa.periodo)
            .filter(Boolean)
    )
];

const ssps = [
    ...new Set(
        mapas
            .map((mapa) => mapa.ssp)
            .filter(Boolean)
    )
];

const percentis = [
    ...new Set(
        mapas
            .map((mapa) => mapa.percentil)
            .filter(Boolean)
    )
];

const mapasFiltrados = mapas.filter((mapa) => {

    const periodoOk =
        !filtroPeriodo ||
        mapa.periodo === filtroPeriodo;

    const sspOk =
        !filtroSSP ||
        mapa.ssp === filtroSSP;

    const percentilOk =
        !filtroPercentil ||
        mapa.percentil === filtroPercentil;

    return (
        periodoOk &&
        sspOk &&
        percentilOk
    );

});


    /* =========================
       MAPA SELECIONADO
    ========================= */

    const mapaAtual =
    mapasFiltrados.find(
        (mapa) =>
            String(mapa.id) ===
            String(mapaSelecionado)
    ) ||
    mapasFiltrados[0];

    


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


            {/* SELECT */}

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

                <select


                value={filtroPeriodo}
                onChange={(e) => {
                    setFiltroPeriodo(e.target.value);
                    setMapaSelecionado("");
                }}
                style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            >
                <option value="">
                    Periodo
                </option>

                {periodos.map((periodo) => (
                    <option
                        key={periodo}
                        value={periodo}
                    >
                        {periodo}
                    </option>
                ))}
            </select>

            <select
                value={filtroSSP}
                onChange={(e) => {
                    setFiltroSSP(e.target.value);
                    setMapaSelecionado("");
                }}
                style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            >
                <option value="">
                    SSP
                </option>

                {ssps.map((ssp) => (
                    <option
                        key={ssp}
                        value={ssp}
                    >
                        SSP {ssp}
                    </option>
                ))}
            </select>

            <select
                value={filtroPercentil}
                onChange={(e) => {
                    setFiltroPercentil(e.target.value);
                    setMapaSelecionado("");
                }}
                style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc"
                }}
            >
                <option value="">
                    percentis
                </option>

                {percentis.map((percentil) => (
                    <option
                        key={percentil}
                        value={percentil}
                    >
                        {percentil}
                    </option>
                ))}
            </select>

                <select
                    value={
                        mapaSelecionado
                    }
                    onChange={(e) =>
                        setMapaSelecionado(
                            e.target.value
                        )
                    }
                    style={{
                        width: "280px",
                        padding: "10px",
                        borderRadius: "8px",
                        border:
                            "1px solid #ccc",
                        marginBottom:
                            "10px"
                    }}
                >

                    {carregandoMapas ? (

                        <option>
                            Carregando mapas...
                        </option>

                    ) : (

                        mapasFiltrados.map(
                            (mapa) => (

                                <option
                                    key={
                                        mapa.id
                                    }
                                    value={
                                        mapa.id
                                    }
                                >
                                    {mapa.campo}
                                </option>

                            )
                        )

                    )}

                </select>

            </div>

            </div>


            {/* MAPA */}

            {mapaAtual && (

                <MapaItem
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