import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewList } from "../components/ReviewList";
import { StarRating } from "../components/StarRating";
import {
  AVALIACOES_INICIAIS,
  REVIEWS_STORAGE_KEY,
  SERVICOS,
  distribuicaoNotas,
  mediaAvaliacoes,
  type Review,
} from "../components/reviews";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Route = createFileRoute("/avaliacoes")({
  head: () => ({
    meta: [
      { title: "Avaliações dos Serviços | AgroConecta" },
      {
        name: "description",
        content:
          "Dê uma nota de 1 a 5 estrelas, deixe um comentário e veja a média de satisfação dos serviços da AgroConecta.",
      },
      { property: "og:title", content: "Avaliações dos Serviços | AgroConecta" },
      {
        property: "og:description",
        content: "Avalie com estrelas e comente sua experiência com os serviços da AgroConecta.",
      },
    ],
  }),
  component: Avaliacoes,
});

function Avaliacoes() {
  const { value: reviews, setValue: setReviews } = useLocalStorage<Review[]>(
    REVIEWS_STORAGE_KEY,
    AVALIACOES_INICIAIS,
  );
  const [filtroServico, setFiltroServico] = useState("todos");
  const [filtroNota, setFiltroNota] = useState(0);

  const media = mediaAvaliacoes(reviews);
  const distribuicao = useMemo(() => distribuicaoNotas(reviews), [reviews]);

  const visiveis = useMemo(
    () =>
      reviews
        .filter((r) => filtroServico === "todos" || r.servico === filtroServico)
        .filter((r) => filtroNota === 0 || r.nota === filtroNota)
        .sort((a, b) => +new Date(b.data) - +new Date(a.data)),
    [reviews, filtroServico, filtroNota],
  );

  function adicionar(review: Review) {
    setReviews((atuais) => [review, ...atuais]);
  }

  function remover(id: string) {
    setReviews((atuais) => atuais.filter((r) => r.id !== id));
  }

  return (
    <div className="rating-wrap">
      <div className="section-tag">Nova Funcionalidade</div>
      <h2>
        Avaliação dos <span style={{ color: "var(--pink)" }}>Serviços</span>
      </h2>
      <p>
        Já usou um serviço da AgroConecta? Dê uma nota de 1 a 5 estrelas e deixe um comentário — sua
        avaliação alimenta o índice de satisfação do dashboard.
      </p>

      <div className="rating-summary">
        <div>
          <div className="rating-avg">{reviews.length ? media.toFixed(1) : "—"}</div>
          <div className="rating-count">
            {reviews.length} avaliaç{reviews.length === 1 ? "ão" : "ões"}
          </div>
        </div>
        <StarRating value={Math.round(media)} readOnly />
        <div style={{ flex: 1, minWidth: 220 }}>
          {distribuicao.map(({ nota, total }) => (
            <div
              key={nota}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".6rem",
                marginBottom: ".25rem",
              }}
            >
              <span style={{ color: "var(--muted)", fontSize: ".78rem", width: 26 }}>{nota}★</span>
              <div
                style={{
                  flex: 1,
                  background: "var(--bg)",
                  borderRadius: 50,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: reviews.length ? `${(total / reviews.length) * 100}%` : "0%",
                    height: "100%",
                    background: "#ffb020",
                    borderRadius: 50,
                  }}
                />
              </div>
              <span style={{ color: "var(--muted)", fontSize: ".78rem", width: 18 }}>{total}</span>
            </div>
          ))}
        </div>
      </div>

      <ReviewForm onSubmit={adicionar} />

      <div style={{ marginTop: "2.5rem" }}>
        <div className="chart-card-header">
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>
            Comentários recentes
          </h3>
          <div className="periodo-filtros">
            <button
              className={`periodo-btn${filtroNota === 0 ? " active" : ""}`}
              onClick={() => setFiltroNota(0)}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                className={`periodo-btn${filtroNota === n ? " active" : ""}`}
                onClick={() => setFiltroNota(n)}
              >
                {n}★
              </button>
            ))}
          </div>
        </div>

        <label>Filtrar por serviço</label>
        <select
          className="sim-select"
          value={filtroServico}
          onChange={(e) => setFiltroServico(e.target.value)}
        >
          <option value="todos">Todos os serviços</option>
          {SERVICOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <ReviewList reviews={visiveis} onDelete={remover} />
      </div>
    </div>
  );
}
