export default function PageShell({ children, className = "", wide = false }) {
  return (
    <main
      className={`content page-shell ${wide ? "page-shell-wide" : ""} ${className}`.trim()}
      id="conteudo"
      tabIndex={-1}
    >
      {children}
    </main>
  );
}
