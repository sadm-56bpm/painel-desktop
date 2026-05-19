@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM  Deploy GitHub Pages · SADM 56 BPM · Painel Desktop
REM  Onda 29 · 2026-05-19
REM  ═══════════════════════════════════════════════════════════════════════════
REM
REM  PRE-REQUISITOS:
REM  1. Git instalado (git-scm.com)
REM  2. GitHub CLI instalado e logado (gh auth status)
REM
REM  RESULTADO ESPERADO:
REM  URL canonica: https://sadm-56bpm.github.io/painel-desktop/
REM
REM  ═══════════════════════════════════════════════════════════════════════════

cd /d "C:\Users\filli\Desktop\SADM - 56 BPM\_PUBLICACAO_GH_PAGES_DESKTOP"

echo.
echo ═══════════════════════════════════════════════════════════════
echo   SADM 56 BPM · Deploy GitHub Pages · DESKTOP
echo ═══════════════════════════════════════════════════════════════
echo.
echo Diretorio: %CD%
echo.

REM Verificar git
where git >nul 2>nul
if errorlevel 1 (
  echo [ERRO] git nao encontrado. Instale Git for Windows.
  pause
  exit /b 1
)

REM Verificar gh CLI
where gh >nul 2>nul
set HAS_GH=0
if not errorlevel 1 set HAS_GH=1

REM Inicializar repo se necessario
if not exist ".git\config" (
  echo [INFO] Inicializando repositorio git...
  git init -b main
  git config user.email "sadm.56bpm@gmail.com"
  git config user.name "SADM 56 BPM"
)

REM Criar repo GitHub publico
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  if "%HAS_GH%"=="1" (
    echo.
    echo [INFO] Criando repositorio publico GitHub via gh CLI...
    gh repo create sadm-56bpm/painel-desktop --public --source=. --remote=origin --description "Painel Institucional SADM 56 BPM Desktop · 16:9 · sidebar premium · cloud-first Workspace PMMG"
    if errorlevel 1 (
      echo [AVISO] Falhou criar via gh. Configurando remote manualmente.
      git remote add origin https://github.com/sadm-56bpm/painel-desktop.git
    )
  ) else (
    echo.
    echo [AVISO] gh CLI nao instalado. Crie manualmente em https://github.com/new
    echo        Nome: painel-desktop
    echo        Owner: sadm-56bpm
    echo        Publico: SIM
    echo.
    set /p ANSWER="Repo criado? Pressione Enter para configurar remote... "
    git remote add origin https://github.com/sadm-56bpm/painel-desktop.git
  )
)

REM Adicionar arquivos
echo.
echo --- adicionando arquivos ---
git add -A
git diff --cached --stat

REM Commit
echo.
echo --- commit ---
git commit -m "feat: deploy inicial painel desktop · onda 29 · 5 paineis 16:9 + tokens.css canonico + cross-link mobile"

REM Push
echo.
echo --- push origin main ---
git push -u origin main

if errorlevel 1 (
  echo.
  echo [ERRO] Push falhou. Verifique credenciais GitHub:
  echo        - PAT: https://github.com/settings/tokens
  echo        - Ou: gh auth login
  pause
  exit /b 1
)

REM Ativar GitHub Pages se gh disponivel
if "%HAS_GH%"=="1" (
  echo.
  echo --- ativando GitHub Pages ---
  gh api -X POST repos/sadm-56bpm/painel-desktop/pages -f source[branch]=main -f source[path]=/ 2>nul
  if errorlevel 1 (
    echo [AVISO] Ativacao via API falhou. Ative manualmente:
    echo        https://github.com/sadm-56bpm/painel-desktop/settings/pages
  ) else (
    echo [OK] GitHub Pages ativado.
  )
) else (
  echo.
  echo --- ATIVAR GITHUB PAGES MANUALMENTE ---
  echo 1. Abra: https://github.com/sadm-56bpm/painel-desktop/settings/pages
  echo 2. Source: Deploy from a branch
  echo 3. Branch: main · Folder: / ^(root^)
  echo 4. Save
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   DEPLOY DESKTOP CONCLUIDO
echo ═══════════════════════════════════════════════════════════════
echo.
echo URL canonica:
echo   https://sadm-56bpm.github.io/painel-desktop/
echo.
echo Paginas:
echo   /                            ^(Hub Desktop^)
echo   /apresentacao-desktop.html   ^(Apresentacao Executiva^)
echo   /tv-mural-desktop.html       ^(TV Mural fullscreen^)
echo   /gestao-desktop.html         ^(Gestao Estrategica^)
echo   /operacional-desktop.html    ^(Operacional Live^)
echo.
echo ═══════════════════════════════════════════════════════════════
pause
