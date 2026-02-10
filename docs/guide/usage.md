# Usage

## Import Patterns

### Raw SVG Files

Import SVG files directly from the `assets/` directory. Each file exports a raw SVG string.

```javascript
// Phosphor icons — pick any weight
import acornSvg from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
import gearBold from '@jorcleme/cisco-icons-core/phosphor/bold/gear.svg';
import houseThin from '@jorcleme/cisco-icons-core/phosphor/thin/house.svg';

// Cisco icons — regular weight only
import catalystCenter from '@jorcleme/cisco-icons-core/cisco/regular/icon-catalyst-center.svg';
```

### Available Weights

| Weight | Path | Description |
|--------|------|-------------|
| `thin` | `phosphor/thin/` | Thinnest stroke |
| `light` | `phosphor/light/` | Light stroke |
| `regular` | `phosphor/regular/` | Default stroke |
| `bold` | `phosphor/bold/` | Heavy stroke |
| `fill` | `phosphor/fill/` | Solid filled |
| `duotone` | `phosphor/duotone/` | Two-tone variant |

Cisco icons are only available in `regular` weight.

### With `assets/` Prefix

Both path styles resolve to the same file:

```javascript
// Short form
import svg from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';

// Explicit form
import svg from '@jorcleme/cisco-icons-core/assets/phosphor/regular/acorn.svg';
```

## Metadata Catalog

The core package exports a typed array of every icon with its metadata.

### Accessing the Catalog

```typescript
import { icons } from '@jorcleme/cisco-icons-core';

console.log(icons.length); // 2008

// Each entry
icons[0];
// {
//   name: "cisco-favicon",
//   pascal_name: "CiscoFavicon",
//   family: "cisco",
//   weights: ["regular"],
//   tags: []
// }
```

### Filtering Icons

```typescript
import { icons, IconFamily, IconWeight } from '@jorcleme/cisco-icons-core';

// Only Cisco icons
const ciscoIcons = icons.filter(i => i.family === IconFamily.CISCO);

// Only Phosphor icons
const phosphorIcons = icons.filter(i => i.family === IconFamily.PHOSPHOR);

// Icons with a specific weight
const duotoneIcons = icons.filter(i =>
  i.weights.includes(IconWeight.DUOTONE)
);
```

### Building an SVG Path from Metadata

```typescript
import { icons, type IconEntry } from '@jorcleme/cisco-icons-core';

function svgPath(icon: IconEntry, weight = 'regular'): string {
  return `@jorcleme/cisco-icons-core/${icon.family}/${weight}/${icon.name}.svg`;
}

const acorn = icons.find(i => i.name === 'acorn')!;
const path = svgPath(acorn, 'bold');
// → "@jorcleme/cisco-icons-core/phosphor/bold/acorn.svg"
```

## TypeScript Types

### Exports

```typescript
import type {
  IconEntry,   // Single icon metadata object
  IconFamily,  // "phosphor" | "cisco"
  IconWeight,  // "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
} from '@jorcleme/cisco-icons-core';
```

### `IconEntry`

```typescript
interface IconEntry {
  /** kebab-case icon name, e.g. "acorn" or "icon-catalyst-center" */
  name: string;
  /** PascalCase name, e.g. "Acorn" or "IconCatalystCenter" */
  pascal_name: string;
  /** Icon family */
  family: IconFamily;
  /** Available weights for this icon */
  weights: readonly IconWeight[];
  /** Searchable tags */
  tags: readonly string[];
}
```

### `IconFamily` Enum

```typescript
enum IconFamily {
  PHOSPHOR = "phosphor",
  CISCO = "cisco",
}
```

### `IconWeight` Enum

```typescript
enum IconWeight {
  THIN = "thin",
  LIGHT = "light",
  REGULAR = "regular",
  BOLD = "bold",
  FILL = "fill",
  DUOTONE = "duotone",
}
```

## Icon Naming Conventions

| Family | File Name | Catalog `name` | Catalog `pascal_name` |
|--------|-----------|----------------|----------------------|
| Phosphor | `acorn.svg` | `acorn` | `Acorn` |
| Phosphor | `address-book.svg` | `address-book` | `AddressBook` |
| Cisco | `icon-catalyst-center.svg` | `icon-catalyst-center` | `IconCatalystCenter` |
| Cisco | `icon-5g-sd-wan.svg` | `icon-5g-sd-wan` | `Icon5GSDWAN` |

Cisco icon names are normalized from the original filenames — acronyms like AI, API, SD, WAN, VPN, 5G are preserved in PascalCase.
