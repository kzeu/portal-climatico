import { useState } from "react";
import "../App.css";

const API_URL = "http://localhost:3000";

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

            <form
                className="form-container"
                onSubmit={salvar}
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