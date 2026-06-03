const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const db = require("./db");

const app = express();

/* =========================
   CONFIG
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   UPLOADS
========================= */

app.use(
  "/uploads",
  express.static("uploads")
);

/* =========================
   MULTER
========================= */

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(

      null,

      Date.now() +

      path.extname(file.originalname)

    );

  }

});

const upload = multer({
  storage
});

/* =========================
   TESTE
========================= */

app.get("/", (req, res) => {

  res.send("API funcionando");

});

/* =========================
   LISTAR CARDS
========================= */

app.get("/cards", async (req, res) => {

  try {

    const resultado = await db.query(

      `
      SELECT *
      FROM cards
      ORDER BY pagina, ordem, id
      `

    );

    res.json(
      resultado.rows
    );

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      erro: err.message
    });

  }

});

app.get("/cards/:pagina", async (req, res) => {

  try {

    const pagina = req.params.pagina;

    const result = await db.query(

      `
      SELECT *
      FROM cards
      WHERE pagina = $1
      AND ativo = true
      ORDER BY ordem
      `,

      [pagina]

    );

    res.json(result.rows);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      erro: "Erro servidor"

    });

  }

});

/* =========================
   CADASTRAR CARD
========================= */

app.post(

  "/cards",

  upload.fields([

  {
    name: "imagem_card",
    maxCount: 1
  },

  {
    name: "imagens",
    maxCount: 5
  }

]),

  async (req, res) => {

    try {

      const {

        pagina,

        titulo,

        conteudo,

        link,

        tipo_link,

        ordem,

        pagina_detalhe,

        titulo_pagina,

        texto_pagina,

        data_publicacao

      } = req.body;

      /* IMAGEM */

      let imagem = null;

      if (

          req.files &&
          req.files.imagem_card

        ) {

          imagem =
            req.files.imagem_card[0]
              .filename;

        }

      /* SALVAR CARD */

      const novoCard = await db.query(

        `
        INSERT INTO cards
        (

          pagina,

          titulo,

          conteudo,

          link,

          tipo_link,

          ordem,

          imagem_card,

          pagina_detalhe

        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8
        )

        RETURNING *
        `,

        [

          pagina,

          titulo,

          conteudo,

          link,

          tipo_link,

          ordem,

          imagem,

          pagina_detalhe === "sim"

        ]

      );

      /* =========================
         SE TIVER PÁGINA
      ========================= */

      if (pagina_detalhe === "sim") {

              const paginaNova =
          await db.query(

            `
            INSERT INTO paginas
            (
              card_id,
              titulo,
              texto,
              data_publicacao
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *
            `,

            [

              novoCard.rows[0].id,

              titulo_pagina,

              texto_pagina,

              data_publicacao

            ]

          );

          if (

                  req.files &&
                  req.files.imagens

                ) {

                  const paginaId =
                    paginaNova.rows[0].id;

                  for (

                    let i = 0;

                    i < req.files.imagens.length;

                    i++

                  ) {

                    await db.query(

                      `
                      INSERT INTO paginas_imagens
                      (
                        pagina_id,
                        imagem,
                        ordem
                      )
                      VALUES
                      ($1,$2,$3)
                      `,

                      [

                        paginaId,

                        req.files.imagens[i]
                          .filename,

                        i + 1

                      ]

                    );

                  }

                }

      }

      res.json({

        sucesso: true

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        erro: "Erro servidor"

      });

    }

  }

);

app.post(

  "/login",

  async (req, res) => {

    const {
      usuario,
      senha
    } = req.body;

    const resultado = await db.query(

      `
      SELECT *
      FROM usuarios
      WHERE usuario = $1
      AND senha = $2
      `,

      [usuario, senha]

    );

    res.json({

      sucesso:
        resultado.rows.length > 0

    });

  }

);

/* =========================
   EXCLUIR CARD
========================= */

app.delete("/cards/:id", async (req, res) => {

  try {

    const cardId = req.params.id;

    /* procura página vinculada */

    const pagina = await db.query(

      `
      SELECT id
      FROM paginas
      WHERE card_id = $1
      `,

      [cardId]

    );

    if (pagina.rows.length > 0) {

      const paginaId =
        pagina.rows[0].id;

      /* exclui imagens */

      await db.query(

        `
        DELETE FROM paginas_imagens
        WHERE pagina_id = $1
        `,

        [paginaId]

      );

      /* exclui página */

      await db.query(

        `
        DELETE FROM paginas
        WHERE id = $1
        `,

        [paginaId]

      );

    }

    /* exclui card */

    await db.query(

      `
      DELETE FROM cards
      WHERE id = $1
      `,

      [cardId]

    );

    res.json({

      sucesso: true

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      erro: err.message

    });

  }

});


/* =========================
   EDITAR CARD
========================= */

