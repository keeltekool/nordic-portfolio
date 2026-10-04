// Persistent click-through suite (CLAUDE.md §2). Real browser at 375 / 1440.
// Usage: node scripts/check-ui-flows.mjs [base-url]
import { readFileSync } from "fs";
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const all = JSON.parse(readFileSync(new URL("../data/projects.json", import.meta.url), "utf8")).projects;
const active = all.filter((p) => !p.archived);
const archived = all.filter((p) => p.archived);
const matches = (list, q) => list.filter((p) => `${p.title} ${p.description}`.toLowerCase().includes(q)).length;

let step = 0;
let failed = 0;
const check = (name, cond, detail = "") => {
  const n = String(++step).padStart(2, "0");
  if (cond) console.log(`  [${n}] PASS ${name}`);
  else {
    failed++;
    console.error(`  [${n}] FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const browser = await chromium.launch();

for (const [vp, width, height] of [["375", 375, 812], ["1440", 1440, 900]]) {
  console.log(`\n${vp}px`);
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

  const search = page.getByRole("searchbox", { name: "Search projects" });
  const cards = page.locator("main h3");
  const count = () => cards.count();

  await page.goto(BASE, { waitUntil: "networkidle" });
  check("home lists every active project", (await count()) === active.length, `${await count()} vs ${active.length}`);
  check("search box visible", await search.isVisible());
  check("no horizontal scroll", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  const name = active[0].title;
  await search.fill(name.toLowerCase());
  check(`"${name.toLowerCase()}" finds ${name}`, (await cards.allTextContents()).some((t) => t.includes(name)));

  await search.fill("radar");
  check('"radar" matches title + description filter', (await count()) === matches(active, "radar"), `${await count()} vs ${matches(active, "radar")}`);

  await search.fill("zzqqxx");
  check("no match shows empty message", (await count()) === 0 && (await page.getByText('No projects match "zzqqxx".').isVisible()));

  await search.fill("");
  check("clearing restores all cards", (await count()) === active.length);

  await page.getByRole("link", { name: "Archive" }).click();
  await page.waitForURL(`${BASE}/archive`);
  check("archive lists every archived project", (await count()) === archived.length, `${await count()} vs ${archived.length}`);
  if (archived.length) {
    await search.fill(archived[0].title);
    check(`archive search finds ${archived[0].title}`, (await cards.allTextContents()).some((t) => t.includes(archived[0].title)));
  }

  check("no console errors or failed requests", errors.length === 0, errors.join(" | "));
  await page.close();
}

await browser.close();
console.log(failed ? `\n${failed} FAILED` : `\nALL ${step} PASS`);
process.exit(failed ? 1 : 0);
