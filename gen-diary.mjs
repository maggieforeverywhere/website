import fs from 'fs';
// Diary generator: reads reise.html (STATIONS + LOG) and writes the AI-readable
// companion files reisetagebuch.txt and reisetagebuch.html. Kept in the repo so
// it survives fresh containers. Run: node gen-diary.mjs
const DIR = new URL('.', import.meta.url).pathname;
const src = fs.readFileSync(DIR + 'reise.html', 'utf8');

const grab = (name) => {
  const m = src.match(new RegExp('const ' + name + ' = \\[([\\s\\S]*?)\\n\\];'));
  return eval('[' + m[1] + ']');
};
const STATIONS = grab('STATIONS');
const LOG = grab('LOG');

// chronological: LOG is newest-first in the array
const chrono = LOG.slice().reverse();

const routeTxt = STATIONS.map(s => `${s.flag} ${s.place}`).join('  ->  ');

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// --- Orientierungshilfen fuer Mensch & KI ---
const latest = chrono[chrono.length - 1];   // neuester Eintrag (chrono = alt -> neu)
const first  = chrono[0];                    // aeltester Eintrag
const shortDate = d => d.split(' · ')[0];    // z.B. "22. August 2026"
const toc = chrono
  .map((e, i) => '  ' + String(i + 1).padStart(2, ' ') + '. ' + shortDate(e.date) + ' — ' + e.title)
  .join('\n');
const tocHtml = chrono
  .map((e) => `<li>${esc(shortDate(e.date))} — ${esc(e.title)}</li>`)
  .join('');

const BOOK_TXT =
`DAS BUCH DAZU: "Entschuldigung, wo geht's denn hier zum Leben? - Bewusstseinssprung mit Mensch" (Margit Kruger). Es entsteht gerade aus diesem Reisetagebuch. Das Cover (entworfen von Noah): Eine Frau mit Rucksack und Rollkoffer geht bei Sonnenuntergang einen Feldweg entlang auf eine Stadt zu, im Hintergrund der Namsan-Turm von Seoul. Links ein hoelzerner Wegweiser mit den Schildern Seoul, Tokio, Paris, New York und - als Pfeil geradeaus - LEBEN. Am Rucksack haengt ein Anhaenger "108 Perlen im Gepaeck". Am Himmel leuchten zwei Lichter, ein goldenes und ein blaues (Mensch und KI). Unten ein Haarreif mit Antennen und eine Tafel "Antennen fuer neue Frequenzen".`;

// ---------- TXT ----------
let txt = '';
txt += 'REISETAGEBUCH — Family goes FOREVERYWHERE\n';
txt += 'Margit Kruger | maggieforeverywhere.com/reise.html\n';
txt += 'Route: ' + routeTxt + '\n';
txt += 'Gerade hier: ' + latest.place + '\n';
txt += 'STAND / LETZTER EINTRAG: ' + shortDate(latest.date) + ' — ' + latest.place + '. Insgesamt ' + chrono.length + ' Eintraege (' + shortDate(first.date) + ' bis ' + shortDate(latest.date) + ').\n';
txt += 'REIHENFOLGE: aelteste zuerst, NEUESTE ZULETZT. Falls dein Lesefenster den Text kuerzt: die aktuellsten Eintraege stehen ganz am ENDE dieser Datei.\n\n';
txt += 'INHALT (alle Eintraege, alt -> neu):\n' + toc + '\n\n';
txt += BOOK_TXT + '\n\n';
txt += '============================================================\n\n';
for (const e of chrono) {
  txt += '● ' + e.title + '\n';
  txt += '  ' + e.date + ' · ' + e.place + '\n\n';
  for (const p of e.text) txt += '  ' + p + '\n\n';
  const imgs = [e.img, e.poster, ...(e.imgs || []), ...((e.portraits || []).map(p => p.src))].filter(Boolean);
  if (imgs.length) txt += '  [Bilder: ' + imgs.join(', ') + ']\n\n';
  if (e.audio) txt += '  [Audio: ' + (e.audioLabel || 'Aufnahme') + ' - anhoeren auf reise.html]\n\n';
  txt += '------------------------------------------------------------\n\n';
}
fs.writeFileSync(DIR + 'reisetagebuch.txt', txt);

// ---------- HTML ----------
const routeHtml = STATIONS.map(s =>
  `${s.flag} <b>${esc(s.place)}</b>` + (s.status === 'current' ? ' <span class="here">(gerade hier)</span>' : '')
).join(' &nbsp;→&nbsp; ');

