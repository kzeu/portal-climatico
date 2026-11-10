// `kicker` mantém-se por compatibilidade e passa a ser lido como descrição curta.
export default function SectionTitle({ kicker, description, title, as = "h2", id }) {
  const Heading = as;
  const texto = description || kicker;
  return (
    <div className="home-section-title">
      <Heading id={id}>{title}</Heading>
      {texto ? <p className="home-section-desc">{texto}</p> : null}
    </div>
  );
}
