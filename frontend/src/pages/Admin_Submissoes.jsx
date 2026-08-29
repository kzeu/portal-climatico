import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function Admin_Submissoes() {

    const [submissoes, setSubmissoes] = useState([]);
    const [statusFiltro, setStatusFiltro] = useState("PENDENTE");

    const [selecionada, setSelecionada] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [processando, setProcessando] = useState(false);



    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");


    // =========================================================
    // CARREGAR SUBMISSÕES
    // =========================================================

    async function carregarSubmissoes() {

        try {

            setCarregando(true);
            setErro("");

            const response = await fetch(
                `${API_URL}/submissoes`
            );

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(
                    dados.erro ||
                    "Erro ao carregar submissões."
                );
            }

            setSubmissoes(dados);

        }
        catch (err) {

            console.error(err);

            setErro(err.message);

        }
        finally {

            setCarregando(false);

        }

    }


    useEffect(() => {

        carregarSubmissoes();

    }, []);


    // =========================================================
    // FILTRO
    // =========================================================

    const listaFiltrada =
        statusFiltro === "TODOS"
            ? submissoes
            : submissoes.filter(
                item =>
                    String(item.status || "").toUpperCase() ===
                    statusFiltro
            );


    // =========================================================
    // ABRIR DETALHES
    // =========================================================

    async function abrirDetalhes(id) {

        try {

            setErro("");

            const response = await fetch(
                `${API_URL}/submissoes/${id}`
   );

            const dados = await response.json();

            if (!response.ok) {

                throw new Error(
                    dados.erro ||
                    "Erro ao carregar submissão."
                );

            }

            setSelecionada(dados);


        }
        catch (err) {

            console.error(err);

            setErro(err.message);

        }

    }


    // =========================================================
    // APROVAR
    // =========================================================

    // =========================================================
// APROVAR
// =========================================================

