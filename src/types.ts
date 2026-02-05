/**
 * @jorcleme/cisco-icons-core - Type Definitions
 */

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export type IconFamily = 'phosphor' | 'cisco';

export interface IconEntry {
  name: string;
  family: IconFamily;
  weights: IconWeight[];
}

export interface PhosphorIconEntry extends IconEntry {
  family: 'phosphor';
}

export interface CiscoAssetEntry extends IconEntry {
  family: 'cisco';
  weights: ['regular'];
}

export type Icon = PhosphorIconEntry | CiscoAssetEntry;

export function isPhosphorIcon(icon: Icon): icon is PhosphorIconEntry {
  return icon.family === 'phosphor';
}

export function isCiscoIcon(icon: Icon): icon is CiscoAssetEntry {
  return icon.family === 'cisco';
}