app.put(
  

  "/cards/:id",

  

  upload.fields([

    

    {
      name: "imagem_card",
      maxCount: 1
    },

    {
      name: "imagens",
      maxCount: 5
    }

  ]),


  

  async (req, res) => {

    try {

      const id = req.params.id;

      const {

        pagina,

        titulo,

        conteudo,

        link,

        tipo_link,

        ordem,

        pagina_detalhe,

        titulo_pagina,

        texto_pagina,

        data_publicacao

      } = req.body;

      /* =========================
         IMAGEM
      ========================= */

      let imagem = null;

        if (

          req.files &&
          req.files.imagem_card

        ) {

          imagem =
            req.files.imagem_card[0]
              .filename;

        }

      /* =========================
         UPDATE CARD
      ========================= */

      await db.query(

        `
        UPDATE cards
        SET

          pagina = $1,

          titulo = $2,

          conteudo = $3,

          link = $4,

          tipo_link = $5,

          ordem = $6,

          imagem_card =
          COALESCE($7, imagem_card),

          pagina_detalhe = $8

        WHERE id = $9
        `,

        [

          pagina,

          titulo,

          conteudo,

          link,

          tipo_link,

          ordem,

          imagem,

          pagina_detalhe === "sim",

          id

        ]

      );

      /* =========================
         VERIFICAR PAGINA
      ========================= */

      const paginaExistente = await db.query(

        `
        SELECT *
        FROM paginas
        WHERE card_id = $1
        `,

        [id]

      );

      /* =========================
         ATUALIZAR PAGINA
      ========================= */

      if (

        pagina_detalhe === "sim"

      ) {

        if (

          paginaExistente.rows.length > 0

        ) {

          await db.query(

            `
            UPDATE paginas
            SET

              titulo = $1,

              texto = $2,

              data_publicacao = $3

            WHERE card_id = $4
            `,

            [

              titulo_pagina,

              texto_pagina,

              data_publicacao,

              id

            ]

          );

        }

        else {

          await db.query(

            `
            INSERT INTO paginas
            (

              card_id,

              titulo,

              texto,

              data_publicacao

            )

            VALUES
            (
              $1,$2,$3,$4
            )
            `,

            [

              id,

              titulo_pagina,

              texto_pagina,

              data_publicacao

            ]

          );

          

        }

      }

      const paginaAtual = await db.query(

              `
              SELECT id
              FROM paginas
              WHERE card_id = $1
              `,

              [id]

            );

            if (paginaAtual.rows.length === 0) {

              return res.status(400).json({
                erro: "Página não encontrada"
              });

            }

            const paginaId =
              paginaAtual.rows[0].id;



              if (

              req.files &&
              req.files.imagens

            ) {

              for (

                let i = 0;

                i < req.files.imagens.length;

                i++

              ) {

                await db.query(

                  `
                  INSERT INTO paginas_imagens
                  (
                    pagina_id,
                    imagem,
                    ordem
                  )
                  VALUES
                  ($1,$2,$3)
                  `,

                  [

                    paginaId,

                    req.files.imagens[i]
                      .filename,

                    i + 1

                  ]

                );

              }

            }

      res.json({

        sucesso: true

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        erro: "Erro servidor"

      });

    }

  }

);

/* =========================
   BUSCAR PAGINA
========================= */

app.get("/pagina/:cardId", async (req, res) => {

  try {

    const cardId = req.params.cardId;

    const result = await db.query(

      `
      SELECT *
      FROM paginas
      WHERE card_id = $1
      `,

      [cardId]

    );

    res.json(
      result.rows[0]
    );

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      erro: "Erro servidor"

    });

  }

});


/* =========================
   LISTAR IMAGENS
========================= */

app.post(

  "/pagina-imagens/:paginaId",

  upload.array("imagens", 5),

  async (req, res) => {

    try {

      const paginaId =
        req.params.paginaId;

      for (

        let i = 0;

        i < req.files.length;

        i++

      ) {

        await db.query(

          `
          INSERT INTO paginas_imagens
          (
            pagina_id,
            imagem,
            ordem
          )
          VALUES
          ($1,$2,$3)
          `,

          [

            paginaId,

            req.files[i].filename,

            i + 1

          ]

        );

      }

      res.json({

        sucesso: true

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        erro: "Erro upload"

      });

    }

  }

);

/* =========================
   LISTAR IMAGENS
========================= */

app.get(

  "/pagina-imagens/:paginaId",

  async (req, res) => {

    try {

      const result = await db.query(

        `
        SELECT *
        FROM paginas_imagens
        WHERE pagina_id = $1
        ORDER BY ordem
        `,

        [

          req.params.paginaId

        ]

      );

      res.json(

        result.rows

      );

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        erro: "Erro"

      });

    }

  }

);

/* =========================
   EXCLUIR IMAGEM
========================= */

app.delete(

  "/pagina-imagem/:id",

  async (req, res) => {

    try {

      await db.query(

        `
        DELETE FROM paginas_imagens
        WHERE id = $1
        `,

        [req.params.id]

      );

      res.json({

        sucesso: true

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        erro: "Erro ao excluir imagem"

      });

    }

  }

);


/* =========================
   SERVIDOR
========================= */

app.listen(3000, () => {

  console.log(
    "Servidor rodando porta 3000"
  );

});