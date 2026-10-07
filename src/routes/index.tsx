import { createFileRoute, Link } from "@tanstack/react-router";
import { useCountUp } from "../hooks/useCountUp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgroConecta — Conectando o Campo às Cidades" },
      {
        name: "description",
        content:
          "Rede agrotech B2B de assinaturas semanais: menos desperdício no campo, fornecimento estável para restaurantes.",
      },
      { property: "og:title", content: "AgroConecta — Conectando o Campo às Cidades" },
      {
        property: "og:description",
        content:
          "Rede agrotech B2B de assinaturas semanais: menos desperdício no campo, fornecimento estável para restaurantes.",
      },
    ],
  }),
  component: Home,
});

const PROBLEMAS = [
  {
    icone: "🚜",
    titulo: "O Pequeno Produtor",
    texto:
      "Sofre com o desperdício de excedentes e falta de previsibilidade financeira para planejar safras. Perde até 50% da produção sem mercado garantido.",
  },
  {
    icone: "🍽️",
    titulo: "O Comércio Local",
    texto:
      "Enfrenta fornecedores instáveis, variação de preços e falta de rastreabilidade na qualidade. Impossível construir um cardápio orgânico consistente.",
  },
  {
    icone: "🌍",
    titulo: "O Impacto Ambiental",
    texto:
      "Cadeias com muitos intermediários geram emissões desnecessárias. A falta de planejamento leva ao desperdício de recursos naturais e financeiros.",
  },
];

const PILARES = [
  {
    num: "01",
    titulo: "Assinatura B2B",
    texto: "Restaurantes assinam volumes semanais garantindo demanda constante para os produtores.",
  },
  {
    num: "02",
    titulo: "Inteligência",
    texto: "Nossa IA consolida pedidos e divide entre produtores locais por capacidade disponível.",
  },
  {
    num: "03",
    titulo: "Logística",
    texto: "Rotas otimizadas reduzem o custo de frete e o tempo de prateleira dos produtos.",
  },
  {
    num: "04",
    titulo: "Monitoramento",
    texto: "Dashboard de performance para gestão técnica e financeira total em tempo real.",
  },
];

const ESTATISTICAS = [
  { alvo: 40, sufixo: "%", label: "Redução de Desperdício" },
  { alvo: 25, sufixo: "%", label: "Aumento de Renda" },
  { alvo: 98, sufixo: "%", label: "Nível de Serviço" },
  { alvo: 320, sufixo: "+", label: "Produtores Parceiros" },
];

function Stat({ alvo, sufixo, label }: { alvo: number; sufixo: string; label: string }) {
  const valor = useCountUp(alvo);
  return (
    <div className="stat-item">
      <div className="stat-num">
        {valor}
        {sufixo}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-tag">🌱 Agrotech · B2B · Sustentabilidade</div>
        <h1>
          Conectando <span className="accent">Campo</span>
          <br />
          às Cidades
        </h1>
        <p>
          A solução Agrotech focada em eliminar o desperdício e garantir segurança alimentar através
          de redes de assinatura B2B.
        </p>
        <div className="hero-btns">
          <Link to="/simulador" className="btn-primary">
            Ver Simulação
          </Link>
          <Link to="/dashboard" className="btn-outline">
            Acessar Dashboard
          </Link>
        </div>
      </section>

      <div className="stats-strip">
        {ESTATISTICAS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <section className="section">
        <div className="section-tag">O Problema</div>
        <h2 className="section-title">Por que a cadeia alimentar atual está quebrada?</h2>
        <p className="section-sub">
          3.2% dos domicílios brasileiros ainda enfrentam insegurança alimentar grave (IBGE 2024),
          enquanto produtores perdem safras inteiras por falta de escoamento.
        </p>
        <div className="problem-grid">
          {PROBLEMAS.map((p) => (
            <div className="problem-card" key={p.titulo}>
              <div className="problem-icon">{p.icone}</div>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-tag">A Solução</div>
        <h2 className="section-title">Ecossistema AgroConecta</h2>
        <p className="section-sub">
          Distribuição inteligente baseada em recorrência. Quatro pilares que transformam a cadeia
          de valor do campo à cidade.
        </p>
        <div className="flow-grid">
          {PILARES.map((p) => (
            <div className="flow-card" key={p.num}>
              <div className="flow-num">{p.num}</div>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-banner">
          <h2>
            Transformando o Campo,
            <br />
            Alimentando Cidades.
          </h2>
          <p>Junte-se à rede que já conecta produtores e restaurantes em todo o Brasil.</p>
          <Link to="/contato" className="btn-primary">
            Vamos conectar o futuro do agronegócio?
          </Link>
        </div>
      </section>
    </>
  );
}
