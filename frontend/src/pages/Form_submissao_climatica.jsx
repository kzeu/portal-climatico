import "../App.css";

function Form_submissao_climatica() {
  return (
    <div className="content" id="content">

      <div className="form-container">

        <h1>Formulário Submissao</h1>

        <p className="form-subtitle">
          Envie suas dúvidas ou sugestões através do formulário abaixo.
        </p>

        <form className="form">

          <label>Nome completo *</label>
          <input type="text" placeholder="Digite seu nome completo" />

          <label>E-mail *</label>
          <input type="email" placeholder="Digite seu e-mail" />

          <label>Assunto *</label>
          <input type="text" placeholder="Digite o assunto" />

          <label>Mensagem *</label>
          <textarea placeholder="Digite sua mensagem..." rows="5"></textarea>

          <button type="submit" className="btn-enviar">
            Enviar mensagem
          </button>

        </form>

      </div>

    </div>
  );
}

export default Form_submissao_climatica;