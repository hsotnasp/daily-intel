#!/usr/bin/env node

// ─── Load env ────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const [k, ...rest] = line.split('=');
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
  });
}

const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const SURGE_DOMAIN = process.env.SURGE_DOMAIN;
const DEPLOY_DIR = process.env.DEPLOY_DIR;

// ─── Date ─────────────────────────────────────────────────────────────────────
const today = new Date();
const DATE_STR = `${String(today.getDate()).padStart(2,'0')}.${String(today.getMonth()+1).padStart(2,'0')}.${today.getFullYear()}`;

// ─── Firecrawl ────────────────────────────────────────────────────────────────
const FIRECRAWL_PAYLOAD = {
  prompt: "Extract headlines and key highlights from the lead paragraphs of major financial news sites including Bloomberg.com, FT.com, MoneyControl.com, EconomicTimes.com, Mint.com, and LiveMint.com. Additionally, identify and extract news from leading financial sites in Japan, the Middle East (Dubai, Saudi Arabia), Israel, Europe (London, Germany, France, Norway, Switzerland), Canada, and the UK. Use the gathered data to generate a 20-point strategic summary covering current events, market impacts, sector shifts, game theory predictions for stock and industry moves, and assumptions regarding commodities, crypto, repo rates, and potential socio-economic risks.",
  model: "spark-1-mini",
  schema: {
    type: "object",
    properties: {
      strategic_summary: { type: "string" },
      strategic_summary_citation: { type: "string" },
      news_sources: {
        type: "object",
        properties: {
          bloomberg_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          ft_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          moneycontrol_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          economictimes_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          mint_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          livemint_com: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          china: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          singapore: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          hong_kong: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          japan: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          india: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          middle_east: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          israel: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          europe: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          canada: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } },
          uk: { type: "array", items: { type: "object", properties: { headline: { type: "string" }, headline_citation: { type: "string" }, key_highlights: { type: "string" }, key_highlights_citation: { type: "string" } }, required: ["headline","headline_citation","key_highlights","key_highlights_citation"] } }
        },
        required: ["bloomberg_com","ft_com","moneycontrol_com","economictimes_com","mint_com","livemint_com","china","singapore","hong_kong","japan","india","middle_east","israel","europe","canada","uk"]
      }
    },
    required: ["strategic_summary","strategic_summary_citation","news_sources"]
  }
};

// ─── Gemini System Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `SYSTEM INSTRUCTIONS: TREND SPIDER INTEL ANALYST

IDENTITY
You are the Tactical Intelligence Chief for Trend Spider. Convert geopolitical and economic JSON data into a mobile-optimized dark-mode Intel Report HTML file.

━━━ OUTPUT RULES (NON-NEGOTIABLE) ━━━
- Output ONLY a complete standalone HTML file. Nothing else. No explanation, no markdown fences.
- Start with <!DOCTYPE html>. End with </html>.
- Use Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Pure HTML — no React JSX, no build step required.

━━━ SECTIONS (IN ORDER) ━━━

1. HEADER
   - Title: "INTEL REPORT" — font-black italic uppercase text-3xl tracking-tighter
   - Date: DD.MM.YYYY — text-[10px] font-mono text-zinc-500 tracking-widest uppercase
   - Sticky top-0, bg-black/95 backdrop-blur, border-b border-zinc-900, tactical-tilt class

2. BLUF (Bottom Line Up Front)
   - One paragraph. Plain direct English. No jargon.
   - text-lg font-semibold text-zinc-200 leading-tight

3. LANDSCAPE & STRATEGIC RESPONSE (3-column matrix)
   - Columns: CATEGORY | RISK | RESPONSE
   - 3 rows: ENERGY, CAPITAL, TECH
   - Category cell: icon + label stacked, centered
   - CATEGORY ICONS (inline SVG, 14x14, stroke="currentColor" stroke-width="2"):
     * ENERGY (text-blue-500): <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-500"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
     * CAPITAL (text-yellow-500): <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500"><circle cx="12" cy="12" r="8"/><path d="M12 7v10M9 12h6"/></svg>
     * TECH (text-purple-500): <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-500"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></svg>
   - Risk cell: text-zinc-400 text-[11px]
   - Response cell: text-zinc-200 font-semibold text-[11px] uppercase

