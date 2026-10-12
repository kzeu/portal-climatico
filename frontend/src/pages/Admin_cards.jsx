/* eslint-disable react-hooks/exhaustive-deps */

import "../App.css";
import { useState, useEffect } from "react";
import API_URL from "../config";



function Admin_cards() {

  const [cards, setCards] = useState([]);

  const [editando, setEditando] = useState(null);

  const [imagens, setImagens] = useState([]);

  const [imagensExistentes, setImagensExistentes] = useState([]);

  const [form, setForm] = useState({

    pagina: "home",

    titulo: "",

    conteudo: "",

    link: "",

    tipo_link: "interno",

    ordem: 0,

    imagem_card: null,

    pagina_detalhe: "nao",

    titulo_pagina: "",

    texto_pagina: "",

    data_publicacao: ""

  });

  const paginasInternas = [
  { value: "home", label: "Home" },
  { value: "adaptacao", label: "Adaptação" },
  { value: "mitigacao", label: "Mitigação" },
  { value: "engajamento", label: "Engajamento" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "contato", label: "Contato" },
  { value: "seguimento_nap", label: "Seguimento do NAP" },
  { value: "mapas_climatologia", label: "Mapas Climatologia" },
  { value: "mapas_riscos", label: "Mapas de Risco" },
  { value: "form_submissao", label: "Formulário de Submissão Climática" }
];


  

  /* =========================
     LISTAR
  ========================= */

  async function carregarCards() {

    const response = await fetch(
    `${API_URL}/cards`
  );

    const data = await response.json();

    setCards(data);

  }

  useEffect(() => {

    carregarCards();

  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */

  function handleChange(e) {

    const {

      name,

      value,

      files

    } = e.target;

    setForm((anterior) => {
      const proximo = {
        ...anterior,
        [name]: files ? files[0] : value
      };

      // A opção Publicação usa a página de conteúdo já existente no backend.
      if (name === "tipo_link") {
        proximo.pagina_detalhe = value === "publicacao" ? "sim" : "nao";
        if (value === "nenhum") proximo.link = "";
      }

      if (name === "pagina_detalhe") {
        proximo.tipo_link = value === "sim" ? "publicacao" : (anterior.tipo_link === "publicacao" ? "interno" : anterior.tipo_link);
      }

      return proximo;
    });

  }




  /* =========================
     SALVAR
  ========================= */

  async function salvar(e) {

    e.preventDefault();

    if (["interno", "externo"].includes(form.tipo_link) && !String(form.link || "").trim()) {
      alert(form.tipo_link === "externo"
        ? "Informe o endereço do link externo."
        : "Selecione a página interna de destino.");
      return;
    }

    if (form.tipo_link === "externo" && !/^https?:\/\//i.test(String(form.link || "").trim())) {
      alert("Informe um endereço externo válido começando com http:// ou https://.");
      return;
    }

    const dadosForm = {
      ...form,
      pagina_detalhe: form.tipo_link === "publicacao" ? "sim" : "nao"
    };
    const formData = new FormData();

    Object.keys(dadosForm).forEach((key) => {
      formData.append(key, dadosForm[key] ?? "");
    });

    imagens.forEach((img) => {

      formData.append(
        "imagens",
        img
      );

    });

    /* EDITAR */

    if (editando) {

      await fetch(

         `${API_URL}/cards/${editando}`,

        

        {

          method: "PUT",

          body: formData

        }

      );

      alert("Card atualizado");

    }

    /* NOVO */

    else {

      await fetch(

       `${API_URL}/cards`,

        {

          method: "POST",

          body: formData

        }

      );

      alert("Card salvo");

    }

    carregarCards();

    setEditando(null);

    setImagens([]);
    setImagensExistentes([]);

    

    setForm({

      pagina: "home",

      titulo: "",

      conteudo: "",

      link: "",

      tipo_link: "interno",

      ordem: 0,

      imagem_card: null,

      pagina_detalhe: "nao",

      titulo_pagina: "",

      texto_pagina: "",

      data_publicacao: ""

    });

  }

  function limparFormulario() {

  setEditando(null);

  setImagens([]);

  setImagensExistentes([]);

  setForm({

    pagina: "home",

    titulo: "",

    conteudo: "",

    link: "",

    tipo_link: "interno",

    ordem: 0,

    imagem_card: null,

    pagina_detalhe: "nao",

    titulo_pagina: "",

    texto_pagina: "",

    data_publicacao: ""

  });

}


  async function carregarImagensPagina(cardId) {

  try {

    const respostaPagina = await fetch(
      `${API_URL}/pagina/${cardId}`
    );

    const pagina =
      await respostaPagina.json();

    const respostaImagens = await fetch(
      `${API_URL}/pagina-imagens/${pagina.id}`
    );

    const imagens =
      await respostaImagens.json();

    setImagensExistentes(imagens);

  }

  catch (erro) {

    console.log(erro);

  }

}

  /* =========================
     EXCLUIR
  ========================= */

  async function excluir(id) {

    await fetch(

      `${API_URL}/cards/${id}`,

      {

        method: "DELETE"

      }

    );

    carregarCards();

  }

  async function excluirImagem(idImagem, cardId) {

  const confirmar = window.confirm(
    "Deseja excluir esta imagem?"
  );

  if (!confirmar) return;

  await fetch(

    `${API_URL}/pagina-imagem/${idImagem}`,

    {

      method: "DELETE"

    }

  );

  await carregarImagensPagina(
    cardId
  );

  setImagensExistentes(

  imagensExistentes.filter(
    img => img.id !== idImagem
  )

);

}



  return (

        <div className="admin-card">

        <div className="admin-header">

          

          <h2>
            Cadastro e gerenciamento de conteúdos
          </h2>

        </div>

       

          {/* FORM */}

          <form
            className="admin-form"
            onSubmit={salvar}
          >

            <div className="secao-admin">

            <h2>Dados do Card</h2>

          </div>

            {/* PAGINA */}

            <div className="form-group">

            
              <label>Página</label>

              <select
                name="pagina"
                value={form.pagina}
                onChange={handleChange}
              >

                {paginasInternas.map((pagina) => (
                  <option key={pagina.value} value={pagina.value}>
                    {pagina.label}
                  </option>
                ))}

              </select>

            </div>

            {/* ORDEM */}

            <div className="form-group">

              <label>Ordem</label>

              <input
                type="number"
                name="ordem"
                value={form.ordem}
                onChange={handleChange}
              />

            </div>

            {/* TITULO */}

            <div className="form-group">

              <label>Título</label>

              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                maxLength={120}
                required
                placeholder="Ex.: Mapas de risco climático"
              />

            </div>

            {/* CONTEUDO */}

            <div className="form-group">

              <label>Conteúdo</label>

              <textarea
                rows="4"
                name="conteudo"
                value={form.conteudo || ""}
                onChange={handleChange}
                maxLength={200}
                placeholder="Escreva uma descrição curta e objetiva para o card."
              />
              <small className="card-char-counter">
                {(form.conteudo || "").length}/200 caracteres.
                {(form.conteudo || "").length >= 180
                  ? " Prefira uma frase curta; textos maiores podem ficar na página de conteúdo."
                  : " Se precisar explicar mais, use a página de conteúdo vinculada."}
              </small>

            </div>

            {/* DESTINO E COMPORTAMENTO */}
            <div className="form-group">
              <label>Destino / comportamento do card</label>
              <select
                name="tipo_link"
                value={form.tipo_link || (form.pagina_detalhe === "sim" ? "publicacao" : "interno")}
                onChange={handleChange}
              >
                <option value="interno">Página interna do portal</option>
                <option value="externo">Página externa (abre em nova aba)</option>
                <option value="publicacao">Página de publicação / conteúdo completo</option>
                <option value="nenhum">Nenhum — apenas informativo</option>
              </select>
            </div>

            {(form.tipo_link === "interno" || form.tipo_link === "externo") && (
              <div className="form-group">
                <label>{form.tipo_link === "interno" ? "Página interna de destino" : "Endereço externo"}</label>
                {form.tipo_link === "interno" ? (
                  <select name="link" value={form.link || ""} onChange={handleChange} required>
                    <option value="">Selecione uma página...</option>
                    {paginasInternas.map((pagina) => (
                      <option key={pagina.value} value={pagina.value}>{pagina.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="url"
                    name="link"
                    value={form.link || ""}
                    onChange={handleChange}
                    placeholder="https://exemplo.org"
                    required
                  />
                )}
              </div>
            )}

            <p className="card-admin-help full-width">
              <strong>Como o card vai funcionar?</strong> Página interna navega no portal; página externa abre um site em nova aba; publicação abre uma página própria com texto completo, data e fotos; “Nenhum” exibe o card apenas como informação, sem ação de clique.
            </p>

            {/* IMAGEM */}

            <div className="form-group">

              

             {editando && form.imagem_card && (

                      <div className="imagens-existentes">

                        <h4>

                          Imagem Atual do Card

                        </h4>

                        <div className="preview-imagens">

                          <div className="preview-item">

                            <img

                              src={`${API_URL}/uploads/${form.imagem_card}`}

                              alt=""

                            />

                          </div>

                        </div>

                      </div>

                    )}

              <label>Imagem de capa (opcional)</label>
              <input
                type="file"
                name="imagem_card"
                accept="image/*"
                onChange={handleChange}
              />
              <small className="card-admin-help">
                Se houver imagem, ela será usada como fundo do card com uma camada verde-escura para manter o texto legível.
              </small>

            </div>

            {/* SE TIVER PAGINA */}

            {form.tipo_link === "publicacao" && (

                <div className="secao-admin">

                  <h2>Notícia/Publicação Vinculada</h2>

                </div>

              )}

            {form.tipo_link === "publicacao" && (

              <>

                {/* TITULO PAGINA */}

                <div className="form-group">

                  <label>Título Página</label>

                  <input
                    type="text"
                    name="titulo_pagina"
                    value={form.titulo_pagina}
                    onChange={handleChange}
                  />

                </div>

                {/* DATA */}

                <div className="form-group">

                  <label>Data da publicação</label>

                  <input
                    type="date"
                    name="data_publicacao"
                    value={form.data_publicacao}
                    onChange={handleChange}
                  />

                </div>



                {/* FOTOS */}

                  <div className="form-group full-width">

                    <label>

                      Fotos da Notícia
                      (máximo 5)

                    </label>

                      {imagensExistentes.length > 0 && (

                        <div className="imagens-existentes">

                          <h4>

                            Fotos já cadastradas

                          </h4>

                          <div className="preview-imagens">

                            {imagensExistentes.map((img) => (

                              <div
                                key={img.id}
                                className="preview-item"
                              >

                                <img
                                  src={`${API_URL}/uploads/${img.imagem}`}
                                  alt=""
                                />

                                <button

                                  type="button"

                                  className="btn-excluir-imagem"

                                  onClick={() =>

                                    excluirImagem(
                                      img.id,
                                      editando
                                    )

                                  }

                                >

                                  ✖

                                </button>

                              </div>

                            ))}

                              {imagens.map((img, index) => (

                                    <div
                                      key={index}
                                      className="preview-item"
                                    >

                                      <img

                                        src={URL.createObjectURL(img)}

                                        alt=""

                                      />

                                      {index === 0 && (

                                        <span>

                                          Foto 1

                                        </span>

                                      )}

                                    </div>

                                  ))}

                          </div>

                        </div>

                      )}

                       

                    <input

                      type="file"

                      multiple

                      accept="image/*"

                      onChange={(e) => {

                        setImagens(

                          Array.from(
                            e.target.files
                          ).slice(0, 5)

                        );

                      }}

                    />

                  </div>

                  {imagens.length > 0 && (

                    <div className="preview-imagens">

                   

                    </div>

                  )}

                {/* TEXTO */}

                <div className="form-group full-width">

                  <label>Texto Completo</label>

                  <textarea
                    rows="8"
                    name="texto_pagina"
                    value={form.texto_pagina}
                    onChange={handleChange}
                  />

                </div>

              </>

            )}

            {/* BOTÃO */}

           <div
                className="full-width botoes-form"
              >

                <button
                  type="submit"
                  className="btn-enviar"
                >

                  {editando
                    ? "Atualizar"
                    : "Salvar"}

                </button>

                <button

                  type="button"

                  className="btn-enviar"

                  onClick={
                    limparFormulario
                  }

                >

                  Limpar

                </button>

              </div>

          </form>

          {/* TABELA */}

          <table className="admin-table">

            <thead>

              <tr>


                <th>Título</th>

                <th>Página</th>

                <th>Imagem</th>

                <th>Destino</th>


                <th>Ações</th>

              </tr>

            </thead>

            <tbody>

              {cards.map((card) => (

                <tr key={card.id}>

                 

                  <td>{card.titulo}</td>

                  <td>{card.pagina}</td>

                  <td>

                    {card.imagem_card
                      ? "Sim"
                      : "Não"}

                  </td>

                  <td>
                    {card.pagina_detalhe
                      ? "Publicação"
                      : card.tipo_link === "externo"
                        ? "Link externo"
                        : card.tipo_link === "nenhum"
                          ? "Informativo"
                          : "Página interna"}
                  </td>

                <td>

                    <div className="acoes-card">

                      <button

                        className="btn-editar"

                        onClick={async () => {

                          setEditando(card.id);

                          let dadosPagina = null;

                          if (card.pagina_detalhe) {

                            const respostaPagina = await fetch(
                              `${API_URL}/pagina/${card.id}`
                            );

                            dadosPagina =
                              await respostaPagina.json();

                            await carregarImagensPagina(
                              card.id
                            );

                          }

                          setForm({

                            ...card,

                            tipo_link: (card.pagina_detalhe === true || card.pagina_detalhe === 1 || card.pagina_detalhe === "1" || card.pagina_detalhe === "sim")
                              ? "publicacao"
                              : (card.tipo_link || "interno"),

                            pagina_detalhe:
                              (card.pagina_detalhe === true || card.pagina_detalhe === 1 || card.pagina_detalhe === "1" || card.pagina_detalhe === "sim")
                                ? "sim"
                                : "nao",

                            titulo_pagina:
                              dadosPagina?.titulo || "",

                            texto_pagina:
                              dadosPagina?.texto || "",

                            data_publicacao:
                              dadosPagina?.data_publicacao
                                ? dadosPagina.data_publicacao.substring(0, 10)
                                : ""

                          });

                        }}

                      >

                        ✏️ Editar

                      </button>

                      <button

                        className="btn-excluir"

                        onClick={() => {

                          const confirmar = window.confirm(

                            `Deseja excluir o card "${card.titulo}"?`

                          );

                          if (confirmar) {

                            excluir(card.id);

                          }

                        }}

                      >

                        🗑️ Excluir

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      

  );

}

export default Admin_cards;