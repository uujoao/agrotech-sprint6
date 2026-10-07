# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Funcionalidades da Fase 6

### Formulários

As abas **Contato** e **Fale Conosco** usam componentes React/TypeScript com validação no cliente, mensagens de erro amigáveis e máscara para celular brasileiro no formato `(XX) 9XXXX-XXXX`.

### Painel Climático

O Dashboard possui o componente `src/components/PainelClimatico.tsx`, que consulta a OpenWeatherMap para exibir temperatura, umidade, condição climática e probabilidade de precipitação para as próximas 12 horas. A cidade pode ser alterada pelo próprio painel.

Crie/edite o arquivo `.env.local` com sua chave:

```env
VITE_OPENWEATHER_API_KEY=sua_chave_aqui
```

O arquivo `.env.local` não deve ser versionado. O projeto também inclui `.env.example` como modelo.
