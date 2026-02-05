# AGENTS.md - Cisco Icons Core

> Guidelines for AI agents working in this codebase.

## Project Overview

This is a **framework-agnostic SVG icon library** combining Phosphor Icons + Cisco branded icons. Icons are exported as raw SVG strings for use in any JavaScript framework.

### Package Structure

```
cisco-icons-core/
├── src/                # TypeScript source (types)
├── dist/               # Generated output (gitignored)
├── raw/                # Source SVG files
│   ├── thin/           # Phosphor thin weight
│   ├── light/          # Phosphor light weight
│   ├── regular/        # Phosphor regular weight
│   ├── bold/           # Phosphor bold weight
│   ├── fill/           # Phosphor fill weight
│   ├── duotone/        # Phosphor duotone weight
│   └── cisco/          # Cisco branded icons (regular only)
├── tools/
│   └── generate.ts     # Build script
├── package.json
└── tsconfig.json
```

## Build Commands

```bash
# Install dependencies
bun install

# Build the package (generates dist/)
bun run build

# Clean dist directory
bun run clean
```

## Code Style Guidelines

- **TypeScript strict mode** - no `as any`, `@ts-ignore`, `@ts-expect-error`
- **ES Modules** - `"type": "module"`
- **Target**: ES2020

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Source files | kebab-case | `generate.ts` |
| SVG icons | kebab-case.svg | `acorn.svg`, `address-book.svg` |

### Export Naming

```typescript
// Import raw SVG strings
import { acorn } from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
import { iconCatalystCenter } from '@jorcleme/cisco-icons-core/cisco/regular/icon-catalyst-center.svg';
```

## How the Build Works

The `tools/generate.ts` script:

1. Reads SVGs from `raw/` directory
2. Generates ESM (`.svg.js`), CJS (`.svg.cjs`), and types (`.svg.d.ts`)
3. Creates `icons.json` metadata
4. Updates `package.json` exports map

### Icon Weights

| Family | Weights |
|--------|---------|
| Phosphor | thin, light, regular, bold, fill, duotone |
| Cisco | regular only |

## Publishing

Published to **GitHub Packages**:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

## Constraints

- **DO NOT** publish without explicit request
- **DO NOT** add new dependencies without discussion
- **PREFER** bun for all operations
