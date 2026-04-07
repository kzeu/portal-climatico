function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ESQUERDA - BRASÃO */}
        <div className="footer-left">
          <img src="/brasao.svg.png" alt="Brasão Guiné-Bissau" />
        </div>

        {/* COLUNAS */}
        <div className="footer-columns">

          {/* SOBRE */}
          <div className="footer-col">
            <h4>Sobre o Portal</h4>
            <p>Portal Climático da Guiné-Bissau</p>
            <p>Política de Privacidade</p>
          </div>

          {/* REDES */}
          <div className="footer-col">
            <h4>Redes Sociais</h4>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>LinkedIn</p>
          </div>

          {/* CONTATO */}
          <div className="footer-col">
            <h4>Contato</h4>
            <p>Email: info@clima.gb</p>
            <p>Tel: +245 XXX XXX</p>
          </div>

        </div>

      </div>

      {/* BASE */}
      <div className="footer-bottom">
        © Instituto Nacional do Ambiente - Guiné-Bissau, 2026.
        Todos os direitos reservados.
      </div>

    </footer>
  );
}

export default Footer;