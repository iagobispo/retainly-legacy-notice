/**
 * Servidor HTTP mínimo para ficheiros estáticos na raiz.
 * Usado pelo Railpack / Railway / Dokploy quando o projeto tem package.json (detecção Node).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.toml': 'text/plain; charset=utf-8',
};

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const rel = decoded === '/' ? '/index.html' : decoded;
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return null;
  return file;
}

function send(res, code, body, contentType) {
  res.writeHead(code, { 'Content-Type': contentType || 'text/plain; charset=utf-8' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    return res.end();
  }

  const filePath = safeJoin(ROOT, req.url || '/');
  if (!filePath) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (!err && st.isFile()) {
      return fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          send(res, 500, 'Erro ao ler ficheiro', 'text/plain; charset=utf-8');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const type = MIME[ext] || 'application/octet-stream';
        send(res, 200, data, type);
      });
    }

    // Fallback: SPA / rotas desconhecidas → index.html
    const indexPath = path.join(ROOT, 'index.html');
    fs.readFile(indexPath, (e2, html) => {
      if (e2) {
        send(res, 404, 'Not found', 'text/plain; charset=utf-8');
        return;
      }
      send(res, 200, html, 'text/html; charset=utf-8');
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[retainly-legacy-notice] static ${ROOT} → http://0.0.0.0:${PORT}`);
});
