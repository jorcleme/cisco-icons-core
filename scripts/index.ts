import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_PATH = path.join(__dirname, "..");
export const ASSETS_PATH = path.join(ROOT_PATH, "assets");
export const RAW_PATH = path.join(ROOT_PATH, "raw");
export const SRC_PATH = path.join(ROOT_PATH, "src");
export const ICONS_PATH = path.join(SRC_PATH, "icons.ts");

export const PHOSPHOR_WEIGHTS = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
] as const;

export type PhosphorWeight = (typeof PHOSPHOR_WEIGHTS)[number];

export function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function getWeightFromFilename(filename: string): PhosphorWeight | null {
  const name = path.parse(filename).name;
  const parts = name.split("-");
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
