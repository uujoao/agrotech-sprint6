export type Review = {
  id: string;
  autor: string;
  servico: string;
  nota: number;
  comentario: string;
  data: string; // ISO
};

export const SERVICOS = [
  "Assinatura B2B",
  "Simulador de Impacto",
  "Logística / Entrega",
  "Dashboard Executivo",
  "Atendimento",
] as const;

export const REVIEWS_STORAGE_KEY = "agroconecta:avaliacoes";

export const AVALIACOES_INICIAIS: Review[] = [
  {
    id: "seed-1",
    autor: "Bistrô Verde",
    servico: "Assinatura B2B",
    nota: 5,
    comentario:
      "Volume semanal sempre no prazo e qualidade constante. Conseguimos montar um cardápio 100% orgânico.",
    data: "2026-08-24T12:00:00.000Z",
  },
  {
    id: "seed-2",
    autor: "José Batista",
    servico: "Logística / Entrega",
    nota: 4,
    comentario:
      "A rota otimizada reduziu bastante meu frete. Só senti falta de mais janelas de coleta na sexta.",
    data: "2026-08-27T12:00:00.000Z",
  },
];

export function mediaAvaliacoes(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((soma, r) => soma + r.nota, 0) / reviews.length;
}

export function distribuicaoNotas(reviews: Review[]) {
  return [5, 4, 3, 2, 1].map((nota) => ({
    nota,
    total: reviews.filter((r) => r.nota === nota).length,
  }));
}

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
