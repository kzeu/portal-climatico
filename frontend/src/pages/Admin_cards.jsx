/* eslint-disable react-hooks/exhaustive-deps */

import "../App.css";
import { useState, useEffect } from "react";

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


  

  /* =========================
     LISTAR
  ========================= */

  async function carregarCards() {

    const response = await fetch(
  "http://localhost:3000/cards"
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

    setForm({

      ...form,

      [name]: files
        ? files[0]
        : value

    });

  }




  /* =========================
     SALVAR
  ========================= */

  async function salvar(e) {

    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {

      formData.append(

        key,

        form[key]

      );

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

        `http://localhost:3000/cards/${editando}`,

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

        "http://localhost:3000/cards",

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


  async function carregarImagensPagina(cardId) {

  try {

    const respostaPagina = await fetch(
      `http://localhost:3000/pagina/${cardId}`
    );

    const pagina =
      await respostaPagina.json();

    const respostaImagens = await fetch(
      `http://localhost:3000/pagina-imagens/${pagina.id}`
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

      `http://localhost:3000/cards/${id}`,

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

    `http://localhost:3000/pagina-imagem/${idImagem}`,

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

                <option value="home">
                  Home
                </option>

                <option value="adaptacao">
                  Adaptação
                </option>

                <option value="mitigacao">
                  Mitigação
                </option>

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
              />

            </div>

            {/* CONTEUDO */}

            <div className="form-group">

              <label>Conteúdo</label>

              <textarea
                rows="5"
                name="conteudo"
                value={form.conteudo}
                onChange={handleChange}
              />

            </div>

            {/* LINK */}

              <div className="form-group">

                <label>Tipo Link</label>

                <select
                  name="tipo_link"
                  value={form.tipo_link}
                  onChange={handleChange}
                >

                  <option value="interno">
                    Interno
                  </option>

                  <option value="externo">
                    Externo
                  </option>

                </select>

              </div>

        

            {/* TIPO LINK */}

            <div className="form-group">

                <label>Link</label>

                <input
                  type="text"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="Ex: https://site.com ou pagina_interna"
                />

              </div>

          

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

                              src={`http://localhost:3000/uploads/${form.imagem_card}`}

                              alt=""

                            />

                          </div>

                        </div>

                      </div>

                    )}

              <input
                type="file"
                name="imagem_card"
                onChange={handleChange}
              />

            </div>

            {/* PAGINA DETALHE */}

            <div className="form-group">

              <label>Publicar Página?</label>

              <select
                name="pagina_detalhe"
                value={form.pagina_detalhe}
                onChange={handleChange}
              >

                <option value="nao">
                  Não
                </option>

                <option value="sim">
                  Sim
                </option>

              </select>

            </div>

            {/* SE TIVER PAGINA */}

            {form.pagina_detalhe === "sim" && (

                <div className="secao-admin">

                  <h2>Notícia/Publicação Vinculada</h2>

                </div>

              )}

            {form.pagina_detalhe === "sim" && (

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

                  <label>Data Publicação</label>

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
                                  src={`http://localhost:3000/uploads/${img.imagem}`}
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

            <div className="full-width">

              <button
                type="submit"
                className="btn-enviar"
              >

                {editando
                  ? "Atualizar"
                  : "Salvar"}

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

                <th>Notícia</th>


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
                      ? "Sim"
                      : "Não"}

                  </td>

                  <td>

                    <button

                     onClick={async () => {

                                  setEditando(card.id);

                                  let dadosPagina = null;

                                  if (card.pagina_detalhe) {

                                    const respostaPagina = await fetch(
                                      `http://localhost:3000/pagina/${card.id}`
                                    );

                                    dadosPagina =
                                      await respostaPagina.json();

                                    await carregarImagensPagina(
                                      card.id
                                    );

                                  }

                                  setForm({

                                    ...card,

                                    pagina_detalhe:
                                      card.pagina_detalhe
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

                      Editar

                    </button>

                   <button

                    onClick={() => {

                      const confirmar = window.confirm(

                        `Deseja excluir o card "${card.titulo}"?`

                      );

                      if (confirmar) {

                        excluir(card.id);

                      }

                    }}

                  >

                    Excluir

                  </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      

  );

}

export default Admin_cards;