# React

The `@jorcleme/cisco-icons-react` package provides React components for every icon. Each icon is a named export that accepts standard props for size, color, weight, and mirroring.

## Installation

::: info Prerequisites
Follow the [authentication setup](/guide/getting-started#authentication) before installing.
:::

```bash
npm install @jorcleme/cisco-icons-react
# or
bun add @jorcleme/cisco-icons-react
```

`@jorcleme/cisco-icons-core` is included as a dependency — you don't need to install it separately.

## Quick Start

```tsx
import { Acorn, Gear, AddressBook } from '@jorcleme/cisco-icons-react';

function App() {
  return (
    <div>
      <Acorn />
      <Gear size={32} color="dodgerblue" weight="bold" />
      <AddressBook size={48} weight="duotone" />
    </div>
  );
}
```

## Props

Every icon component accepts these props, plus all standard `<svg>` attributes:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string \| number` | `"1em"` | Width and height of the icon |
| `color` | `string` | `"currentColor"` | SVG fill/stroke color |
| `weight` | `IconWeight` | `"regular"` | Icon weight variant |
| `mirrored` | `boolean` | `false` | Flip horizontally (for RTL) |
| `alt` | `string` | `""` | Accessible alt text — sets `aria-label` and `role="img"` |

```tsx
<Gear
  size={24}
  color="#333"
  weight="light"
  mirrored={false}
  className="my-icon"
  style={{ marginRight: 8 }}
/>
```

## Weights

```tsx
import { House } from '@jorcleme/cisco-icons-react';

<House weight="thin" />
<House weight="light" />
<House weight="regular" />
<House weight="bold" />
<House weight="fill" />
<House weight="duotone" />
```

Cisco icons only support `regular` weight. Passing other weights has no effect.

## Icon Context

Use `IconContext` to set default props for all icons in a subtree, avoiding repetitive prop drilling.

```tsx
import { IconContext, House, Gear, User } from '@jorcleme/cisco-icons-react';

function App() {
  return (
    <IconContext.Provider value={{ size: 32, color: 'slateblue', weight: 'duotone' }}>
      <House />   {/* 32px, slateblue, duotone */}
      <Gear />    {/* 32px, slateblue, duotone */}
      <User />    {/* 32px, slateblue, duotone */}
    </IconContext.Provider>
  );
}
```

Props passed directly to an icon override context values:

```tsx
<IconContext.Provider value={{ size: 32, weight: 'bold' }}>
  <House />                    {/* 32px, bold */}
  <Gear size={16} />           {/* 16px, bold — size overridden */}
  <User weight="light" />      {/* 32px, light — weight overridden */}
</IconContext.Provider>
```

## Cisco Icons

Cisco icons use the same component API:

```tsx
import { IconCatalystCenter, IconSecurityAiWhite } from '@jorcleme/cisco-icons-react';

<IconCatalystCenter size={48} color="#049fd9" />
```

Component names match the `pascal_name` from the [icon catalog](/guide/usage#metadata-catalog).

## Server-Side Rendering

The React package supports SSR out of the box. Icons render to static SVG markup on the server and hydrate on the client with no flash or layout shift.

```tsx
// Works in Next.js, Remix, etc.
import { Acorn } from '@jorcleme/cisco-icons-react';

export default function Page() {
  return <Acorn size={24} />;
}
```

## Tree Shaking

Only the icons you import are included in your bundle:

```tsx
// Only Acorn and Gear SVGs are bundled
import { Acorn, Gear } from '@jorcleme/cisco-icons-react';
```

## TypeScript

All components are fully typed. Import the shared types if needed:

```typescript
import type { IconWeight } from '@jorcleme/cisco-icons-react';

const weight: IconWeight = 'bold';
```
