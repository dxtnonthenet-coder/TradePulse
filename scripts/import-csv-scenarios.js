const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const scenariosDir = path.join(root, "data", "scenarios");
const indexPath = path.join(scenariosDir, "index.json");

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function candleFromRow(headers, row) {
  const lookup = Object.fromEntries(headers.map((header, index) => [header, row[index]]));
  const time = lookup.time || lookup.timestamp || lookup.datetime || lookup.date || lookup.t;
  const open = Number(lookup.open || lookup.o);
  const high = Number(lookup.high || lookup.h);
  const low = Number(lookup.low || lookup.l);
  const close = Number(lookup.close || lookup.c);
  const volume = Number(lookup.volume || lookup.vol || lookup.v || 0);
  if (!time || !Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close)) return null;
  return { time, open, high, low, close, volume: Number.isFinite(volume) ? volume : 0 };
}

function answerForMove(anchor, future) {
  const move = future.close - anchor.close;
  const range = Math.max(0.01, anchor.high - anchor.low);
  if (move > range * 0.45) return "Long";
  if (move < -range * 0.45) return "Short";
  return "Flat";
}

function difficultyForMove(anchor, future) {
  const move = Math.abs(future.close - anchor.close);
  const range = Math.max(0.01, anchor.high - anchor.low);
  if (move > range * 1.2) return "Easy";
  if (move > range * 0.65) return "Medium";
  return "Hard";
}

function scenarioFromWindow(candles, market, timeframe, offset, number) {
  const visible = candles.slice(offset, offset + 45);
  const future = candles.slice(offset + 45, offset + 65);
  const anchor = visible[visible.length - 1];
  const outcome = future[future.length - 1];
  const correctAnswer = answerForMove(anchor, outcome);
  const difficulty = difficultyForMove(anchor, outcome);
  const direction = correctAnswer === "Long" ? "upside continuation" : correctAnswer === "Short" ? "downside rotation" : "range compression";
  return {
    id: `${market.toLowerCase()}-${timeframe}-real-${String(number).padStart(4, "0")}`,
    scenarioCode: `REAL ${number}`,
    title: `${market} Blind Replay ${number}`,
    market,
    date: String(anchor.time),
    time: String(anchor.time),
    session: "Historical replay",
    difficulty,
    pattern: "Blind Historical Replay",
    bias: correctAnswer === "Flat" ? "chop" : "breakout",
    tags: ["Historical", "Blind Replay", timeframe],
    question: "What is the highest probability read from this hidden-date market moment?",
    answers: ["Long", "Short", "Flat"],
    correctAnswer,
    context: "Real exported OHLC data. Date and narrative are hidden so the read comes from price action only.",
    explanation: `Price resolved into ${direction} after the hidden candles revealed. The goal is to train decision quality from structure, not hindsight labels.`,
    timeframes: {
      [timeframe]: {
        visible,
        future
      }
    },
    source: "Imported CSV OHLC export"
  };
}

function loadIndex() {
  if (!fs.existsSync(indexPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch {
    return [];
  }
}

function main() {
  const [, , csvPath, marketArg = "NQ", timeframeArg = "1m"] = process.argv;
  if (!csvPath) {
    console.error("Usage: node scripts/import-csv-scenarios.js data/raw/NQ_1m.csv NQ 1m");
    process.exit(1);
  }
  const market = marketArg.toUpperCase();
  const timeframe = timeframeArg;
  const rows = parseCsv(fs.readFileSync(path.resolve(csvPath), "utf8"));
  const headers = rows.shift().map(normalizeHeader);
  const candles = rows.map((row) => candleFromRow(headers, row)).filter(Boolean);
  if (candles.length < 80) {
    console.error("CSV needs at least 80 valid candles with time, open, high, low, close columns.");
    process.exit(1);
  }
  fs.mkdirSync(scenariosDir, { recursive: true });
  const index = loadIndex();
  const created = [];
  for (let offset = 0; offset + 65 < candles.length; offset += 25) {
    const number = index.length + created.length + 1;
    const scenario = scenarioFromWindow(candles, market, timeframe, offset, number);
    const file = `${scenario.id}.json`;
    fs.writeFileSync(path.join(scenariosDir, file), JSON.stringify(scenario, null, 2));
    created.push({ id: scenario.id, file, market, timeframe, source: "csv-import" });
  }
  const existingIds = new Set(index.map((item) => item.id));
  const merged = [...index, ...created.filter((item) => !existingIds.has(item.id))];
  fs.writeFileSync(indexPath, JSON.stringify(merged, null, 2));
  console.log(`Imported ${created.length} scenarios from ${candles.length} candles.`);
}

main();
