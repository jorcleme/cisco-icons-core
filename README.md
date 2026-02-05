# @jorcleme/cisco-icons-core

Framework-agnostic SVG icon library based on Phosphor Icons + Cisco branded icons. Raw SVG strings as ES modules for use in any JavaScript framework or vanilla JS.

## Installation

This package is published to **GitHub Packages** (not npm). You'll need to configure your project to use the GitHub registry.

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Select scope: `read:packages`
4. Copy the generated token

### 2. Configure `.npmrc`

Create or update `.npmrc` in your project root:

```ini
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Or use an environment variable (recommended):

```ini
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

> **Security**: Never commit `.npmrc` files containing tokens. Add `.npmrc` to your `.gitignore` or use environment variables.

### 3. Install the package

```bash
npm install @jorcleme/cisco-icons-core
# or
pnpm add @jorcleme/cisco-icons-core
# or
yarn add @jorcleme/cisco-icons-core
```

## Quick Start

```javascript
// Import raw SVG strings
import { acorn } from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
import { gear } from '@jorcleme/cisco-icons-core/phosphor/bold/gear.svg';
import { iconCatalystCenter } from '@jorcleme/cisco-icons-core/cisco/regular/icon-catalyst-center.svg';

// Use in any context
document.getElementById('icon').innerHTML = acorn;
```

## Features

- **2000+ Icons**: Phosphor Icons + Cisco branded icons
- **6 Weights**: thin, light, regular, bold, fill, duotone (Phosphor only)
- **Framework Agnostic**: Works with React, Vue, Svelte, vanilla JS, or any framework
- **Tree-shakeable**: Only bundle the icons you use
- **TypeScript**: Full type definitions included
- **ESM & CommonJS**: Both module formats supported

## Icon Structure

```
@jorcleme/cisco-icons-core
├── phosphor/
│   ├── thin/      # Thinnest weight
│   ├── light/     # Light weight
│   ├── regular/   # Default weight
│   ├── bold/      # Bold weight
│   ├── fill/      # Filled variant
│   └── duotone/   # Two-tone variant
└── cisco/
    └── regular/   # Cisco branded icons
```

## Import Methods

### Direct SVG Import

```javascript
// ESM
import { acorn } from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
import { gear } from '@jorcleme/cisco-icons-core/phosphor/bold/gear.svg';

// CommonJS
const { acorn } = require('@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg');
```

### Icon Metadata

```javascript
import icons from '@jorcleme/cisco-icons-core/icons.json';

// icons is an array of all available icons with metadata
console.log(icons);
// [
//   { name: "acorn", family: "phosphor", category: "nature", ... },
//   { name: "icon-catalyst-center", family: "cisco", ... },
//   ...
// ]
```

### Types

```typescript
import type { IconEntry, IconFamily, IconWeight } from '@jorcleme/cisco-icons-core';

const weight: IconWeight = 'bold';
const family: IconFamily = 'phosphor';
```

## Usage Examples

### Vanilla JavaScript

```javascript
import { house } from '@jorcleme/cisco-icons-core/phosphor/regular/house.svg';

const button = document.createElement('button');
button.innerHTML = house;
button.querySelector('svg').style.width = '24px';
button.querySelector('svg').style.height = '24px';
document.body.appendChild(button);
```

### Vue.js

```vue
<template>
  <span v-html="houseIcon" class="icon"></span>
</template>

<script setup>
import { house } from '@jorcleme/cisco-icons-core/phosphor/regular/house.svg';
const houseIcon = house;
</script>

<style scoped>
.icon :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
```

### Svelte

```svelte
<script>
  import { house } from '@jorcleme/cisco-icons-core/phosphor/regular/house.svg';
</script>

<span class="icon">{@html house}</span>

<style>
  .icon :global(svg) {
    width: 24px;
    height: 24px;
  }
</style>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { house } from '@jorcleme/cisco-icons-core/phosphor/regular/house.svg';

@Component({
  selector: 'app-icon',
  template: '<span [innerHTML]="icon"></span>'
})
export class IconComponent {
  icon: SafeHtml;
  
  constructor(private sanitizer: DomSanitizer) {
    this.icon = this.sanitizer.bypassSecurityTrustHtml(house);
  }
}
```

## Cisco Icons

Cisco branded icons are available in the `cisco/regular/` directory:

```javascript
import { iconCatalystCenter } from '@jorcleme/cisco-icons-core/cisco/regular/icon-catalyst-center.svg';
import { iconSecurityAiWhite } from '@jorcleme/cisco-icons-core/cisco/regular/icon-security-ai-white.svg';
```

## Icon Naming

- **Phosphor Icons**: kebab-case filenames (e.g., `acorn.svg`, `address-book.svg`)
- **Cisco Icons**: Prefixed with `icon-` (e.g., `icon-catalyst-center.svg`)
- **Export names**: camelCase (e.g., `acorn`, `addressBook`, `iconCatalystCenter`)

## TypeScript

Full TypeScript support with type definitions:

```typescript
import type { IconEntry, IconFamily, IconWeight } from '@jorcleme/cisco-icons-core';

// Type-safe weight selection
const weights: IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];

// Type-safe family selection
const families: IconFamily[] = ['phosphor', 'cisco'];
```

## Bundle Size

Icons are tree-shakeable. Only imported icons are included in your bundle:

```javascript
// Only these two icons are bundled
import { acorn } from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
import { gear } from '@jorcleme/cisco-icons-core/phosphor/bold/gear.svg';
```

## For React Users

If you're using React, consider using `@jorcleme/cisco-icons-react` instead, which provides React components with proper prop handling, SSR support, and the IconContext provider.

```bash
npm install @jorcleme/cisco-icons-react
```

## License

MIT
