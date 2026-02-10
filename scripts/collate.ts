#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

import {
  ASSETS_PATH,
  RAW_PATH,
  PHOSPHOR_WEIGHTS,
  normalizeIconName,
  getIconNameFromFilename,
  type PhosphorWeight,
} from "./index.js";

main().catch(console.error);

async function main() {
  console.log(chalk.cyan("\n📦 Collating SVG assets...\n"));

  await ensureAssetDirs();

  let totalFiles = 0;

  for (const weight of PHOSPHOR_WEIGHTS) {
    const count = await processPhosphorWeight(weight);
    totalFiles += count;
  }

  const ciscoCount = await processCiscoIcons();
  totalFiles += ciscoCount;

  console.log(chalk.green(`\n✅ Collated ${totalFiles} SVG files\n`));
}

async function ensureAssetDirs(): Promise<void> {
  for (const weight of PHOSPHOR_WEIGHTS) {
    const dir = path.join(ASSETS_PATH, "phosphor", weight);
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.mkdir(path.join(ASSETS_PATH, "cisco", "regular"), {
    recursive: true,
  });
}

async function processPhosphorWeight(weight: PhosphorWeight): Promise<number> {
  const srcDir = path.join(RAW_PATH, weight);
  const destDir = path.join(ASSETS_PATH, "phosphor", weight);

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.yellow(`⚠ Skipping ${weight} - not found`));
    return 0;
  }

  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
  let count = 0;

  for (const file of files) {
    // Strip weight suffix from filename (e.g., "acorn-thin.svg" → "acorn.svg")
    const iconName = getIconNameFromFilename(file);
    const destFilename = `${iconName}.svg`;

    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, destFilename);

    const content = await fs.promises.readFile(srcPath, "utf-8");
    const processed = replaceColorLiterals(content);

    await fs.promises.writeFile(destPath, processed);
    count++;
  }

  console.log(chalk.gray(`  phosphor/${weight}: ${count} icons`));
  return count;
}

async function processCiscoIcons(): Promise<number> {
  const srcDir = path.join(RAW_PATH, "cisco");
  const destDir = path.join(ASSETS_PATH, "cisco", "regular");

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.yellow(`⚠ Skipping cisco - not found`));
    return 0;
  }

  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));
  let count = 0;
  const seen = new Map<string, string>();

  for (const file of files) {
    const normalized = normalizeIconName(file);
    const destFilename = `${normalized}.svg`;

    if (seen.has(normalized)) {
      console.log(
        chalk.yellow(
          `  ⚠ Collision: "${file}" → "${destFilename}" (already mapped from "${seen.get(normalized)}")`
        )
      );
      continue;
    }
    seen.set(normalized, file);

    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, destFilename);

    const content = await fs.promises.readFile(srcPath, "utf-8");
    const processed = replaceColorLiterals(content);

    await fs.promises.writeFile(destPath, processed);
    count++;
  }

  console.log(chalk.gray(`  cisco/regular: ${count} icons`));
  return count;
}

function replaceColorLiterals(svg: string): string {
  return svg.replace(/#0+(?=[^0-9a-fA-F]|$)/g, "currentColor");
}
