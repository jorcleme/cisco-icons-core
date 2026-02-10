# Vanilla JS

Use `@jorcleme/cisco-icons-core` directly in any JavaScript project — no framework required. Icons are raw SVG files you can load via `fetch`, inline via a bundler, or read from disk in Node.

## Installation

::: info Prerequisites
Follow the [authentication setup](/guide/getting-started#authentication) before installing.
:::

```bash
npm install @jorcleme/cisco-icons-core
# or
bun add @jorcleme/cisco-icons-core
```

## Using Raw SVG Files

### With a Bundler (Vite, Webpack, etc.)

Most bundlers can import `.svg` files as strings with the right loader/plugin:

```javascript
// Vite — use ?raw suffix
import acornSvg from '@jorcleme/cisco-icons-core/assets/phosphor/regular/acorn.svg?raw';

document.getElementById('icon').innerHTML = acornSvg;
```

### Fetch at Runtime

Load SVGs on demand from `node_modules`:

```javascript
async function loadIcon(family, weight, name) {
  const url = new URL(
    `./node_modules/@jorcleme/cisco-icons-core/assets/${family}/${weight}/${name}.svg`,
    import.meta.url
  );
  const res = await fetch(url);
  return res.text();
}

const svg = await loadIcon('phosphor', 'regular', 'acorn');
document.getElementById('icon').innerHTML = svg;
```

### Node.js / Server-Side

```javascript
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const corePath = require.resolve('@jorcleme/cisco-icons-core/package.json');
const baseDir = corePath.replace('/package.json', '');

const svg = readFileSync(
  `${baseDir}/assets/phosphor/regular/acorn.svg`,
  'utf-8'
);
```

## Using the Metadata Catalog

The catalog lets you build dynamic icon pickers, search UIs, or icon sprite sheets:

```javascript
import { icons } from '@jorcleme/cisco-icons-core';

// Build an icon picker
const container = document.getElementById('icon-picker');

for (const icon of icons) {
  const button = document.createElement('button');
  button.title = icon.pascal_name;
  button.dataset.name = icon.name;
  button.dataset.family = icon.family;

  // Load the SVG
  fetch(`/node_modules/@jorcleme/cisco-icons-core/assets/${icon.family}/regular/${icon.name}.svg`)
    .then(r => r.text())
    .then(svg => { button.innerHTML = svg; });

  container.appendChild(button);
}
```

## Styling SVGs

Inline SVGs inherit CSS styles. Target the `<svg>` element or its children:

```html
<span id="icon" class="icon-wrapper"></span>

<style>
  .icon-wrapper svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  /* Change color on hover */
  .icon-wrapper:hover svg {
    fill: dodgerblue;
  }
</style>
```

### Sizing

```css
/* Fixed size */
.icon svg {
  width: 32px;
  height: 32px;
}

/* Relative to font size */
.icon svg {
  width: 1em;
  height: 1em;
}
```

### Color

Phosphor icons use `currentColor` by default, so they inherit the parent's text color:

```css
.icon {
  color: slateblue; /* SVG inherits this */
}
```

Override directly:

```css
.icon svg {
  fill: #049fd9;
  stroke: #049fd9;
}
```

## Switching Weights

```javascript
function setIconWeight(element, family, name, weight) {
  fetch(`/assets/${family}/${weight}/${name}.svg`)
    .then(r => r.text())
    .then(svg => { element.innerHTML = svg; });
}

// Toggle between regular and bold
const el = document.getElementById('my-icon');
setIconWeight(el, 'phosphor', 'house', 'bold');
```

## CDN Usage

If you don't use a package manager, you can reference the SVG files from a self-hosted location or copy them into your `public/` directory:

```html
<!-- Copy assets/ to your public directory, then: -->
<img src="/icons/phosphor/regular/acorn.svg" alt="Acorn" width="24" height="24" />
```

::: warning
Using `<img>` tags prevents CSS color customization. For full styling control, inline the SVG markup instead.
:::

## TypeScript

```typescript
import { icons, type IconEntry, IconFamily, IconWeight } from '@jorcleme/cisco-icons-core';

function getIconPath(icon: IconEntry, weight: IconWeight = IconWeight.REGULAR): string {
  return `/assets/${icon.family}/${weight}/${icon.name}.svg`;
}
```