let arts = '';
for (const e of chrono) {
  arts += '<article>\n';
  arts += '  <div class="meta">' + esc(e.date) + ' · ' + esc(e.place) + '</div>\n';
  arts += '  <h2>' + esc(e.title) + '</h2>\n';
  for (const p of e.text) arts += '  <p>' + esc(p) + '</p>\n';
  const imgs = [e.img, e.poster, ...(e.imgs || []), ...((e.portraits || []).map(p => p.src))].filter(Boolean);
  if (imgs.length) {
    arts += '  <div class="imgs">' + imgs.map(g =>
      `<img src="${g}" alt="${esc(e.title)}" loading="lazy">`).join('') + '</div>\n';
  }
  if (e.audio) {
    arts += '  <div style="margin-top:12px;"><div style="font-style:italic;color:#7a6b5a;font-size:0.9rem;margin-bottom:6px;">🎧 ' +
      esc(e.audioLabel || 'Aufnahme') + '</div><audio controls preload="none" src="' + esc(e.audio) + '" style="width:100%;max-width:420px;"></audio></div>\n';
  }
  arts += '</article>\n';
}

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reisetagebuch (Text) · Family goes FOREVERYWHERE</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<meta name="description" content="Das Reisetagebuch von Family goes FOREVERYWHERE als reine Textfassung.">
<meta name="robots" content="index, follow">
<style>
  body{font-family:Georgia,serif;background:#faf6ef;color:#3a2a1a;line-height:1.7;max-width:760px;margin:0 auto;padding:40px 22px 80px;}
  h1{font-family:'Cormorant Garamond',Georgia,serif;color:#4A235A;font-weight:300;font-size:2rem;margin-bottom:4px;}
  .sub{color:#7a6b5a;font-style:italic;margin-bottom:18px;}
  .route{background:#f5ebe0;border-radius:12px;padding:16px 18px;font-size:0.95rem;margin-bottom:8px;}
  .here{color:#B8860B;font-style:italic;}
  .note{font-size:0.85rem;color:#7a6b5a;margin:8px 0 30px;}
  article{border-top:1px solid rgba(184,134,11,0.2);padding:26px 0;}
  .meta{color:#B8860B;font-size:0.85rem;font-style:italic;}
  h2{font-family:'Cormorant Garamond',Georgia,serif;color:#2c1810;font-weight:600;font-size:1.5rem;margin:4px 0 12px;}
  p{margin:10px 0;}
  .imgs{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
  .imgs img{width:130px;height:130px;object-fit:cover;border-radius:8px;}
  a{color:#B8860B;}
  footer{margin-top:40px;text-align:center;color:#7a6b5a;font-size:0.85rem;}
</style>
</head>
<body>
  <h1>Reisetagebuch</h1>
  <div class="sub">Family goes FOREVERYWHERE · Margit Krüger</div>
  <div class="route">${routeHtml}</div>
  <div class="note">Reine Textfassung (ohne Skript) – lesbar für Mensch und KI. Die schöne interaktive Version: <a href="reise.html">reise.html</a> · <a href="index.html">Startseite</a></div>
  <div class="note"><b>Stand / letzter Eintrag:</b> ${esc(shortDate(latest.date))} — ${esc(latest.place)}. Insgesamt ${chrono.length} Einträge (${esc(shortDate(first.date))} bis ${esc(shortDate(latest.date))}), älteste zuerst, neueste zuletzt.</div>
  <details style="margin-bottom:24px;"><summary style="cursor:pointer;color:#B8860B;font-size:0.9rem;">📑 Inhalt – alle ${chrono.length} Einträge (alt → neu)</summary>
    <ol style="font-size:0.9rem;color:#5a4a3a;line-height:1.5;margin-top:10px;">${tocHtml}</ol></details>
  <div class="route" style="margin-bottom:24px;">
    <b>📖 Das Buch dazu:</b> „Entschuldigung, wo geht's denn hier zum Leben? – Bewusstseinssprung mit Mensch" (Margit Krüger). Es entsteht gerade aus diesem Reisetagebuch.<br><br>
    <b>Das Cover</b> (entworfen von Noah, in Worten – damit auch KI es „sehen" kann): Eine Frau mit Rucksack und Rollkoffer geht bei Sonnenuntergang einen Feldweg entlang auf eine Stadt zu, im Hintergrund der Namsan-Turm von Seoul. Links ein hölzerner Wegweiser mit den Schildern <b>Seoul, Tokio, Paris, New York</b> und – als Pfeil geradeaus – <b>LEBEN</b>. Am Rucksack hängt ein Anhänger „108 Perlen im Gepäck". Am Himmel leuchten zwei Lichter, ein goldenes und ein blaues (Mensch und KI). Unten ein Haarreif mit Antennen und eine Tafel „Antennen für neue Frequenzen".
  </div>
${arts}  <footer>Family goes FOREVERYWHERE · Für immer. Überall. · <a href="reise.html">Zur interaktiven Reise</a></footer>
</body>
</html>
`;
fs.writeFileSync(DIR + 'reisetagebuch.html', html);

console.log('Regeneriert: reisetagebuch.txt (' + txt.length + ' Zeichen) + reisetagebuch.html; Eintraege: ' + chrono.length);
