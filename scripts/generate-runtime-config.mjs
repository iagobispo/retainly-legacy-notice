/**
 * Gera `runtime-config.js` na raiz do projeto a partir de variáveis de ambiente.
 * Usar no deploy (ex.: Netlify/Vercel) com Build command: `npm run build`
 *
 * MAINTENANCE ou RETAINLY_MAINTENANCE: true | 1 | yes | on (case-insensitive) → manutenção ativa
 * Se existir `.env` na raiz, lê MAINTENANCE / RETAINLY_MAINTENANCE (sem dependência dotenv).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const out = path.join(root, 'runtime-config.js');

function loadEnvFile() {
  const p = path.join(root, '.env');
  if (!fs.existsSync(p)) return;
  const text = fs.readFileSync(p, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(
      /^(?:export\s+)?(MAINTENANCE|RETAINLY_MAINTENANCE)\s*=\s*(.*)$/,
    );
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile();

const raw = process.env.MAINTENANCE ?? process.env.RETAINLY_MAINTENANCE ?? '';
const maintenance = ['1', 'true', 'yes', 'on'].includes(String(raw).trim().toLowerCase());

const body = `/* Gerado em build — ver MAINTENANCE no .env ou no painel do host. */
window.__RETAINLY_LEGACY__ = ${JSON.stringify({ maintenance })};\n`;

fs.writeFileSync(out, body, 'utf8');
console.log(
  maintenance
    ? '[retainly-legacy-notice] runtime-config.js → maintenance: true'
    : '[retainly-legacy-notice] runtime-config.js → maintenance: false',
);
