#!/usr/bin/env bun
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import type { PhosphorWeight } from '.';

import {
  ASSETS_PATH,
  ICONS_PATH,
  PHOSPHOR_WEIGHTS,
  kebabToPascal,
  getIconNameFromFilename
} from './index.js';

interface IconData {
  name: string;
  pascal_name: string;
  family: 'phosphor' | 'cisco';
  weights: PhosphorWeight[];
}

main().catch(console.error);

async function main() {
  console.log(chalk.cyan('\n📋 Generating icons catalog...\n'));

  const iconMap = new Map<string, IconData>();

  for (const weight of PHOSPHOR_WEIGHTS) {
    const dir = path.join(ASSETS_PATH, 'phosphor', weight);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'));

    for (const file of files) {
      const iconName = getIconNameFromFilename(file);
      const key = `phosphor:${iconName}`;

      if (!iconMap.has(key)) {
        iconMap.set(key, {
          name: iconName,
          pascal_name: kebabToPascal(iconName),
          family: 'phosphor',
          weights: []
        });
      }

      const icon = iconMap.get(key)!;
      if (!icon.weights.includes(weight)) {
        icon.weights.push(weight);
      }
    }
  }

  const ciscoDir = path.join(ASSETS_PATH, 'cisco', 'regular');
  if (fs.existsSync(ciscoDir)) {
    const files = fs.readdirSync(ciscoDir).filter((f) => f.endsWith('.svg'));

    for (const file of files) {
      const iconName = path.parse(file).name;
      const key = `cisco:${iconName}`;

      iconMap.set(key, {
        name: iconName,
        pascal_name: kebabToPascal(iconName),
        family: 'cisco',
        weights: ['regular']
      });
    }
  }

  const icons = Array.from(iconMap.values()).sort((a, b) => {
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    return a.name.localeCompare(b.name);
  });

  for (const icon of icons) {
    if (icon.family === 'phosphor') {
      icon.weights.sort((a, b) => PHOSPHOR_WEIGHTS.indexOf(a) - PHOSPHOR_WEIGHTS.indexOf(b as any));
    }
  }

  const fileContent = generateIconsFile(icons);
  await fs.promises.writeFile(ICONS_PATH, fileContent);

  const phosphorCount = icons.filter((i) => i.family === 'phosphor').length;
  const ciscoCount = icons.filter((i) => i.family === 'cisco').length;

  console.log(chalk.gray(`  Phosphor: ${phosphorCount} icons`));
  console.log(chalk.gray(`  Cisco: ${ciscoCount} icons`));
  console.log(chalk.green(`\n✅ Generated ${icons.length} icon entries\n`));
}

function generateIconsFile(icons: IconData[]): string {
  let content = `import { IconEntry, IconFamily, IconWeight } from "./types";

export type CiscoIcon = (typeof icons)[number];

export const icons = [
`;

  for (const icon of icons) {
    const weights = icon.weights.map((w) => `IconWeight.${w.toUpperCase()}`).join(', ');

    content += `  {
    name: "${icon.name}",
    pascal_name: "${icon.pascal_name}",
    family: IconFamily.${icon.family.toUpperCase()},
    weights: [${weights}] as const,
    tags: [] as const,
  },
`;
  }

  content += `] as const satisfies readonly IconEntry[];
`;

  return content;
}