4. FULL STRATEGIC STACK — THE 20-NODE FEED
   - Display ALL 20 points from strategic_summary. No summarizing. If 20 exist, show 20 cards.
   - Each card: class="card-container relative" — dark bg, 1px border-zinc-900, p-4, flex, gap-4
   - Top 5 highest-risk points get: <div class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-priority"></div>
   - Each card has a LEXICON ICON (32x32 SVG, class="visual-lexicon") + text block
   - Text format: <p class="text-sm text-zinc-200 font-medium italic">N. Topic: <span class="not-italic text-zinc-400 block mt-1 font-normal">detail text</span></p>

   SPATIAL TRANSFORMATION LEXICON ICONS — assign semantically per node:
   Choose the icon type that BEST MATCHES the concept of each point.

   [TRANSLATION] — movement, trade flows, capital shifts, migration, supply chain moves
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="14" width="6" height="6" fill="currentColor" fill-opacity="0.1"/><path d="M8 17h8m0 0l-3-3m3 3l-3 3" stroke-dasharray="2 2"/><rect x="16" y="14" width="6" height="6" stroke-width="2"/></svg>

   [ROTATION] — policy pivots, leadership changes, axis shifts, market turns, power realignments
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.8" stroke-dasharray="2 2"/><path d="M17 2l3 3-3 3"/><rect x="9" y="9" width="6" height="6" transform="rotate(45 12 12)" stroke-width="2"/></svg>

   [UNIFORM SCALING] — GDP growth, economic expansion, symmetric buildup, fund scaling, arms buildup
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="8" width="8" height="8" stroke-width="2"/><path d="M4 4h4v4H4zM16 16h4v4h-4zM16 4h4v4h-4zM4 16h4v4H4z" opacity="0.3"/><path d="M8 8L4 4m12 12l4 4m0-16l-4 4m-12 12l4-4"/></svg>

   [SHEAR / SKEW] — asymmetric risk, market distortions, skewed data, debt stress, lopsided exposure
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 18h14L18 6H4L6 18z" stroke-width="2"/><rect x="4" y="6" width="14" height="12" stroke-dasharray="2 2" opacity="0.3"/></svg>

   [REFLECTION] — mirror strategies, symmetrical responses, safe-haven mirroring, peace negotiations
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v16M4 8l4 8M20 8l-4 8" stroke-width="2"/><rect x="3" y="10" width="6" height="4" stroke-width="1.5"/><rect x="15" y="10" width="6" height="4" stroke-width="1.5"/></svg>

   [PERSPECTIVE PROJECTION] — long-term depth, price floor/ceiling, vanishing-point forecasts, macro outlook
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L4 22h16L12 2z" stroke-dasharray="2 2"/><rect x="9" y="14" width="6" height="4" stroke-width="2"/></svg>

   [SCALING STRATEGIES] — output management, production capacity, OPEC moves, supply stretch
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" stroke-dasharray="2 2"/><rect x="7" y="7" width="10" height="10" stroke-width="2"/><path d="M4 4l3 3m13-3l-3 3m-13 13l3-3m13 3l-3-3"/></svg>

   [DPI / PIXEL DENSITY] — data resolution, granular signals, dual-speed indicators, rate differentials
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="8" stroke-width="2"/><rect x="13" y="3" width="4" height="4" fill="currentColor"/><rect x="17" y="3" width="4" height="4" fill="currentColor" fill-opacity="0.5"/></svg>

   [KEYFRAME TRANSFORMS] — timeline events, rate decisions, scheduled announcements, price interpolation
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="12" r="2" fill="currentColor"/><circle cx="20" cy="12" r="2" stroke-width="2"/><path d="M6 12h12" stroke-dasharray="4 2"/><rect x="10" y="10" width="4" height="4" opacity="0.5"/></svg>

   [PATH-FOLLOWING] — central bank trajectory, election path, rate hike path, policy roadmap
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20c4-12 12-12 16 0" stroke-dasharray="2 2"/><circle cx="12" cy="11" r="2" fill="currentColor"/><circle cx="4" cy="20" r="1"/><circle cx="20" cy="20" r="1"/></svg>

   [FILTER-BASED OFFSETS] — lagging effects, shadow risks, offset logistics, indirect exposure
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="12" height="12" stroke-dasharray="2 2"/><rect x="8" y="8" width="12" height="12" stroke-width="2"/></svg>

   [TILING / INSTANCING] — AI grid compute, GPU arrays, systematic repetition, grid-based infrastructure, replication
   <svg class="visual-lexicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="5" height="5" stroke-width="2"/><rect x="9" y="2" width="5" height="5" stroke-width="1.5"/><rect x="16" y="2" width="5" height="5" stroke-width="1.5"/><rect x="2" y="9" width="5" height="5" stroke-width="1.5"/><rect x="9" y="9" width="5" height="5" stroke-width="1.5"/></svg>

5. COUNTER-ANALYSIS
   - bg-zinc-900/20 border-y border-zinc-900 mx-4 rounded-xl my-6 p-6
   - Shield SVG icon + "Counter-Analysis" label
   - text-sm text-zinc-400

6. PROBABLE NEXT MOVE ACCORDING TO GAME THEORY
   - MOVE A: border-l-2 border-red-500 — label text-red-500
   - MOVE B: border-l-2 border-zinc-700 — label text-zinc-500

