<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import "../App.css";
import PageShell from "../components/PageShell";
import HeroPage from "../components/HeroPage";
import Icon from "../components/Icon";
import API_URL from "../config";
import { useRodape } from "../hooks/useRodape";
import { enviarPedido, semApi } from "../rede";
import { AvisoSemEnvio } from "../components/StatusStates";
=======
import { useState } from "react";
import "../App.css";
import API_URL from "../config";
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

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
<<<<<<< HEAD
    const [passo, setPasso] = useState(1);
    const [feedback, setFeedback] = useState(null);
    const [erros, setErros] = useState({});
    const [concluida, setConcluida] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const rodape = useRodape();
    const sucessoRef = useRef(null);
    const focoPendente = useRef(null);
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3


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

<<<<<<< HEAD
        setErros((atual) => {
            if (!atual[name]) return atual;
            const proximo = { ...atual };
            delete proximo[name];
            return proximo;
        });

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
    function limparFormulario() {
        setForm((atual) => {
            const proximo = {};
            Object.entries(atual).forEach(([chave, valor]) => {
                if (chave === "data_submissao") proximo[chave] = new Date().toISOString().split("T")[0];
                else if (chave === "tipo_link") proximo[chave] = "interno";
                else if (typeof valor === "boolean") proximo[chave] = false;
                else proximo[chave] = "";
            });
            return proximo;
        });
        setArquivos([]);
        setImagensPagina([]);
        setPasso(1);
        setErros({});
        setFeedback(null);
    }

    const CAMPOS_PASSO = {
        tipo_proponente: 1,
        entidade: 1,
        email: 1,
        nome_responsavel: 1,
        tipo_submissao: 2,
        titulo: 2,
        pagina_card: 2,
        link_externo: 2,
        titulo_pagina: 2,
        texto_pagina: 2,
        data_inicio: 2,
        tags: 3,
        permissao_publicacao: 4
    };

    const FOCO = {
        tipo_proponente: "sub-tipo_proponente",
        entidade: "sub-entidade",
        email: "sub-email",
        nome_responsavel: "sub-nome_responsavel",
        tipo_submissao: "sub-tipo_submissao",
        titulo: "sub-titulo",
        pagina_card: "sub-pagina_card",
        link_externo: "sub-link_externo",
        titulo_pagina: "sub-titulo_pagina",
        texto_pagina: "sub-texto_pagina",
        data_inicio: "sub-data_inicio",
        tags: "sub-tags",
        permissao_publicacao: "sub-permissao"
    };

    function validarPasso(alvo) {
        const novos = {};
        if (alvo === 1) {
            if (!form.tipo_proponente) novos.tipo_proponente = "Selecione se envia como indivíduo ou instituição.";
            if (!form.entidade.trim()) novos.entidade = "Indique o nome da entidade ou da pessoa.";
            if (!form.email.trim()) novos.email = "Indique o e-mail de contacto.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novos.email = "Indique um e-mail válido.";
            if (!form.nome_responsavel.trim()) novos.nome_responsavel = "Indique quem responde por esta submissão.";
        }
        if (alvo === 2) {
            if (!form.tipo_submissao) novos.tipo_submissao = "Escolha o tipo de conteúdo.";
            if (!form.titulo.trim()) novos.titulo = "Indique o título.";
            if (deveMostrarCard) {
                if (!form.pagina_card) novos.pagina_card = "Escolha a secção onde o conteúdo deve aparecer.";
                if (form.tipo_link === "externo" && !form.link_externo.trim()) novos.link_externo = "Indique o endereço do conteúdo.";
                if (form.tipo_link === "interno") {
                    if (!form.titulo_pagina.trim()) novos.titulo_pagina = "Indique o título da página.";
                    if (!form.texto_pagina.trim()) novos.texto_pagina = "Escreva o texto da página.";
                }
            }
            if (deveMostrarEvento && !form.data_inicio) novos.data_inicio = "Indique a data de início.";
        }
        if (alvo === 3) {
            if (!form.tags) novos.tags = "Escolha adaptação ou mitigação.";
        }
        if (alvo === 4) {
            if (!form.permissao_publicacao) novos.permissao_publicacao = "Confirme que os dados são verdadeiros e que autoriza a análise para publicação.";
        }
        return novos;
    }

    function mostrarErros(novos) {
        const primeiro = Object.keys(novos)[0];
        focoPendente.current = primeiro ? FOCO[primeiro] : null;
        setErros(novos);
        setFeedback(null);
        if (primeiro) setPasso(CAMPOS_PASSO[primeiro] || 1);
    }

    useEffect(() => {
        if (!focoPendente.current) return;
        const id = focoPendente.current;
        focoPendente.current = null;
        document.getElementById(id)?.focus();
    }, [erros, passo]);

    useEffect(() => {
        if (concluida) sucessoRef.current?.focus();
    }, [concluida]);

    useEffect(() => {
        if (concluida) return undefined;
        const sujo = Boolean(
            form.email || form.titulo || form.nome_responsavel || form.descricao
            || form.tipo_submissao || arquivos.length || imagensPagina.length
        );
        if (!sujo) return undefined;
        const avisar = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", avisar);
        return () => window.removeEventListener("beforeunload", avisar);
    }, [concluida, form, arquivos.length, imagensPagina.length]);

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
    async function salvar(e) {

        e.preventDefault();

<<<<<<< HEAD
        const novos = {
            ...validarPasso(1),
            ...validarPasso(2),
            ...validarPasso(3),
            ...validarPasso(4)
        };
        if (Object.keys(novos).length) {
            mostrarErros(novos);
            return;
        }

        setEnviando(true);
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

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

<<<<<<< HEAD
            const { resposta, dados } =
                await enviarPedido(
=======
            const response =
                await fetch(
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                    `${API_URL}/submissoes`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


<<<<<<< HEAD
            if (!resposta.ok) {
                setFeedback({
                    tipo: "erro",
                    texto: dados.erro || "Erro ao enviar submissão."
                });
                return;
            }

            limparFormulario();
            setConcluida({ id: dados.registro?.id });
=======
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

>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

        }
        catch (err) {

            console.log(err);

<<<<<<< HEAD
            setFeedback({
                tipo: "erro",
                texto: semApi(err)
                    ? "sem-api"
                    : "Erro ao enviar a submissão. Verifique a ligação e tente novamente."
            });

        }
        finally {
            setEnviando(false);
        }
=======
            alert(
                "Erro ao enviar a submissão."
            );

        }
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

    }


