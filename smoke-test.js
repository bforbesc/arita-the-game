const { chromium } = require("playwright");

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const gameUrl = "http://127.0.0.1:4173";

async function main() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });

  try {
    await page.goto(gameUrl, { waitUntil: "networkidle" });
    await page.screenshot({ path: "smoke-before.png", fullPage: true });

    await page.getByRole("button", { name: "Start round" }).click();
    await page.waitForTimeout(2300);

    const area = await page.locator("#gameArea").boundingBox();
    if (!area) {
      throw new Error("Game area bounding box not available");
    }

    const y = area.y + area.height - 60;
    const xPositions = [
      area.x + area.width * 0.15,
      area.x + area.width * 0.85,
      area.x + area.width * 0.35,
      area.x + area.width * 0.65,
      area.x + area.width * 0.5,
    ];

    for (let i = 0; i < 14; i += 1) {
      await page.mouse.move(xPositions[i % xPositions.length], y);
      await page.mouse.down();
      await page.mouse.move(xPositions[(i + 1) % xPositions.length], y, { steps: 4 });
      await page.mouse.up();
      await page.waitForTimeout(350);
    }

    await page.waitForTimeout(2500);
    await page.screenshot({ path: "smoke-after.png", fullPage: true });

    const result = await page.evaluate(() => {
      const score = Number(document.getElementById("score")?.textContent || "0");
      const mood = document.getElementById("mood")?.textContent || "";
      const message = document.getElementById("message")?.textContent || "";
      const buttonText = document.getElementById("startButton")?.textContent || "";
      const items = document.querySelectorAll(".falling-item").length;
      const countdownHidden = document.getElementById("countdown")?.classList.contains("hidden");
      const playerLeft = window.getComputedStyle(document.getElementById("player")).left;
      return { score, mood, message, buttonText, items, countdownHidden, playerLeft };
    });

    console.log(JSON.stringify(result, null, 2));

    if (!result.countdownHidden) {
      throw new Error("Countdown never finished");
    }

    if (result.buttonText !== "Running...") {
      throw new Error(`Game did not remain active, button text was: ${result.buttonText}`);
    }

    if (result.items < 1) {
      throw new Error("No falling items were rendered during play");
    }

    if (result.mood === "Calm-ish") {
      throw new Error("Mood never changed during play");
    }

    if (result.playerLeft === "0px") {
      throw new Error("Player did not appear to move");
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
