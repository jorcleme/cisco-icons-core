export enum IconWeight {
  THIN = "thin",
  LIGHT = "light",
  REGULAR = "regular",
  BOLD = "bold",
  FILL = "fill",
  DUOTONE = "duotone",
}

export enum IconFamily {
  PHOSPHOR = "phosphor",
  CISCO = "cisco",
}

export interface IconEntry {
  name: string;
  pascal_name: string;
  family: IconFamily;
  weights: readonly IconWeight[];
  tags: readonly string[];
}
