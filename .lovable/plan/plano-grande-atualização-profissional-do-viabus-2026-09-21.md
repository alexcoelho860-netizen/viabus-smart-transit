# Plano — Grande atualização profissional do ViaBus

## Objetivo
Evoluir o projeto existente sem remover recursos, priorizando o novo mapa real de Curitiba, a experiência de rotas e a consistência dos quatro perfis.

## 1. Auditoria e base visual
- Revisar rotas, navegação, botões, formulários, estados, permissões e textos em português.
- Manter o design atual do ViaBus, refinando hierarquia, espaçamentos, ícones, foco, contraste e comportamento em celular/tablet/desktop.
- Remover da interface códigos internos e linguagem técnica de demonstração onde poluem a experiência, mantendo a identificação interna dos dados.
- Preservar avisos discretos apenas onde dados simulados precisam ser claramente diferenciados de dados reais.

## 2. Rotas e itinerários
- Redesenhar os cards de rotas com ícone de navegação, origem/destino em destaque e indicadores compactos de intervalo, tarifa e atraso.
- Ocultar `RD-01`, `RD-02` etc. e o prefixo “Rota demonstrativa” dos nomes apresentados ao usuário.
- Manter favoritos com animação discreta e feedback imediato.
- Evoluir “Ver itinerário” para uma visualização completa com origem, destino, sequência conectada de paradas, tempo, distância, status e mapa.
- Exibir a tarifa como configurável e não oficial quando aplicável.

## 3. Mapa real de Curitiba
- Substituir integralmente o mapa quadriculado por um mapa geográfico real e navegável, usando OpenStreetMap como fallback sem chave.
- Preparar suporte opcional a Google Maps por variável de ambiente, sem expor chaves no código.
- Centralizar inicialmente em Curitiba, com zoom, movimentação, recentralização e solicitação real de localização; nunca inventar a posição do usuário.
- Converter veículos, paradas, alertas e ocorrências para latitude/longitude coerentes com locais reais.
- Criar marcadores pequenos e distintos por estado/tipo, popups informativos, filtros funcionais, legenda discreta e seleção de rota/veículo.
- Adaptar detalhes para card flutuante no desktop e painel inferior no celular, mantendo o mapa como área principal.

## 4. Fluxos dos quatro perfis
- Passageiro: revisar busca, mapa, rotas, favoritos, notificações, alertas, pontos e acompanhamento de ônibus.
- Motorista: validar jornada, rota, ocorrência, histórico, chat, perfil e status operacional.
- Fiscal: validar painel, mapa, ocorrências, motoristas, veículos, comunicação, histórico e alertas.
- Administrador: revisar métricas, usuários/passageiros, frota, rotas, ocorrências, banners, notificações, relatórios, configurações e auditoria.
- Garantir o fluxo integrado de ocorrência: registro → protocolo → recebimento → atendimento → conversa → resolução → encerramento → histórico/alerta.

## 5. Dados, acesso e confiabilidade
- Manter os mocks centralizados e desacoplados da interface, preparados para futura persistência real.
- Corrigir dados geográficos inconsistentes e evitar apresentar simulações como informações oficiais.
- Reforçar sessão demonstrativa e proteção por perfil sem transformar botões de login social em ações falsas.
- Completar estados de carregamento, vazio, conexão, formulário e erro com opção de recuperação.
- Revisar notificações, chat, busca global, filtros, banners, relatórios e auditoria para que todas as ações visíveis tenham efeito.

## 6. Validação final
- Validar compilação e erros de execução.
- Executar os quatro fluxos ponta a ponta descritos no documento.
- Conferir responsividade em celular, tablet, notebook e desktop, incluindo mapa e navegação inferior.
- Testar tema escuro, teclado, foco, labels, popups, filtros, favoritos, notificações, 404, permissões e links.
- Corrigir qualquer falha encontrada antes de concluir.

## Detalhes técnicos
- TanStack Start e componentes existentes serão preservados.
- O mapa será carregado apenas no navegador para manter a renderização inicial estável.
- OpenStreetMap será a opção funcional padrão; Google Maps ficará preparado e condicionado à configuração segura de chave.
- Os identificadores internos podem permanecer para relacionamentos e estado, mas não serão usados como títulos visuais de rota.
- Não será criado banco novo nesta etapa porque o projeto atual não possui Lovable Cloud conectado; a camada de dados continuará pronta para migração futura.
