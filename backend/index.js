const express = require("express");
const cors = require("cors");

const multer = require("multer");

const uploadSubmissao = multer({
  storage: multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, "uploads/submissoes");
    },

    filename: function (req, file, cb) {

      const nomeSeguro = file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      const nomeFinal =
        Date.now() + "_" + nomeSeguro;

      cb(null, nomeFinal);
    }

  })
});

const path = require("path");

const db = require("./db");

const fs =require("fs");

const XLSX = require("xlsx");

const app = express();

/* =========================
   CONFIG
========================= */

app.use(cors());

app.use(express.json());

app.use(
    "/maps",
    express.static("uploads/mapas")
);

app.use(express.urlencoded({ extended: true }));
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



const storageMapas = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/mapas");

    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() + "_" + file.originalname
        );

    }

});

const uploadMapa = multer({

    storage: storageMapas

});


const storageMetadata = multer.memoryStorage();

const uploadMetadata = multer({
    storage: storageMetadata
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

app.get("/usuarios", async (req, res) => {

  try {

    const resultado = await db.query(
      `
      SELECT *
      FROM usuarios
      ORDER BY id
      `
    );

    res.json(resultado.rows);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro servidor"
    });

  }

});

app.post("/usuarios", async (req, res) => {

  try {

    const {

      nome,
      usuario,
      senha,
      perfil

    } = req.body;

    await db.query(

      `
      INSERT INTO usuarios
      (
        nome,
        usuario,
        senha,
        perfil
      )
      VALUES
      (
        $1,$2,$3,$4
      )
      `,

      [
        nome,
        usuario,
        senha,
        perfil
      ]

    );

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

});

app.put("/usuarios/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const {

      nome,
      usuario,
      senha,
      perfil

    } = req.body;

    await db.query(

      `
      UPDATE usuarios
      SET

        nome = $1,
        usuario = $2,
        senha = $3,
        perfil = $4

      WHERE id = $5
      `,

      [
        nome,
        usuario,
        senha,
        perfil,
        id
      ]

    );

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

});

app.delete("/usuarios/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await db.query(

      `
      DELETE FROM usuarios
      WHERE id = $1
      `,

      [id]

    );

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
   CLIMA - INDICADORES
========================= */

app.get("/clima/indicadores", async (req, res) => {

    try {

        const resultado = await db.query(`
            SELECT *
            FROM clima_indicadores
            ORDER BY codigo
        `);

        res.json(resultado.rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            erro: err.message
        });

    }

});



/* =========================
   CADASTRAR INDICADOR CLIMÁTICO
========================= */

app.post(
  "/clima/indicadores",
  uploadMapa.single("arquivo"),

  async (req, res) => {

    try {

      const {
        codigo,
        nome,
        descricao,
        tipo,
        ativo
      } = req.body;

      const arquivo = req.file
        ? req.file.filename
        : null;

      const resultado = await db.query(

        `
        INSERT INTO clima_indicadores
        (
          codigo,
          nome,
          descricao,
          tipo,
          arquivo,
          ativo
        )
        VALUES
        ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,

        [
          codigo,
          nome,
          descricao,
          tipo,
          arquivo,
          ativo === "true" || ativo === true
        ]

      );

      res.json(resultado.rows[0]);

    }

    catch (err) {

      console.error(err);

      res.status(500).json({
        erro: err.message
      });

    }

  }

);




/* =========================
   EDITAR INDICADOR CLIMÁTICO
========================= */

app.put(
  "/clima/indicadores/:id",
  uploadMapa.single("arquivo"),
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        codigo,
        nome,
        descricao,
        tipo,
        ativo
      } = req.body;

      let arquivo = null;

      if (req.file) {

        arquivo = req.file.filename;

        await db.query(
          `
          UPDATE clima_indicadores
          SET
            codigo=$1,
            nome=$2,
            descricao=$3,
            tipo=$4,
            arquivo=$5,
            ativo=$6
          WHERE id=$7
          `,
          [
            codigo,
            nome,
            descricao,
            tipo,
            arquivo,
            ativo === "true" || ativo === true,
            id
          ]
        );

      } else {

        await db.query(
          `
          UPDATE clima_indicadores
          SET
            codigo=$1,
            nome=$2,
            descricao=$3,
            tipo=$4,
            ativo=$5
          WHERE id=$6
          `,
          [
            codigo,
            nome,
            descricao,
            tipo,
            ativo === "true" || ativo === true,
            id
          ]
        );

      }

      res.json({
        sucesso: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        erro: err.message
      });

    }

  }
);

/* =========================
   EXCLUIR INDICADOR CLIMÁTICO
========================= */

app.delete(
  "/clima/indicadores/:id",

  async (req, res) => {

    try {

      const { id } = req.params;

      await db.query(
        `
        DELETE
        FROM clima_indicadores
        WHERE id=$1
        `,
        [id]
      );

      res.json({
        sucesso: true
      });

    }

    catch (err) {

      console.error(err);

      res.status(500).json({
        erro: err.message
      });

    }

  }

);

/* =========================
   CLIMA - CLASSIFICAÇÕES
========================= */

app.get("/clima/classificacoes/:codigo", async (req, res) => {

    try {

        const resultado = await db.query(

            `
            SELECT *
            FROM clima_classificacoes
            WHERE codigo = $1
            ORDER BY classe
            `,

            [req.params.codigo]

        );

        res.json(resultado.rows);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            erro: err.message
        });

    }

});


/* =========================
   CLIMATE MAP METADATA
========================= */

app.post("/clima/map-metadata", async (req, res) => {

    try {

        const {
            indicator_id,
            map_code,
            geojson_field,
            variable_full,
            variable_short,
            period,
            scenario,
            uncertainty
        } = req.body;

        const resultado = await db.query(
            `
            INSERT INTO climate_map_metadata
            (
                indicator_id,
                map_code,
                geojson_field,
                variable_full,
                variable_short,
                period,
                scenario,
                uncertainty
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                indicator_id,
                map_code,
                geojson_field,
                variable_full,
                variable_short,
                period,
                scenario,
                uncertainty
            ]
        );

        res.json(resultado.rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            erro: err.message
        });

    }

});

