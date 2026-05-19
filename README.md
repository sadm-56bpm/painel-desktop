# SADM 56º BPM · Painel Institucional Desktop

Versão desktop premium dos painéis canônicos da Seção Administrativa do 56º Batalhão de Polícia Militar · Itajubá · MG.

**Cloud-first · Workspace Polícia Militar · acesso público · 24/7 · 16:9 · sidebar fixa · grid 12 colunas**

## Resolução-alvo

- **Baseline:** 1920×1080 (FHD)
- **Suporte fluido:** 1366→2560 (QHD) via `clamp()` CSS
- **Container max:** 1440px centralizado
- **Sidebar:** 260px fixa (220px em <1280px)
- **Mobile fallback:** colapsa para 1 coluna em <1024px

## Páginas

- **[index.html](index.html)** · Hub Central · entrada padrão
- **[apresentacao-desktop.html](apresentacao-desktop.html)** · ★ Apresentação Executiva · 6 tabs
- **[tv-mural-desktop.html](tv-mural-desktop.html)** · TV Mural fullscreen · 7 painéis rotativos · auto 25s
- **[gestao-desktop.html](gestao-desktop.html)** · Gestão Estratégica · Compliance + AADP
- **[operacional-desktop.html](operacional-desktop.html)** · Operacional Live · countdowns + perf + aniv

## Cross-link Mobile ↔ Desktop

Cada painel desktop tem botão `📱 Versão mobile` que abre o painel equivalente em `https://sadm-56bpm.github.io/painel/<nome>-mobile.html`.
Os painéis mobile (repo separado) recebem botão recíproco `🖥 Versão desktop`.

## Stack

- HTML5 · CSS3 · JavaScript vanilla
- **tokens.css** · sistema de design canônico extraído (variáveis CSS · compartilhável)
- IBM Plex Sans / Mono / Serif (Google Fonts)
- Zero dependências externas pesadas
- Acessível sem login

## Conformidade institucional

- **DA-027** · cloud-first
- **DA-049** · GitHub é stack canônica (versionado + auditável)
- **DA-052** · publicação institucional autorizada
- **DA-055** · arquitetura 3 planos (Dados / Inteligência / Interface)
- **DA-066** · arquivos sanitizados (zero Claude/Anthropic em conteúdo público)
- **DA-071** · GitHub Pages canônico (expandido para Desktop · Onda 29)

## Custo

R$ 0,00 · GitHub Pages é gratuito para repos públicos.

---

Cap. Fillipe Caldeira · Chefia SADM · 56º BPM · 17ª RPM · PMMG

Onda 29 · 2026-05-19
