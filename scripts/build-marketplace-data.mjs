// Convertit outilsia_final_enrichi.csv → lib/data/marketplace-tools.json (champs utiles only).
// Usage : node scripts/build-marketplace-data.mjs
import fs from "node:fs";
import path from "node:path";

const CSV_PATH = "C:/Users/Milid/Documents/outilsia_final_enrichi.csv";
const OUT_PATH = path.join(process.cwd(), "lib/data/marketplace-tools.json");

const raw = fs.readFileSync(CSV_PATH, "utf8").replace(/^﻿/, "");

// --- Parser CSV robuste (gère "", retours-ligne et virgules entre guillemets) ---
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* ignore */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCSV(raw);
const header = rows[0];
const idx = (name) => header.indexOf(name);

const iName = idx("name");
const iSlug = idx("slug");
const iDescShort = idx("desc_short");
const iUrl = idx("url");
const iFunctions = idx("functions");
const iUses = idx("uses");
const iPrice = idx("price");
const iJobs = idx("jobs");
const iPlatforms = idx("platforms");
const iTags = idx("tags");
const iScore = idx("score_global");

function arr(v) {
  if (!v) return [];
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

const tools = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length < header.length) continue;
  const name = (row[iName] || "").trim();
  if (!name) continue;
  tools.push({
    name,
    slug: (row[iSlug] || "").trim(),
    desc: (row[iDescShort] || "").trim(),
    url: (row[iUrl] || "").trim(),
    functions: arr(row[iFunctions]),
    uses: arr(row[iUses]).slice(0, 6),
    price: (row[iPrice] || "").trim(),
    jobs: arr(row[iJobs]).slice(0, 5),
    platforms: arr(row[iPlatforms]),
    tags: arr(row[iTags]).slice(0, 4),
    score: parseFloat(row[iScore]) || null,
  });
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(tools));

// Stats
const fns = new Set();
const prices = new Set();
tools.forEach((t) => { t.functions.forEach((f) => fns.add(f)); if (t.price) prices.add(t.price); });
console.log(`✓ ${tools.length} outils écrits → ${OUT_PATH}`);
console.log(`  Taille : ${(fs.statSync(OUT_PATH).size / 1024 / 1024).toFixed(2)} Mo`);
console.log(`  Fonctions (${fns.size}) :`, [...fns].sort().join(", "));
console.log(`  Prix :`, [...prices].sort().join(", "));
