# Retainly — aviso para utilizadores da base antiga

Site estático mínimo para quem ainda acede ao domínio ou URL da **versão antiga** da Retainly: explica a mudança e direciona para **https://retainly.com.br/**.

## Conteúdo

- `index.html` — mensagem em português, link destacado e redirecionamento automático (~12 s).

Para alterar o destino ou o tempo, edite o URL e os valores em `index.html` (meta refresh, variável `url` / `seconds` no script).

## Publicar

### Opção A — Qualquer hospedagem de ficheiros estáticos

Faça deploy da pasta inteira com `index.html` na raiz do site (GitHub Pages, Cloudflare Pages, S3+CloudFront, etc.).

### Opção B — Redirecionamento imediato (301) sem mostrar a página

Se preferir que **todo** o tráfego vá direto para o novo domínio (sem passar pelo HTML):

- **Netlify:** copie `netlify.redirect.example.toml` para `netlify.toml`.
- **Vercel:** copie `vercel.redirect.example.json` para `vercel.json`.

Nessa configuração o visitante recebe redirecionamento HTTP e pode nem ver a página de aviso.

## Repositório

```bash
cd retainly-legacy-notice
git init
git add .
git commit -m "Página de transição para retainly.com.br"
```

Ligue o repositório ao remoto (GitHub/GitLab) e configure o domínio antigo no painel do seu provedor de hospedagem.
