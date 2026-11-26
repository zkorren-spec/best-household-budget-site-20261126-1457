// Hand-in program: builds out/ for The Marlowe Budget Book.
// Copies app/ and screenshots/ into out/, then writes out/dossier.json
// with the kit's buildDossier — the same bytes the scorer rebuilds.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const ROOT = process.cwd();
const OUT = process.env.MAKEFUN_OUTPUT_DIR || join(ROOT, "out");

function mustExist(p, what) {
  if (!existsSync(p)) throw new Error("missing " + what + ": " + p);
}

function totalBytes(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    total += s.isDirectory() ? totalBytes(p) : s.size;
  }
  return total;
}

function main() {
  const appDir = join(ROOT, "app");
  const shotsDir = join(ROOT, "screenshots");
  mustExist(appDir, "app directory");
  mustExist(shotsDir, "screenshots directory");
  const shots = ["1-dashboard.jpg", "2-envelopes.jpg", "3-bills.jpg", "4-goals-phone.jpg"];
  for (const shot of shots) mustExist(join(shotsDir, shot), "screenshot");
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, "app"), { recursive: true });
  mkdirSync(join(OUT, "screenshots"), { recursive: true });
  cpSync(appDir, join(OUT, "app"), { recursive: true });
  cpSync(shotsDir, join(OUT, "screenshots"), { recursive: true });
  writeFileSync(join(OUT, "dossier.json"), buildDossier(OUT, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }));
  console.log("out/ ready: " + totalBytes(OUT) + " bytes, " + shots.length + " screenshots, dossier written");
}

main();
