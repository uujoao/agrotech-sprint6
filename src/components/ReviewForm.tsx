import { useState } from "react";
import { StarRating } from "./StarRating";
import { SERVICOS, type Review } from "./reviews";
import { useToast } from "./ToastProvider";

type Erros = { autor?: string; nota?: string; comentario?: string };

const MAX = 400;

export function ReviewForm({ onSubmit }: { onSubmit: (review: Review) => void }) {
  const [autor, setAutor] = useState("");
  const [servico, setServico] = useState<string>(SERVICOS[0]);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const { showToast } = useToast();

  function validar(): Erros {
    const e: Erros = {};
    if (autor.trim().length < 2) e.autor = "Informe seu nome (mínimo 2 caracteres).";
    if (nota < 1) e.nota = "Escolha uma nota de 1 a 5 estrelas.";
    if (comentario.trim() === "") e.comentario = "Escreva um comentário sobre o serviço.";
    else if (comentario.length > MAX)
      e.comentario = `O comentário deve ter no máximo ${MAX} caracteres.`;
    return e;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) {
      showToast("⚠️", "Verifique os campos", "Corrija os campos destacados antes de enviar.");
      return;
    }

    onSubmit({
      id: `${Date.now()}`,
      autor: autor.trim(),
      servico,
      nota,
      comentario: comentario.trim(),
      data: new Date().toISOString(),
    });

    setAutor("");
    setNota(0);
    setComentario("");
    setServico(SERVICOS[0]);
    setErros({});
    showToast("⭐", "Avaliação registrada!", `Obrigado pelo feedback — ${nota} de 5 estrelas.`);
  }

  const counterClass =
    comentario.length > MAX ? "limit-over" : comentario.length > MAX - 50 ? "limit-near" : "";

  return (
    <form className="sim-panel" onSubmit={handleSubmit} noValidate>
      <h2>
        Avalie seu <span className="accent">Serviço</span>
      </h2>

      <label>Sua nota *</label>
      <StarRating value={nota} onChange={setNota} showHint />
      {erros.nota && (
        <span className="error-msg" style={{ marginTop: 0 }}>
          {erros.nota}
        </span>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Nome / Estabelecimento *</label>
          <input
            type="text"
            className={`sim-input${erros.autor ? " input-error" : ""}`}
            value={autor}
            maxLength={60}
            placeholder="Ana Martins ou Bistrô Verde"
            onChange={(e) => setAutor(e.target.value)}
          />
          <span className="error-msg">{erros.autor ?? ""}</span>
        </div>
        <div className="form-group">
          <label>Serviço utilizado</label>
          <select
            className="sim-select"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
          >
            {SERVICOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Comentário *</label>
        <textarea
          className={`sim-input${erros.comentario ? " input-error" : ""}`}
          value={comentario}
          maxLength={MAX}
          placeholder="Conte como foi sua experiência com o serviço..."
          onChange={(e) => setComentario(e.target.value)}
        />
        <div className="msg-footer">
          <span className="error-msg">{erros.comentario ?? ""}</span>
          <span className={`char-counter ${counterClass}`}>
            {comentario.length}/{MAX}
          </span>
        </div>
      </div>

      <button type="submit" className="sim-btn">
        ⭐ Enviar Avaliação
      </button>
    </form>
  );
}
