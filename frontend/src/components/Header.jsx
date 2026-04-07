function Header({ setPage }) {
  return (
    <div className="header-new">

      {/* LOGO */}
      <div className="logo-area" onClick={() => setPage("home")}>
        <img src="/logo2.png" alt="logo" />
      </div>

      {/* MENU */}
      <div className="menu-new">
        <span onClick={() => setPage("home")}>início</span>
        <span onClick={() => setPage("adaptacao")}>adaptação</span>
        <span onClick={() => setPage("mitigacao")}>mitigação</span>
        <span onClick={() => setPage("engajamento")}>stakeholders</span>
        <span onClick={() => setPage("biblioteca")}>recursos</span>
        <span onClick={() => setPage("contato")}>contactos</span>
      </div>

      {/* BOTÃO ENTRAR */}
      <button className="btn-login">
        🔒 entrar
      </button>

    </div>
  );
}

export default Header;