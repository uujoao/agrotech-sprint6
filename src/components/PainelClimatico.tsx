import { useEffect, useState, type FormEvent } from "react";

const API_KEY = import.meta.env["VITE_OPENWEATHER_API_KEY"];
const DEFAULT_CITY = "São Paulo, BR";

interface GeoLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface CurrentWeatherResponse {
  name: string;
  sys?: { country?: string };
  main: { temp: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
}

interface ForecastResponse {
  list: Array<{ pop?: number }>;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  rainChance: number;
}

async function readApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || "Não foi possível consultar o clima agora.";
  } catch {
    return "Não foi possível consultar o clima agora.";
  }
}

async function getWeather(city: string, signal: AbortSignal): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error(
      "Chave da OpenWeather não configurada. Defina VITE_OPENWEATHER_API_KEY no arquivo .env.local.",
    );
  }

  const params = new URLSearchParams({
    q: city,
    limit: "1",
    appid: API_KEY,
  });

  const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?${params}`, {
    signal,
  });
  if (!geoResponse.ok) throw new Error(await readApiError(geoResponse));

  const locations = (await geoResponse.json()) as GeoLocation[];
  if (!locations.length) throw new Error("Não encontramos essa cidade. Tente informar outro nome.");

  const location = locations[0];
  if (!location) throw new Error("Não encontramos essa cidade. Tente informar outro nome.");

  const weatherParams = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lon),
    appid: API_KEY,
    units: "metric",
    lang: "pt_br",
  });

  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?${weatherParams}`, { signal }),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?${weatherParams}`, { signal }),
  ]);

  if (!currentResponse.ok) throw new Error(await readApiError(currentResponse));
  if (!forecastResponse.ok) throw new Error(await readApiError(forecastResponse));

  const current = (await currentResponse.json()) as CurrentWeatherResponse;
  const forecast = (await forecastResponse.json()) as ForecastResponse;

  const nextTwelveHours = forecast.list.slice(0, 4);
  const rainChance = nextTwelveHours.length
    ? Math.round(Math.max(...nextTwelveHours.map((item) => (item.pop ?? 0) * 100)))
    : 0;

  return {
    city: current.name || location.name,
    country: current.sys?.country || location.country,
    temperature: current.main.temp,
    humidity: current.main.humidity,
    description: current.weather[0]?.description || "Condição indisponível",
    icon: current.weather[0]?.icon || "01d",
    rainChance,
  };
}

export function PainelClimatico() {
  const [cidade, setCidade] = useState(DEFAULT_CITY);
  const [busca, setBusca] = useState(DEFAULT_CITY);
  const [clima, setClima] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarClima() {
      setLoading(true);
      setError("");

      try {
        const data = await getWeather(cidade, controller.signal);
        setClima(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar o clima.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void carregarClima();

    return () => controller.abort();
  }, [cidade, retryToken]);

  function pesquisar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cidadeNormalizada = busca.trim();
    if (cidadeNormalizada) setCidade(cidadeNormalizada);
  }

  return (
    <section className="climate-panel" aria-labelledby="climate-title">
      <div className="climate-header">
        <div>
          <div className="section-tag">Nova Funcionalidade</div>
          <h2 id="climate-title">
            Painel <span>Climático</span>
          </h2>
          <p>Consulte as condições atuais e a chance de chuva para a região do produtor.</p>
        </div>

        <form className="climate-search" onSubmit={pesquisar}>
          <label htmlFor="climate-city">Cidade</label>
          <div className="climate-search-row">
            <input
              id="climate-city"
              className="sim-input"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: Cachoeiro de Itapemirim, BR"
            />
            <button
              className="climate-search-btn"
              type="submit"
              disabled={loading || !busca.trim()}
            >
              {loading ? "..." : "Consultar"}
            </button>
          </div>
        </form>
      </div>

      {error ? (
        <div className="climate-error" role="alert">
          <strong>Não foi possível carregar o clima.</strong>
          <span>{error}</span>
          <button
            type="button"
            className="btn-outline climate-retry"
            onClick={() => setRetryToken((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      ) : loading && !clima ? (
        <div className="climate-loading" role="status" aria-live="polite">
          Consultando dados meteorológicos...
        </div>
      ) : clima ? (
        <div className="climate-content">
          <div className="climate-location">
            <span>📍</span>
            <div>
              <strong>
                {clima.city}, {clima.country}
              </strong>
              <span>Condições atuais</span>
            </div>
          </div>

          <div className="climate-metrics">
            <article className="climate-metric climate-temp">
              <div className="climate-icon">🌡️</div>
              <div>
                <span>Temperatura</span>
                <strong>{Math.round(clima.temperature)}°C</strong>
              </div>
            </article>

            <article className="climate-metric">
              <div className="climate-icon">💧</div>
              <div>
                <span>Umidade do ar</span>
                <strong>{clima.humidity}%</strong>
              </div>
            </article>

            <article className="climate-metric">
              <div className="climate-icon">☔</div>
              <div>
                <span>Chance de chuva</span>
                <strong>{clima.rainChance}%</strong>
              </div>
            </article>
          </div>

          <div className="climate-summary">
            <img
              src={`https://openweathermap.org/img/wn/${clima.icon}@2x.png`}
              alt=""
              width="64"
              height="64"
            />
            <div>
              <span>Condição climática</span>
              <strong>{clima.description}</strong>
              <small>Chance de chuva calculada para os próximos 12h.</small>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
