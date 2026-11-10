import { useEffect, useState } from "react";
import API_URL from "../config";

export default function Admin_mensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/contato`)
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar as mensagens.");
        return res.json();
      })
      .then((dados) => setMensagens(Array.isArray(dados) ? dados : []))
      .catch((err) => setErro(err.message));
  }, []);

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2>Mensagens de contato</h2>
      </div>
      {erro ? <p className="ui-error">{erro}</p> : null}
      {mensagens.length === 0 && !erro ? <p>Ainda não há mensagens.</p> : null}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Assunto</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody>
          {mensagens.map((item) => (
            <tr key={item.id}>
              <td>{item.criado_em ? new Date(item.criado_em).toLocaleString("pt-BR") : ""}</td>
              <td>{item.nome}</td>
              <td>{item.email}</td>
              <td>{item.assunto}</td>
              <td>{item.mensagem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
