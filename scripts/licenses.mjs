// Writes public/licenses.txt with the licence text of every production dependency
// (MIT, ISC, OFL fonts, etc. require their notices to ship alongside the code).
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// --parseable gives the real install path of every installed production package (skips missing optional peers)
const dirs = execSync("npm ls --omit=dev --all --parseable", { encoding: "utf8" })
  .split("\n")
  .slice(1) // first line is this project
  .filter((d) => d && existsSync(join(d, "package.json")));

const seen = new Map();
for (const dir of dirs) {
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  seen.set(`${pkg.name}@${pkg.version}`, { dir, pkg });
}

const blocks = [...seen].sort(([a], [b]) => a.localeCompare(b)).map(([key, { dir, pkg }]) => {
  const license = typeof pkg.license === "string" ? pkg.license : pkg.license?.type ?? "see package";
  const file = readdirSync(dir).find((f) => /^(licen[sc]e|copying)(\.|$)/i.test(f));
  const text = file ? readFileSync(join(dir, file), "utf8").trim() : `License: ${license} (no licence file shipped; see ${pkg.homepage ?? "the package page"})`;
  return `${"=".repeat(72)}\n${key}  (${license})\n${"=".repeat(72)}\n${text}\n`;
});

// Artwork copied into the demo sites (not npm dependencies, so listed by hand).
const MIT = (holder) => `MIT License

Copyright (c) ${holder}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
const assets = [
  ["Fluent Emoji 3D artwork (demos/crumb/img), by Microsoft, via @lobehub/fluent-emoji-3d", "MIT", `${MIT("Microsoft Corporation")}\n\nPackaging: ${MIT("2023 LobeHub")}`],
  ["Coffee photo (demos/monsoon/coffee.jpg), by Rachel Michetti, from scikit-image sample data", "CC0", "No copyright restrictions. CC0 by the photographer."],
].map(([name, lic, text]) => `${"=".repeat(72)}\n${name}  (${lic})\n${"=".repeat(72)}\n${text}\n`);

writeFileSync(
  "public/licenses.txt",
  `Third-party software used on this website\n\nThis site uses the open-source packages below. Their licences are reproduced in full.\n\n${blocks.join("\n")}\n${assets.join("\n")}`
);
console.log(`licenses.txt: ${blocks.length} packages`);
