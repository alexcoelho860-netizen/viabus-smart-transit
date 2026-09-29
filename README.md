# ViaBus: Smart Transit

Crie a aplicação web completa "ViaBus" para transporte coletivo urbano com 4 perfis distintos (Passageiro, Motorista, Fiscal, Administrador) e tela de demonstração/login rápido sem senha para cada perfil.

Identidade visual: Azul escuro (#0F172A), Azul principal (#2563EB), Azul claro (#3B82F6), Fundo (#F8FAFC), Verde (#22C55E), Amarelo (#F59E0B), Vermelho (#EF4444). Tipografia moderna, visual profissional de mobilidade urbana (cards elegantes, sombras suaves, microinterações, responsivo com sidebar no desktop e navegação inferior no mobile).

Estrutura de navegação e rotas:
- Landing Page (/) e Login/Demo (/login ou /demo com botões de 1 clique para entrar como Passageiro, Motorista, Fiscal ou Admin).
- Passageiro: /passageiro (Dashboard com boas-vindas, sino de notificações, carrossel de avisos, pesquisa "Para onde você vai?", card "Seu próximo ônibus" linha 203 com rota/tempo/lotação, linhas favoritas, alertas da região, ônibus próximos), /passageiro/mapa, /passageiro/linhas, /passageiro/pontos, /passageiro/notificacoes, /passageiro/favoritos, /passageiro/perfil.
- Motorista: interface limpa e focada no volante (/motorista com status em operação, card do veículo 4821 linha 203, status de trânsito + tempo de atraso, previsão do próximo ponto, botão grande "⚠ REGISTRAR OCORRÊNCIA", botões "Ver rota", "Falar com fiscal", "Histórico"). Modal/tela de ocorrência (/motorista/ocorrencia) com botões grandes de tipo (Problema mecânico, Acidente, Congestionamento, Problema na via, Passageiro, Outro), gravidade, descrição, envio com feedback de sucesso e protocolo gerado (ex: VB-2026-00482). Chat com fiscal (/motorista/comunicacao).
- Fiscal: Central de operações (/fiscal com stat cards de ônibus em operação, ocorrências abertas, motoristas conectados, linhas com atraso; grande mapa operacional interativo com marcadores coloridos de ônibus, paradas, trânsito e ocorrências com filtro; lista de ocorrências recentes com ações "Atender", "Detalhes" e "Encerrar" com modal de confirmação; chat operacional com respostas rápidas e status online).
- Administrador: Dashboard executivo (/admin com métricas de ônibus ativos, viagens, ocorrências, atrasos, gráficos analíticos de ocorrências por dia/categoria, linhas com mais atrasos, tempo médio de atendimento; seções de alertas críticos e insights da operação; telas de gestão de linhas, veículos, motoristas, passageiros, relatórios e configurações).

Recursos e dados:
- Dados mockados realistas e consistentes (linhas 203, 205, 301, 405; veículos 4821, 4835, 4910, etc.; motoristas João da Silva, Carlos Henrique, etc.; ocorrências ativas com status e severidades).
- Atualização simulada com indicador de "Atualizado agora" e movimentação/status em tempo real.
- Sistema de chat operacional entre motorista e fiscal com respostas rápidas prontas.
- Notificações Toast, modais de confirmação e detalhes, busca e filtros funcionais, sem páginas vazias ou textos em lorem ipsum. Tudo em português do Brasil.
- Modelos de dados e tipos TypeScript bem estruturados e preparados para futura integração com Supabase.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7a0fb06c-c758-4c3e-b044-b3aa7e053305).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
