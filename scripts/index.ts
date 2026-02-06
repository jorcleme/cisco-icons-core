import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_PATH = path.join(__dirname, '..');
export const ASSETS_PATH = path.join(ROOT_PATH, 'assets');
export const RAW_PATH = path.join(ROOT_PATH, 'raw');
export const SRC_PATH = path.join(ROOT_PATH, 'src');
export const ICONS_PATH = path.join(SRC_PATH, 'icons.ts');

export const PHOSPHOR_WEIGHTS = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const;

export type PhosphorWeight = (typeof PHOSPHOR_WEIGHTS)[number];

/**
 * Known acronyms that should stay uppercase in PascalCase names
 */
export const ACRONYMS = new Set([
  'AI',
  'API',
  'AR',
  'AWS',
  'CLI',
  'CPU',
  'CSS',
  'DC',
  'DNS',
  'EVPN',
  'FI',
  'GPU',
  'HTML',
  'HTTP',
  'HTTPS',
  'HX',
  'ID',
  'IOT',
  'IP',
  'ISE',
  'IT',
  'JS',
  'JSON',
  'LAN',
  'MDS',
  'OS',
  'PDF',
  'RAM',
  'REST',
  'SD',
  'SDK',
  'SFP',
  'SQL',
  'SSH',
  'SSL',
  'TCP',
  'TLS',
  'UI',
  'URL',
  'USB',
  'UX',
  'VDI',
  'VPN',
  'VR',
  'WAN',
  'WI',
  'XML',
  'XR',
  '5G',
]);

/**
 * Sanitize a raw icon name by removing invalid characters and normalizing separators.
 * - Replaces spaces with underscores
 * - Removes non-alphanumeric characters (except _ and -)
 * - Collapses multiple underscores
 * - Trims leading/trailing underscores
 */
export function sanitizeName(name: string): string {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Convert a string to PascalCase, preserving known acronyms.
 * Handles kebab-case, snake_case, and space-separated strings.
 */
export function pascalize(str: string): string {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => {
      const upper = part.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Normalize an icon name from filename:
 * 1. Remove file extension
 * 2. Strip dimension suffixes (e.g., _80x80px, -16x16px)
 * 3. Sanitize invalid characters
 * 4. Convert to kebab-case for consistency
 */
export function normalizeIconName(filename: string): string {
  const DIMENSION_SUFFIX = /[-_]\d+x\d+(px)?$/i;
  const CAMEL_TO_KEBAB = /([a-z])([A-Z])/g;
  const MULTI_HYPHENS = /-+/g;
  const EDGE_HYPHENS = /^-|-$/g;

  let name = path.parse(filename).name;
  name = name.replace(DIMENSION_SUFFIX, '');
  name = sanitizeName(name);
  name = name.replace(CAMEL_TO_KEBAB, '$1-$2');
  name = name.replace(/_/g, '-');
  name = name.toLowerCase();
  name = name.replace(MULTI_HYPHENS, '-');
  name = name.replace(EDGE_HYPHENS, '');

  return name;
}

/**
 * @deprecated Use pascalize() instead for better acronym handling
 */
export function kebabToPascal(str: string): string {
  return pascalize(str);
}

export function getWeightFromFilename(filename: string): PhosphorWeight | null {
  const name = path.parse(filename).name;
  const parts = name.split('-');
  const lastPart = parts[parts.length - 1];

  if (PHOSPHOR_WEIGHTS.includes(lastPart as PhosphorWeight)) {
    return lastPart as PhosphorWeight;
  }
  return null;
}

export function getIconNameFromFilename(filename: string): string {
  const name = path.parse(filename).name;
  const weight = getWeightFromFilename(filename);

  if (weight) {
    return name.slice(0, -(weight.length + 1));
  }
  return name;
}
