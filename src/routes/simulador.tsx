import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useToast } from "../components/ToastProvider";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador de Impacto | AgroConecta" },
      {
        name: "description",
        content:
          "Calcule ganho financeiro, quilos salvos e custo de frete ao entrar na rede de assinaturas AgroConecta.",
      },
      { property: "og:title", content: "Simulador de Impacto | AgroConecta" },
      {
        property: "og:description",
        content: "Simule quanto sua produção pode ganhar com a rede AgroConecta.",
      },
    ],
  }),
  component: Simulador,
});

const FRETES: Record<string, string> = {
  curta: "R$ 80–120/semana",
  media: "R$ 150–220/semana",
  longa: "R$ 280–350/semana",
};

const PRODUTORES = ["José (Fazenda Boa Vista)", "Ana (Sítio Verde)", "Carlos (Cooperativa Vale)"];

type Resultado = { reducao: string; kgSalvos: string; ganho: string; frete: string };

function Simulador() {
  const { showToast } = useToast();
  const [cultura, setCultura] = useState("hortalica");
  const [producao, setProducao] = useState("500");
  const [desperdicio, setDesperdicio] = useState(40);
  const [preco, setPreco] = useState("4.50");
  const [distancia, setDistancia] = useState("curta");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const [restaurante, setRestaurante] = useState("Restaurante Orgânico SP");
  const [produto, setProduto] = useState("Alface Crespa (10 kg/sem)");
  const [pedido, setPedido] = useState<{ produtor: string; horas: number } | null>(null);

  function calcularImpacto() {
    const prod = parseFloat(producao) || 500;
    const desp = desperdicio / 100;
    const prc = parseFloat(preco) || 4.5;
    const kgSalvos = prod * desp * 0.4;
    const ganhoMensal = kgSalvos * prc * 4.3;

    setResultado({
      reducao: `-${Math.round(desp * 40)}% de perdas`,
      kgSalvos: `${kgSalvos.toFixed(0)} kg/semana`,
      ganho: `R$ ${ganhoMensal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      frete: FRETES[distancia]!,
    });
    showToast("📊", "Cálculo concluído!", "Veja seu impacto potencial com AgroConecta.");
  }

  function simularPedido() {
    const produtor = PRODUTORES[Math.floor(Math.random() * PRODUTORES.length)]!;
    const horas = Math.floor(Math.random() * 12) + 6;
    setPedido({ produtor, horas });
    showToast("📦", "Pedido simulado!", `${produto} alocado via ${produtor}`);
  }

  return (
    <>
      <div style={{ padding: "2.5rem 2rem 0", maxWidth: 1100, margin: "0 auto" }}>
        <div className="section-tag">Simulador Interativo</div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.8rem,4vw,2.5rem)",
            marginBottom: ".5rem",
          }}
        >
          Calcule seu <span style={{ color: "var(--pink)" }}>Impacto</span>
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          Simule o ganho financeiro e redução de desperdício ao entrar na rede AgroConecta.
        </p>
      </div>

      <div className="sim-layout">
        <div className="sim-panel">
          <h2>
            Dados do <span className="accent">Produtor</span>
          </h2>
          <label>Tipo de Cultura</label>
          <select
            className="sim-select"
            value={cultura}
            onChange={(e) => setCultura(e.target.value)}
          >
            <option value="hortalica">Hortaliças</option>
            <option value="fruta">Frutas</option>
            <option value="graos">Grãos</option>
            <option value="laticinios">Laticínios</option>
          </select>

          <label>Produção Semanal (kg)</label>
          <input
            type="number"
            className="sim-input"
            value={producao}
            onChange={(e) => setProducao(e.target.value)}
            placeholder="Ex: 500"
          />

          <label>Desperdício Atual (%)</label>
          <input
            type="range"
            className="sim-input"
            min={10}
            max={60}
            value={desperdicio}
            onChange={(e) => setDesperdicio(Number(e.target.value))}
          />
          <span style={{ color: "var(--pink)", fontWeight: 700, fontSize: "1.1rem" }}>
            {desperdicio}%
          </span>
          <br />
          <br />

          <label>Preço Médio de Venda (R$/kg)</label>
          <input
            type="number"
            step="0.10"
            className="sim-input"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <label>Distância ao Centro de Distribuição (km)</label>
          <select
            className="sim-select"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
          >
            <option value="curta">Até 50 km</option>
            <option value="media">50–150 km</option>
            <option value="longa">150+ km</option>
          </select>

          <button className="sim-btn" onClick={calcularImpacto}>
            🌱 Calcular Impacto
          </button>

          <div className={`result-panel${resultado ? " show" : ""}`}>
            <div className="result-card">
              <h3>📊 Seu Resultado com AgroConecta</h3>
              <div className="result-row">
                <span className="label">Redução de desperdício</span>
                <span className="value good">{resultado?.reducao ?? "—"}</span>
              </div>
              <div className="result-row">
                <span className="label">Kg salvos por semana</span>
                <span className="value good">{resultado?.kgSalvos ?? "—"}</span>
              </div>
              <div className="result-row">
                <span className="label">Ganho financeiro/mês</span>
                <span className="value good">{resultado?.ganho ?? "—"}</span>
              </div>
              <div className="result-row">
                <span className="label">Custo de frete estimado</span>
                <span className="value">{resultado?.frete ?? "—"}</span>
              </div>
              <div className="result-row">
                <span className="label">Nível de serviço esperado</span>
                <span className="value good">98%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sim-panel">
          <h2>
            Mapa de <span className="accent">Rotas</span>
          </h2>
          <div className="map-sim">
            <svg className="map-svg" viewBox="0 0 400 280">
              <rect width="400" height="280" fill="#0f1322" />
              {[70, 140, 210].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1e2438" strokeWidth="1" />
              ))}
              {[100, 200, 300].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="#1e2438" strokeWidth="1" />
              ))}
              <path
                d="M40 240 Q120 180 200 140 Q280 100 360 60"
                stroke="#2a3356"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M80 260 L80 20" stroke="#2a3356" strokeWidth="5" fill="none" />
              <path d="M0 130 L400 130" stroke="#2a3356" strokeWidth="5" fill="none" />
              <path
                d="M70 220 Q140 170 210 140 Q280 110 340 80"
                stroke="#ff2d7e"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="200"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <circle cx="70" cy="220" r="10" fill="#ff2d7e" />
              <circle cx="210" cy="140" r="12" fill="#7c3aed" />
              <text
                x="210"
                y="172"
                textAnchor="middle"
                fill="#a78bfa"
                fontSize="9"
                fontFamily="DM Sans"
              >
                Hub Central
              </text>
              <rect
                x="288"
                y="85"
                width="28"
                height="22"
                rx="5"
                fill="#1e2438"
                stroke="#4ade80"
                strokeWidth="1.5"
              />
              <text
                x="302"
                y="116"
                textAnchor="middle"
                fill="#4ade80"
                fontSize="8"
                fontFamily="DM Sans"
              >
                Rest. 1
              </text>
              <rect
                x="325"
                y="60"
                width="28"
                height="22"
                rx="5"
                fill="#1e2438"
                stroke="#4ade80"
                strokeWidth="1.5"
              />
              <text
                x="339"
                y="92"
                textAnchor="middle"
                fill="#4ade80"
                fontSize="8"
                fontFamily="DM Sans"
              >
                Rest. 2
              </text>
              <text
                x="200"
                y="20"
                textAnchor="middle"
                fill="#6b7a9e"
                fontSize="10"
                fontFamily="Syne"
              >
                Rota Otimizada AgroConecta
              </text>
            </svg>
          </div>
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#ff2d7e" }} />
              Produtores
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#7c3aed" }} />
              Hub Central
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#4ade80" }} />
              Restaurantes
            </div>
          </div>
          <div className="route-info">
            <p>
              A IA AgroConecta consolida pedidos de múltiplos restaurantes e traça a{" "}
              <strong>rota mínima entre produtores e hubs</strong>, reduzindo emissões e custo
              logístico em até <strong>35%</strong>.
            </p>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem" }}>
              Simular <span className="accent">Pedido</span>
            </h2>
            <label>Restaurante</label>
            <select
              className="sim-select"
              value={restaurante}
              onChange={(e) => setRestaurante(e.target.value)}
            >
              <option>Restaurante Orgânico SP</option>
              <option>Bistrô Verde</option>
              <option>Cozinha Natural</option>
            </select>
            <label>Produto Desejado</label>
            <select
              className="sim-select"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
            >
              <option>Alface Crespa (10 kg/sem)</option>
              <option>Tomate Orgânico (15 kg/sem)</option>
              <option>Mix de Folhas (8 kg/sem)</option>
              <option>Abóbora Japonesa (20 kg/sem)</option>
            </select>
            <button className="sim-btn" onClick={simularPedido}>
              📦 Simular Entrega
            </button>

            {pedido && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "var(--bg)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  fontSize: ".88rem",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                <div
                  style={{
                    color: "var(--pink)",
                    fontWeight: 700,
                    fontFamily: "'Syne', sans-serif",
                    marginBottom: ".5rem",
                  }}
                >
                  ✅ Pedido Simulado com Sucesso
                </div>
                <b>Restaurante:</b> {restaurante}
                <br />
                <b>Produto:</b> {produto}
                <br />
                <b>Fornecedor alocado:</b> {pedido.produtor}
                <br />
                <b>Rota otimizada:</b> Produtor → Hub Central → Restaurante
                <br />
                <b>Previsão de entrega:</b> {pedido.horas}h após confirmação
                <br />
                <b>Rastreabilidade:</b> Ponta a ponta garantida
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
