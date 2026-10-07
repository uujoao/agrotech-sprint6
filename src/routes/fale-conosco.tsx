import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useToast } from "../components/ToastProvider";
import {
  formatTelefoneBR,
  MAX_MESSAGE_LENGTH,
  validarEmail,
  validarMensagem,
  validarNome,
  validarTelefone,
  type FieldErrors,
} from "../lib/form-validation";

export const Route = createFileRoute("/fale-conosco")({
  head: () => ({
    meta: [
      { title: "Fale Conosco | AgroConecta" },
      {
        name: "description",
        content:
          "Dúvidas, sugestões, parcerias ou suporte: envie sua mensagem para o time da AgroConecta.",
      },
      { property: "og:title", content: "Fale Conosco | AgroConecta" },
      {
        property: "og:description",
        content: "Envie dúvidas, sugestões ou propostas de parceria para a AgroConecta.",
      },
    ],
  }),
  component: FaleConosco,
});

type CamposFale = "nome" | "email" | "tel" | "msg";

function FaleConosco() {
  const { showToast } = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [assunto, setAssunto] = useState("duvida");
  const [msg, setMsg] = useState("");
  const [tocado, setTocado] = useState<Record<CamposFale, boolean>>({
    nome: false,
    email: false,
    tel: false,
    msg: false,
  });
  const [enviado, setEnviado] = useState(false);

  const erros: FieldErrors<CamposFale> = {
    nome: validarNome(nome),
    email: validarEmail(email),
    tel: validarTelefone(tel),
    msg: validarMensagem(msg),
  };

  function tocar(campo: CamposFale) {
    setTocado((atual) => ({ ...atual, [campo]: true }));
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTocado({ nome: true, email: true, tel: true, msg: true });

    const primeiroErro = Object.values(erros).find(Boolean);
    if (primeiroErro) {
      showToast("⚠️", "Verifique os campos", "Corrija os campos destacados antes de enviar.");
      return;
    }

    setEnviado(true);
    showToast("📨", "Mensagem enviada!", `Obrigado, ${nome.trim()}! Responderemos em breve.`);
  }

  return (
    <div className="contact-wrap">
      <div className="section-tag">Dúvidas, Sugestões ou Parcerias</div>
      <h2>
        Fale <span>Conosco</span>
      </h2>
      <p>Preencha o formulário abaixo e nossa equipe responderá o mais breve possível.</p>

      <form noValidate onSubmit={enviar}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fale-nome">Nome Completo *</label>
            <input
              id="fale-nome"
              type="text"
              className={`sim-input${tocado.nome && erros.nome ? " input-error" : ""}`}
              value={nome}
              placeholder="João da Silva"
              autoComplete="name"
              aria-invalid={Boolean(tocado.nome && erros.nome)}
              aria-describedby="fale-nome-error"
              onChange={(e) => {
                setNome(e.target.value);
                setEnviado(false);
              }}
              onBlur={() => tocar("nome")}
            />
            <span id="fale-nome-error" className="error-msg" role="alert">
              {tocado.nome ? (erros.nome ?? "") : ""}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="fale-email">E-mail *</label>
            <input
              id="fale-email"
              type="email"
              className={`sim-input${tocado.email && erros.email ? " input-error" : ""}`}
              value={email}
              placeholder="joao@exemplo.com"
              autoComplete="email"
              aria-invalid={Boolean(tocado.email && erros.email)}
              aria-describedby="fale-email-error"
              onChange={(e) => {
                setEmail(e.target.value);
                setEnviado(false);
              }}
              onBlur={() => tocar("email")}
            />
            <span id="fale-email-error" className="error-msg" role="alert">
              {tocado.email ? (erros.email ?? "") : ""}
            </span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fale-tel">Telefone / WhatsApp *</label>
            <input
              id="fale-tel"
              type="tel"
              className={`sim-input${tocado.tel && erros.tel ? " input-error" : ""}`}
              value={tel}
              placeholder="(11) 99999-9999"
              inputMode="numeric"
              maxLength={15}
              autoComplete="tel"
              aria-invalid={Boolean(tocado.tel && erros.tel)}
              aria-describedby="fale-tel-error"
              onChange={(e) => {
                setTel(formatTelefoneBR(e.target.value));
                setEnviado(false);
              }}
              onBlur={() => tocar("tel")}
            />
            <span id="fale-tel-error" className="error-msg" role="alert">
              {tocado.tel ? (erros.tel ?? "") : ""}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="fale-assunto">Assunto *</label>
            <select
              id="fale-assunto"
              className="sim-select"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            >
              <option value="duvida">Dúvida</option>
              <option value="sugestao">Sugestão</option>
              <option value="parceria">Parceria</option>
              <option value="suporte">Suporte</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fale-msg">Descrição da Mensagem *</label>
          <textarea
            id="fale-msg"
            className={`sim-input${tocado.msg && erros.msg ? " input-error" : ""}`}
            maxLength={MAX_MESSAGE_LENGTH}
            value={msg}
            placeholder="Escreva aqui sua mensagem..."
            aria-invalid={Boolean(tocado.msg && erros.msg)}
            aria-describedby="fale-msg-error"
            onChange={(e) => {
              setMsg(e.target.value);
              setEnviado(false);
            }}
            onBlur={() => tocar("msg")}
          />
          <div className="msg-footer">
            <span id="fale-msg-error" className="error-msg" role="alert">
              {tocado.msg ? (erros.msg ?? "") : ""}
            </span>
            <span className="char-counter">
              {msg.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        <button type="submit" className="sim-btn">
          📨 Enviar Mensagem
        </button>
      </form>

      {enviado && (
        <div className="form-success" role="status">
          <div className="form-success-icon">✅</div>
          <strong>Mensagem enviada!</strong>
          <span>
            Recebemos sua mensagem e responderemos em breve. Obrigado por falar com a AgroConecta!
          </span>
        </div>
      )}
    </div>
  );
}
