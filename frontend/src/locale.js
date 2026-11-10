export const LOCALE = "pt-PT";

export function formatarData(valor) {
  if (!valor) return "";
  const texto = String(valor).slice(0, 10);
  const data = new Date(`${texto}T00:00:00`);
  if (Number.isNaN(data.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "long" }).format(data);
}

export function formatarTamanho(bytes) {
  const numero = Number(bytes);
  if (!Number.isFinite(numero) || numero <= 0) return "";
  if (numero < 1024) return `${Math.round(numero)} B`;
  if (numero < 1024 * 1024) return `${Math.max(1, Math.round(numero / 1024))} KB`;
  const mb = numero / (1024 * 1024);
  const texto = mb >= 10
    ? String(Math.round(mb))
    : mb.toFixed(1).replace(".", ",");
  return `${texto} MB`;
}

export function formatarNumero(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "";
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 }).format(numero);
}