async function aprovarSubmissao() {

    if (!selecionada) {
        return;
    }


    const confirmar =
        window.confirm(
            "Deseja realmente aprovar esta submissão?"
        );


    if (!confirmar) {
        return;
    }


    try {

        setProcessando(true);

        setErro("");

        setMensagem("");


        const response =
            await fetch(
                `${API_URL}/submissoes/${selecionada.id}/aprovar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        usuario_aprovador: "admin"
                    })
                }
            );


        const dados =
            await response.json();


        if (!response.ok) {

            throw new Error(
                dados.erro ||
                "Erro ao aprovar submissão."
            );

        }


        // =====================================================
        // MENSAGEM
        // =====================================================

        let mensagem =
            "Submissão aprovada com sucesso.";


        if (
            dados.evento_id &&
            dados.card_id &&
            dados.biblioteca_id
        ) {

            mensagem =
                "Submissão aprovada. Calendário, Card e Biblioteca criados como não publicados.";

        }

        else if (
            dados.evento_id &&
            dados.card_id
        ) {

            mensagem =
                "Submissão aprovada. Calendário e Card criados como não publicados.";

        }

        else if (
            dados.biblioteca_id
        ) {

            mensagem =
                "Submissão aprovada. Item criado na Biblioteca como não publicado.";

        }


        setMensagem(mensagem);


        setSelecionada(null);


        await carregarSubmissoes();


    }
    catch (err) {

        console.error(err);

        setErro(
            err.message ||
            "Erro ao aprovar submissão."
        );

    }
    finally {

        setProcessando(false);

    }

}


    // =========================================================
    // RECUSAR
    // =========================================================

    async function recusarSubmissao() {

        if (!selecionada) {
            return;
        }


        const observacao =
            window.prompt(
                "Informe o motivo da recusa:"
            );


        if (observacao === null) {
            return;
        }


        try {

            setProcessando(true);
            setErro("");
            setMensagem("");


            const response = await fetch(

                `${API_URL}/submissoes/${selecionada.id}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        status: "RECUSADO",

                        observacao_admin:
                            observacao

                    })
                }

            );


            const dados =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    dados.erro ||
                    "Erro ao recusar submissão."
                );

            }


            setMensagem(
                "Submissão recusada."
            );


            setSelecionada(null);

            await carregarSubmissoes();


        }
        catch (err) {

            console.error(err);

            setErro(err.message);

        }
        finally {

            setProcessando(false);

        }

    }


    // =========================================================
    // FORMATAÇÃO
    // =========================================================

    function formatarData(data) {

        if (!data) {
            return "-";
        }

        try {

            return new Date(data)
                .toLocaleDateString(
                    "pt-BR"
                );

        }
        catch {

            return data;

        }

    }


    function classeStatus(status) {

        const valor =
            String(status || "")
                .toUpperCase();

        if (valor === "PENDENTE") {
            return "status-pendente";
        }

        if (valor === "APROVADO") {
            return "status-aprovado";
        }

        if (valor === "RECUSADO") {
            return "status-recusado";
        }

        return "status-outro";

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="admin-submissoes">

            <div className="admin-submissoes-header">

                <div>

                    <h1>
                        Submissões Climáticas
                    </h1>

                    <p>
                        Analise e aprove os conteúdos
                        enviados para o portal.
                    </p>

                </div>


                <button
                    className="btn-atualizar"
                    onClick={carregarSubmissoes}
                >
                    Atualizar
                </button>

            </div>


            {mensagem && (

                <div className="mensagem-sucesso">
                    {mensagem}
                </div>

            )}


            {erro && (

                <div className="mensagem-erro">
                    {erro}
                </div>

            )}


            <div className="filtros-submissoes">

                <button
                    className={
                        statusFiltro === "PENDENTE"
                            ? "filtro ativo"
                            : "filtro"
                    }
                    onClick={() =>
                        setStatusFiltro("PENDENTE")
                    }
                >
                    Pendentes
                </button>


                <button
                    className={
                        statusFiltro === "APROVADO"
                            ? "filtro ativo"
                            : "filtro"
                    }
                    onClick={() =>
                        setStatusFiltro("APROVADO")
                    }
                >
                    Aprovadas
                </button>


                <button
                    className={
                        statusFiltro === "RECUSADO"
                            ? "filtro ativo"
                            : "filtro"
                    }
                    onClick={() =>
                        setStatusFiltro("RECUSADO")
                    }
                >
                    Recusadas
                </button>


                <button
                    className={
                        statusFiltro === "TODOS"
                            ? "filtro ativo"
                            : "filtro"
                    }
                    onClick={() =>
                        setStatusFiltro("TODOS")
                    }
                >
                    Todas
                </button>

            </div>


            {carregando ? (

                <div className="estado-vazio">
                    Carregando submissões...
                </div>

            ) : listaFiltrada.length === 0 ? (

                <div className="estado-vazio">
                    Nenhuma submissão encontrada.
                </div>

            ) : (

                <div className="tabela-submissoes">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Título</th>

                                <th>Tipo</th>

                                <th>Responsável</th>

                                <th>Data</th>

                                <th>Status</th>

                                <th>Ação</th>

                            </tr>

                        </thead>


                        <tbody>

                            {listaFiltrada.map(
                                submissao => (

                                    <tr
                                        key={
                                            submissao.id
                                        }
                                    >

                                        <td>
                                            #{submissao.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    submissao.titulo ||
                                                    "-"
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                submissao.tipo_submissao ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                submissao.nome_responsavel ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                formatarData(
                                                    submissao.data_submissao
                                                )
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    `status ${classeStatus(
                                                        submissao.status
                                                    )}`
                                                }
                                            >
                                                {
                                                    submissao.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="btn-ver"
                                                onClick={() =>
                                                    abrirDetalhes(
                                                        submissao.id
                                                    )
                                                }
                                            >
                                                Ver detalhes
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            {selecionada && (

                <div className="modal-overlay">

                    <div className="modal-submissao">

                        <div className="modal-header">

                            <div>

                                <span>
                                    Submissão #
                                    {
                                        selecionada.id
                                    }
                                </span>

                                <h2>
                                    {
                                        selecionada.titulo
                                    }
                                </h2>

                            </div>


                            <button
                                className="btn-fechar"
                                onClick={() =>
                                    setSelecionada(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-conteudo">

                            <div className="campo-detalhe">

                                <label>
                                    Tipo
                                </label>

                                <strong>
                                    {
                                        selecionada.tipo_submissao ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe">

                                <label>
                                    Responsável
                                </label>

                                <strong>
                                    {
                                        selecionada.nome_responsavel ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe">

                                <label>
                                    Entidade
                                </label>

                                <strong>
                                    {
                                        selecionada.entidade ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe">

                                <label>
                                    E-mail
                                </label>

                                <strong>
                                    {
                                        selecionada.email ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe campo-largo">

                                <label>
                                    Descrição
                                </label>

                                <p>
                                    {
                                        selecionada.descricao ||
                                        "-"
                                    }
                                </p>

                            </div>


                            <div className="campo-detalhe">

                                <label>
                                    Data de início
                                </label>

                                <strong>
                                    {
                                        formatarData(
                                            selecionada.data_inicio
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe">

                                <label>
                                    Data de fim
                                </label>

                                <strong>
                                    {
                                        formatarData(
                                            selecionada.data_fim
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="campo-detalhe campo-largo">

                                <label>
                                    Link
                                </label>

                                {selecionada.link ? (

                                    <a
                                        href={
                                            selecionada.link
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {
                                            selecionada.link
                                        }
                                    </a>

                                ) : (

                                    <span>
                                        -
                                    </span>

                                )}

                            </div>


                        </div>


                        <div className="modal-footer">

                            <button
                                className="btn-recusar"
                                onClick={
                                    recusarSubmissao
                                }
                                disabled={
                                    processando
                                }
                            >
                                Recusar
                            </button>


                            <button
                                className="btn-aprovar"
                                onClick={
                                    aprovarSubmissao
                                }
                                disabled={
                                    processando
                                }
                            >
                                {
                                    processando
                                        ? "Processando..."
                                        : "Aprovar"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}