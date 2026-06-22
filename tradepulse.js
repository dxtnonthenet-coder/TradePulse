const fs = require("fs");
const path = require("path");
const readline = require("readline");

const appPath = path.join(__dirname, "app.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const clean = answer.trim();
      if (clean.toLowerCase() === "cancel") {
        console.log("\nCanceled. Nothing was added.");
        rl.close();
        process.exit(0);
      }
      resolve(clean);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function escapeJs(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function scenarioCode(scenario) {
  const tags = scenario.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const answers = [scenario.answerA, scenario.answerB, scenario.answerC, scenario.answerD];
  const correctAnswer = answers[Number(scenario.correct) - 1] || scenario.answerA;
  const seed = Math.floor(Math.random() * 900) + 100;
  const id = `${slugify(scenario.market)}-${slugify(scenario.title)}-${seed}`;
  const biasMap = {
    "1": "reversal",
    "2": "continuation",
    "3": "breakout",
    "4": "chop"
  };

  return `  {
    id: "${escapeJs(id)}",
    title: "${escapeJs(scenario.title)}",
    scenarioCode: "Scenario ${seed}",
    market: "${escapeJs(scenario.market)}",
    time: "${escapeJs(scenario.time)}",
    difficulty: "${escapeJs(scenario.difficulty)}",
    tags: [${tags.map((tag) => `"${escapeJs(tag)}"`).join(", ")}],
    question: "${escapeJs(scenario.question)}",
    context:
      "${escapeJs(scenario.context)}",
    answers: [${answers.map((answer) => `"${escapeJs(answer)}"`).join(", ")}],
    correctAnswer: "${escapeJs(correctAnswer)}",
    explanation:
      "${escapeJs(scenario.explanation)}",
    pattern: "${escapeJs(tags[0] || "Pattern Recognition")}",
    seed: ${seed},
    bias: "${biasMap[scenario.bias] || "reversal"}"
  }`;
}

function insertScenario(code) {
  const app = fs.readFileSync(appPath, "utf8");
  const marker = "const scenarios = [";
  const markerIndex = app.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("Could not find the scenario list in app.js.");
  }

  const insertIndex = markerIndex + marker.length;
  const updated = `${app.slice(0, insertIndex)}\n${code},${app.slice(insertIndex)}`;
  fs.writeFileSync(appPath, updated);
}

async function addScenario() {
  console.log("\nTradePulse Scenario Builder");
  console.log("Answer each question. I will add it to the website for you.\n");
  console.log("If you make a mistake, type CANCEL and press Enter.\n");

  const scenario = {};
  scenario.market = await ask("Market, example NQ or ES: ");
  scenario.title = await ask("Scenario title: ");
  scenario.time = await ask("Date/time, example Jun 14, 2024 · 9:45 AM: ");
  scenario.difficulty = await ask("Difficulty, example Easy, Medium, Hard: ");
  scenario.tags = await ask("Tags separated by commas, example VWAP, Liquidity Sweep, Opening Range: ");
  scenario.context = await ask("Context shown before the question: ");
  scenario.question = await ask("Question: ");
  scenario.answerA = await ask("Answer A: ");
  scenario.answerB = await ask("Answer B: ");
  scenario.answerC = await ask("Answer C: ");
  scenario.answerD = await ask("Answer D: ");
  scenario.correct = await ask("Which answer is correct? Type 1, 2, 3, or 4: ");
  scenario.explanation = await ask("Explanation after reveal: ");
  scenario.bias = await ask("Chart result type: 1 reversal, 2 continuation, 3 breakout, 4 chop: ");

  console.log("\nCheck this before saving:\n");
  console.log(`Market: ${scenario.market}`);
  console.log(`Title: ${scenario.title}`);
  console.log(`Time: ${scenario.time}`);
  console.log(`Difficulty: ${scenario.difficulty}`);
  console.log(`Question: ${scenario.question}`);
  console.log(`Correct answer number: ${scenario.correct}`);
  console.log("");

  const confirm = await ask("Save this scenario? Type YES to save, or CANCEL to stop: ");

  if (confirm.toLowerCase() !== "yes") {
    rl.close();
    console.log("\nNot saved. Run the add command again when ready.");
    return;
  }

  insertScenario(scenarioCode(scenario));
  rl.close();

  console.log("\nDone. Your scenario was added.");
  console.log("Refresh http://localhost:4173 in Chrome.");
}

function listScenarios() {
  const app = fs.readFileSync(appPath, "utf8");
  const start = app.indexOf("const scenarios = [");
  const end = app.indexOf("];", start);
  const scenarioBlock = app.slice(start, end);
  const matches = [...scenarioBlock.matchAll(/title: "([^"]+)"/g)].map((match) => match[1]);

  console.log("\nTradePulse scenarios:\n");
  matches.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  console.log("");
  rl.close();
}

async function main() {
  const command = process.argv[2];

  if (command === "add") {
    await addScenario();
    return;
  }

  if (command === "list") {
    listScenarios();
    return;
  }

  console.log("\nUse one of these commands:\n");
  console.log("node tradepulse.js add");
  console.log("node tradepulse.js list\n");
  rl.close();
}

main().catch((error) => {
  rl.close();
  console.error("\nSomething went wrong:");
  console.error(error.message);
  process.exit(1);
});