/* =========================
   CADASTRAR CLASSIFICAÇÃO
========================= */

app.post("/clima/classificacoes", async (req, res) => {

    try {

        const {

            codigo,
            classe,
            minimo,
            maximo,
            cor

        } = req.body;

        const resultado = await db.query(

            `
            INSERT INTO clima_classificacoes
            (
                codigo,
                classe,
                minimo,
                maximo,
                cor
            )

            VALUES
            ($1,$2,$3,$4,$5)

            RETURNING *

            `,

            [

                codigo,
                classe,
                minimo,
                maximo,
                cor

            ]

        );

        res.json(resultado.rows[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            erro: err.message
        });

    }

});

/* =========================
   CADASTRAR CLASSIFICAÇÕES EM LOTE
========================= */

app.post("/clima/classificacoes/lote", async (req, res) => {

    try {

        const {
            codigo,
            classificacoes
        } = req.body;


        /* =========================
           VALIDAR
        ========================= */

        if (!codigo) {

            return res.status(400).json({
                erro: "Código do indicador não informado."
            });

        }


        if (
            !Array.isArray(classificacoes) ||
            classificacoes.length === 0
        ) {

            return res.status(400).json({
                erro: "Nenhuma classificação informada."
            });

        }


        /* =========================
           APAGAR CLASSIFICAÇÕES
           ANTIGAS
        ========================= */

        await db.query(
            `
            DELETE FROM clima_classificacoes
            WHERE codigo = $1
            `,
            [codigo]
        );


        /* =========================
           INSERIR NOVAS
        ========================= */

        for (const item of classificacoes) {

            await db.query(
                `
                INSERT INTO clima_classificacoes
                (
                    codigo,
                    classe,
                    minimo,
                    maximo,
                    cor
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
                `,
                [
                    codigo,
                    item.classe,
                    item.minimo,
                    item.maximo,
                    item.cor
                ]
            );

        }


        /* =========================
           RETORNO
        ========================= */

        res.json({

            sucesso: true,

            mensagem:
                "Classificações salvas com sucesso.",

            quantidade:
                classificacoes.length

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
   EDITAR CLASSIFICAÇÃO
========================= */

app.put("/clima/classificacoes/:id", async (req,res)=>{

    try{

        const {id}=req.params;

        const{

            classe,
            minimo,
            maximo,
            cor

        }=req.body;

        await db.query(

            `
            UPDATE clima_classificacoes

            SET

                classe=$1,
                minimo=$2,
                maximo=$3,
                cor=$4

            WHERE id=$5
            `,

            [

                classe,
                minimo,
                maximo,
                cor,
                id

            ]

        );

        res.json({

            sucesso:true

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            erro:err.message

        });

    }

});

/* =========================
   EXCLUIR CLASSIFICAÇÃO
========================= */

app.delete("/clima/classificacoes/:id", async (req,res)=>{

    try{

        await db.query(

            `
            DELETE
            FROM clima_classificacoes
            WHERE id=$1
            `,

            [

                req.params.id

            ]

        );

        res.json({

            sucesso:true

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            erro:err.message

        });

    }

});


/* =========================
   PROCESSAR MAPAS DO GEOJSON
========================= */

app.post(
    "/clima/mapas/processar",
    async (req, res) => {

        try {

            const {
                codigo,
                arquivo
            } = req.body;


            /* =========================
               VALIDAR
            ========================= */

            if (!codigo) {

                return res.status(400).json({
                    erro: "Código do indicador não informado."
                });

            }

            if (!arquivo) {

                return res.status(400).json({
                    erro: "Arquivo GeoJSON não informado."
                });

            }


            /* =========================
               CAMINHO DO ARQUIVO
            ========================= */

            const nomeArquivo =
                path.basename(arquivo);

            const caminhoArquivo =
                path.join(
                    __dirname,
                    "uploads",
                    "mapas",
                    nomeArquivo
                );


            /* =========================
               VERIFICAR ARQUIVO
            ========================= */

            if (!fs.existsSync(caminhoArquivo)) {

                return res.status(404).json({
                    erro: "Arquivo GeoJSON não encontrado."
                });

            }


            /* =========================
               LER GEOJSON
            ========================= */

            const conteudo =
                fs.readFileSync(
                    caminhoArquivo,
                    "utf8"
                );

            const geojson =
                JSON.parse(conteudo);


            if (
                !geojson.features ||
                !Array.isArray(geojson.features)
            ) {

                return res.status(400).json({
                    erro: "GeoJSON inválido."
                });

            }


            /* =========================
               PREFIXO DO INDICADOR
               HD30 -> hd30
               HD40 -> hd40
               TAS  -> tas
               TMAX -> tmax
            ========================= */

            const prefixo =
                codigo.toLowerCase();


            /* =========================
               OS 12 MAPAS
            ========================= */

          


            /* =========================
               VERIFICAR CAMPOS
            ========================= */



             


      


            /* =========================
               TRANSAÇÃO
            ========================= */

            await db.query("BEGIN");


            /* =========================
               APAGAR MAPAS ANTIGOS
            ========================= */

            await db.query(
                `
                DELETE FROM clima_mapas
                WHERE codigo = $1
                `,
                [codigo]
            );


            /* =========================
               INSERIR OS 12 MAPAS
            ========================= */

            for (const mapa of mapas) {

                await db.query(
                    `
                    INSERT INTO clima_mapas
                    (
                        codigo,
                        periodo,
                        ssp,
                        percentil,
                        campo,
                        arquivo
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )
                    `,
                    [
                        codigo,
                        mapa.periodo,
                        mapa.ssp,
                        mapa.percentil,
                        mapa.campo,
                        nomeArquivo
                    ]
                );

            }


            /* =========================
               CONFIRMAR
            ========================= */

            await db.query("COMMIT");


            res.json({

                sucesso: true,

                codigo: codigo,

                arquivo: nomeArquivo,

                quantidade: mapas.length

            });

        }

        catch (err) {

            try {

                await db.query("ROLLBACK");

            }

            catch (erroRollback) {

                console.log(
                    erroRollback
                );

            }


            console.error(err);

            res.status(500).json({

                erro: err.message

            });

        }

    }
);
/* =====================================================
   IMPORTAR METADADOS DOS MAPAS - EXCEL
===================================================== */

app.post(
    "/clima/map-metadata/upload",
    uploadMetadata.single("arquivo"),
    async (req, res) => {

        try {

            /* =====================================================
               VALIDAR ARQUIVO
            ===================================================== */

            if (!req.file) {

                return res.status(400).json({
                    erro: "Nenhum arquivo Excel foi enviado."
                });

            }


            console.log(
                "Excel recebido:",
                req.file.originalname
            );


            /* =====================================================
               LER EXCEL
            ===================================================== */

            const workbook = XLSX.read(
                req.file.buffer,
                {
                    type: "buffer"
                }
            );


            if (
                !workbook.SheetNames ||
                workbook.SheetNames.length === 0
            ) {

                return res.status(400).json({
                    erro: "O arquivo Excel não possui nenhuma aba."
                });

            }


            const nomeAba =
                workbook.SheetNames[0];


            const worksheet =
                workbook.Sheets[nomeAba];


            const linhas =
                XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        defval: ""
                    }
                );


            console.log(
                "Linhas encontradas:",
                linhas.length
            );


            if (linhas.length === 0) {

                return res.status(400).json({
                    erro: "A planilha está vazia."
                });

            }


            /* =====================================================
               COLUNAS OBRIGATÓRIAS
            ===================================================== */

            const colunasObrigatorias = [

                "map_code",
                "variable_full",
                "variable_short",
                "period",
                "scenario",
                "uncertainty"

            ];


            const primeiraLinha =
                linhas[0];


            const colunasFaltando =
                colunasObrigatorias.filter(
                    coluna =>
                        !(coluna in primeiraLinha)
                );


            if (colunasFaltando.length > 0) {

                return res.status(400).json({

                    erro:
                        "Colunas obrigatórias não encontradas.",

                    colunas_faltando:
                        colunasFaltando

                });

            }


            /* =====================================================
               VALIDAR TODOS OS REGISTROS
            ===================================================== */

            const registrosValidos = [];

            const erros = [];


            linhas.forEach(
                (linha, index) => {

                    const linhaExcel =
                        index + 2;


                    const registro = {

                        map_code:
                            String(
                                linha.map_code || ""
                            ).trim(),

                        variable_full:
                            String(
                                linha.variable_full || ""
                            ).trim(),

                        variable_short:
                            String(
                                linha.variable_short || ""
                            ).trim(),

                        period:
                            String(
                                linha.period || ""
                            ).trim(),

                        scenario:
                            String(
                                linha.scenario || ""
                            ).trim(),

                        uncertainty:
                            String(
                                linha.uncertainty || ""
                            ).trim()

                    };


                    /* MAP_CODE É OBRIGATÓRIO */

                    if (!registro.map_code) {

                        erros.push(
                            `Linha ${linhaExcel}: map_code vazio.`
                        );

                        return;

                    }


                    registrosValidos.push(
                        registro
                    );

                }
            );


            /* =====================================================
               VERIFICAR ERROS
            ===================================================== */

            if (erros.length > 0) {

                return res.status(400).json({

                    erro:
                        "Existem problemas nos dados da planilha.",

                    detalhes:
                        erros.slice(0, 20),

                    total_erros:
                        erros.length

                });

            }


            if (
                registrosValidos.length === 0
            ) {

                return res.status(400).json({

                    erro:
                        "Nenhum registro válido foi encontrado."

                });

            }


            /* =====================================================
               VERIFICAR DUPLICADOS
            ===================================================== */

            const mapaCodes =
                new Set();

            const duplicados = [];


            for (
                const registro
                of registrosValidos
            ) {

                if (
                    mapaCodes.has(
                        registro.map_code
                    )
                ) {

                    duplicados.push(
                        registro.map_code
                    );

                }

                mapaCodes.add(
                    registro.map_code
                );

            }


            if (duplicados.length > 0) {

                return res.status(400).json({

                    erro:
                        "Existem map_codes duplicados na planilha.",

                    duplicados:
                        [...new Set(duplicados)].slice(
                            0,
                            20
                        ),

                    total_duplicados:
                        [...new Set(duplicados)].length

                });

            }


            /* =====================================================
               TRANSAÇÃO
            ===================================================== */

            const client =
                await db.connect();


            try {

                await client.query(
                    "BEGIN"
                );


                /* =================================================
                   APAGAR METADADOS ATUAIS
                ================================================= */

                await client.query(
                    `
                    DELETE FROM
                        climate_map_metadata
                    `
                );


                /* =================================================
                   INSERIR NOVOS METADADOS
                ================================================= */

                for (
                    const registro
                    of registrosValidos
                ) {

                    await client.query(
                        `
                        INSERT INTO
                            climate_map_metadata
                        (
                            map_code,
                            variable_full,
                            variable_short,
                            period,
                            scenario,
                            uncertainty
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6
                        )
                        `,
                        [

                            registro.map_code,

                            registro.variable_full,

                            registro.variable_short,

                            registro.period,

                            registro.scenario,

                            registro.uncertainty

                        ]
                    );

                }


                /* =================================================
                   CONFIRMAR
                ================================================= */

                await client.query(
                    "COMMIT"
                );


                res.json({

                    sucesso: true,

                    mensagem:
                        "Metadados importados com sucesso.",

                    arquivo:
                        req.file.originalname,

                    registros:
                        registrosValidos.length

                });


            }
            catch (erroBanco) {

                await client.query(
                    "ROLLBACK"
                );

                throw erroBanco;

            }
            finally {

                client.release();

            }

        }
        catch (erro) {

            console.error(
                "Erro ao importar metadados:",
                erro
            );


            res.status(500).json({

                erro:
                    "Erro ao importar metadados.",

                detalhe:
                    erro.message

            });

        }

    }
);

app.get("/clima/map-metadata", async (req, res) => {

    try {

        const resultado = await db.query(`
            SELECT *
            FROM climate_map_metadata
            ORDER BY map_code
        `);

        res.json(resultado.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            erro: err.message
        });

    }

});


app.get("/clima/mapas-filtros", async (req, res) => {

    try {

        const resultado = await db.query(`
            SELECT
                m.map_code,
                m.variable_short,
                m.period,
                m.scenario,
                m.uncertainty,

                cm.id AS mapa_id,
                cm.indicador_id,
                cm.arquivo,
                cm.campo,
                cm.ordem,

                ci.codigo,
                ci.nome,
                ci.tipo

            FROM climate_map_metadata m

            INNER JOIN clima_mapas cm
                ON cm.campo = m.map_code

            INNER JOIN clima_indicadores ci
                ON ci.id = cm.indicador_id

            ORDER BY
                ci.tipo,
                m.period,
                m.scenario,
                m.uncertainty,
                cm.ordem

        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            "Erro ao carregar mapas para filtros:",
            erro
        );

        res.status(500).json({
            erro: "Erro ao carregar mapas para filtros.",
            detalhe: erro.message
        });

    }

});

/* =========================
   ANALISAR GEOJSON
========================= */


app.post(
  "/clima/mapas/analisar",
  async (req, res) => {

    try {

      const { arquivo } = req.body;

      if (!arquivo) {

        return res.status(400).json({
          erro: "Arquivo não informado."
        });

      }

      const caminhoArquivo = path.join(
        __dirname,
        "uploads",
        "mapas",
        arquivo
      );

      if (!fs.existsSync(caminhoArquivo)) {

        return res.status(404).json({
          erro: "Arquivo GeoJSON não encontrado."
        });

      }

      const conteudo =
        fs.readFileSync(
          caminhoArquivo,
          "utf8"
        );

      const geojson =
        JSON.parse(conteudo);

      if (
        !geojson.features ||
        !Array.isArray(
          geojson.features
        )
      ) {

        return res.status(400).json({
          erro: "GeoJSON inválido."
        });

      }

      /* =========================
         PROPERTIES
      ========================= */

      const propriedades =
        geojson.features[0]?.properties || {};

      const campos =
        Object.keys(propriedades);


      /* =========================
         CAMPOS QUE NÃO SÃO MAPAS
      ========================= */

      const camposIgnorar = [

        "OBJECTID",
        "adm1_name",
        "adm1_pcode",
        "adm0_name",
        "adm0_pcode",
        "valid_on",
        "area_sqkm",
        "cod_versio",
        "lang",
        "adm1_ref_n",
        "center_lat",
        "center_lon",
        "code"

      ];


      /* =========================
         CAMPOS DOS MAPAS
      ========================= */

      const camposMapas =
        campos.filter(
          campo =>
            !camposIgnorar.includes(
              campo
            )
        );


      res.json({

        sucesso: true,

        arquivo,

        quantidade_features:
          geojson.features.length,

        campos: camposMapas

      });

    }

    catch (erro) {

      console.error(erro);

      res.status(500).json({

        erro:
          erro.message

      });

    }

  }
);



/* =========================
   SALVAR MAPAS DO GEOJSON
========================= */

app.post(
    "/clima/mapas/campos",
    async (req, res) => {

        try {

            const {
                indicador_id,
                arquivo,
                campos
            } = req.body;


            /* =========================
               VALIDAR
            ========================= */

            if (
                !indicador_id ||
                !arquivo ||
                !Array.isArray(campos)
            ) {

                return res.status(400).json({

                    erro:
                        "Dados incompletos."

                });

            }


            /* =========================
               APAGAR MAPAS ANTIGOS
            ========================= */

            await db.query(
                `
                DELETE FROM clima_mapas
                WHERE indicador_id = $1
                `,
                [
                    indicador_id
                ]
            );


            /* =========================
               CRIAR UM MAPA POR CAMPO
            ========================= */

            for (
                let i = 0;
                i < campos.length;
                i++
            ) {

                await db.query(
                    `
                    INSERT INTO clima_mapas
                    (
                        indicador_id,
                        campo,
                        arquivo,
                        ordem
                    )
                    VALUES
                    ($1, $2, $3, $4)
                    `,
                    [

                        indicador_id,

                        campos[i].campo,

                        arquivo,

                        i + 1

                    ]
                );

            }


            /* =========================
               RESPOSTA
            ========================= */

            res.json({

                sucesso: true,

                quantidade:
                    campos.length,

                mensagem:
                    `${campos.length} mapas criados.`

            });

        }

        catch (erro) {

            console.error(erro);

            res.status(500).json({

                erro:
                    erro.message

            });

        }

    }
);

/* =========================
   BIBLIOTECA
========================= */

app.get("/biblioteca", async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT *
      FROM biblioteca
      WHERE ativo = true
      ORDER BY ordem, id
    `);

    res.json(resultado.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});


app.post(
    "/biblioteca",

    upload.single("arquivo"),

    async (req,res)=>{

          console.log("CONTENT-TYPE:", req.headers["content-type"]);
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
  try {
    const {
      titulo,
      tipo,
      data,
      link,
      pagina,
      ordem
    } = req.body;

    let arquivo = null;
      let nome_arquivo = null;

      if(req.file){

          arquivo = req.file.filename;

          nome_arquivo = req.file.originalname;

      }

    const resultado = await db.query(
      `
      INSERT INTO biblioteca
      (
        titulo,
        tipo,
        data,
        link,
        pagina,
        ordem,
        arquivo,
        nome_arquivo

      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        titulo,
        tipo,
        data,
        link || null,
        pagina || null,
        ordem || 0,
        arquivo,
        nome_arquivo
      ]
    );

    res.json({
      sucesso: true,
      registro: resultado.rows[0]
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});

/* =========================
   SUBMISSÕES CLIMÁTICAS
   ========================= */

const TIPOS_CARD_SUBMISSAO = [
  "Evento",
  "Workshop",
  "Treinamento",
  "Concurso",
  "Notícia",
  "Noticia",
  "Iniciativa Local",
  "Iniciativa Nacional",
  "Projeto Curto"
];

const TIPOS_BIBLIOTECA_SUBMISSAO = [
  "Projeto Longo",
  "Projeto climático",
  "Projeto Climático",
  "Projeto Climático (+6 meses)",
  "Publicação",
  "Relatório",
  "Relatorio",
  "Base de Dados",
  "Mapa",
  "Mapa Estático",
  "Mapa estatico"
];

function definirDestinosSubmissao(tipo) {
  const valor = String(tipo || "").trim();

  if (valor === "Outro" || valor.toLowerCase() === "outro") {
    return ["evento", "card", "biblioteca"];
  }

  if (TIPOS_CARD_SUBMISSAO.includes(valor)) {
    return ["evento", "card"];
  }

  if (TIPOS_BIBLIOTECA_SUBMISSAO.includes(valor)) {
    return ["biblioteca"];
  }

  return [];
}

/* =========================
   LISTAR SUBMISSÕES
   ========================= */

app.get("/submissoes", async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT *
      FROM submissoes_climaticas
      ORDER BY data_submissao DESC
    `);

    res.json(resultado.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});

/* =========================
   BUSCAR UMA SUBMISSÃO
   ========================= */

app.get("/submissoes/:id", async (req, res) => {
  try {
    const resultado = await db.query(
      `
      SELECT *
      FROM submissoes_climaticas
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Submissão não encontrada."
      });
    }

    const submissao = resultado.rows[0];

    const arquivos = await db.query(
      `
      SELECT *
      FROM submissao_arquivos
      WHERE submissao_id = $1
      ORDER BY id
      `,
      [req.params.id]
    );

    res.json({
      ...submissao,
      arquivos: arquivos.rows
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});

/* =========================
   CRIAR SUBMISSÃO

   Recebe:
   - campos gerais
   - arquivos gerais
   - imagens da página do Card

   Os arquivos são armazenados em:
   uploads/submissoes
   ========================= */

app.post(
  "/submissoes",
  uploadSubmissao.fields([
    {
      name: "arquivos",
      maxCount: 10
    },
    {
      name: "imagens_pagina",
      maxCount: 5
    }
  ]),
  async (req, res) => {
    const client = await db.connect();

    try {
      const arquivos = req.files?.arquivos || [];
      const imagensPagina = req.files?.imagens_pagina || [];

      const {
        email,
        tipo_proponente,
        nome_responsavel,
        entidade,
        cargo,
        website,
        tipo_submissao,
        pagina,
        pagina_card,
        idioma,
        titulo,
        titulo_curto,
        descricao,
        data_publicacao,
        data_retirada,
        data_inicio,
        hora_inicio,
        data_fim,
        hora_fim,
        evento_online,
        local1,
        local2,
        link,
        permissao_publicacao,
        motivo_publicacao,
        descricao_documento,
        tags,

        /* CARD */
        tipo_link,
        link_externo,
        titulo_pagina,
        texto_pagina,
        data_publicacao_pagina,
        imagem_card_index,

        /* BIBLIOTECA */
        biblioteca_link,

      } = req.body;

      if (!email || !tipo_proponente || !nome_responsavel || !tipo_submissao || !titulo || !descricao) {
        return res.status(400).json({
          erro: "Preencha os campos obrigatórios da submissão."
        });
      }

      const destinos = definirDestinosSubmissao(tipo_submissao);

      if (destinos.length === 0) {
        return res.status(400).json({
          erro: `Tipo de submissão não configurado: ${tipo_submissao}`
        });
      }

      const paginaCardFinal =
        pagina_card || pagina || "home";

      const tipoLinkFinal =
        tipo_link === "externo" ? "externo" : "interno";

      const linkExternoFinal =
        link_externo || null;

      const bibliotecaLinkFinal =
        biblioteca_link || null;

      const dataPaginaFinal =
        data_publicacao_pagina ||
        data_publicacao ||
        data_inicio ||
        null;

      const permissaoFinal =
        permissao_publicacao === true ||
        permissao_publicacao === "true";

      const eventoOnlineFinal =
        evento_online === true ||
        evento_online === "true";

      /* =====================================================
         VALIDAÇÕES ESPECÍFICAS DO CARD
         ===================================================== */

      const precisaCard = destinos.includes("card");

      if (precisaCard) {
        const paginasPermitidas = [
          "home",
          "adaptacao",
          "mitigacao",
          "engajamento"
        ];

        if (!paginasPermitidas.includes(paginaCardFinal)) {
          return res.status(400).json({
            erro: "Página do Card inválida."
          });
        }

        if (tipoLinkFinal === "externo" && !linkExternoFinal) {
          return res.status(400).json({
            erro: "Informe o link externo do Card."
          });
        }

        if (
          tipoLinkFinal === "interno" &&
          (!titulo_pagina || !texto_pagina)
        ) {
          return res.status(400).json({
            erro: "Para uma página interna, informe o título e o conteúdo da página."
          });
        }
      }

      /* =====================================================
         TRANSAÇÃO
         ===================================================== */

      await client.query("BEGIN");

      /* =====================================================
         SUBMISSÃO
         ===================================================== */

      const resultado = await client.query(
        `
        INSERT INTO submissoes_climaticas
        (
          email,
          tipo_proponente,
          nome_responsavel,
          entidade,
          cargo,
          website,
          tipo_submissao,
          pagina,
          idioma,
          titulo,
          titulo_curto,
          descricao,
          data_publicacao,
          data_retirada,
          data_inicio,
          hora_inicio,
          data_fim,
          hora_fim,
          evento_online,
          local1,
          local2,
          link,
          permissao_publicacao,
          motivo_publicacao,
          descricao_documento,
          tags,
          pagina_card,
          tipo_link,
          link_externo,
          titulo_pagina,
          texto_pagina,
          data_publicacao_pagina,
          imagem_card_index,
          biblioteca_link
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20,
          $21,
          $22,
          $23,
          $24,
          $25,
          $26,
          $27,
          $28,
          $29,
          $30,
          $31,
          $32,
          $33,
          $34
        )
        RETURNING *
        `,
        [
          email,
          tipo_proponente,
          nome_responsavel,
          entidade,
          cargo,
          website || null,
          tipo_submissao,
          paginaCardFinal,
          idioma || null,
          titulo,
          titulo_curto || null,
          descricao,
          data_publicacao || null,
          data_retirada || null,
          data_inicio || null,
          hora_inicio || null,
          data_fim || null,
          hora_fim || null,
          eventoOnlineFinal,
          local1 || null,
          local2 || null,
          link || null,
          permissaoFinal,
          motivo_publicacao || null,
          descricao_documento || null,
          tags || null,
          paginaCardFinal,
          tipoLinkFinal,
          linkExternoFinal,
          titulo_pagina || null,
          texto_pagina || null,
          dataPaginaFinal,
          imagem_card_index || null,
          bibliotecaLinkFinal
        ]
      );

      const submissaoId = resultado.rows[0].id;

      /* =====================================================
         ARQUIVOS GERAIS
         ===================================================== */

      for (const arquivo of arquivos) {
        await client.query(
          `
          INSERT INTO submissao_arquivos
          (
            submissao_id,
            nome_original,
            nome_arquivo,
            caminho,
            tipo_mime,
            tamanho
          )
          VALUES
          ($1,$2,$3,$4,$5,$6)
          `,
          [
            submissaoId,
            arquivo.originalname,
            arquivo.filename,
            arquivo.path,
            arquivo.mimetype,
            arquivo.size
          ]
        );
      }

      /* =====================================================
         IMAGENS DA PÁGINA DO CARD

         Elas também entram em submissao_arquivos.
         Na aprovação serão usadas para paginas_imagens.
         ===================================================== */

      for (const imagem of imagensPagina) {
        await client.query(
          `
          INSERT INTO submissao_arquivos
          (
            submissao_id,
            nome_original,
            nome_arquivo,
            caminho,
            tipo_mime,
            tamanho
          )
          VALUES
          ($1,$2,$3,$4,$5,$6)
          `,
          [
            submissaoId,
            imagem.originalname,
            imagem.filename,
            imagem.path,
            imagem.mimetype,
            imagem.size
          ]
        );
      }

      await client.query("COMMIT");

      res.json({
        sucesso: true,
        registro: resultado.rows[0],
        destinos,
        arquivos: arquivos.length,
        imagens_pagina: imagensPagina.length
      });
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Erro no ROLLBACK:", rollbackError);
      }

      console.log(err);

      res.status(500).json({
        erro: err.message
      });
    } finally {
      client.release();
    }
  }
);

/* =========================
   ALTERAR STATUS / OBSERVAÇÃO
   ========================= */

app.put("/submissoes/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const {
      status,
      observacao_admin
    } = req.body;

    await db.query(
      `
      UPDATE submissoes_climaticas
      SET
        status = $1,
        observacao_admin = $2
      WHERE id = $3
      `,
      [
        status,
        observacao_admin || null,
        id
      ]
    );

    res.json({
      sucesso: true
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});

/* =====================================================
   APROVAR SUBMISSÃO

   GRUPO 1
   Evento / Workshop / Treinamento / Concurso /
   Notícia / Iniciativa Local / Iniciativa Nacional /
   Projeto Curto

   -> EVENTO + CARD

   GRUPO 2
   Projeto Longo / Publicação / Relatório /
   Base de Dados / Mapa

   -> BIBLIOTECA

   OUTRO

   -> EVENTO + CARD + BIBLIOTECA

   NADA É PUBLICADO AUTOMATICAMENTE.
   ===================================================== */

app.post("/submissoes/:id/aprovar", async (req, res) => {
  const client = await db.connect();

  try {
    const id = req.params.id;

    const {
      usuario_aprovador
    } = req.body;

    const resultado = await client.query(
      `
      SELECT *
      FROM submissoes_climaticas
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Submissão não encontrada."
      });
    }

    const submissao = resultado.rows[0];

    const statusAtual =
      String(submissao.status || "")
        .trim()
        .toLowerCase();

    if (statusAtual === "aprovado") {
      return res.status(400).json({
        erro: "Esta submissão já foi aprovada."
      });
    }

    if (statusAtual === "rejeitado") {
      return res.status(400).json({
        erro: "Esta submissão está rejeitada."
      });
    }

    const tipoOriginal =
      String(submissao.tipo_submissao || "")
        .trim();

    const destinos =
      definirDestinosSubmissao(tipoOriginal);

    if (destinos.length === 0) {
      return res.status(400).json({
        erro:
          `Tipo de submissão não configurado: ${tipoOriginal}`
      });
    }

    await client.query("BEGIN");

    let eventoId = null;
    let cardId = null;
    let bibliotecaId = null;

    /* =====================================================
       ARQUIVOS
       ===================================================== */

    const arquivosResult = await client.query(
      `
      SELECT
        id,
        nome_original,
        nome_arquivo,
        caminho,
        tipo_mime,
        tamanho
      FROM submissao_arquivos
      WHERE submissao_id = $1
      ORDER BY id
      `,
      [id]
    );

    const arquivos = arquivosResult.rows || [];

    /* =====================================================
       IMAGEM ESCOLHIDA PARA O CARD

       O formulário guarda imagem_card_index como índice
       dentro do array de arquivos gerais.
       ===================================================== */

    let primeiraImagem = null;

    const indiceImagemCard =
      Number.isInteger(Number(submissao.imagem_card_index))
        ? Number(submissao.imagem_card_index)
        : -1;

    if (
      indiceImagemCard >= 0 &&
      indiceImagemCard < arquivos.length &&
      String(arquivos[indiceImagemCard].tipo_mime || "")
        .startsWith("image/")
    ) {
      primeiraImagem =
        arquivos[indiceImagemCard];
    }

    if (!primeiraImagem) {
      primeiraImagem = arquivos.find(
        arquivo =>
          String(arquivo.tipo_mime || "")
            .startsWith("image/")
      );
    }

    const primeiroDocumento =
      arquivos.find(
        arquivo =>
          !String(arquivo.tipo_mime || "")
            .startsWith("image/")
      ) || null;

    const caminhoImagem = primeiraImagem
      ? `submissoes/${primeiraImagem.nome_arquivo}`
      : null;

    const caminhoDocumento = primeiroDocumento
      ? `submissoes/${primeiroDocumento.nome_arquivo}`
      : null;

    const nomeDocumento = primeiroDocumento
      ? primeiroDocumento.nome_original
      : null;

    /* =====================================================
       CARD - DESTINO
       ===================================================== */

    if (destinos.includes("card")) {
      const paginaCard =
        submissao.pagina_card ||
        submissao.pagina ||
        "home";

      const paginasPermitidas = [
        "home",
        "adaptacao",
        "mitigacao",
        "engajamento"
      ];

      if (!paginasPermitidas.includes(paginaCard)) {
        throw new Error(
          "Página do Card inválida."
        );
      }

      const tipoLink =
        submissao.tipo_link === "externo"
          ? "externo"
          : "interno";

      const linkCard =
        tipoLink === "externo"
          ? submissao.link_externo
          : paginaCard;

      if (!linkCard) {
        throw new Error(
          "O Card não possui destino configurado."
        );
      }

      const ehPaginaInterna =
        tipoLink === "interno";

      const tituloCard =
        ehPaginaInterna && submissao.titulo_pagina
          ? submissao.titulo_pagina
          : submissao.titulo;

      const conteudoCard =
        ehPaginaInterna && submissao.texto_pagina
          ? submissao.texto_pagina
          : submissao.descricao;

      const card = await client.query(
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
          pagina_detalhe,
          ativo
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING id
        `,
        [
          paginaCard,
          tituloCard,
          conteudoCard,
          linkCard,
          tipoLink,
          0,
          caminhoImagem,
          ehPaginaInterna,
          false
        ]
      );

      cardId = card.rows[0].id;

      /* =================================================
         PÁGINA INTERNA
         ================================================= */

      if (ehPaginaInterna) {
        const pagina = await client.query(
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
          RETURNING id
          `,
          [
            cardId,
            submissao.titulo_pagina || submissao.titulo,
            submissao.texto_pagina || submissao.descricao,
            submissao.data_publicacao_pagina ||
              submissao.data_publicacao ||
              submissao.data_inicio ||
              null
          ]
        );

        const paginaId =
          pagina.rows[0].id;

        /* =============================================
           ATÉ 5 FOTOS
           ============================================= */

        const imagens = arquivos
          .filter(arquivo =>
            String(arquivo.tipo_mime || "")
              .startsWith("image/")
          )
          .slice(0, 5);

        for (let i = 0; i < imagens.length; i++) {
          await client.query(
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
              `submissoes/${imagens[i].nome_arquivo}`,
              i + 1
            ]
          );
        }
      }
    }

    /* =====================================================
       BIBLIOTECA
       ===================================================== */

    if (destinos.includes("biblioteca")) {
      const tipoBiblioteca =
        tipoOriginal === "Projeto Longo" ||
        tipoOriginal === "Projeto climático" ||
        tipoOriginal === "Projeto Climático" ||
        tipoOriginal === "Projeto Climático (+6 meses)"
          ? "Projeto climático"
          : tipoOriginal === "Mapa" ||
            tipoOriginal === "Mapa Estático" ||
            tipoOriginal === "Mapa estatico"
          ? "Mapa estático"
          : tipoOriginal === "Relatorio"
          ? "Relatório"
          : tipoOriginal;

      const biblioteca = await client.query(
        `
        INSERT INTO biblioteca
        (
          titulo,
          tipo,
          data,
          link,
          pagina,
          ordem,
          arquivo,
          nome_arquivo,
          ativo
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        RETURNING id
        `,
        [
          submissao.titulo,
          tipoBiblioteca,
          submissao.data_publicacao ||
            submissao.data_inicio ||
            null,
          submissao.biblioteca_link || null,
          null,
          0,
          caminhoDocumento,
          nomeDocumento,
          false
        ]
      );

      bibliotecaId =
        biblioteca.rows[0].id;
    }

    /* =====================================================
       EVENTO / CALENDÁRIO
       ===================================================== */

    if (destinos.includes("evento")) {
      const evento = await client.query(
        `
        INSERT INTO eventos
        (
          titulo,
          titulo_curto,
          descricao,
          tipo,
          data_inicio,
          hora_inicio,
          data_fim,
          hora_fim,
          evento_online,
          local1,
          local2,
          link,
          entidade,
          nome_responsavel,
          email_responsavel,
          ativo
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,
          $9,$10,$11,$12,$13,$14,$15,$16
        )
        RETURNING id
        `,
        [
          submissao.titulo,
          submissao.titulo_curto || null,
          submissao.descricao,
          tipoOriginal,
          submissao.data_inicio || submissao.data_publicacao || null,
          submissao.hora_inicio || null,
          submissao.data_fim || null,
          submissao.hora_fim || null,
          submissao.evento_online === true ||
            submissao.evento_online === "true",
          submissao.local1 || null,
          submissao.local2 || null,
          submissao.link || null,
          submissao.entidade || null,
          submissao.nome_responsavel || null,
          submissao.email || null,
          false
        ]
      );

      eventoId = evento.rows[0].id;
    }

    /* =====================================================
       MARCAR SUBMISSÃO COMO APROVADA

       Os campos publicado_cards / publicado_biblioteca
       significam que o destino foi criado.
       A publicação real continua dependendo do ativo=false.
       ===================================================== */

    await client.query(
      `
      UPDATE submissoes_climaticas
      SET
        status = $1,
        usuario_aprovador = $2,
        data_aprovacao = CURRENT_TIMESTAMP,
        publicado_cards = $3,
        publicado_biblioteca = $4
      WHERE id = $5
      `,
      [
        "aprovado",
        usuario_aprovador || "admin",
        false,
        false,
        id
      ]
    );

    await client.query("COMMIT");

    res.json({
      sucesso: true,
      mensagem: "Submissão aprovada com sucesso.",
      submissao_id: Number(id),
      evento_id: eventoId,
      card_id: cardId,
      biblioteca_id: bibliotecaId,
      destinos,
      publicado: false
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Erro no ROLLBACK:",
        rollbackError
      );
    }

    console.error(
      "Erro ao aprovar submissão:",
      err
    );

    res.status(500).json({
      erro:
        err.message ||
        "Erro ao aprovar submissão."
    });
  } finally {
    client.release();
  }
});

/* =========================
   EXCLUIR SUBMISSÃO
   ========================= */

app.delete("/submissoes/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM submissao_arquivos
      WHERE submissao_id = $1
      `,
      [req.params.id]
    );

    await db.query(
      `
      DELETE FROM submissoes_climaticas
      WHERE id = $1
      `,
      [req.params.id]
    );

    res.json({
      sucesso: true
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});


app.put(
    "/biblioteca/:id",

    upload.single("arquivo"),

    async (req, res) => {

        try {

            const id = req.params.id;

            const {
                titulo,
                tipo,
                data,
                link,
                pagina,
                ordem
            } = req.body;

            let arquivo = null;
            let nome_arquivo = null;

            if (req.file) {

                arquivo = req.file.filename;
                nome_arquivo = req.file.originalname;

            }

            await db.query(
                `
                UPDATE biblioteca
                SET
                    titulo = $1,
                    tipo = $2,
                    data = $3,
                    link = $4,
                    pagina = $5,
                    ordem = $6,
                    arquivo = COALESCE($7, arquivo),
                    nome_arquivo = COALESCE($8, nome_arquivo)
                WHERE id = $9
                `,
                [
                    titulo,
                    tipo,
                    data,
                    link || null,
                    pagina || null,
                    ordem || 0,
                    arquivo,
                    nome_arquivo,
                    id
                ]
            );

            res.json({
                sucesso: true
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                erro: err.message
            });

        }

    }
);


app.delete("/biblioteca/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM biblioteca
      WHERE id = $1
      `,
      [req.params.id]
    );

    res.json({
      sucesso: true
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: err.message
    });
  }
});

/* =========================
   LISTAR MAPAS DO INDICADOR
========================= */

app.get(
    "/clima/mapas/:indicador_id",
    async (req, res) => {

        try {

            const { indicador_id } =
                req.params;

            const resultado =
                await db.query(
                    `
                    SELECT
                        id,
                        indicador_id,
                        campo,
                        arquivo,
                        ordem
                    FROM clima_mapas
                    WHERE indicador_id = $1
                    ORDER BY ordem
                    `,
                    [
                        indicador_id
                    ]
                );

            res.json(
                resultado.rows
            );

        }

        catch (erro) {

            console.error(erro);

            res.status(500).json({

                erro:
                    erro.message

            });

        }

    }
);




/* =========================
   SERVIDOR
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor rodando porta ${PORT}`
  );

});