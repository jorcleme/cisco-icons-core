#!/usr/bin/env tsx
/**
 * @cisco-icons/core Build Script
 * 
 * Reads raw SVG files from raw/ directory and generates:
 * - ESM modules (.svg.js)
 * - CJS modules (.svg.cjs)
 * - TypeScript declarations (.svg.d.ts)
 * - Icons metadata (icons.json)
 * - Dynamic package.json exports map
 */

import { resolve, join, parse } from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';

const ROOT_DIR = resolve(__dirname, '..');
const RAW_DIR = join(ROOT_DIR, 'raw');
const DIST_DIR = join(ROOT_DIR, 'dist');
const SRC_DIR = join(ROOT_DIR, 'src');
const PACKAGE_JSON_PATH = join(ROOT_DIR, 'package.json');

const PHOSPHOR_WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

interface IconMetadata {
  name: string;
  kind: 'phosphor' | 'cisco';
  weights: string[];
}

interface DiscoveredIcon {
  name: string;
  weight: string;
  kind: 'phosphor' | 'cisco';
  sourcePath: string;
  svgContent: string;
}

/**
 * Main execution
 */
async function main() {
  console.log(chalk.cyan('\n🚀 Generating @cisco-icons/core modules...\n'));

  await fs.emptyDir(DIST_DIR);
  console.log(chalk.gray(`✓ Cleaned ${DIST_DIR}`));

  console.log(chalk.gray('📦 Compiling TypeScript source...'));
  await compileTypeScript();
  console.log(chalk.green('✓ Compiled TypeScript source\n'));

  const discoveredIcons = await discoverSVGs();
  console.log(chalk.green(`✓ Discovered ${discoveredIcons.length} SVG files\n`));

  for (const icon of discoveredIcons) {
    await generateModules(icon);
  }
  console.log(chalk.green(`✓ Generated ${discoveredIcons.length} modules\n`));

  const metadata = buildMetadata(discoveredIcons);
  await generateMetadata(metadata);
  console.log(chalk.green(`✓ Generated icons.json with ${metadata.length} icons\n`));

  await updatePackageExports(metadata);
  console.log(chalk.green(`✓ Updated package.json exports map\n`));

  console.log(chalk.cyan('✨ Build complete!\n'));
}

