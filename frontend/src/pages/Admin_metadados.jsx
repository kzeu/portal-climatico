import { useEffect, useState } from "react";


/* =====================================================
   API
===================================================== */

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "";


/* =====================================================
   COMPONENTE
===================================================== */

function Admin_metadados() {

    const [arquivo, setArquivo] =
        useState(null);

    const [quantidadeAtual, setQuantidadeAtual] =
        useState(0);

    const [carregando, setCarregando] =
        useState(false);

    const [mensagem, setMensagem] =
        useState("");

    const [erro, setErro] =
        useState("");


    /* =====================================================
       CARREGAR QUANTIDADE ATUAL
    ===================================================== */

    async function carregarQuantidade() {

        try {

            const response =
                await fetch(
                    `${API_URL}/clima/map-metadata`
                );


            const dados =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    dados.erro ||
                    "Erro ao carregar metadados."
                );

            }


            setQuantidadeAtual(
                Array.isArray(dados)
                    ? dados.length
                    : 0
            );

        }
        catch (err) {

            console.error(
                err
            );

        }

    }


    useEffect(() => {

        carregarQuantidade();

    }, []);


    /* =====================================================
       SELECIONAR ARQUIVO
    ===================================================== */

    function selecionarArquivo(event) {

        setMensagem("");

        setErro("");


        const selecionado =
            event.target.files?.[0];


        if (!selecionado) {

            setArquivo(null);

            return;

        }


        const nome =
            selecionado.name.toLowerCase();


        if (
            !nome.endsWith(".xlsx") &&
            !nome.endsWith(".xls")
        ) {

            setErro(
                "Selecione um arquivo Excel (.xlsx ou .xls)."
            );

            event.target.value = "";

            setArquivo(null);

            return;

        }


        setArquivo(
            selecionado
        );

    }


    /* =====================================================
       ENVIAR
    ===================================================== */

    async function importarMetadados() {

        if (!arquivo) {

            setErro(
                "Selecione um arquivo Excel."
            );

            return;

        }


        const confirmar =
            window.confirm(
                `ATENÇÃO!\n\n` +
                `A importação irá substituir ` +
                `todos os ${quantidadeAtual} registros ` +
                `atuais de metadados.\n\n` +
                `Deseja continuar?`
            );


        if (!confirmar) {

            return;

        }


        setCarregando(true);

        setMensagem("");

        setErro("");


        try {

            const formData =
                new FormData();


            formData.append(
                "arquivo",
                arquivo
            );


            const response =
                await fetch(
                    `${API_URL}/clima/map-metadata/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const dados =
                await response.json();


            if (!response.ok) {

                const detalhes =
                    Array.isArray(
                        dados.detalhes
                    )
                        ? "\n\n" +
                          dados.detalhes.join(
                              "\n"
                          )
                        : "";


                throw new Error(
                    (
                        dados.erro ||
                        "Erro ao importar metadados."
                    ) +
                    detalhes
                );

            }


            setMensagem(
                `Importação concluída com sucesso. ` +
                `${dados.registros} registros foram inseridos.`
            );


            setArquivo(null);


            const input =
                document.getElementById(
                    "arquivo-metadados"
                );


            if (input) {

                input.value = "";

            }


            await carregarQuantidade();

        }
        catch (err) {

            console.error(
                err
            );


            setErro(
                err.message
            );

        }
        finally {

            setCarregando(false);

        }

    }


    /* =====================================================
       INTERFACE
    ===================================================== */

    return (

        <div
            style={{
                width: "100%",
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >

            {/* CABEÇALHO */}

            <div
                style={{
                    marginBottom: "25px"
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        color: "#176b5f"
                    }}
                >
                    Metadados dos Mapas
                </h2>


                <p
                    style={{
                        marginTop: "8px",
                        color: "#666"
                    }}
                >
                    Importe a planilha Excel com
                    os metadados dos mapas climáticos.
                </p>

            </div>


            {/* STATUS ATUAL */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        background: "#f4f7f7",
                        borderRadius: "10px",
                        padding: "18px 25px",
                        minWidth: "220px",
                        border:
                            "1px solid #e0e5e5"
                    }}
                >

                    <div
                        style={{
                            fontSize: "13px",
                            color: "#777",
                            marginBottom: "5px"
                        }}
                    >
                        Registros atuais
                    </div>


                    <strong
                        style={{
                            fontSize: "28px",
                            color: "#176b5f"
                        }}
                    >
                        {quantidadeAtual}
                    </strong>

                </div>

            </div>


            {/* ÁREA DE UPLOAD */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "30px",
                    border:
                        "1px solid #e1e5e5",
                    boxShadow:
                        "0 3px 12px rgba(0,0,0,0.06)"
                }}
            >

                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: "10px"
                    }}
                >
                    Nova planilha de metadados
                </h3>


                <p
                    style={{
                        color: "#666",
                        lineHeight: 1.6
                    }}
                >
                    A planilha deve possuir as
                    seguintes colunas:
                </p>


                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "25px"
                    }}
                >

                    {[
                        "map_code",
                        "variable_full",
                        "variable_short",
                        "period",
                        "scenario",
                        "uncertainty"
                    ].map(
                        coluna => (

                            <span
                                key={coluna}
                                style={{
                                    background:
                                        "#eef6f4",
                                    color:
                                        "#176b5f",
                                    padding:
                                        "6px 10px",
                                    borderRadius:
                                        "6px",
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "600"
                                }}
                            >
                                {coluna}
                            </span>

                        )
                    )}

                </div>


                {/* INPUT */}

                <label
                    htmlFor="arquivo-metadados"
                    style={{
                        display: "block",
                        border:
                            "2px dashed #b8d5d0",
                        borderRadius: "10px",
                        padding: "30px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: "#fafcfc"
                    }}
                >

                    <div
                        style={{
                            fontSize: "38px",
                            marginBottom: "10px"
                        }}
                    >
                        📊
                    </div>


                    <strong>
                        Clique para selecionar
                        o arquivo Excel
                    </strong>


                    <div
                        style={{
                            marginTop: "6px",
                            color: "#777",
                            fontSize: "13px"
                        }}
                    >
                        Formatos aceitos:
                        .xlsx e .xls
                    </div>


                    <input
                        id="arquivo-metadados"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={
                            selecionarArquivo
                        }
                        style={{
                            display: "none"
                        }}
                    />

                </label>


                {/* ARQUIVO SELECIONADO */}

                {arquivo && (

                    <div
                        style={{
                            marginTop: "18px",
                            padding: "15px",
                            background:
                                "#f2f8f6",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >

                        <div>

                            <strong>
                                Arquivo selecionado
                            </strong>

                            <div
                                style={{
                                    marginTop: "4px",
                                    color: "#555",
                                    fontSize: "14px"
                                }}
                            >
                                {arquivo.name}
                            </div>

                        </div>

                        <span
                            style={{
                                color: "#176b5f",
                                fontWeight: "bold"
                            }}
                        >
                            {(arquivo.size / 1024)
                                .toFixed(1)} KB
                        </span>

                    </div>

                )}


                {/* AVISO */}

                <div
                    style={{
                        marginTop: "25px",
                        padding: "15px",
                        borderRadius: "8px",
                        background: "#fff7e6",
                        border:
                            "1px solid #f0d28a",
                        color: "#765d1d",
                        lineHeight: 1.5
                    }}
                >

                    <strong>
                        ⚠ Atenção
                    </strong>

                    <br />

                    A importação substituirá
                    todos os metadados atuais
                    pelos registros da nova planilha.

                </div>


                {/* ERRO */}

                {erro && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            borderRadius: "8px",
                            background: "#fdecec",
                            border:
                                "1px solid #efb0b0",
                            color: "#a32020",
                            whiteSpace:
                                "pre-line"
                        }}
                    >
                        {erro}
                    </div>

                )}


                {/* SUCESSO */}

                {mensagem && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            borderRadius: "8px",
                            background: "#eaf7ef",
                            border:
                                "1px solid #b6dfc4",
                            color: "#176b3a"
                        }}
                    >
                        ✓ {mensagem}
                    </div>

                )}


                {/* BOTÃO */}

                <button
                    type="button"
                    onClick={
                        importarMetadados
                    }
                    disabled={
                        !arquivo ||
                        carregando
                    }
                    style={{
                        marginTop: "25px",
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                            !arquivo ||
                            carregando
                                ? "#b8c5c2"
                                : "#16855f",
                        color: "white",
                        fontSize: "15px",
                        fontWeight: "bold",
                        cursor:
                            !arquivo ||
                            carregando
                                ? "not-allowed"
                                : "pointer"
                    }}
                >

                    {carregando
                        ? "Importando..."
                        : "Importar Metadados"}

                </button>

            </div>

        </div>

    );

}


export default Admin_metadados;