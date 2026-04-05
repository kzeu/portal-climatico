import "../App.css";

function Form_submissao_climatica() {
  return (
    <div className="content" id="content">
      <div className="form-container">

        <h1>Submissão Climática</h1>

        {/* ================= IDENTIFICAÇÃO ================= */}
        <div className="form-box">
          <h2>Identificação</h2>

          <label>Organismo *</label>
          <select>
            <option>-- Selecione --</option>
            <option>Instituição</option>
            <option>Organização</option>
          
          </select>

           <label>Data *</label>
          <input type="Data" value={Date.now} />

          <label>E-mail *</label>
          <input type="email" placeholder="Digite seu email" />

          <label>Nome da Entidade *</label>
          <input type="entidade" placeholder="Digite o nome da entidade" />

          <label>Nome completo responsável *</label>
          <input type="text" placeholder="Digite seu nome completo" />

          <label>Papel na instituição</label>
          <input type="text" placeholder="Informe seu papel" />

          <label>Website</label>
          <input type="text" placeholder="Ex: www.seusite.gw" />
        </div>

        {/* ================= INFORMAÇÃO ================= */}
        <div className="form-box">
          <h2>Informação sobre Submissão</h2>

          <label>Tipo de submissão *</label>
          <select>
            <option>-- Selecione --</option>
            <option>Evento</option>
            <option>Workshop</option>
            <option>Treinamento</option>
            <option>Concurso</option>
            <option>Noticia</option>
            <option>Iniciativa local</option>
            <option>Iniciativa nacional</option>
            <option>Projeto Curto</option>
            <option>Projeto climático de mais de 6 meses</option>
            <option>Publicação</option>
            <option>Relatorio</option>
            <option>Base de dados</option>
            <option>Mapa estático</option>
            <option>Outro</option>
          </select>

          <div className="row">
            <div>
              <label>Título *</label>
              <input type="text" placeholder="Digite o título" />
            </div>

            <div>
              <label>Descrição</label>
              <textarea placeholder="Descreva o conteúdo"></textarea>
            </div>
          </div>
        </div>

        {/* ================= TAGS ================= */}
        <div className="form-box">
          <h2>Tags</h2>

          <div className="tags">
            <label><input type="checkbox" /> Adaptação</label>
            <label><input type="checkbox" /> Mitigação</label>
            <label><input type="checkbox" /> Agricultura</label>
            <label><input type="checkbox" /> Água</label>
            <label><input type="checkbox" /> Energia</label>
            <label><input type="checkbox" /> Biodiversidade</label>
          </div>
        </div>

        {/* ================= UPLOAD ================= */}
        <div className="form-box">
          <h2>Upload de documentos</h2>

          <input type="file" />
        </div>

        {/* ================= BOTÃO ================= */}
        <button className="btn-enviar">
          Enviar submissão
        </button>

      </div>
    </div>
  );
}

export default Form_submissao_climatica;