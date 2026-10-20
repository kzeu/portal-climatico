import { useState } from "react";
import "../App.css";
import API_URL from "../config";

function Form_submissao_climatica() {

    // =====================================================
    // TIPOS DE CADA DESTINO
    // =====================================================

    const tiposCard = [
        "Evento",
        "Workshop",
        "Treinamento",
        "Concurso",
        "Notícia",
        "Iniciativa Local",
        "Iniciativa Nacional",
        "Projeto Curto"
    ];

    const tiposBiblioteca = [
        "Projeto Longo",
        "Publicação",
        "Relatório",
        "Base de Dados",
        "Mapa"
    ];

   

    // =====================================================
    // FORMULÁRIO
    // =====================================================

    const [form, setForm] = useState({

        // IDENTIFICAÇÃO

        data_submissao:
            new Date().toISOString().split("T")[0],

        email: "",

        tipo_proponente: "",

        entidade: "",

        nome_responsavel: "",

        cargo: "",

        website: "",


        // SUBMISSÃO

        tipo_submissao: "",

        idioma: "",

        titulo: "",

        titulo_curto: "",

        descricao: "",

        data_publicacao: "",

        data_retirada: "",


        // EVENTO / PROJETO

        data_inicio: "",

        hora_inicio: "",

        data_fim: "",

        hora_fim: "",

        evento_online: false,

        local1: "",

        local2: "",

        link: "",


        // PROJETO

        area_projeto: "",

        parceiros: "",

        objetivo_projeto: "",


        // OUTRO

        tipo_conteudo_outro: "",

        objetivo_outro: "",

        descricao_outro: "",

        observacoes_outro: "",


        // ADMIN / CONFIRMAÇÃO

        permissao_publicacao: false,

        motivo_publicacao: "",

        descricao_documento: "",

        tags: "",


        // =================================================
        // CARD
        // =================================================

        tipo_link: "interno",

        pagina_card: "",

        link_externo: "",

        titulo_pagina: "",

        texto_pagina: "",

        data_publicacao_pagina: "",

        imagem_card_index: "",


        // =================================================
        // BIBLIOTECA
        // =================================================

        biblioteca_link: ""

    });


    // =====================================================
    // ARQUIVOS GERAIS
    // =====================================================

    const [arquivos, setArquivos] = useState([]);


    // =====================================================
    // FOTOS DA PÁGINA
    // =====================================================

    const [imagensPagina, setImagensPagina] = useState([]);


    // =====================================================
    // FUNÇÃO AUXILIAR
    // =====================================================

    


    // =====================================================
    // ALTERAR CAMPO
    // =====================================================

    function alterarCampo(e) {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm({

            ...form,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        });

    }


    // =====================================================
    // QUANDO MUDA O TIPO DE SUBMISSÃO
    // =====================================================

    function alterarTipoSubmissao(e) {

        const novoTipo = e.target.value;

        setForm({

            ...form,

            tipo_submissao: novoTipo,

            // limpa dados de Card
            pagina_card: "",
            tipo_link: "interno",
            link_externo: "",
            titulo_pagina: "",
            texto_pagina: "",
            data_publicacao_pagina: "",
            imagem_card_index: "",

            // limpa Biblioteca
            biblioteca_link: ""

        });

        setImagensPagina([]);

        setArquivos([]);

    }


    // =====================================================
    // ARQUIVOS GERAIS
    // =====================================================

    function selecionarArquivos(e) {

        const selecionados =
            Array.from(e.target.files);

        setArquivos(selecionados);

    }


    // =====================================================
    // IMAGENS DA PÁGINA
    // MÁXIMO 5
    // =====================================================

    function selecionarImagensPagina(e) {

        const selecionadas =

            Array.from(e.target.files)

                .filter(arquivo =>
                    arquivo.type.startsWith("image/")
                )

                .slice(0, 5);


        setImagensPagina(
            selecionadas
        );

    }


    // =====================================================
    // IMAGEM DO CARD
    // =====================================================

    function selecionarImagemCard(e) {

        const arquivo =
            e.target.files[0];

        if (!arquivo) {

            return;

        }


        setArquivos(
            anteriores => {

                const novosArquivos = [
                    ...anteriores,
                    arquivo
                ];


                setForm({

                    ...form,

                    imagem_card_index:
                        String(
                            novosArquivos.length - 1
                        )

                });


                return novosArquivos;

            }
        );

    }


    // =====================================================
    // ARQUIVO DA BIBLIOTECA
    // =====================================================

    function selecionarArquivoBiblioteca(e) {

        const arquivo =
            e.target.files[0];

        if (!arquivo) {

            return;

        }


        setArquivos(
            anteriores => {

                return [
                    ...anteriores,
                    arquivo
                ];

            }
        );

    }


    // =====================================================
    // VERIFICAÇÕES
    // =====================================================

    const tipoAtual =
        form.tipo_submissao;


    const deveMostrarCard =
        tiposCard.includes(tipoAtual) ||
        tipoAtual === "Outro";


    const deveMostrarBiblioteca =
        tiposBiblioteca.includes(tipoAtual) ||
        tipoAtual === "Outro";


    const deveMostrarEvento =
        [
            "Evento",
            "Workshop",
            "Treinamento",
            "Concurso"
        ].includes(tipoAtual);


    const deveMostrarProjeto =
        [
            "Projeto Curto",
            "Projeto Longo"
        ].includes(tipoAtual);


    // =====================================================
    // SALVAR
    // =====================================================

    async function salvar(e) {

        e.preventDefault();


        try {

            const formData =
                new FormData();


            // =================================================
            // CAMPOS
            // =================================================

            Object.entries(form).forEach(
                ([chave, valor]) => {

                    if (
                        valor !== null &&
                        valor !== undefined
                    ) {

                        formData.append(
                            chave,
                            valor
                        );

                    }

                }
            );


            // =================================================
            // ARQUIVOS
            // =================================================

            arquivos.forEach(
                arquivo => {

                    formData.append(
                        "arquivos",
                        arquivo
                    );

                }
            );


            // =================================================
            // FOTOS DA PÁGINA
            // =================================================

            imagensPagina.forEach(
                imagem => {

                    formData.append(
                        "imagens_pagina",
                        imagem
                    );

                }
            );


            // =================================================
            // ENVIO
            // =================================================

            const response =
                await fetch(
                    `${API_URL}/submissoes`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const resultado =
                await response.json();


            if (!response.ok) {

                alert(
                    resultado.erro ||
                    "Erro ao enviar submissão."
                );

                return;

            }


            alert(
                "Submissão enviada com sucesso!"
            );


            console.log(
                "SUBMISSÃO:",
                resultado
            );


        }
        catch (err) {

            console.log(err);

            alert(
                "Erro ao enviar a submissão."
            );

        }

    }


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div
            className="content"
            id="content"
        >

            {/* CAIXA EXPLICATIVA */}
            <section
                aria-label="Orientações para submissão climática"
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "20px 22px",
                    marginBottom: "10px",
                    background: "#ffffff",
                    border: "1px solid #dce7e8",
                    borderLeft: "5px solid #0f766e",
                    borderRadius: "12px",
                    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.05)"
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        flexShrink: 0,
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        background: "#e6f4f1",
                        fontSize: "23px"
                    }}
                >
                    🌍
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                        style={{
                            margin: "0 0 7px",
                            color: "#164e4a",
                            fontSize: "19px"
                        }}
                    >
                        Compartilhe iniciativas e conhecimentos climáticos
                    </h2>

                    <p
                        style={{
                            margin: "0 0 12px",
                            color: "#475569",
                            lineHeight: 1.6,
                            fontSize: "14px"
                        }}
                    >
                        Utilize este formulário para enviar eventos, projetos, publicações,
                        relatórios, mapas, bases de dados e outras informações relacionadas
                        às mudanças climáticas na Guiné-Bissau.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "10px"
                        }}
                    >
                        {[
                            ["📋", "Preencha os dados obrigatórios"],
                            ["📎", "Anexe documentos ou imagens, quando necessário"],
                            ["🔎", "A submissão será analisada antes da publicação"]
                        ].map(([icone, texto]) => (
                            <div
                                key={texto}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    padding: "8px 10px",
                                    borderRadius: "8px",
                                    background: "#f3f8f8",
                                    color: "#334155",
                                    fontSize: "12px",
                                    lineHeight: 1.4
                                }}
                            >
                                <span aria-hidden="true">{icone}</span>
                                <span>{texto}</span>
                            </div>
                        ))}
                    </div>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "12px",
                            lineHeight: 1.5
                        }}
                    >
                        Antes de enviar, confira os dados e os links. O envio não significa
                        publicação automática; o conteúdo depende de análise e aprovação.
                    </p>
                </div>
            </section>

            <form
                className="form-container"
                onSubmit={salvar}
                style={{ marginTop: "0" }}
            >


                {/* =====================================================
                    TÍTULO
                ===================================================== */}

                <h1>
                    Submissão Climática
                </h1>


                {/* =====================================================
                    IDENTIFICAÇÃO
                ===================================================== */}

                <div className="form-box">

                    <h2>
                        Identificação
                    </h2>


                    <div className="form-grid">


                        {/* ORGANISMO */}

                        <div className="campo">

                            <label>
                                Organismo *
                            </label>

                            <select
                                name="tipo_proponente"
                                value={
                                    form.tipo_proponente
                                }
                                onChange={
                                    alterarCampo
                                }
                                required
                            >

                                <option value="">
                                    -- Selecione --
                                </option>

                                <option value="Individuo">
                                    Individuo
                                </option>

                                <option value="Instituição">
                                    Instituição
                                </option>

                                <option value="Organização">
                                    Organização
                                </option>

                            </select>

                        </div>


                        {/* DATA */}

                        <div className="campo">

                            <label>
                                Data da Submissão
                            </label>

                            <input
                                type="date"
                                name="data_submissao"
                                value={
                                    form.data_submissao
                                }
                                readOnly
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="campo campo-2">

                            <label>
                                E-mail *
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Digite seu e-mail"
                                required
                            />

                        </div>


                        {/* ENTIDADE */}

                        <div className="campo">

                            <label>
                                Nome da Entidade *
                            </label>

                            <input
                                type="text"
                                name="entidade"
                                value={
                                    form.entidade
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Digite o nome da entidade"
                                required
                            />

                        </div>


                        {/* RESPONSÁVEL */}

                        <div className="campo">

                            <label>
                                Nome do Responsável *
                            </label>

                            <input
                                type="text"
                                name="nome_responsavel"
                                value={
                                    form.nome_responsavel
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Digite o nome completo"
                                required
                            />

                        </div>


                        {/* CARGO */}

                        <div className="campo">

                            <label>
                                Cargo / Papel na Instituição
                            </label>

                            <input
                                type="text"
                                name="cargo"
                                value={
                                    form.cargo
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Cargo"
                            />

                        </div>


                        {/* WEBSITE */}

                        <div className="campo">

                            <label>
                                Website
                            </label>

                            <input
                                type="url"
                                name="website"
                                value={
                                    form.website
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="https://..."
                            />

                        </div>


                    </div>

                </div>


                {/* =====================================================
                    INFORMAÇÃO SOBRE A SUBMISSÃO
                ===================================================== */}

                <div className="form-box">

                    <h2>
                        Informação sobre a Submissão
                    </h2>


                    <div className="form-grid">


                        {/* TIPO */}

                        <div className="campo">

                            <label>
                                Tipo de Submissão *
                            </label>

                            <select
                                name="tipo_submissao"
                                value={
                                    form.tipo_submissao
                                }
                                onChange={
                                    alterarTipoSubmissao
                                }
                                required
                            >

                                <option value="">
                                    -- Selecione --
                                </option>

                                <option value="Evento">
                                    Evento
                                </option>

                                <option value="Workshop">
                                    Workshop
                                </option>

                                <option value="Treinamento">
                                    Treinamento
                                </option>

                                <option value="Concurso">
                                    Concurso
                                </option>

                                <option value="Notícia">
                                    Notícia
                                </option>

                                <option value="Iniciativa Local">
                                    Iniciativa Local
                                </option>

                                <option value="Iniciativa Nacional">
                                    Iniciativa Nacional
                                </option>

                                <option value="Projeto Curto">
                                    Projeto Curto
                                </option>

                                <option value="Projeto Longo">
                                    Projeto Climático (+6 meses)
                                </option>

                                <option value="Publicação">
                                    Publicação
                                </option>

                                <option value="Relatório">
                                    Relatório
                                </option>

                                <option value="Base de Dados">
                                    Base de Dados
                                </option>

                                <option value="Mapa">
                                    Mapa Estático
                                </option>

                                <option value="Outro">
                                    Outro
                                </option>

                            </select>

                        </div>

                        {/* PAINEL EXPLICATIVO DO DESTINO — apenas orientação visual; não altera as regras de envio */}
                        {form.tipo_submissao && (
                            <div
                                className="campo campo-2"
                                role="status"
                                aria-live="polite"
                                style={{
                                    padding: "18px",
                                    border: "1px solid #cfe3df",
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #f3fbf8 0%, #ffffff 100%)",
                                    marginTop: "4px"
                                }}
                            >
                                {(() => {
                                    const vaiCalendario = tiposCard.includes(form.tipo_submissao) || form.tipo_submissao === "Outro";
                                    const vaiBiblioteca = tiposBiblioteca.includes(form.tipo_submissao) || form.tipo_submissao === "Outro";
                                    return (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                                <span aria-hidden="true" style={{ fontSize: "25px" }}>🧭</span>
                                                <div>
                                                    <strong style={{ display: "block", color: "#164e4a", fontSize: "16px" }}>Onde esta submissão vai aparecer?</strong>
                                                    <span style={{ color: "#52616b", fontSize: "13px" }}>Destino previsto para “{form.tipo_submissao}”</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px" }}>
                                                {vaiCalendario && (
                                                    <div style={{ background: "#fff", border: "1px solid #d8e9e5", borderRadius: "11px", padding: "13px" }}>
                                                        <div style={{ fontSize: "23px", marginBottom: "5px" }} aria-hidden="true">📅</div>
                                                        <strong style={{ color: "#155e55" }}>Calendário de eventos e iniciativas</strong>
                                                        <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: 1.5, color: "#475569" }}>O conteúdo será encaminhado para o calendário e terá um Card preparado para publicação após análise e aprovação.</p>
                                                        <p style={{ margin: "7px 0 0", fontSize: "12px", color: "#64748b" }}>Para eventos: datas, horários e local ajudam a contextualizar a atividade.</p>
                                                    </div>
                                                )}
                                                {vaiBiblioteca && (
                                                    <div style={{ background: "#fff", border: "1px solid #d8e9e5", borderRadius: "11px", padding: "13px" }}>
                                                        <div style={{ fontSize: "23px", marginBottom: "5px" }} aria-hidden="true">📚</div>
                                                        <strong style={{ color: "#155e55" }}>Biblioteca climática</strong>
                                                        <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: 1.5, color: "#475569" }}>O item será encaminhado à Biblioteca e ficará pendente de análise antes de ser publicado.</p>
                                                        <p style={{ margin: "7px 0 0", fontSize: "12px", color: "#64748b" }}>Inclua o link e/ou o arquivo do material, quando disponíveis.</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ marginTop: "12px", padding: "12px", borderRadius: "10px", background: "#eef5ff", color: "#334155", fontSize: "13px", lineHeight: 1.55 }}>
                                                <strong>Como ficará o Card e a página de detalhes?</strong>
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px", marginTop: "9px" }}>
                                                    <div><span aria-hidden="true">🖼️ </span><strong>Imagem do Card:</strong> capa/miniatura que identifica o conteúdo nas páginas do portal.</div>
                                                    <div><span aria-hidden="true">📷 </span><strong>Fotos da página:</strong> imagens adicionais para a galeria da página de detalhes.</div>
                                                    <div><span aria-hidden="true">📎 </span><strong>Documentos e links:</strong> materiais de apoio associados à submissão; a exibição depende dos campos e recursos disponíveis na página.</div>
                                                </div>
                                            </div>
                                            {form.tipo_submissao === "Outro" && (
                                                <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#7c4a03" }}>
                                                    <strong>Este tipo segue os dois destinos:</strong> Calendário de eventos e iniciativas e Biblioteca, ambos pendentes de análise e aprovação.
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}


                        {/* IDIOMA */}

                        <div className="campo">

                            <label>
                                Idioma *
                            </label>

                            <select
                                name="idioma"
                                value={
                                    form.idioma
                                }
                                onChange={
                                    alterarCampo
                                }
                                required
                            >

                                <option value="">
                                    -- Selecione --
                                </option>

                                <option value="Português">
                                    Português
                                </option>

                                <option value="Criolo">
                                    Criolo
                                </option>

                                <option value="Inglês">
                                    Inglês
                                </option>

                                <option value="Francês">
                                    Francês
                                </option>

                                <option value="Linguas Nacionais">
                                    Línguas Nacionais
                                </option>

                                <option value="Outras">
                                    Outras
                                </option>

                            </select>

                        </div>


                        {/* TÍTULO */}

                        <div className="campo">

                            <label>
                                Título *
                            </label>

                            <input
                                type="text"
                                name="titulo"
                                value={
                                    form.titulo
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Título da submissão"
                                required
                            />

                        </div>


                        {/* TÍTULO CURTO */}

                        <div className="campo">

                            <label>
                                Título Curto
                            </label>

                            <input
                                type="text"
                                name="titulo_curto"
                                value={
                                    form.titulo_curto
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Título resumido"
                            />

                        </div>


                        {/* DESCRIÇÃO */}

                        <div className="campo campo-2">

                            <label>
                                Descrição *
                            </label>

                            <textarea
                                name="descricao"
                                value={
                                    form.descricao
                                }
                                onChange={
                                    alterarCampo
                                }
                                rows={6}
                                placeholder="Descreva a submissão..."
                                required
                            />

                        </div>


                        {/* DATA PUBLICAÇÃO */}

                        <div className="campo">

                            <label>
                                Data de Publicação
                            </label>

                            <input
                                type="date"
                                name="data_publicacao"
                                value={
                                    form.data_publicacao
                                }
                                onChange={
                                    alterarCampo
                                }
                            />

                        </div>


                        {/* DATA RETIRADA */}

                        <div className="campo">

                            <label>
                                Data de Retirada
                            </label>

                            <input
                                type="date"
                                name="data_retirada"
                                value={
                                    form.data_retirada
                                }
                                onChange={
                                    alterarCampo
                                }
                            />

                        </div>


                    </div>

                </div>


                {/* =====================================================
                    CARD
                ===================================================== */}

                {deveMostrarCard && (

                    <div className="form-box">

                        <h2>
                            Publicação no Portal
                        </h2>


                        <p>
                            Esta submissão será transformada
                            em um Card após aprovação.
                        </p>


                        <div className="form-grid">


                            {/* PÁGINA */}

                            <div className="campo campo-2">

                                <label>
                                    Página onde o Card será publicado *
                                </label>

                                <select
                                    name="pagina_card"
                                    value={
                                        form.pagina_card
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                >

                                    <option value="">
                                        Selecione a página
                                    </option>

                                    <option value="home">
                                        Home
                                    </option>

                                    <option value="adaptacao">
                                        Adaptação
                                    </option>

                                    <option value="mitigacao">
                                        Mitigação
                                    </option>

                                    <option value="engajamento">
                                        Engajamento
                                    </option>

                                </select>

                            </div>


                            {/* DESTINO */}

                            <div className="campo campo-2">

                                <label>
                                    Destino do Card *
                                </label>

                                <select
                                    name="tipo_link"
                                    value={
                                        form.tipo_link
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                >

                                    <option value="interno">
                                        Página interna
                                    </option>

                                    <option value="externo">
                                        Link externo
                                    </option>

                                </select>

                            </div>


                            {/* LINK EXTERNO */}

                            {form.tipo_link === "externo" && (

                                <div className="campo campo-2">

                                    <label>
                                        Link externo *
                                    </label>

                                    <input
                                        type="url"
                                        name="link_externo"
                                        value={
                                            form.link_externo
                                        }
                                        onChange={
                                            alterarCampo
                                        }
                                        placeholder="https://..."
                                        required
                                    />

                                </div>

                            )}


                            {/* IMAGEM DO CARD */}

                            <div className="campo campo-2">

                                <label>
                                    Imagem do Card
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={
                                        selecionarImagemCard
                                    }
                                />

                                <small>
                                    Opcional. Será usada como
                                    imagem de entrada do Card.
                                </small>

                            </div>


                        </div>


                        {/* =================================================
                            PÁGINA INTERNA
                        ================================================= */}

                        {form.tipo_link === "interno" && (

                            <div className="secao-admin">

                                <h2>
                                    Conteúdo da Página
                                </h2>


                                <div className="form-grid">


                                    {/* TÍTULO */}

                                    <div className="campo">

                                        <label>
                                            Título da Página *
                                        </label>

                                        <input
                                            type="text"
                                            name="titulo_pagina"
                                            value={
                                                form.titulo_pagina
                                            }
                                            onChange={
                                                alterarCampo
                                            }
                                            placeholder="Título da página"
                                            required
                                        />

                                    </div>


                                    {/* DATA */}

                                    <div className="campo">

                                        <label>
                                            Data de Publicação
                                        </label>

                                        <input
                                            type="date"
                                            name="data_publicacao_pagina"
                                            value={
                                                form.data_publicacao_pagina
                                            }
                                            onChange={
                                                alterarCampo
                                            }
                                        />

                                    </div>


                                    {/* TEXTO */}

                                    <div className="campo campo-2">

                                        <label>
                                            Texto Completo *
                                        </label>

                                        <textarea
                                            name="texto_pagina"
                                            value={
                                                form.texto_pagina
                                            }
                                            onChange={
                                                alterarCampo
                                            }
                                            rows={10}
                                            placeholder="Escreva o conteúdo completo da página..."
                                            required
                                        />

                                    </div>


                                    {/* FOTOS */}

                                    <div className="campo campo-2">

                                        <label>
                                            Fotos da Página
                                            {" "}
                                            <span>
                                                (máximo 5)
                                            </span>
                                        </label>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={
                                                selecionarImagensPagina
                                            }
                                        />


                                        {imagensPagina.length > 0 && (

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    flexWrap: "wrap",
                                                    marginTop: "15px"
                                                }}
                                            >

                                                {imagensPagina.map(
                                                    (imagem, index) => (

                                                        <div
                                                            key={index}
                                                            style={{
                                                                width: "130px"
                                                            }}
                                                        >

                                                            <img
                                                                src={
                                                                    URL.createObjectURL(
                                                                        imagem
                                                                    )
                                                                }
                                                                alt=""
                                                                style={{
                                                                    width: "120px",
                                                                    height: "90px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "6px"
                                                                }}
                                                            />

                                                            <small>
                                                                Foto {index + 1}
                                                            </small>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>


                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* =====================================================
                    BIBLIOTECA
                ===================================================== */}

                {deveMostrarBiblioteca && (

                    <div className="form-box">

                        <h2>
                            Publicação na Biblioteca
                        </h2>


                        <p>
                            Esta submissão será disponibilizada
                            na Biblioteca após aprovação.
                        </p>


                        <div className="form-grid">


                            {/* LINK */}

                            <div className="campo campo-2">

                                <label>
                                    Link externo
                                </label>

                                <input
                                    type="url"
                                    name="biblioteca_link"
                                    value={
                                        form.biblioteca_link
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="https://..."
                                />

                                <small>
                                    Informe o link caso o material
                                    esteja disponível online.
                                </small>

                            </div>


                            {/* ARQUIVO */}

                            <div className="campo campo-2">

                                <label>
                                    Arquivo da Biblioteca
                                </label>

                                <input
                                    type="file"
                                    accept="
                                        .pdf,
                                        .doc,
                                        .docx,
                                        .xls,
                                        .xlsx,
                                        .ppt,
                                        .pptx,
                                        .zip
                                    "
                                    onChange={
                                        selecionarArquivoBiblioteca
                                    }
                                />

                                <small>
                                    Envie o documento que será
                                    disponibilizado na Biblioteca.
                                </small>

                            </div>


                        </div>

                    </div>

                )}


                {/* =====================================================
                    EVENTO
                ===================================================== */}

                {deveMostrarEvento && (

                    <div className="form-box">

                        <h2>
                            Dados do Evento
                        </h2>


                        <div className="form-grid">


                            {/* INÍCIO */}

                            <div className="campo">

                                <label>
                                    Data de Início *
                                </label>

                                <input
                                    type="date"
                                    name="data_inicio"
                                    value={
                                        form.data_inicio
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                />

                            </div>


                            {/* HORA */}

                            <div className="campo">

                                <label>
                                    Hora de Início
                                </label>

                                <input
                                    type="time"
                                    name="hora_inicio"
                                    value={
                                        form.hora_inicio
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                />

                            </div>


                            {/* FIM */}

                            <div className="campo">

                                <label>
                                    Data de Término
                                </label>

                                <input
                                    type="date"
                                    name="data_fim"
                                    value={
                                        form.data_fim
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                />

                            </div>


                            {/* HORA FIM */}

                            <div className="campo">

                                <label>
                                    Hora de Término
                                </label>

                                <input
                                    type="time"
                                    name="hora_fim"
                                    value={
                                        form.hora_fim
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                />

                            </div>


                            {/* LOCAL */}

                            <div className="campo">

                                <label>
                                    Local Principal
                                </label>

                                <input
                                    type="text"
                                    name="local1"
                                    value={
                                        form.local1
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="Cidade, Região ou Local"
                                />

                            </div>


                            {/* LOCAL COMPLEMENTAR */}

                            <div className="campo">

                                <label>
                                    Local Complementar
                                </label>

                                <input
                                    type="text"
                                    name="local2"
                                    value={
                                        form.local2
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="Endereço, Auditório, Sala..."
                                />

                            </div>


                            {/* ONLINE */}

                            <div className="campo campo-2">

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        cursor: "pointer"
                                    }}
                                >

                                    <input
                                        type="checkbox"
                                        name="evento_online"
                                        checked={
                                            form.evento_online
                                        }
                                        onChange={
                                            alterarCampo
                                        }
                                    />

                                    Evento Online

                                </label>

                            </div>


                            {/* LINK ONLINE */}

                            {form.evento_online && (

                                <div className="campo campo-2">

                                    <label>
                                        Link do Evento
                                    </label>

                                    <input
                                        type="url"
                                        name="link"
                                        value={
                                            form.link
                                        }
                                        onChange={
                                            alterarCampo
                                        }
                                        placeholder="https://..."
                                    />

                                </div>

                            )}


                        </div>

                    </div>

                )}


                {/* =====================================================
                    PROJETO
                ===================================================== */}

                {deveMostrarProjeto && (

                    <div className="form-box">

                        <h2>
                            Dados do Projeto
                        </h2>


                        <div className="form-grid">


                            {/* INÍCIO */}

                            <div className="campo">

                                <label>
                                    Data de Início *
                                </label>

                                <input
                                    type="date"
                                    name="data_inicio"
                                    value={
                                        form.data_inicio
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                />

                            </div>


                            {/* FIM */}

                            <div className="campo">

                                <label>
                                    Data Prevista de Término
                                </label>

                                <input
                                    type="date"
                                    name="data_fim"
                                    value={
                                        form.data_fim
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                />

                            </div>


                            {/* ÁREA */}

                            <div className="campo">

                                <label>
                                    Área de Atuação
                                </label>

                                <select
                                    name="area_projeto"
                                    value={
                                        form.area_projeto
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                >

                                    <option value="">
                                        -- Selecione --
                                    </option>

                                    <option value="Agricultura">
                                        Agricultura
                                    </option>

                                    <option value="Água">
                                        Água
                                    </option>

                                    <option value="Energia">
                                        Energia
                                    </option>

                                    <option value="Florestas">
                                        Florestas
                                    </option>

                                    <option value="Biodiversidade">
                                        Biodiversidade
                                    </option>

                                    <option value="Pesca">
                                        Pesca
                                    </option>

                                    <option value="Saúde">
                                        Saúde
                                    </option>

                                    <option value="Educação">
                                        Educação
                                    </option>

                                    <option value="Infraestrutura">
                                        Infraestrutura
                                    </option>

                                    <option value="Outro">
                                        Outro
                                    </option>

                                </select>

                            </div>


                            {/* LINK */}

                            <div className="campo">

                                <label>
                                    Link do Projeto
                                </label>

                                <input
                                    type="url"
                                    name="link"
                                    value={
                                        form.link
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="https://..."
                                />

                            </div>


                            {/* PARCEIROS */}

                            <div className="campo campo-2">

                                <label>
                                    Instituições Parceiras
                                </label>

                                <input
                                    type="text"
                                    name="parceiros"
                                    value={
                                        form.parceiros
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="Ex.: Ministério do Ambiente, PNUD, FAO..."
                                />

                            </div>


                            {/* OBJETIVO */}

                            <div className="campo campo-2">

                                <label>
                                    Objetivo do Projeto *
                                </label>

                                <textarea
                                    name="objetivo_projeto"
                                    value={
                                        form.objetivo_projeto
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={5}
                                    placeholder="Descreva os objetivos do projeto..."
                                />

                            </div>


                            {/* OBSERVAÇÕES */}

                            <div className="campo campo-2">

                                <label>
                                    Observações
                                </label>

                                <textarea
                                    name="descricao_documento"
                                    value={
                                        form.descricao_documento
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={4}
                                    placeholder="Informações complementares..."
                                />

                            </div>


                        </div>

                    </div>

                )}


                {/* =====================================================
                    OUTRO
                ===================================================== */}

                {tipoAtual === "Outro" && (

                    <div className="form-box">

                        <h2>
                            Outras Informações
                        </h2>


                        <p>
                            Este conteúdo será encaminhado
                            para Card e Biblioteca após aprovação.
                        </p>


                        <div className="form-grid">


                            {/* TIPO */}

                            <div className="campo">

                                <label>
                                    Tipo de Conteúdo *
                                </label>

                                <input
                                    type="text"
                                    name="tipo_conteudo_outro"
                                    value={
                                        form.tipo_conteudo_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    placeholder="Ex.: Podcast, Vídeo, Curso..."
                                    required
                                />

                            </div>


                            {/* OBJETIVO */}

                            <div className="campo campo-2">

                                <label>
                                    Objetivo *
                                </label>

                                <textarea
                                    name="objetivo_outro"
                                    value={
                                        form.objetivo_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={4}
                                    placeholder="Qual o objetivo deste conteúdo?"
                                    required
                                />

                            </div>


                            {/* DESCRIÇÃO */}

                            <div className="campo campo-2">

                                <label>
                                    Descrição
                                </label>

                                <textarea
                                    name="descricao_outro"
                                    value={
                                        form.descricao_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={5}
                                    placeholder="Descreva o conteúdo..."
                                />

                            </div>


                            {/* OBSERVAÇÕES */}

                            <div className="campo campo-2">

                                <label>
                                    Observações
                                </label>

                                <textarea
                                    name="observacoes_outro"
                                    value={
                                        form.observacoes_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={4}
                                    placeholder="Informações adicionais..."
                                />

                            </div>


                        </div>

                    </div>

                )}


                {/* =====================================================
                    ARQUIVOS GERAIS
                ===================================================== */}

                <div className="form-box">

                    <h2>
                        Arquivos
                    </h2>


                    <div className="form-grid">

                        <div className="campo campo-2">

                            <label>
                                Documentos e arquivos
                            </label>

                            <input
                                type="file"
                                multiple
                                accept="
                                    .pdf,
                                    .doc,
                                    .docx,
                                    .xls,
                                    .xlsx,
                                    .png,
                                    .jpg,
                                    .jpeg,
                                    .zip
                                "
                                onChange={
                                    selecionarArquivos
                                }
                            />

                        </div>


                        {arquivos.length > 0 && (

                            <div className="campo campo-2">

                                <h4>
                                    Arquivos selecionados
                                </h4>


                                <ul>

                                    {arquivos.map(
                                        (arquivo, index) => (

                                            <li
                                                key={index}
                                            >

                                                📄{" "}
                                                {arquivo.name}

                                                {String(
                                                    form.imagem_card_index
                                                ) ===
                                                String(index) && (

                                                    <strong>
                                                        {" "}
                                                        ⭐ Imagem do Card
                                                    </strong>

                                                )}

                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>

                        )}

                    </div>

                </div>


                {/* =====================================================
                    TAGS
                ===================================================== */}

                <div className="form-box">

                    <h2>
                        Palavras-chave
                    </h2>


                    <div className="form-grid">

                        <div className="campo campo-2">

                            <label>
                                Tags
                            </label>

                            <select
                                name="tags"
                                value={
                                    form.tags
                                }
                                onChange={
                                    alterarCampo
                                }
                                required
                            >

                                <option value="">
                                    Selecione...
                                </option>

                                <option value="Adaptação">
                                    Adaptação
                                </option>

                                <option value="Mitigação">
                                    Mitigação
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    CONFIRMAÇÃO
                ===================================================== */}

                <div className="form-box">

                    <h2>
                        Confirmação
                    </h2>


                    <div className="form-grid">


                        <div className="campo campo-2">

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer"
                                }}
                            >

                                <input
                                    type="checkbox"
                                    name="permissao_publicacao"
                                    checked={
                                        form.permissao_publicacao
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                />

                                Declaro que as informações
                                fornecidas são verdadeiras
                                e autorizo sua publicação
                                no Portal Climático da
                                Guiné-Bissau.

                            </label>

                        </div>


                        {/* BOTÃO */}

                        <div
                            className="campo campo-2"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px"
                            }}
                        >

                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Enviar Submissão
                            </button>

                        </div>


                    </div>

                </div>


            </form>

        </div>

    );

}

export default Form_submissao_climatica;