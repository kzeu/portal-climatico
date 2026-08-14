import { useState } from "react";
import "../App.css";

const API_URL = "http://localhost:3000";

function Form_submissao_climatica() {

    const [form, setForm] = useState({

        data_submissao: new Date().toISOString().split("T")[0],

        email: "",

        tipo_proponente: "",

        entidade: "",

        nome_responsavel: "",

        cargo: "",

        website: "",

        tipo_submissao: "",

        idioma: "",

        titulo: "",

        titulo_curto: "",

        descricao: "",

        data_publicacao: "",

        data_retirada: "",

        data_inicio: "",

        hora_inicio: "",

        data_fim: "",

        hora_fim: "",

        evento_online: false,

        local1: "",

        local2: "",

        link: "",

        permissao_publicacao: false,

        motivo_publicacao: "",

        descricao_documento: "",

        area_projeto: "",
        parceiros: "",
        objetivo_projeto: "",

        tipo_conteudo_outro: "",
        objetivo_outro: "",
        descricao_outro: "",
        observacoes_outro: "",

        tags: ""

    });


    const [arquivos, setArquivos] = useState([]);

    function alterarCampo(e) {

        const { name, value, type, checked } = e.target;

        setForm({

            ...form,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    }


    function selecionarArquivos(e) {

    setArquivos(Array.from(e.target.files));

}

    async function salvar(e) {

        e.preventDefault();

        try {


            const response = await fetch(`${API_URL}/submissoes`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(form)

            });

            const resultado = await response.json();

            if (!response.ok) {

                alert(resultado.erro);

                return;

            }

            alert("Submissão enviada com sucesso!");

            console.log(resultado);

        }

        catch (err) {

            console.log(err);

            alert("Erro ao enviar a submissão.");

        }

    }

    return (

        <div className="content" id="content">

            <form
                className="form-container"
                onSubmit={salvar}
            >

                <h1>Submissão Climática</h1>

                {/* BLOCO 2 VEM AQUI */}



                {/* ================= IDENTIFICAÇÃO ================= */}

{/* ================= IDENTIFICAÇÃO ================= */}

<div className="form-box">

    <h2>Identificação</h2>

    <div className="form-grid">

        <div className="campo">

            <label>Organismo *</label>

            <select
                name="tipo_proponente"
                value={form.tipo_proponente}
                onChange={alterarCampo}
                required
            >
                <option value="">-- Selecione --</option>
                 <option value="Individuo">Individuo</option>
                <option value="Instituição">Instituição</option>
                <option value="Organização">Organização</option>
            </select>

        </div>

        <div className="campo">

            <label>Data da Submissão</label>

            <input
                type="date"
                name="data_submissao"
                value={form.data_submissao}
                readOnly
            />

        </div>

        <div className="campo campo-2">

            <label>E-mail *</label>

            <input
                type="email"
                name="email"
                value={form.email}
                onChange={alterarCampo}
                placeholder="Digite seu e-mail"
                required
            />

        </div>

        <div className="campo">

            <label>Nome da Entidade *</label>

            <input
                type="text"
                name="entidade"
                value={form.entidade}
                onChange={alterarCampo}
                placeholder="Digite o nome da entidade"
                required
            />

        </div>

        <div className="campo">

            <label>Nome do Responsável *</label>

            <input
                type="text"
                name="nome_responsavel"
                value={form.nome_responsavel}
                onChange={alterarCampo}
                placeholder="Digite o nome completo"
                required
            />

        </div>

        <div className="campo">

            <label>Cargo / Papel na Instituição</label>

            <input
                type="text"
                name="cargo"
                value={form.cargo}
                onChange={alterarCampo}
                placeholder="Cargo"
            />

        </div>

        <div className="campo">

            <label>Website</label>

            <input
                type="url"
                name="website"
                value={form.website}
                onChange={alterarCampo}
                placeholder="https://..."
            />

        </div>

    </div>

</div>

{/* BLOCO 3 VEM AQUI */}

{/* ================= INFORMAÇÃO SOBRE A SUBMISSÃO ================= */}

<div className="form-box">

    <h2>Informação sobre a Submissão</h2>

    <div className="form-grid">

        <div className="campo">

            <label>Tipo de Submissão *</label>

            <select
                name="tipo_submissao"
                value={form.tipo_submissao}
                onChange={alterarCampo}
                required
            >
                <option value="">-- Selecione --</option>
                <option value="Evento">Evento</option>
                <option value="Workshop">Workshop</option>
                <option value="Treinamento">Treinamento</option>
                <option value="Concurso">Concurso</option>
                <option value="Notícia">Notícia</option>
                <option value="Iniciativa Local">Iniciativa Local</option>
                <option value="Iniciativa Nacional">Iniciativa Nacional</option>
                <option value="Projeto Curto">Projeto Curto</option>
                <option value="Projeto Longo">Projeto Climático (+6 meses)</option>
                <option value="Publicação">Publicação</option>
                <option value="Relatório">Relatório</option>
                <option value="Base de Dados">Base de Dados</option>
                <option value="Mapa">Mapa Estático</option>
                <option value="Outro">Outro</option>
            </select>

        </div>

        <div className="campo">

            <label>Idioma *</label>

            <select
                name="idioma"
                value={form.idioma}
                onChange={alterarCampo}
                required
            >
                <option value="">-- Selecione --</option>
                <option value="Português">Português</option>
                <option value="Português">Criolo</option>
                <option value="Inglês">Inglês</option>
                <option value="Francês">Francês</option>
                <option value="Francês">Linguas Nacionais</option>
                <option value="Francês">Outras</option>
            </select>

        </div>

        <div className="campo">

            <label>Título *</label>

            <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={alterarCampo}
                placeholder="Título da submissão"
                required
            />

        </div>

        <div className="campo">

            <label>Título Curto</label>

            <input
                type="text"
                name="titulo_curto"
                value={form.titulo_curto}
                onChange={alterarCampo}
                placeholder="Título resumido"
            />

        </div>

        <div className="campo campo-2">

            <label>Descrição *</label>

            <textarea
                name="descricao"
                value={form.descricao}
                onChange={alterarCampo}
                rows={6}
                placeholder="Descreva a submissão..."
                required
            />

        </div>

    </div>

</div>

{/* ================= DADOS EVENTO ================= */}

{/* ================= DADOS EVENTO ================= */}

{["Evento","Workshop","Treinamento","Concurso"].includes(form.tipo_submissao) && (

<div className="form-box">

    <h2>Dados do Evento</h2>

    <div className="form-grid">

        <div className="campo">

            <label>Data de Início *</label>

            <input
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Hora de Início</label>

            <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Data de Término</label>

            <input
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Hora de Término</label>

            <input
                type="time"
                name="hora_fim"
                value={form.hora_fim}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Local Principal</label>

            <input
                type="text"
                name="local1"
                value={form.local1}
                onChange={alterarCampo}
                placeholder="Cidade, Região ou Local"
            />

        </div>

        <div className="campo">

            <label>Local Complementar</label>

            <input
                type="text"
                name="local2"
                value={form.local2}
                onChange={alterarCampo}
                placeholder="Endereço, Auditório, Sala..."
            />

        </div>

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
                    checked={form.evento_online}
                    onChange={alterarCampo}
                />

                Evento Online

            </label>

        </div>

        {form.evento_online && (

            <div className="campo campo-2">

                <label>Link do Evento</label>

                <input
                    type="url"
                    name="link"
                    value={form.link}
                    onChange={alterarCampo}
                    placeholder="https://..."
                />

            </div>

        )}

    </div>

</div>

)}


{/* ================= DADOS PROJETO ================= */}

{/* ================= DADOS PROJETO ================= */}

{["Projeto Curto","Projeto Longo"].includes(form.tipo_submissao) && (

<div className="form-box">

    <h2>Dados do Projeto</h2>

    <div className="form-grid">

        <div className="campo">

            <label>Data de Início *</label>

            <input
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Data Prevista de Término</label>

            <input
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={alterarCampo}
            />

        </div>

        <div className="campo">

            <label>Área de Atuação</label>

            <select
                name="area_projeto"
                value={form.area_projeto}
                onChange={alterarCampo}
            >
                <option value="">-- Selecione --</option>
                <option value="Agricultura">Agricultura</option>
                <option value="Água">Água</option>
                <option value="Energia">Energia</option>
                <option value="Florestas">Florestas</option>
                <option value="Biodiversidade">Biodiversidade</option>
                <option value="Pesca">Pesca</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Outro">Outro</option>
            </select>

        </div>

        <div className="campo">

            <label>Link do Projeto</label>

            <input
                type="url"
                name="link"
                value={form.link}
                onChange={alterarCampo}
                placeholder="https://..."
            />

        </div>

        <div className="campo campo-2">

            <label>Instituições Parceiras</label>

            <input
                type="text"
                name="parceiros"
                value={form.parceiros}
                onChange={alterarCampo}
                placeholder="Ex.: Ministério do Ambiente, PNUD, FAO..."
            />

        </div>

        <div className="campo campo-2">

            <label>Objetivo do Projeto *</label>

            <textarea
                name="objetivo_projeto"
                value={form.objetivo_projeto}
                onChange={alterarCampo}
                rows={5}
                placeholder="Descreva os objetivos do projeto..."
            />

        </div>

        <div className="campo campo-2">

            <label>Observações</label>

            <textarea
                name="descricao_documento"
                value={form.descricao_documento}
                onChange={alterarCampo}
                rows={4}
                placeholder="Informações complementares..."
            />

        </div>

    </div>

</div>

)}


{/* ================= OUTROS ================= */}

{/* ================= OUTROS ================= */}

{form.tipo_submissao==="Outro" && (

<div className="form-box">

    <h2>Outras Informações</h2>

    <div className="form-grid">

        <div className="campo">

            <label>Tipo de Conteúdo *</label>

            <input
                type="text"
                name="tipo_conteudo_outro"
                value={form.tipo_conteudo_outro || ""}
                onChange={alterarCampo}
                placeholder="Ex.: Podcast, Concurso, Vídeo, Curso..."
            />

        </div>

        <div className="campo">

            <label>Link Relacionado</label>

            <input
                type="url"
                name="link"
                value={form.link}
                onChange={alterarCampo}
                placeholder="https://..."
            />

        </div>

        <div className="campo campo-2">

            <label>Objetivo *</label>

            <textarea
                name="objetivo_outro"
                value={form.objetivo_outro || ""}
                onChange={alterarCampo}
                rows={4}
                placeholder="Qual o objetivo deste conteúdo?"
            />

        </div>

        <div className="campo campo-2">

            <label>Descrição</label>

            <textarea
                name="descricao_outro"
                value={form.descricao_outro || ""}
                onChange={alterarCampo}
                rows={5}
                placeholder="Descreva o conteúdo..."
            />

        </div>

        <div className="campo campo-2">

            <label>Observações</label>

            <textarea
                name="observacoes_outro"
                value={form.observacoes_outro || ""}
                onChange={alterarCampo}
                rows={4}
                placeholder="Informações adicionais..."
            />

        </div>

    </div>

</div>

)}

{/* ================= UPLOAD DE ARQUIVOS ================= */}

{/* ================= UPLOAD DE ARQUIVOS ================= */}

<div className="form-box">

    <h2>Arquivos</h2>

    <div className="form-grid">

        <div className="campo campo-2">

            <label>Selecione um ou mais arquivos</label>

            <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                onChange={selecionarArquivos}
            />

        </div>

        {arquivos.length > 0 && (

            <div className="campo campo-2">

                <h4>Arquivos selecionados</h4>

                <ul>

                    {arquivos.map((arquivo, index) => (

                        <li key={index}>
                            📄 {arquivo.name}
                        </li>

                    ))}

                </ul>

            </div>

        )}

    </div>

</div>



{/* ================= TAGS ================= */}

<div className="form-box">

    <h2>Palavras-chave</h2>

    <div className="form-grid">

     <div className="campo campo-2">

    <label>Tags</label>

    <select
        name="tags"
        value={form.tags}
        onChange={alterarCampo}
        required
    >
        <option value="">Selecione...</option>

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


{/* ================= CONFIRMAÇÃO ================= */}

{/* ================= CONFIRMAÇÃO ================= */}

<div className="form-box">

    <h2>Confirmação</h2>

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
                    checked={form.permissao_publicacao}
                    onChange={alterarCampo}
                    required
                />

                Declaro que as informações fornecidas são verdadeiras e autorizo sua publicação no Portal Climático da Guiné-Bissau.

            </label>

        </div>

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