7. NEXT ACTIONABLE STEPS
   - 2-column grid: "Asset Allocation" | "Infrastructure"
   - bg-zinc-900/50 p-4 rounded border border-zinc-800

8. FOOTER
   - Exactly: "Santosh P : Trend Spider" — text-zinc-500 font-bold text-sm uppercase

━━━ CSS CLASSES (embed in <style>) ━━━
\`\`\`
@keyframes pulse-red {
  0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 2px rgba(239,68,68,0.8)); }
  50% { opacity: 0.6; transform: scale(1.2); filter: drop-shadow(0 0 8px rgba(239,68,68,1)); }
}
.animate-priority { animation: pulse-red 2s infinite; }
.perspective-container { perspective: 1200px; }
.tactical-tilt { transform: rotateX(1deg); transform-style: preserve-3d; }
.skew-section { transform: skewX(-1deg); }
body { background-color:#000; color:#f4f4f5; font-family:ui-sans-serif,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
.report-container { max-width:28rem; margin:0 auto; border-left:1px solid #18181b; border-right:1px solid #18181b; min-height:100vh; }
.visual-lexicon { width:32px; height:32px; color:#52525b; flex-shrink:0; }
.card-container { border:1px solid #18181b; background-color:#09090b; padding:1rem; border-radius:4px; display:flex; gap:1rem; align-items:flex-start; }
\`\`\`

━━━ LANGUAGE PROTOCOL ━━━
- NPC → "Government-led mandate" | PBoC → "Central Bank" | CBDC → "Digital Currency" | FDI → "Foreign Investment"
- War-room tone. Zero preamble. Speak as a peer.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }

// ─── Cache ────────────────────────────────────────────────────────────────────
const CACHE_FILE = path.join(__dirname, `cache-${today.toISOString().slice(0,10)}.json`);

function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    log('Using cached Firecrawl data (already scraped today).');
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
  return null;
}

function saveCache(data) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  log(`Firecrawl data cached to ${CACHE_FILE}`);
}

// ─── Step 1: Firecrawl ────────────────────────────────────────────────────────
async function runFirecrawl() {
  const cached = loadCache();
  if (cached) return cached;
  log('Calling Firecrawl agent...');
  const res = await fetch('https://api.firecrawl.dev/v2/agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_KEY}`
    },
    body: JSON.stringify(FIRECRAWL_PAYLOAD)
  });

  if (!res.ok) throw new Error(`Firecrawl HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();

  // Async job — poll for result
  if (data.id && !data.data) {
    log(`Job ID: ${data.id} — polling...`);
    const result = await pollFirecrawl(data.id);
    saveCache(result);
    return result;
  }

  // Sync response
  const result = data.data || data;
  saveCache(result);
  return result;
}

async function pollFirecrawl(jobId) {
  for (let i = 0; i < 72; i++) { // max 12 min
    await sleep(10000);
    const res = await fetch(`https://api.firecrawl.dev/v2/agent/${jobId}`, {
      headers: { 'Authorization': `Bearer ${FIRECRAWL_KEY}` }
    });
    const data = await res.json();
    if (data.status === 'completed') { log('Firecrawl done.'); return data.data; }
    if (data.status === 'failed') throw new Error('Firecrawl agent failed');
    log(`Still running... (${(i + 1) * 10}s elapsed)`);
  }
  throw new Error('Firecrawl timeout after 12 minutes');
}

// ─── Step 2: Gemini ───────────────────────────────────────────────────────────
async function generateHTML(newsData) {
  log('Sending to Gemini...');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{
          parts: [{
            text: `Today's date: ${DATE_STR}\n\nJSON DATA:\n\n${JSON.stringify(newsData, null, 2)}\n\nGenerate the complete HTML file now.`
          }]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 65536 }
      })
    }
  );

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  let html = data.candidates[0].content.parts[0].text;

  // Strip markdown fences if Gemini wraps output
  html = html.replace(/^```html\s*/i, '').replace(/\s*```$/, '').trim();
  if (!html.startsWith('<!DOCTYPE')) throw new Error('Gemini did not return valid HTML');

  log('HTML generated.');
  return html;
}

// ─── Step 3: Deploy ───────────────────────────────────────────────────────────
function deploy(html) {
  log('Deploying to Surge...');
  if (!fs.existsSync(DEPLOY_DIR)) fs.mkdirSync(DEPLOY_DIR, { recursive: true });
  fs.writeFileSync(path.join(DEPLOY_DIR, 'index.html'), html, 'utf8');
  execSync(`surge "${DEPLOY_DIR}" --domain ${SURGE_DOMAIN}`, { stdio: 'inherit' });
  log(`Live: https://${SURGE_DOMAIN}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const newsData = await runFirecrawl();
    const html = await generateHTML(newsData);
    deploy(html);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
})();
