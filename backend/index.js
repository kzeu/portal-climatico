const express = require("express");
const cors = require("cors");
const multer = require("multer");
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

            if (!req.file) {

                return res.status(400).json({
                    erro: "Nenhum arquivo Excel foi enviado."
                });

            }

            console.log(
                "Excel recebido:",
                req.file.originalname
            );

            // ==========================================
            // LER EXCEL
            // ==========================================

            const workbook = XLSX.read(
                req.file.buffer,
                {
                    type: "buffer"
                }
            );

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

            // ==========================================
            // VERIFICAR COLUNAS
            // ==========================================

            const primeiraLinha =
                linhas[0];

            const colunasObrigatorias = [
                "map_code",
                "variable_full",
                "variable_short",
                "period",
                "scenario",
                "uncertainty"
            ];

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

            // ==========================================
            // TRANSAÇÃO
            // ==========================================

         const client =
           await db.connect();

            try {

                await client.query("BEGIN");

                // Limpa os metadados atuais
                // para importar a nova versão completa

                await client.query(
                    `
                    DELETE FROM climate_map_metadata
                    `
                );

                // ==========================================
                // INSERIR LINHAS
                // ==========================================

                let quantidadeInserida = 0;

                for (const linha of linhas) {

                    const mapCode =
                        String(
                            linha.map_code || ""
                        ).trim();

                    if (!mapCode) {
                        continue;
                    }

                    await client.query(
                        `
                        INSERT INTO climate_map_metadata
                        (
                            map_code,
                            variable_full,
                            variable_short,
                            period,
                            scenario,
                            uncertainty
                        )
                        VALUES
                        ($1, $2, $3, $4, $5, $6)
                        `,
                        [
                            mapCode,

                            String(
                                linha.variable_full || ""
                            ).trim(),

                            String(
                                linha.variable_short || ""
                            ).trim(),

                            String(
                                linha.period || ""
                            ).trim(),

                            String(
                                linha.scenario || ""
                            ).trim(),

                            String(
                                linha.uncertainty || ""
                            ).trim()
                        ]
                    );

                    quantidadeInserida++;

                }

                await client.query("COMMIT");

                res.json({

                    sucesso: true,

                    mensagem:
                        "Metadados importados com sucesso.",

                    registros:
                        quantidadeInserida

                });

            } catch (erroBanco) {

                await client.query("ROLLBACK");

                throw erroBanco;

            } finally {

                client.release();

            }

        } catch (erro) {

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

app.get("/submissoes", async (req, res) => {

  try {

    const resultado = await db.query(`
      SELECT *
      FROM submissoes_climaticas
      ORDER BY data_submissao DESC
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

app.get("/submissoes/:id", async (req, res) => {

  try {

    const resultado = await db.query(
      `
      SELECT *
      FROM submissoes_climaticas
      WHERE id=$1
      `,
      [req.params.id]
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


app.post("/submissoes", async (req, res) => {

  try {

    const {

      email,
      tipo_proponente,
      nome_responsavel,
      entidade,
      cargo,
      website,
      tipo_submissao,
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
      tags

    } = req.body;

    // Campos opcionais
    const websiteFinal = website || null;
    const dataPublicacao = data_publicacao || null;
    const dataRetirada = data_retirada || null;
    const dataInicio = data_inicio || null;
    const horaInicio = hora_inicio || null;
    const dataFim = data_fim || null;
    const horaFim = hora_fim || null;
    const local1Final = local1 || null;
    const local2Final = local2 || null;
    const linkFinal = link || null;
    const motivoPublicacao = motivo_publicacao || null;
    const descricaoDocumento = descricao_documento || null;
    const tagsFinal = tags || null;

    const resultado = await db.query(

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
        tags
      )

      VALUES
      (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25
      )

      RETURNING *
      `,

      [
        email,
        tipo_proponente,
        nome_responsavel,
        entidade,
        cargo,
        websiteFinal,
        tipo_submissao,
        idioma,
        titulo,
        titulo_curto,
        descricao,
        dataPublicacao,
        dataRetirada,
        dataInicio,
        horaInicio,
        dataFim,
        horaFim,
        evento_online,
        local1Final,
        local2Final,
        linkFinal,
        permissao_publicacao,
        motivoPublicacao,
        descricaoDocumento,
        tagsFinal
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

app.put("/submissoes/:id", async (req,res)=>{

   try{

      const id=req.params.id;

      const {

         status,
         observacao_admin

      }=req.body;

      await db.query(

      `

      UPDATE submissoes_climaticas

      SET

      status=$1,

      observacao_admin=$2

      WHERE id=$3

      `,

      [

         status,

         observacao_admin,

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


app.delete("/submissoes/:id", async (req,res)=>{

   try{

      await db.query(

      `
      DELETE FROM submissoes_climaticas
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