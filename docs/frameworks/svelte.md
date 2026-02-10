# Svelte

The `@jorcleme/cisco-icons-svelte` package provides native Svelte components for every icon with full TypeScript support.

## Installation

::: info Prerequisites
Follow the [authentication setup](/guide/getting-started#authentication) before installing.
:::

```bash
npm install @jorcleme/cisco-icons-svelte
# or
bun add @jorcleme/cisco-icons-svelte
```

`@jorcleme/cisco-icons-core` is included as a dependency — you don't need to install it separately.

## Quick Start

```svelte
<script>
  import { Acorn, Gear, AddressBook } from '@jorcleme/cisco-icons-svelte';
</script>

<Acorn />
<Gear size={32} color="dodgerblue" weight="bold" />
<AddressBook size={48} weight="duotone" />
```

## Props

Every icon component accepts these props, plus all standard `<svg>` attributes:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string \| number` | `"1em"` | Width and height of the icon |
| `color` | `string` | `"currentColor"` | SVG fill/stroke color |
| `weight` | `IconWeight` | `"regular"` | Icon weight variant |
| `mirrored` | `boolean` | `false` | Flip horizontally (for RTL) |

```svelte
<Gear
  size={24}
  color="#333"
  weight="light"
  class="my-icon"
/>
```

## Weights

```svelte
<script>
  import { House } from '@jorcleme/cisco-icons-svelte';
</script>

<House weight="thin" />
<House weight="light" />
<House weight="regular" />
<House weight="bold" />
<House weight="fill" />
<House weight="duotone" />
```

Cisco icons only support `regular` weight.

## Icon Context

Use Svelte's context API to set default props for all icons in a component tree.

```svelte
<!-- Layout.svelte -->
<script>
  import { setContext } from 'svelte';

  setContext('iconCtx', {
    size: 32,
    color: 'slateblue',
    weight: 'duotone',
  });
</script>

<slot />
```

```svelte
<!-- Page.svelte (child of Layout) -->
<script>
  import { House, Gear, User } from '@jorcleme/cisco-icons-svelte';
</script>

<House />   <!-- 32px, slateblue, duotone -->
<Gear />    <!-- 32px, slateblue, duotone -->
<User />    <!-- 32px, slateblue, duotone -->
```

Props passed directly to a component override context values:

```svelte
<House />                    <!-- uses context defaults -->
<Gear size={16} />           <!-- 16px, rest from context -->
<User weight="light" />      <!-- light weight, rest from context -->
```

## Cisco Icons

```svelte
<script>
  import { IconCatalystCenter, IconSecurityAiWhite } from '@jorcleme/cisco-icons-svelte';
</script>

<IconCatalystCenter size={48} color="#049fd9" />
```

Component names match the `pascal_name` from the [icon catalog](/guide/usage#metadata-catalog).

## SvelteKit SSR

Icons render as static SVG on the server and hydrate seamlessly:

```svelte
<!-- +page.svelte -->
<script>
  import { Acorn } from '@jorcleme/cisco-icons-svelte';
</script>

<Acorn size={24} />
```

## Tree Shaking

Only the icons you import are included in your bundle:

```svelte
<script>
  // Only Acorn and Gear SVGs are bundled
  import { Acorn, Gear } from '@jorcleme/cisco-icons-svelte';
</script>
```

## TypeScript

All components ship with TypeScript declarations:

```typescript
import type { IconWeight } from '@jorcleme/cisco-icons-svelte';

const weight: IconWeight = 'bold';
```
