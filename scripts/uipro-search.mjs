/**
 * Node fallback for the UI/UX Pro Max skill search.
 *
 * The skill ships `scripts/search.py` (Python). Python is not available in
 * every environment, so this script queries the very same CSV data files in
 * `.claude/skills/ui-ux-pro-max/data/` using Node instead.
 *
 *   node scripts/uipro-search.mjs "keyboard focus" --domain ux
 *   node scripts/uipro-search.mjs "photography portfolio" --domain style
 *   node scripts/uipro-search.mjs "bundle splitting" --stack react
 *
 * Domains: ux | style | color | typography | motion | react | product
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA = path.join(process.cwd(), '.claude', 'skills', 'ui-ux-pro-max', 'data');

const FILES = {
  ux: 'ux-guidelines.csv',
  style: 'styles.csv',
  color: 'colors.csv',
  typography: 'typography.csv',
  motion: 'motion.csv',
  react: 'react-performance.csv',
  product: 'products.csv',
  icons: 'icons.csv',
  app: 'app-interface.csv'
};

const parseCsv = (file) => {
  const text = fs.readFileSync(file, 'utf8');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((cells) => cells.length > 1)
    .map((cells) => Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()])));
};

const args = process.argv.slice(2);
const query = args[0] || '';
const domainArg = args.indexOf('--domain') !== -1 ? args[args.indexOf('--domain') + 1] : null;
const stackArg = args.indexOf('--stack') !== -1 ? args[args.indexOf('--stack') + 1] : null;
const limit = args.indexOf('--limit') !== -1 ? Number(args[args.indexOf('--limit') + 1]) : 3;

let file = null;
let label = '';
if (stackArg) {
  file = path.join(DATA, 'stacks', `${stackArg}.csv`);
  label = `stack:${stackArg}`;
} else {
  const key = domainArg || 'ux';
  file = path.join(DATA, FILES[key] || FILES.ux);
  label = `domain:${key}`;
}

if (!fs.existsSync(file)) {
  console.log(`no data file for ${label} (${file})`);
  process.exit(0);
}

const rows = parseCsv(file);
const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

const scored = rows
  .map((row) => {
    const haystack = Object.values(row).join(' ').toLowerCase();
    const hits = terms.filter((term) => haystack.includes(term)).length;
    return { row, hits };
  })
  .filter((entry) => entry.hits > 0)
  .sort((a, b) => b.hits - a.hits)
  .slice(0, limit);

console.log(`\n[ui-ux-pro-max] "${query}" ${label}  (${scored.length} match(es) of ${rows.length})`);

if (scored.length === 0) {
  console.log('no match — fall back to the priority table in SKILL.md');
}

for (const { row } of scored) {
  console.log('\n' + '-'.repeat(70));
  for (const [k, v] of Object.entries(row)) {
    if (!v || k === 'No') continue;
    const value = v.length > 320 ? `${v.slice(0, 320)}…` : v;
    console.log(`${k}: ${value}`);
  }
}
console.log();