<<<<<<< HEAD
    function avancarPasso() {
        const novos = validarPasso(passo);
        if (Object.keys(novos).length) {
            mostrarErros(novos);
            return;
        }
        setErros({});
        setFeedback(null);
        setPasso((atual) => Math.min(4, atual + 1));
    }

    const passos = [
        "Quem envia",
        "O quê",
        "Anexos",
        "Confirmar"
    ];

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
    // =====================================================
    // RETURN
    // =====================================================

    return (

<<<<<<< HEAD
        <PageShell>

            <HeroPage pagina="submissao_climatica" />

            {concluida ? (
                <div className="submissao-sucesso" role="status" tabIndex={-1} ref={sucessoRef}>
                    <h2>Submissão enviada</h2>
                    <p>A equipa analisa o conteúdo antes de o publicar. Este envio ainda não está no portal.</p>
                    {concluida.id ? <p>Número de referência: <strong>{concluida.id}</strong>.</p> : null}
                    <button type="button" className="btn-ghost" onClick={() => setConcluida(null)}>
                        Enviar outra submissão
                    </button>
                </div>
            ) : (
            <div className="submissao-layout">

            {/* CAIXA EXPLICATIVA */}
            <aside
                className="submissao-intro"
                aria-labelledby="titulo-orientacoes"
            >
                <h2 id="titulo-orientacoes">
                    Compartilhe iniciativas e conhecimentos climáticos
                </h2>

                <p>
                    Utilize este formulário para enviar eventos, projetos, publicações,
                    relatórios, mapas, bases de dados e outras informações relacionadas
                    às mudanças climáticas na Guiné-Bissau.
                </p>

                <ul className="submissao-passos">
                    {[
                        "Preencha os dados obrigatórios",
                        "Anexe documentos ou imagens, quando necessário",
                        "A submissão será analisada antes da publicação"
                    ].map((texto) => (
                        <li key={texto}>
                            <Icon name="check" />
                            <span>{texto}</span>
                        </li>
                    ))}
                </ul>

                <p className="submissao-nota">
                    Antes de enviar, confira os dados e os links. O envio não significa
                    publicação automática; o conteúdo depende de análise e aprovação.
                </p>
            </aside>

            <form
                className="form-container submissao-form"
                onSubmit={salvar}
                noValidate
=======
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
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
            >


                {/* =====================================================
                    TÍTULO
                ===================================================== */}

<<<<<<< HEAD
                <h2>
                    Enviar uma ação climática
                </h2>

                <ol className="wizard-steps" aria-label="Passos do formulário">
                    {passos.map((nome, index) => (
                        <li
                            key={nome}
                            className={passo === index + 1 ? "active" : passo > index + 1 ? "done" : ""}
                            aria-current={passo === index + 1 ? "step" : undefined}
                        >
                            <span>{index + 1}</span>
                            {nome}
                        </li>
                    ))}
                </ol>

                {feedback ? (
                    <div className={feedback.tipo === "ok" ? "ui-success" : "ui-error"} role={feedback.tipo === "ok" ? "status" : "alert"}>
                        {feedback.texto === "sem-api" ? (
                            <AvisoSemEnvio email={rodape.email || "info@portaldoclima.gw"} />
                        ) : feedback.texto}
                    </div>
                ) : null}
=======
                <h1>
                    Submissão Climática
                </h1>

>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                {/* =====================================================
                    IDENTIFICAÇÃO
                ===================================================== */}

<<<<<<< HEAD
                <div hidden={passo !== 1}>
                <div className="form-box">

                    <h2>
                        Quem envia
=======
                <div className="form-box">

                    <h2>
                        Identificação
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                    </h2>


                    <div className="form-grid">


                        {/* ORGANISMO */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-tipo_proponente">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Organismo *
                            </label>

                            <select
<<<<<<< HEAD
                                id="sub-tipo_proponente"
                                name="tipo_proponente"
                                aria-invalid={Boolean(erros.tipo_proponente)}
                                aria-describedby={erros.tipo_proponente ? "erro-tipo_proponente" : undefined}
=======
                                name="tipo_proponente"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                                    Indivíduo
=======
                                    Individuo
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                </option>

                                <option value="Instituição">
                                    Instituição
                                </option>

                                <option value="Organização">
                                    Organização
                                </option>

                            </select>
<<<<<<< HEAD
                            {erros.tipo_proponente ? <p className="campo-erro" id="erro-tipo_proponente">{erros.tipo_proponente}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>


                        {/* DATA */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-data_submissao">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Data da Submissão
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-data_submissao"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-email">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                E-mail *
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                spellCheck={false}
                                aria-invalid={Boolean(erros.email)}
                                aria-describedby={erros.email ? "erro-email" : undefined}
=======
                                type="email"
                                name="email"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                value={
                                    form.email
                                }
                                onChange={
                                    alterarCampo
                                }
<<<<<<< HEAD
                                placeholder="nome@exemplo.gw"
                                required
                            />
                            {erros.email ? <p className="campo-erro" id="erro-email">{erros.email}</p> : null}
=======
                                placeholder="Digite seu e-mail"
                                required
                            />
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>


                        {/* ENTIDADE */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-entidade">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Nome da Entidade *
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-entidade"
                                type="text"
                                name="entidade"
                                aria-invalid={Boolean(erros.entidade)}
                                aria-describedby={erros.entidade ? "erro-entidade" : undefined}
=======
                                type="text"
                                name="entidade"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                value={
                                    form.entidade
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Digite o nome da entidade"
                                required
                            />
<<<<<<< HEAD
                            {erros.entidade ? <p className="campo-erro" id="erro-entidade">{erros.entidade}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>


                        {/* RESPONSÁVEL */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-nome_responsavel">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Nome do Responsável *
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-nome_responsavel"
                                type="text"
                                name="nome_responsavel"
                                autoComplete="name"
                                aria-invalid={Boolean(erros.nome_responsavel)}
                                aria-describedby={erros.nome_responsavel ? "erro-nome_responsavel" : undefined}
=======
                                type="text"
                                name="nome_responsavel"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                value={
                                    form.nome_responsavel
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Digite o nome completo"
                                required
                            />
<<<<<<< HEAD
                            {erros.nome_responsavel ? <p className="campo-erro" id="erro-nome_responsavel">{erros.nome_responsavel}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>


                        {/* CARGO */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-cargo">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Cargo / Papel na Instituição
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-cargo"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-website">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Website
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-website"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                type="url"
                                name="website"
                                value={
                                    form.website
                                }
                                onChange={
                                    alterarCampo
                                }
<<<<<<< HEAD
                                placeholder="https://…"
=======
                                placeholder="https://..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                            />

                        </div>


                    </div>

                </div>
<<<<<<< HEAD
                </div>
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3


                {/* =====================================================
                    INFORMAÇÃO SOBRE A SUBMISSÃO
                ===================================================== */}

<<<<<<< HEAD
                <div hidden={passo !== 2}>
                <div className="form-box">

                    <h2>
                        O que está a enviar
=======
                <div className="form-box">

                    <h2>
                        Informação sobre a Submissão
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                    </h2>


                    <div className="form-grid">


                        {/* TIPO */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-tipo_submissao">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Tipo de Submissão *
                            </label>

                            <select
<<<<<<< HEAD
                                id="sub-tipo_submissao"
                                name="tipo_submissao"
                                aria-invalid={Boolean(erros.tipo_submissao)}
                                aria-describedby={erros.tipo_submissao ? "erro-tipo_submissao" : undefined}
=======
                                name="tipo_submissao"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                            {erros.tipo_submissao ? <p className="campo-erro" id="erro-tipo_submissao">{erros.tipo_submissao}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

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

<<<<<<< HEAD
                            <label htmlFor="sub-idioma">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Idioma *
                            </label>

                            <select
<<<<<<< HEAD
                                id="sub-idioma"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-titulo">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Título *
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-titulo"
                                type="text"
                                name="titulo"
                                aria-invalid={Boolean(erros.titulo)}
                                aria-describedby={erros.titulo ? "erro-titulo" : undefined}
=======
                                type="text"
                                name="titulo"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                value={
                                    form.titulo
                                }
                                onChange={
                                    alterarCampo
                                }
                                placeholder="Título da submissão"
                                required
                            />
<<<<<<< HEAD
                            {erros.titulo ? <p className="campo-erro" id="erro-titulo">{erros.titulo}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>


                        {/* TÍTULO CURTO */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-titulo_curto">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Título Curto
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-titulo_curto"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-descricao">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Descrição *
                            </label>

                            <textarea
<<<<<<< HEAD
                                id="sub-descricao"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                name="descricao"
                                value={
                                    form.descricao
                                }
                                onChange={
                                    alterarCampo
                                }
                                rows={6}
<<<<<<< HEAD
                                placeholder="Descreva a submissão…"
=======
                                placeholder="Descreva a submissão..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                required
                            />

                        </div>


                        {/* DATA PUBLICAÇÃO */}

                        <div className="campo">

<<<<<<< HEAD
                            <label htmlFor="sub-data_publicacao">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Data de Publicação
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-data_publicacao"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-data_retirada">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Data de Retirada
                            </label>

                            <input
<<<<<<< HEAD
                                id="sub-data_retirada"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                            Onde deve aparecer
=======
                            Publicação no Portal
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                        </h2>


                        <p>
<<<<<<< HEAD
                            Depois da análise, este conteúdo pode aparecer numa página do portal.
                            Estes campos dizem à equipa onde o mostrar.
=======
                            Esta submissão será transformada
                            em um Card após aprovação.
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                        </p>


                        <div className="form-grid">


                            {/* PÁGINA */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-pagina_card">
                                    Secção do portal *
                                </label>

                                <select
                                id="sub-pagina_card"
                                    name="pagina_card"
                                    aria-invalid={Boolean(erros.pagina_card)}
                                    aria-describedby={erros.pagina_card ? "erro-pagina_card" : undefined}
=======
                                <label>
                                    Página onde o Card será publicado *
                                </label>

                                <select
                                    name="pagina_card"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                                        Início
=======
                                        Home
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                                {erros.pagina_card ? <p className="campo-erro" id="erro-pagina_card">{erros.pagina_card}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                            </div>


                            {/* DESTINO */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-tipo_link">
                                    Como abrir o conteúdo *
                                </label>

                                <select
                                id="sub-tipo_link"
=======
                                <label>
                                    Destino do Card *
                                </label>

                                <select
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                                        Página neste portal
=======
                                        Página interna
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    </option>

                                    <option value="externo">
                                        Link externo
                                    </option>

                                </select>

                            </div>


                            {/* LINK EXTERNO */}

                            {form.tipo_link === "externo" && (

                                <div className="campo campo-2">

<<<<<<< HEAD
                                    <label htmlFor="sub-link_externo">
=======
                                    <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                        Link externo *
                                    </label>

                                    <input
<<<<<<< HEAD
                                id="sub-link_externo"
                                        type="url"
                                        name="link_externo"
                                        aria-invalid={Boolean(erros.link_externo)}
                                        aria-describedby={erros.link_externo ? "erro-link_externo" : undefined}
=======
                                        type="url"
                                        name="link_externo"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                        value={
                                            form.link_externo
                                        }
                                        onChange={
                                            alterarCampo
                                        }
<<<<<<< HEAD
                                        placeholder="https://…"
                                        required
                                    />
                                    {erros.link_externo ? <p className="campo-erro" id="erro-link_externo">{erros.link_externo}</p> : null}
=======
                                        placeholder="https://..."
                                        required
                                    />
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                                </div>

                            )}


                            {/* IMAGEM DO CARD */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-imagem-card">
                                    Imagem de capa
                                </label>

                                <input
                                    id="sub-imagem-card"
=======
                                <label>
                                    Imagem do Card
                                </label>

                                <input
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={
                                        selecionarImagemCard
                                    }
                                />

                                <small>
<<<<<<< HEAD
                                    Opcional. Aparece na entrada do conteúdo, depois da aprovação.
=======
                                    Opcional. Será usada como
                                    imagem de entrada do Card.
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                </small>

                            </div>


                        </div>


                        {/* =================================================
                            PÁGINA INTERNA
                        ================================================= */}

                        {form.tipo_link === "interno" && (

                            <div className="secao-admin">

                                <h2>
<<<<<<< HEAD
                                    Texto da página
=======
                                    Conteúdo da Página
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                </h2>


                                <div className="form-grid">


                                    {/* TÍTULO */}

                                    <div className="campo">

<<<<<<< HEAD
                                        <label htmlFor="sub-titulo_pagina">
                                            Título *
                                        </label>

                                        <input
                                id="sub-titulo_pagina"
                                            type="text"
                                            name="titulo_pagina"
                                            aria-invalid={Boolean(erros.titulo_pagina)}
                                            aria-describedby={erros.titulo_pagina ? "erro-titulo_pagina" : undefined}
=======
                                        <label>
                                            Título da Página *
                                        </label>

                                        <input
                                            type="text"
                                            name="titulo_pagina"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                            value={
                                                form.titulo_pagina
                                            }
                                            onChange={
                                                alterarCampo
                                            }
                                            placeholder="Título da página"
                                            required
                                        />
<<<<<<< HEAD
                                        {erros.titulo_pagina ? <p className="campo-erro" id="erro-titulo_pagina">{erros.titulo_pagina}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                                    </div>


                                    {/* DATA */}

                                    <div className="campo">

<<<<<<< HEAD
                                        <label htmlFor="sub-data_publicacao_pagina">
=======
                                        <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                            Data de Publicação
                                        </label>

                                        <input
<<<<<<< HEAD
                                id="sub-data_publicacao_pagina"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                        <label htmlFor="sub-texto_pagina">
=======
                                        <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                            Texto Completo *
                                        </label>

                                        <textarea
<<<<<<< HEAD
                                id="sub-texto_pagina"
                                            name="texto_pagina"
                                            aria-invalid={Boolean(erros.texto_pagina)}
                                            aria-describedby={erros.texto_pagina ? "erro-texto_pagina" : undefined}
=======
                                            name="texto_pagina"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                            value={
                                                form.texto_pagina
                                            }
                                            onChange={
                                                alterarCampo
                                            }
                                            rows={10}
<<<<<<< HEAD
                                            placeholder="Escreva o conteúdo completo da página…"
                                            required
                                        />
                                        {erros.texto_pagina ? <p className="campo-erro" id="erro-texto_pagina">{erros.texto_pagina}</p> : null}
=======
                                            placeholder="Escreva o conteúdo completo da página..."
                                            required
                                        />
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                                    </div>


                                    {/* FOTOS */}

                                    <div className="campo campo-2">

<<<<<<< HEAD
                                        <label htmlFor="sub-fotos-pagina">
=======
                                        <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                            Fotos da Página
                                            {" "}
                                            <span>
                                                (máximo 5)
                                            </span>
                                        </label>

                                        <input
<<<<<<< HEAD
                                    id="sub-fotos-pagina"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                            Documento na biblioteca
=======
                            Publicação na Biblioteca
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                        </h2>


                        <p>
<<<<<<< HEAD
                            Depois da análise, este material pode ficar disponível na biblioteca.
=======
                            Esta submissão será disponibilizada
                            na Biblioteca após aprovação.
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                        </p>


                        <div className="form-grid">


                            {/* LINK */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-biblioteca_link">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Link externo
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-biblioteca_link"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="url"
                                    name="biblioteca_link"
                                    value={
                                        form.biblioteca_link
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    placeholder="https://…"
=======
                                    placeholder="https://..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                                <small>
                                    Informe o link caso o material
                                    esteja disponível online.
                                </small>

                            </div>


                            {/* ARQUIVO */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-arquivo-biblioteca">
                                    Ficheiro
                                </label>

                                <input
                                    id="sub-arquivo-biblioteca"
=======
                                <label>
                                    Arquivo da Biblioteca
                                </label>

                                <input
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-data_inicio">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Data de Início *
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-data_inicio"
                                    type="date"
                                    name="data_inicio"
                                    aria-invalid={Boolean(erros.data_inicio)}
                                    aria-describedby={erros.data_inicio ? "erro-data_inicio" : undefined}
=======
                                    type="date"
                                    name="data_inicio"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    value={
                                        form.data_inicio
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    required
                                />
<<<<<<< HEAD
                                {erros.data_inicio ? <p className="campo-erro" id="erro-data_inicio">{erros.data_inicio}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                            </div>


                            {/* HORA */}

                            <div className="campo">

<<<<<<< HEAD
                                <label htmlFor="sub-hora_inicio">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Hora de Início
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-hora_inicio"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-data_fim">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Data de Término
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-data_fim"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-hora_fim">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Hora de Término
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-hora_fim"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-local1">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Local Principal
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-local1"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-local2">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Local Complementar
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-local2"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="text"
                                    name="local2"
                                    value={
                                        form.local2
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    placeholder="Endereço, Auditório, Sala…"
=======
                                    placeholder="Endereço, Auditório, Sala..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                    <label htmlFor="sub-link">
=======
                                    <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                        Link do Evento
                                    </label>

                                    <input
<<<<<<< HEAD
                                id="sub-link"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                        type="url"
                                        name="link"
                                        value={
                                            form.link
                                        }
                                        onChange={
                                            alterarCampo
                                        }
<<<<<<< HEAD
                                        placeholder="https://…"
=======
                                        placeholder="https://..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-data_inicio-2">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Data de Início *
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-data_inicio-2"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-data_fim-2">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Data Prevista de Término
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-data_fim-2"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-area_projeto">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Área de Atuação
                                </label>

                                <select
<<<<<<< HEAD
                                id="sub-area_projeto"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-link-2">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Link do Projeto
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-link-2"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="url"
                                    name="link"
                                    value={
                                        form.link
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    placeholder="https://…"
=======
                                    placeholder="https://..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                            </div>


                            {/* PARCEIROS */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-parceiros">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Instituições Parceiras
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-parceiros"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="text"
                                    name="parceiros"
                                    value={
                                        form.parceiros
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    placeholder="Ex.: Ministério do Ambiente, PNUD, FAO…"
=======
                                    placeholder="Ex.: Ministério do Ambiente, PNUD, FAO..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                            </div>


                            {/* OBJETIVO */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-objetivo_projeto">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Objetivo do Projeto *
                                </label>

                                <textarea
<<<<<<< HEAD
                                id="sub-objetivo_projeto"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    name="objetivo_projeto"
                                    value={
                                        form.objetivo_projeto
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={5}
<<<<<<< HEAD
                                    placeholder="Descreva os objetivos do projeto…"
=======
                                    placeholder="Descreva os objetivos do projeto..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                            </div>


                            {/* OBSERVAÇÕES */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-descricao_documento">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Observações
                                </label>

                                <textarea
<<<<<<< HEAD
                                id="sub-descricao_documento"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    name="descricao_documento"
                                    value={
                                        form.descricao_documento
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={4}
<<<<<<< HEAD
                                    placeholder="Informações complementares…"
=======
                                    placeholder="Informações complementares..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-tipo_conteudo_outro">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Tipo de Conteúdo *
                                </label>

                                <input
<<<<<<< HEAD
                                id="sub-tipo_conteudo_outro"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="text"
                                    name="tipo_conteudo_outro"
                                    value={
                                        form.tipo_conteudo_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    placeholder="Ex.: Podcast, Vídeo, Curso…"
=======
                                    placeholder="Ex.: Podcast, Vídeo, Curso..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    required
                                />

                            </div>


                            {/* OBJETIVO */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-objetivo_outro">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Objetivo *
                                </label>

                                <textarea
<<<<<<< HEAD
                                id="sub-objetivo_outro"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                <label htmlFor="sub-descricao_outro">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Descrição
                                </label>

                                <textarea
<<<<<<< HEAD
                                id="sub-descricao_outro"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    name="descricao_outro"
                                    value={
                                        form.descricao_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={5}
<<<<<<< HEAD
                                    placeholder="Descreva o conteúdo…"
=======
                                    placeholder="Descreva o conteúdo..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                            </div>


                            {/* OBSERVAÇÕES */}

                            <div className="campo campo-2">

<<<<<<< HEAD
                                <label htmlFor="sub-observacoes_outro">
=======
                                <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    Observações
                                </label>

                                <textarea
<<<<<<< HEAD
                                id="sub-observacoes_outro"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    name="observacoes_outro"
                                    value={
                                        form.observacoes_outro
                                    }
                                    onChange={
                                        alterarCampo
                                    }
                                    rows={4}
<<<<<<< HEAD
                                    placeholder="Informações adicionais…"
=======
                                    placeholder="Informações adicionais..."
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                />

                            </div>


                        </div>

                    </div>

                )}


<<<<<<< HEAD
                </div>

=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                {/* =====================================================
                    ARQUIVOS GERAIS
                ===================================================== */}

<<<<<<< HEAD
                <div hidden={passo !== 3}>
                <div className="form-box">

                    <h2>
                        Anexos
=======
                <div className="form-box">

                    <h2>
                        Arquivos
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                    </h2>


                    <div className="form-grid">

                        <div className="campo campo-2">

<<<<<<< HEAD
                            <label htmlFor="sub-documentos">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Documentos e arquivos
                            </label>

                            <input
<<<<<<< HEAD
                                    id="sub-documentos"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                                                        <strong>
                                                        {" "}
                                                        Imagem de capa
=======
                                                    <strong>
                                                        {" "}
                                                        ⭐ Imagem do Card
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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

<<<<<<< HEAD
                            <label htmlFor="sub-tags">
=======
                            <label>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                Tags
                            </label>

                            <select
<<<<<<< HEAD
                                id="sub-tags"
                                name="tags"
                                aria-invalid={Boolean(erros.tags)}
                                aria-describedby={erros.tags ? "erro-tags" : undefined}
=======
                                name="tags"
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                value={
                                    form.tags
                                }
                                onChange={
                                    alterarCampo
                                }
                                required
                            >

                                <option value="">
<<<<<<< HEAD
                                    Selecione…
=======
                                    Selecione...
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                </option>

                                <option value="Adaptação">
                                    Adaptação
                                </option>

                                <option value="Mitigação">
                                    Mitigação
                                </option>

                            </select>
<<<<<<< HEAD
                            {erros.tags ? <p className="campo-erro" id="erro-tags">{erros.tags}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

                        </div>

                    </div>

                </div>
<<<<<<< HEAD
                </div>
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3


                {/* =====================================================
                    CONFIRMAÇÃO
                ===================================================== */}

<<<<<<< HEAD
                <div hidden={passo !== 4}>
                <div className="form-box">

                    <h2>
                        Confirmar
=======
                <div className="form-box">

                    <h2>
                        Confirmação
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
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
<<<<<<< HEAD
                                    id="sub-permissao"
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    type="checkbox"
                                    name="permissao_publicacao"
                                    checked={
                                        form.permissao_publicacao
                                    }
                                    onChange={
                                        alterarCampo
                                    }
<<<<<<< HEAD
                                    aria-invalid={Boolean(erros.permissao_publicacao)}
                                    aria-describedby={erros.permissao_publicacao ? "erro-permissao" : undefined}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                                    required
                                />

                                Declaro que as informações
                                fornecidas são verdadeiras
                                e autorizo sua publicação
                                no Portal Climático da
                                Guiné-Bissau.

                            </label>
<<<<<<< HEAD
                            {erros.permissao_publicacao ? <p className="campo-erro" id="erro-permissao">{erros.permissao_publicacao}</p> : null}
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

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
<<<<<<< HEAD
                                disabled={enviando}
                            >
                                {enviando ? "A enviar…" : "Enviar submissão"}
=======
                            >
                                Enviar Submissão
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3
                            </button>

                        </div>


                    </div>

                </div>
<<<<<<< HEAD
                </div>

                <div className="wizard-nav">
                    {passo > 1 ? (
                        <button type="button" className="btn-ghost" onClick={() => setPasso((atual) => atual - 1)}>
                            Anterior
                        </button>
                    ) : <span />}
                    {passo < 4 ? (
                        <button type="button" className="btn-enviar" onClick={avancarPasso}>
                            Continuar
                        </button>
                    ) : null}
                </div>
=======
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3


            </form>

<<<<<<< HEAD
            </div>
            )}

        </PageShell>
=======
        </div>
>>>>>>> 1574794efa33e06e7984fc624f650203a7d339e3

    );

}

export default Form_submissao_climatica;