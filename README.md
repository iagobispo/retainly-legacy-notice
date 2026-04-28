# Retainly — aviso para utilizadores da base antiga

Site estático mínimo para quem ainda acede ao domínio ou URL da **versão antiga** da Retainly: explica a mudança e direciona para **https://retainly.com.br/**.

## Conteúdo

- `index.html` — mensagem em português, destaque da marca e redirecionamento automático (apenas no modo normal).
- `runtime-config.js` — define se a página está em **manutenção** (`maintenance: true/false`). O ficheiro é **gerado** pelo script de build a partir da variável de ambiente (ver abaixo).

Para alterar o destino ou o tempo do redirect no modo normal, edite o URL e a variável `seconds` no `<script>` no final de `index.html`.

## Modo manutenção

Quando `maintenance` está **ativo**, o visitante vê um ecrã amigável (sem countdown nem redirect automático), com a mesma identidade visual Retainly.

### Com variável de ambiente (recomendado em CI / Netlify / Vercel)

1. Defina no painel do host ou no CI: `MAINTENANCE=true` (ou `RETAINLY_MAINTENANCE=true`). Valores aceites: `true`, `1`, `yes`, `on` (case-insensitive).
2. Na **raiz deste repositório**, no build do deploy, execute:

```bash
npm install   # opcional: não há dependências npm; só precisa de Node 18+
npm run build
```

Isto regera `runtime-config.js` com `maintenance: true` antes de publicar os ficheiros.

### Sem pipeline (só GitHub Pages sem build)

Edite **à mão** o ficheiro `runtime-config.js` na raiz:

```js
window.__RETAINLY_LEGACY__ = { maintenance: true };
```

Faça commit e push quando quiser ativar; volte a `false` quando terminar.

### Localmente com `.env`

Copie `env.example` para `.env`, defina `MAINTENANCE=true`, depois:

```bash
npm run build
```

O script lê `.env` automaticamente (sem pacote `dotenv`). O ficheiro `.env` está no `.gitignore`.

## Publicar

### Opção A — Qualquer hospedagem de ficheiros estáticos

Faça deploy da pasta com `index.html`, `runtime-config.js` e o restante na raiz do site.

**Netlify (exemplo):** Build command: `npm run build`; Publish directory: `/` (raiz do repo).

### Railpack / Railway / Dokploy (detecção Node)

Se o builder usar **Railpack** e aparecer *“No start command detected”*: este repositório inclui `package.json` com **`npm run start`** → `node server.cjs`, um servidor estático mínimo (sem dependências npm extra). Defina **Build**: `npm run build` (gera `runtime-config.js`) e deixe o **Start** por omissão. A variável **`PORT`** é lida automaticamente.

Alternativa sem servidor Node: crie um ficheiro **`Staticfile`** na raiz (ver [Railpack — static](https://railpack.com/languages/staticfile/)) e/ou `RAILPACK_STATIC_FILE_ROOT=.` / `RAILPACK_SPA_OUTPUT_DIR=.` nas variáveis do host, conforme a documentação do teu painel.

### Opção B — Redirecionamento imediato (301) sem mostrar a página

Se preferir que **todo** o tráfego vá direto para o novo domínio (sem passar pelo HTML):

- **Netlify:** copie `netlify.redirect.example.toml` para `netlify.toml`.
- **Vercel:** copie `vercel.redirect.example.json` para `vercel.json`.

Nessa configuração o visitante recebe redirecionamento HTTP e pode nem ver a página de aviso (nem manutenção).

## Repositório

```bash
cd retainly-legacy-notice
git add .
git commit -m "..."
git push
```

Ligue o repositório ao remoto (GitHub/GitLab) e configure o domínio antigo no painel do seu provedor de hospedagem.
