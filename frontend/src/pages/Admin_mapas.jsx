import { useEffect, useState } from "react";
import API_URL from "../config";
import "../App.css";


function Admin_mapas() {

    const [dados, setDados] = useState([]);

    const [arquivo, setArquivo] = useState(null);

    const [editando, setEditando] = useState(null);

    const [camposGeoJSON, setCamposGeoJSON] = useState([]);


    const [classificacoes, setClassificacoes] = useState([

    {
        classe:1,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    },

    {
        classe:2,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    },

    {
        classe:3,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    },

    {
        classe:4,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    },

    {
        classe:5,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    },

    {
        classe:6,
        minimo:"",
        maximo:"",
        cor:"#ffffff"
    }

]);

        const [form, setForm] = useState({

            codigo: "",

            nome: "",

            tipo: ""

        });

    /* ===========================
       LISTAR
    =========================== */

  
useEffect(() => {

    async function carregar() {

                try {

                    const response = await fetch(
                        `${API_URL}/clima/indicadores`
                    );

                    const resultado = await response.json();

                    setDados(resultado);

                } catch (erro) {

                    console.error(erro);

                }

            }

            carregar();

        }, []);

    /* ===========================
       ALTERAR CAMPOS
    =========================== */

                function alterarCampo(e) {

                    const { name, value, type, checked } = e.target;

                    setForm({

                        ...form,

                        [name]:
                            type === "checkbox"
                                ? checked
                                : value

                    });

                }


                function alterarClassificacao(
                index,
                campo,
                valor
            ){

                const lista=[...classificacoes];

                lista[index][campo]=valor;

                setClassificacoes(lista);

            }

    /* ===========================
       SALVAR
    =========================== */

  async function salvar(e) {

    e.preventDefault();

    try {

        /* =========================
           1. SALVAR INDICADOR
        ========================= */

        const url = editando
            ? `${API_URL}/clima/indicadores/${editando}`
            : `${API_URL}/clima/indicadores`;

        const metodo = editando
            ? "PUT"
            : "POST";


        const formData = new FormData();

        formData.append(
            "codigo",
            form.codigo
        );

        formData.append(
            "nome",
            form.nome
        );

        formData.append(
            "tipo",
            form.tipo
        );


        if (arquivo) {

            formData.append(
                "arquivo",
                arquivo
            );

        }


        const response = await fetch(
            url,
            {
                method: metodo,
                body: formData
            }
        );


        const resultado =
            await response.json();

            if (!response.ok) {

                alert(
                    resultado.erro ||
                    "Erro ao salvar indicador."
                );

                return;
            }

           
        


        /* =========================
           2. SALVAR CLASSIFICAÇÕES
        ========================= */

        const responseClassificacoes =
            await fetch(
                `${API_URL}/clima/classificacoes/lote`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        codigo: form.codigo,

                        classificacoes:
                            classificacoes

                    })

                }
            );


        const resultadoClassificacoes =
            await responseClassificacoes.json();


            /* =========================
            3. SALVAR CAMPOS GEOJSON
            ========================= */

            if (camposGeoJSON.length > 0) {


                const responseMapas =
                    await fetch(
                        `${API_URL}/clima/mapas/campos`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                indicador_id:
                                    resultado.id,

                                arquivo:
                                    resultado.arquivo,

                                campos:
                                    camposGeoJSON

                            })

                        }
                    );


                const resultadoMapas =
                    await responseMapas.json();


                if (!responseMapas.ok) {

                    alert(
                        resultadoMapas.erro ||
                        "Erro ao salvar campos do mapa."
                    );

                    return;

                }

            }


        /* =========================
           VERIFICAR CLASSIFICAÇÕES
        ========================= */

        if (!responseClassificacoes.ok) {

            alert(
                resultadoClassificacoes.erro ||
                "Indicador salvo, mas houve erro ao salvar as classificações."
            );

            return;

        }


        /* =========================
           SUCESSO
        ========================= */

        alert(

            editando
                ? "Indicador e classificações atualizados!"
                : "Indicador e classificações cadastrados!"

        );


        limparFormulario();

        window.location.reload();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Erro ao salvar."
        );

    }

}

    /* ===========================
       EDITAR
    =========================== */

    function editar(item) {

        setEditando(item.id);

        setForm({

            codigo: item.codigo,

            nome: item.nome,

        

            tipo: item.tipo,

           

        });
        setArquivo(null);

        buscarClassificacoes(item.codigo);

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    async function buscarClassificacoes(codigo) {

    try {

        const response = await fetch(
            `${API_URL}/clima/classificacoes/${codigo}`
        );

        const resultado = await response.json();

        setClassificacoes(resultado);

    }

    catch (erro) {

        console.log(erro);

    }

}

    /* ===========================
       EXCLUIR
    =========================== */

    async function excluir(id) {

        if (

            !window.confirm(

                "Excluir indicador?"

            )

        )

            return;

        try {

            await fetch(

                `${API_URL}/clima/indicadores/${id}`,

                {

                    method: "DELETE"

                }

            );

            window.location.reload();
        }

        catch (erro) {

            console.log(erro);

        }

    }






    /* ===========================
       LIMPAR
    =========================== */

    function limparFormulario() {

        setEditando(null);

        setArquivo(null);

        setCamposGeoJSON([]);

        setForm({

            codigo: "",

            nome: "",

        

            tipo: "",

      

        });

    }


    return (

        <div className="admin-card">

            <h1>Mapas Climáticos</h1>

            <p>

                Cadastro dos indicadores climáticos.

            </p>

            <form onSubmit={salvar}>




                <div className="form-grid">

                    <div className="campo">

                        <label>Código</label>

                        <input
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={alterarCampo}
                            placeholder="Ex.: HD30"
                            required
                        />

                    </div>

                    <div className="campo">

                        <label>Nome</label>

                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={alterarCampo}
                            placeholder="Nome do indicador"
                            required
                        />

                    </div>

                   

                    <div className="campo">

                        <label>Tipo</label>

                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={alterarCampo}
                        >

                            <option value="">Selecione</option>
                            <option value="Temperatura">Temperatura</option>
                            <option value="Precipitação">Precipitação</option>
                          

                        </select>

                    </div>

                    <div className="campo">

                        <label>Arquivo GeoJSON</label>

                                            <input
                            type="file"
                            accept=".geojson,.json"
                            required={!editando}
                            onChange={async (e) => {

                                const arquivoSelecionado =
                                    e.target.files[0];

                                if (!arquivoSelecionado) {
                                    return;
                                }

                                setArquivo(
                                    arquivoSelecionado
                                );

                                try {

                                    const texto =
                                        await arquivoSelecionado.text();

                                    const geojson =
                                        JSON.parse(texto);


                                    /* =========================
                                    PEGAR PROPERTIES
                                    ========================= */

                                    const propriedades =
                                        geojson
                                            .features?.[0]
                                            ?.properties || {};


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

                                    const campos =
                                        Object.keys(propriedades)
                                            .filter(
                                                campo =>
                                                    !camposIgnorar.includes(
                                                        campo
                                                    )
                                            )
                                            .map(campo => ({
                                                campo: campo
                                            }));


                                    setCamposGeoJSON(
                                        campos
                                    );

                                }

                                catch (erro) {

                                    console.error(erro);

                                    alert(
                                        "Não foi possível ler o GeoJSON."
                                    );

                                    setCamposGeoJSON([]);

                                }

                            }}
                        />

                    </div>

                    

                    </div>

                     <div className="admin-card">

                <h2>

                Classificações de Cores

                </h2>

                <table className="tabela-biblioteca">

                <thead>

                <tr>

                <th>Classe</th>

                <th>Mínimo</th>

                <th>Máximo</th>

                <th>Cor</th>

                </tr>

                </thead>

                <tbody>

                {classificacoes.map((item,index)=>(

                <tr key={item.id}>

                <td>{item.classe}</td>

                <td>

                <input
                    type="number"
                    step="0.01"
                    value={item.minimo}
                    onChange={(e) =>
                        alterarClassificacao(
                            index,
                            "minimo",
                            e.target.value
                        )
                    }
                />

                </td>

                <td>

               <input
                    type="number"
                    step="0.01"
                    value={item.maximo}
                    onChange={(e) =>
                        alterarClassificacao(
                            index,
                            "maximo",
                            e.target.value
                        )
                    }
                />

                </td>

                <td>

               <td>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="#ffd0f9"
                            value={item.cor}
                            onChange={(e)=>
                                alterarClassificacao(
                                    index,
                                    "cor",
                                    e.target.value
                                )
                            }
                            style={{
                                width: "110px"
                            }}
                        />

                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                background: item.cor || "#ffffff",
                                border: "1px solid #999",
                                borderRadius: "4px"
                            }}
                        />

                    </div>

                </td>

                </td>

                </tr>

                ))}

                </tbody>

                </table>

                </div>
                
                <div className="form-grid">

                    <div
                        className="campo campo-2"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px"
                        }}
                    >

                        <button type="submit">

                            {editando
                                ? "Salvar Alterações"
                                : "Cadastrar Indicador"}

                        </button>

                        {editando && (

                            <button
                                type="button"
                                onClick={limparFormulario}
                            >

                                Cancelar

                            </button>

                        )}

                    </div>

                </div>

            </form>


                {camposGeoJSON.length > 0 && (

                    <div
                        className="admin-card"
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <h2>
                            Mapas encontrados no GeoJSON
                        </h2>

                        <p>
                            {camposGeoJSON.length} mapas
                            serão criados automaticamente.
                        </p>

                        <table className="tabela-biblioteca">

                            <thead>

                                <tr>

                                    <th>
                                        Ordem
                                    </th>

                                    <th>
                                        Campo GeoJSON
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {camposGeoJSON.map(
                                    (item, index) => (

                                        <tr
                                            key={item.campo}
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.campo}
                                                </strong>
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            <hr />

            <h2>

                Indicadores cadastrados

            </h2>

        

           

                

            <table className="tabela-biblioteca">

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Código</th>

                        <th>Nome</th>

                        <th>Tipo</th>

                        <th>Arquivo</th>

                        <th>Ativo</th>

                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {dados.map((item, index) => (

                        <tr key={item.id}>

                            <td>{index + 1}</td>

                            <td>{item.codigo}</td>

                            <td>{item.nome}</td>

                            <td>{item.tipo}</td>

                            <td>{item.arquivo || "-"}</td>

                            <td>

                                {item.ativo ? "✅" : "❌"}

                            </td>

                            <td>

                                <div className="acoes-card">

                                    <button
                                        className="btn-editar"
                                        type="button"
                                        onClick={() => editar(item)}
                                    >

                                        ✏️ Editar

                                    </button>

                                    <button
                                        className="btn-excluir"
                                        type="button"
                                        onClick={() => excluir(item.id)}
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
export default Admin_mapas;