async function compileTypeScript(): Promise<void> {
  const srcFiles = await fs.readdir(SRC_DIR);
  
  for (const file of srcFiles) {
    if (!file.endsWith('.ts')) continue;
    
    const srcPath = join(SRC_DIR, file);
    const content = await fs.readFile(srcPath, 'utf-8');
    const baseName = parse(file).name;
    
    let jsContent = content
      .replace(/export \* from ['"]\.\/(\w+)['"];?/g, "export * from './$1.js';")
      .replace(/from ['"]\.\/(\w+)['"];?/g, "from './$1.js';")
      .replace(/export type \{[^}]+\} from ['"][^'"]+['"];?\n?/g, '')
      .replace(/export enum (\w+) \{/g, 'export const $1 = {')
      .replace(/(\w+)\s*=\s*"([^"]+)",?/g, '$1: "$2",')
      .replace(/: Icon\b/g, '')
      .replace(/: Icon\[\]/g, '')
      .replace(/: PhosphorIconEntry\[\]/g, '')
      .replace(/: CiscoAssetEntry\[\]/g, '')
      .replace(/icon: Icon/g, 'icon')
      .replace(/icons: Icon\[\]/g, 'icons')
      .replace(/: icon is PhosphorIconEntry/g, '')
      .replace(/: icon is CiscoAssetEntry/g, '');

    const dtsContent = content;
    
    await fs.writeFile(join(DIST_DIR, `${baseName}.js`), jsContent);
    await fs.writeFile(join(DIST_DIR, `${baseName}.d.ts`), dtsContent);
    
    let cjsContent = jsContent
      .replace(/export \* from ['"]\.\/(\w+)\.js['"];?/g, "Object.assign(module.exports, require('./$1.cjs'));")
      .replace(/export \{([^}]+)\} from ['"]\.\/(\w+)\.js['"];?/g, (_, exports, mod) => {
        const names = exports.split(',').map((n: string) => n.trim());
        return names.map((n: string) => `module.exports.${n} = require('./${mod}.cjs').${n};`).join('\n');
      })
      .replace(/export const (\w+)/g, 'const $1 = module.exports.$1')
      .replace(/export function (\w+)/g, 'function $1');
    
    cjsContent = cjsContent.replace(/function (\w+)\(/g, 'module.exports.$1 = function $1(');
    
    await fs.writeFile(join(DIST_DIR, `${baseName}.cjs`), cjsContent);
  }
}

/**
 * Discover all SVG files from raw/ directory
 */
async function discoverSVGs(): Promise<DiscoveredIcon[]> {
  const icons: DiscoveredIcon[] = [];

  for (const weight of PHOSPHOR_WEIGHTS) {
    const weightDir = join(RAW_DIR, weight);
    
    if (!(await fs.pathExists(weightDir))) {
      console.log(chalk.yellow(`⚠ Skipping ${weight} - directory not found`));
      continue;
    }

    const files = await fs.readdir(weightDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));

    for (const file of svgFiles) {
      const sourcePath = join(weightDir, file);
      const svgContent = await fs.readFile(sourcePath, 'utf-8');
      
      // Extract icon name: remove weight suffix if present
      // Examples: 
      //   - acorn-bold.svg → acorn
      //   - acorn.svg → acorn
      //   - address-book-tabs-light.svg → address-book-tabs
      let name = parse(file).name;
      const weightSuffix = `-${weight}`;
      if (name.endsWith(weightSuffix)) {
        name = name.slice(0, -weightSuffix.length);
      }

      icons.push({
        name,
        weight,
        kind: 'phosphor',
        sourcePath,
        svgContent: svgContent.trim(),
      });

      console.log(chalk.gray(`  Found: phosphor/${weight}/${name}`));
    }
  }

  const ciscoDir = join(RAW_DIR, 'cisco');
  if (await fs.pathExists(ciscoDir)) {
    const files = await fs.readdir(ciscoDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));

    for (const file of svgFiles) {
      const sourcePath = join(ciscoDir, file);
      const svgContent = await fs.readFile(sourcePath, 'utf-8');
      const name = parse(file).name;

      icons.push({
        name,
        weight: 'regular',
        kind: 'cisco',
        sourcePath,
        svgContent: svgContent.trim(),
      });

      console.log(chalk.gray(`  Found: cisco/regular/${name}`));
    }
  } else {
    console.log(chalk.yellow(`⚠ Skipping cisco - directory not found`));
  }

  return icons;
}

/**
 * Generate ESM, CJS, and TypeScript declaration files for an icon
 */
async function generateModules(icon: DiscoveredIcon): Promise<void> {
  const { name, weight, kind, svgContent } = icon;
  
  const outputDir = join(DIST_DIR, kind, weight);
  await fs.ensureDir(outputDir);

  const baseName = `${name}.svg`;
  const esmPath = join(outputDir, `${baseName}.js`);
  const cjsPath = join(outputDir, `${baseName}.cjs`);
  const dtsPath = join(outputDir, `${baseName}.d.ts`);

  const header = `/**
 * @cisco-icons/core - ${name} icon (${weight} weight)
 * ${kind === 'phosphor' ? 'Phosphor Icons' : 'Cisco Icons'}
 */`;

  const esmContent = `${header}
export default ${JSON.stringify(svgContent)};
`;

  const cjsContent = `${header}
module.exports = ${JSON.stringify(svgContent)};
`;

  const dtsContent = `${header}
declare const _default: string;
export default _default;
`;

  await Promise.all([
    fs.writeFile(esmPath, esmContent),
    fs.writeFile(cjsPath, cjsContent),
    fs.writeFile(dtsPath, dtsContent),
  ]);
}

/**
 * Build metadata from discovered icons
 */
function buildMetadata(icons: DiscoveredIcon[]): IconMetadata[] {
  const metadataMap = new Map<string, IconMetadata>();

  for (const icon of icons) {
    const key = `${icon.kind}:${icon.name}`;
    
    if (!metadataMap.has(key)) {
      metadataMap.set(key, {
        name: icon.name,
        kind: icon.kind,
        weights: [],
      });
    }

    const metadata = metadataMap.get(key)!;
    if (!metadata.weights.includes(icon.weight)) {
      metadata.weights.push(icon.weight);
    }
  }

  const metadataArray = Array.from(metadataMap.values());
  
  for (const item of metadataArray) {
    if (item.kind === 'phosphor') {
      item.weights.sort((a, b) => 
        PHOSPHOR_WEIGHTS.indexOf(a) - PHOSPHOR_WEIGHTS.indexOf(b)
      );
    }
  }

  metadataArray.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    return a.name.localeCompare(b.name);
  });

  return metadataArray;
}

/**
 * Generate icons.json metadata file
 */
async function generateMetadata(metadata: IconMetadata[]): Promise<void> {
  const metadataPath = join(DIST_DIR, 'icons.json');
  await fs.writeJSON(metadataPath, metadata, { spaces: 2 });
}

/**
 * Update package.json with dynamic exports map
 */
async function updatePackageExports(metadata: IconMetadata[]): Promise<void> {
  const packageJson = await fs.readJSON(PACKAGE_JSON_PATH);

  const exports: Record<string, any> = {
    '.': {
      import: './dist/index.js',
      require: './dist/index.cjs',
      types: './dist/index.d.ts',
    },
    './icons.json': './dist/icons.json',
  };

  const exportPatterns = new Set<string>();
  
  for (const icon of metadata) {
    const pattern = `./${icon.kind}/${icon.weights[0]}/*.svg`;
    exportPatterns.add(pattern);
    
    if (icon.kind === 'phosphor') {
      for (const weight of icon.weights) {
        exportPatterns.add(`./${icon.kind}/${weight}/*.svg`);
      }
    }
  }

  for (const pattern of Array.from(exportPatterns).sort()) {
    const [, kind, weight] = pattern.split('/');
    exports[pattern] = {
      import: `./dist/${kind}/${weight}/*.svg.js`,
      require: `./dist/${kind}/${weight}/*.svg.cjs`,
      types: `./dist/${kind}/${weight}/*.svg.d.ts`,
    };
  }

  packageJson.exports = exports;
  await fs.writeJSON(PACKAGE_JSON_PATH, packageJson, { spaces: 2 });
}

main().catch((error) => {
  console.error(chalk.red('\n❌ Build failed:\n'));
  console.error(error);
  process.exit(1);
});
