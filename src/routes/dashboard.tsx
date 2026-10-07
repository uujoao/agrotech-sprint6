import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { PainelClimatico } from "../components/PainelClimatico";
import {
  AVALIACOES_INICIAIS,
  REVIEWS_STORAGE_KEY,
  mediaAvaliacoes,
  type Review,
} from "../components/reviews";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Executivo | AgroConecta" },
      {
        name: "description",
        content:
          "KPIs semanais da rede AgroConecta: pedidos ativos, kg entregues, desperdício evitado e impacto ambiental.",
      },
      { property: "og:title", content: "Dashboard Executivo | AgroConecta" },
      {
        property: "og:description",
        content: "Acompanhe pedidos, entregas e impacto ambiental da rede AgroConecta.",
      },
    ],
  }),
  component: Dashboard,
});

const SEMANAS = ["S16", "S17", "S18", "S19", "S20", "S21", "S22", "S23"];
const VALORES = [1500, 1650, 1800, 2100, 1950, 2400, 2650, 2840];

const PEDIDOS = [
  ["Bistrô Verde", "Alface 15kg", "15 kg", "ativo"],
  ["Rest. Orgânico SP", "Mix Folhas 10kg", "10 kg", "entregue"],
  ["Cozinha Natural", "Tomate 20kg", "20 kg", "ativo"],
  ["Cantina Saudável", "Abóbora 12kg", "12 kg", "pendente"],
  ["Empório do Campo", "Couve 8kg", "8 kg", "entregue"],
] as const;

const PRODUTORES = [
  { sigla: "JB", nome: "José Batista", cidade: "Campinas, SP", nota: "4.9" },
  { sigla: "AM", nome: "Ana Martins", cidade: "Ibiúna, SP", nota: "4.8" },
  { sigla: "CR", nome: "Carlos Rocha", cidade: "Atibaia, SP", nota: "4.7" },
  { sigla: "FL", nome: "Fátima Lima", cidade: "Jundiaí, SP", nota: "4.9" },
];

