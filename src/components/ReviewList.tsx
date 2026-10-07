import { StarRating } from "./StarRating";
import { formatarData, type Review } from "./reviews";

type Props = {
  reviews: Review[];
  onDelete?: (id: string) => void;
};

export function ReviewList({ reviews, onDelete }: Props) {
  if (reviews.length === 0) {
    return <p className="review-empty">Nenhuma avaliação encontrada para este filtro.</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((r) => (
        <article className="review-card" key={r.id}>
          <div className="review-head">
            <div>
              <div className="review-author">{r.autor}</div>
              <div className="review-service">{r.servico}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <StarRating value={r.nota} readOnly />
              <div className="review-date">{formatarData(r.data)}</div>
            </div>
          </div>
          <p className="review-text">{r.comentario}</p>
          {onDelete && !r.id.startsWith("seed-") && (
            <button className="review-delete" onClick={() => onDelete(r.id)}>
              remover
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
