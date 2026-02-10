# Getting Started

## Overview

Cisco Icons is a family of packages providing 2,000+ icons (Phosphor Icons + Cisco branded) for use in any JavaScript project.

| Package | Framework | Install |
|---------|-----------|---------|
| `@jorcleme/cisco-icons-core` | Any / Vanilla JS | [Setup](#core-package) |
| `@jorcleme/cisco-icons-react` | React | [Setup](/frameworks/react) |
| `@jorcleme/cisco-icons-svelte` | Svelte | [Setup](/frameworks/svelte) |

## Authentication

All packages are published to **GitHub Packages** (not npm). You need to configure authentication before installing.

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Select scope: **`read:packages`**
4. Copy the generated token

### 2. Configure `.npmrc`

Create or update `.npmrc` in your project root:

```ini
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Or hardcode the token (not recommended for shared repos):

```ini
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

::: warning
Never commit `.npmrc` files containing tokens. Add `.npmrc` to your `.gitignore` or use environment variables.
:::

## Core Package

The core package provides raw SVG files and a typed metadata catalog. Use it directly or let the framework packages handle it.

### Install

```bash
npm install @jorcleme/cisco-icons-core
# or
bun add @jorcleme/cisco-icons-core
# or
pnpm add @jorcleme/cisco-icons-core
```

### What's Included

```
@jorcleme/cisco-icons-core
├── assets/
│   ├── phosphor/
│   │   ├── thin/        # 1,512 icons
│   │   ├── light/       # 1,512 icons
│   │   ├── regular/     # 1,512 icons
│   │   ├── bold/        # 1,512 icons
│   │   ├── fill/        # 1,512 icons
│   │   └── duotone/     # 1,512 icons
│   └── cisco/
│       └── regular/     # 496 icons
└── dist/
    ├── index.js         # ESM metadata bundle
    ├── index.cjs        # CJS metadata bundle
    └── index.d.ts       # TypeScript declarations
```

### Quick Test

```javascript
import { icons } from '@jorcleme/cisco-icons-core';

console.log(`${icons.length} icons available`);
// → "2008 icons available"
```

## Next Steps

- [Usage Guide](/guide/usage) — Import patterns, metadata API, TypeScript types
- [Icon Gallery](/icons/gallery) — Browse and search all icons
- [React](/frameworks/react) — Using icons in React
- [Svelte](/frameworks/svelte) — Using icons in Svelte
- [Vanilla JS](/frameworks/vanilla) — Using raw SVGs directly