function Kpi({
  label,
  target,
  delta,
  tone,
  suffix = "",
  money = false,
}: {
  label: string;
  target: number;
  delta: string;
  tone?: "pink" | "green";
  suffix?: string;
  money?: boolean;
}) {
  const valor = useCountUp(target, 50, 25);
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${tone ? ` ${tone}` : ""}`}>
        {money
          ? `R$ ${valor.toLocaleString("pt-BR")}`
          : `${valor.toLocaleString("pt-BR")}${suffix}`}
      </div>
      <div className="kpi-delta up">{delta}</div>
    </div>
  );
}

function Dashboard() {
  const [periodo, setPeriodo] = useState(6);
  const [busca, setBusca] = useState("");
  const { value: avaliacoes } = useLocalStorage<Review[]>(REVIEWS_STORAGE_KEY, AVALIACOES_INICIAIS);

  const { semanas, valores, maximo } = useMemo(() => {
    const s = SEMANAS.slice(-periodo);
    const v = VALORES.slice(-periodo);
    return { semanas: s, valores: v, maximo: Math.max(...v) };
  }, [periodo]);

  const produtoresFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return PRODUTORES.filter(
      (p) => p.nome.toLowerCase().includes(termo) || p.cidade.toLowerCase().includes(termo),
    );
  }, [busca]);

  const media = mediaAvaliacoes(avaliacoes);

  return (
    <>
      <div className="dash-header">
        <div>
          <h1>
            Dashboard <span>Executivo</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: ".88rem", marginTop: ".3rem" }}>
            Semana 23 · Jun 2026
          </p>
        </div>
        <div className="status-badge">
          <div className="status-dot" />
          Sistema Ativo
        </div>
      </div>

      <div className="kpi-grid">
        <Kpi label="Pedidos Ativos" target={47} delta="▲ +12% vs semana anterior" tone="pink" />
        <Kpi label="Kg Entregues" target={2840} delta="▲ +8% vs semana anterior" />
        <Kpi
          label="Desperdício Evitado"
          target={1136}
          suffix=" kg"
          delta="▲ Meta atingida"
          tone="green"
        />
        <Kpi label="Receita Semanal" target={38200} money delta="▲ +5% vs semana anterior" />
        <div className="kpi-card">
          <div className="kpi-label">Satisfação (avaliações)</div>
          <div className="kpi-value" style={{ color: "#ffb020" }}>
            {avaliacoes.length ? `${media.toFixed(1)} ★` : "—"}
          </div>
          <div className="kpi-delta up">
            {avaliacoes.length} avaliaç{avaliacoes.length === 1 ? "ão" : "ões"} registradas
          </div>
        </div>
      </div>

      <PainelClimatico />

      <div className="dash-grid">
        <div>
          <div className="dash-card chart-card">
            <div className="chart-card-header">
              <h3>
                Entregas por Semana <span>(últimas {periodo} semanas)</span>
              </h3>
              <div className="periodo-filtros">
                {[4, 6, 8].map((q) => (
                  <button
                    key={q}
                    className={`periodo-btn${periodo === q ? " active" : ""}`}
                    onClick={() => setPeriodo(q)}
                  >
                    {q} sem
                  </button>
                ))}
              </div>
            </div>
            <div className="bar-chart">
              {semanas.map((semana, i) => (
                <div className="bar-wrap" key={semana}>
                  <div className="bar-val">{valores[i]}</div>
                  <div
                    className={`bar${i === semanas.length - 1 ? "" : " secondary"}`}
                    style={{ height: `${(valores[i]! / maximo) * 120}px` }}
                  />
                  <div className="bar-label">{semana}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h3>Pedidos Recentes</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Produto</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PEDIDOS.map((p) => (
                  <tr key={p[0]}>
                    <td>{p[0]}</td>
                    <td>{p[1]}</td>
                    <td>{p[2]}</td>
                    <td>
                      <span className={`badge ${p[3]}`}>{p[3].toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="dash-card">
            <h3>
              Produtores <span>Conectados</span>
            </h3>
            <div className="producer-search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="sim-input producer-search-input"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou cidade..."
              />
            </div>
            <div className="producer-list">
              {produtoresFiltrados.length === 0 ? (
                <p className="review-empty">Nenhum produtor encontrado.</p>
              ) : (
                produtoresFiltrados.map((p) => (
                  <div className="producer-item" key={p.sigla}>
                    <div className="producer-avatar">{p.sigla}</div>
                    <div className="producer-info">
                      <div className="producer-name">{p.nome}</div>
                      <div className="producer-loc">📍 {p.cidade}</div>
                    </div>
                    <div className="producer-score">⭐ {p.nota}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dash-card" style={{ marginTop: "1.5rem" }}>
            <h3>
              Impacto <span>Ambiental</span>
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: ".8rem", marginTop: ".5rem" }}
            >
              {[
                {
                  label: "CO₂ Evitado",
                  valor: "1.2t",
                  cor: "#4ade80",
                  gradiente: "linear-gradient(90deg,#4ade80,#16a34a)",
                  largura: "72%",
                },
                {
                  label: "Água Poupada",
                  valor: "840L",
                  cor: "#38bdf8",
                  gradiente: "linear-gradient(90deg,#38bdf8,#0284c7)",
                  largura: "55%",
                },
                {
                  label: "Alimentos Redistribuídos",
                  valor: "320kg",
                  cor: "var(--pink)",
                  gradiente: "linear-gradient(90deg,var(--pink),var(--pink-dim))",
                  largura: "85%",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: ".4rem",
                      fontSize: ".85rem",
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>{item.label}</span>
                    <span style={{ color: item.cor, fontWeight: 700 }}>{item.valor}</span>
                  </div>
                  <div
                    style={{
                      background: "var(--bg)",
                      borderRadius: 50,
                      height: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: item.largura,
                        height: "100%",
                        background: item.gradiente,
                        borderRadius: 50,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
