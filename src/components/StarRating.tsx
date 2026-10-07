import { useState } from "react";

const LABELS = ["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"];

type Props = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  showHint?: boolean;
};

/** Seletor de nota de 1 a 5 estrelas (reutilizável, controlado). */
export function StarRating({ value, onChange, readOnly = false, showHint = false }: Props) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  if (readOnly) {
    return (
      <div className="review-stars" aria-label={`${value} de 5 estrelas`}>
        {"★".repeat(value)}
        <span style={{ color: "rgba(255,255,255,.18)" }}>{"★".repeat(5 - value)}</span>
      </div>
    );
  }

  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn${n <= active ? " filled" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange?.(n)}
          aria-label={`Dar nota ${n}`}
          aria-pressed={value === n}
        >
          ★
        </button>
      ))}
      {showHint && (
        <span className="star-hint">{active ? LABELS[active] : "Selecione uma nota"}</span>
      )}
    </div>
  );
}
