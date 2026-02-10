# Transition Sheet: cisco-icons-core → cisco-icons-angular

**Date:** 2026-02-09  
**Session:** Work completed on `cisco-icons-core`, transitioning to `cisco-icons-angular`  
**Return Task:** Update docs site after Angular package is complete

---

## 🎯 Current State of cisco-icons-core

### ✅ Completed Work (All Committed & Pushed)

#### Phase 1-4: Build System & Publishing (Committed: `e8684e6`)
- ✅ Build architecture refactored to match `@phosphor-icons/core`
- ✅ Icon name normalization with ACRONYMS support
- ✅ 2,008 icons cataloged (1,512 Phosphor + 496 Cisco)
- ✅ Build race conditions fixed
- ✅ GitHub Packages publishing workflow ready
- ✅ Dependabot, issue templates, CONTRIBUTING.md, LICENSE added

#### Phase 5-6: VitePress Docs Site (Ready to Commit)
- ✅ Full VitePress documentation site created
- ✅ Custom Mint Emerald theme (emerald greens, matching brand guide)
- ✅ Icon gallery with search, filters, and **true pagination** (Prev/Next + page input)
- ✅ Theme-aware logo and favicon (light/dark variants)
- ✅ Font change: **Inter** (body) + **Ubuntu Mono** (code)
- ✅ All builds passing (`bun run docs:build` ✅)

### 📦 Package Architecture

```
cisco-icons-core/
├── assets/                    # Generated: SVGs normalized from raw/
│   ├── phosphor/{weight}/     # 1,512 icons × 6 weights
│   └── cisco/regular/         # 496 icons
├── raw/                       # Source SVGs (keep for reference)
├── src/
│   ├── icons.ts              # Generated catalog (2,008 entries)
│   └── types.ts              # IconEntry, IconFamily, IconWeight
├── dist/                     # Built metadata bundle (ESM + CJS)
├── docs/                     # VitePress site
│   ├── .vitepress/
│   │   ├── config.ts         # Site config, footer, fonts
│   │   └── theme/
│   │       ├── index.ts      # Custom theme setup
│   │       ├── style.css     # Mint Emerald theme CSS
│   │       └── IconGallery.vue  # Pagination gallery
│   ├── index.md              # Landing page
│   ├── guide/                # Getting started, usage
│   ├── frameworks/           # React, Svelte, vanilla JS
│   └── icons/gallery.md      # Icon gallery page
└── scripts/
    ├── collate.ts            # raw/ → assets/ (normalize filenames)
    ├── catalog.ts            # assets/ → src/icons.ts (generate catalog)
    └── index.ts              # normalizeIconName(), sanitizeName(), pascalize()
```

### 🔧 Key Commands

```bash
# Build package
bun run build              # clean && build:assets && build:lib

# Docs
bun run docs:dev           # Dev server at http://localhost:5173
bun run docs:build         # Build static site
bun run docs:preview       # Preview built site

# Publishing (GitHub Packages)
git tag v0.1.0
git push origin v0.1.0     # Triggers .github/workflows/publish.yml
```

---

## 🚀 Next Steps: cisco-icons-angular Package

### Goals
1. Create Angular component wrapper for cisco-icons-core
2. Match patterns from cisco-icons-react and cisco-icons-svelte
3. Provide Angular-specific ergonomics (inputs, outputs, tree-shaking)

### Architecture Reference (from cisco-icons-react)

```typescript
// React example (adapt for Angular)
<PhAcorn size={32} weight="bold" color="currentColor" />
<CiscoIcon name="catalyst-center" size={24} />
```

**Angular equivalent should be:**
```typescript
<ph-acorn [size]="32" [weight]="'bold'" [color]="'currentColor'"></ph-acorn>
<cisco-icon [name]="'catalyst-center'" [size]="24"></cisco-icon>
```

### Implementation Checklist

#### Setup
- [ ] `ng new cisco-icons-angular --no-standalone` (or standalone if preferred)
- [ ] Install `@jorcleme/cisco-icons-core` as peer dependency
- [ ] Set up GitHub Packages auth in `.npmrc`
- [ ] Configure TypeScript strict mode
- [ ] Set up build for library (ng-packagr or custom)

#### Core Implementation
- [ ] Create base `IconComponent` (generic wrapper)
- [ ] Generate individual icon components (e.g., `PhAcornComponent`, `PhGearComponent`)
  - Option A: Codegen script (like React/Svelte)
  - Option B: Single component with `@Input() name` (simpler but less type-safe)
- [ ] Support props: `@Input() size`, `@Input() weight`, `@Input() color`, `@Input() mirrored`
- [ ] Emit events: `@Output() click`, `@Output() hover` (if needed)
- [ ] Tree-shaking: Ensure Angular can shake unused icons

#### Testing
- [ ] Unit tests for icon rendering
- [ ] Test weight fallback logic (Cisco icons only have `regular`)
- [ ] Test SSR compatibility (Angular Universal)

#### Documentation
- [ ] README with installation (GitHub Packages auth)
- [ ] Usage examples
- [ ] API reference
- [ ] Migration guide (if coming from other icon libraries)

#### Publishing
- [ ] GitHub Actions workflow for publishing
- [ ] Semantic versioning
- [ ] Changelog

---

## 🔙 Return Task: Update cisco-icons-core Docs

### When You Return to cisco-icons-core

After completing `cisco-icons-angular`, you'll need to:

1. **Update Documentation Site**
   - [ ] Add Angular framework page: `docs/frameworks/angular.md`
   - [ ] Update landing page to mention Angular package
   - [ ] Update `docs/guide/getting-started.md` to list Angular option
   - [ ] Add Angular to nav/sidebar in `docs/.vitepress/config.ts`

2. **Update README**
   - [ ] Add Angular package link to README.md
   - [ ] Update "For React Users" section to include Angular

3. **Cross-link Repos**
   - [ ] Add Angular repo to GitHub nav in VitePress config
   - [ ] Update monorepo list in docs

### Template for Angular Docs Page

Create `docs/frameworks/angular.md`:

```markdown
# Angular

Use Cisco Icons in Angular with `@jorcleme/cisco-icons-angular`.

## Installation

\`\`\`bash
npm install @jorcleme/cisco-icons-angular
\`\`\`

## Usage

\`\`\`typescript
import { PhAcornComponent } from '@jorcleme/cisco-icons-angular';

@Component({
  standalone: true,
  imports: [PhAcornComponent],
  template: '<ph-acorn [size]="32" [weight]="'bold'"></ph-acorn>'
})
export class MyComponent {}
\`\`\`

## API

### Props (Inputs)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number \| string | "1em" | Icon size |
| weight | IconWeight | "regular" | Icon weight |
| color | string | "currentColor" | Icon color |
| mirrored | boolean | false | Flip horizontally |

## Examples

[Add examples here]
```

---

## 📋 Uncommitted Changes (MUST COMMIT BEFORE LEAVING)

### Files Modified (Phase 5-6)

```
docs/.vitepress/config.ts          # MODIFIED: Logo, fonts, Google Fonts link
docs/.vitepress/theme/index.ts     # MODIFIED: style.css import
docs/.vitepress/theme/style.css    # CREATED: Mint Emerald theme + Inter/Ubuntu Mono
docs/.vitepress/theme/IconGallery.vue  # CREATED: Pagination gallery
docs/index.md                      # CREATED: Landing page
docs/guide/getting-started.md      # CREATED: Install guide
docs/guide/usage.md                # CREATED: Usage docs
docs/frameworks/react.md           # CREATED: React guide
docs/frameworks/svelte.md          # CREATED: Svelte guide
docs/frameworks/vanilla.md         # CREATED: Vanilla JS guide
docs/icons/gallery.md              # CREATED: Gallery page
docs/public/logo.svg               # CREATED: Light theme logo
docs/public/logo-dark.svg          # CREATED: Dark theme logo
.github/workflows/deploy.yml       # CREATED: GitHub Pages deployment
.gitignore                         # MODIFIED: Added docs build dirs
scripts/collate.ts                 # MODIFIED: Filename normalization fixes
```

### Recommended Commit Message

```bash
git add docs/ .github/workflows/deploy.yml .gitignore scripts/collate.ts
git commit -m "feat(docs): add VitePress site with Mint Emerald theme and pagination gallery

- Add complete VitePress documentation site
- Implement custom Mint Emerald theme (emerald greens, Inter + Ubuntu Mono fonts)
- Create searchable icon gallery with true pagination (Prev/Next + page input)
- Add theme-aware logo and favicon (light/dark variants)
- Include guide pages: getting-started, usage
- Include framework pages: React, Svelte, vanilla JS (Angular pending)
- Set up GitHub Pages deployment workflow
- Fix IconGallery.vue TypeScript error (readonly array → mutable)
- Remove 'Load More' button in favor of pagination controls

Closes #[issue-number-if-any]"

git push origin main
```

---

## 🛠️ Technical Context for Angular Development

### Icon Catalog Structure

The `src/icons.ts` catalog looks like this:

```typescript
export const icons = [
  {
    name: "acorn",
    pascal_name: "Acorn",
    family: IconFamily.PHOSPHOR,
    weights: [IconWeight.THIN, IconWeight.LIGHT, IconWeight.REGULAR, IconWeight.BOLD, IconWeight.FILL, IconWeight.DUOTONE] as const,
    tags: [] as const,
  },
  {
    name: "cisco-favicon",
    pascal_name: "CiscoFavicon",
    family: IconFamily.CISCO,
    weights: [IconWeight.REGULAR] as const,
    tags: [] as const,
  },
  // ... 2,006 more entries
] as const satisfies readonly IconEntry[];
```

### SVG Import Pattern

```typescript
// Direct SVG import (ESM)
import { acorn } from '@jorcleme/cisco-icons-core/phosphor/regular/acorn.svg';
// acorn is a string: '<svg xmlns="...">...</svg>'

// In Angular, you'd use DomSanitizer:
constructor(private sanitizer: DomSanitizer) {}

getSvg(iconName: string): SafeHtml {
  const svgString = await import(`@jorcleme/cisco-icons-core/phosphor/${weight}/${iconName}.svg`);
  return this.sanitizer.bypassSecurityTrustHtml(svgString.default);
}
```

### Weight Fallback Logic

```typescript
// Cisco icons only have 'regular' weight
function resolveWeight(icon: IconEntry, requestedWeight: IconWeight): IconWeight {
  return icon.weights.includes(requestedWeight) 
    ? requestedWeight 
    : icon.weights[0]; // Fallback to first available
}
```

### Component Generation Script (Reference)

You'll likely need a script similar to `tools/generate-components.ts`:

```typescript
import { icons } from '@jorcleme/cisco-icons-core';

for (const icon of icons) {
  const componentName = `Ph${icon.pascal_name}Component`; // or Cisco prefix
  const template = `
    import { Component, Input } from '@angular/core';
    import { IconBaseComponent } from './icon-base.component';
    
    @Component({
      selector: 'ph-${icon.name}',
      template: '<svg [innerHTML]="svgContent"></svg>'
    })
    export class ${componentName} extends IconBaseComponent {
      iconName = '${icon.name}';
      iconFamily = '${icon.family}';
    }
  `;
  // Write to file...
}
```

---

## 🔗 Related Repositories

### Existing Packages (Reference)
- **Core:** https://github.com/jorcleme/cisco-icons-core
- **React:** https://github.com/jorcleme/cisco-icons-react
- **Svelte:** https://github.com/jorcleme/cisco-icons-svelte

### To Be Created
- **Angular:** https://github.com/jorcleme/cisco-icons-angular (NEW)

### Documentation Site
- **Live:** https://jorcleme.github.io/cisco-icons-core/ (after GitHub Pages enabled)

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Total Icons | 2,008 |
| Phosphor Icons | 1,512 (6 weights each) |
| Cisco Icons | 496 (regular only) |
| SVG Files Generated | 9,568 |
| Catalog Size | 332KB (ESM), 252KB (CJS) |
| Build Time | ~9s |
| Docs Build Time | ~9s |

---

## 🎨 Design Tokens (For Angular Package Docs)

### Brand Colors (Mint Emerald Theme)

**Light Mode:**
- Primary: `#10b981` (emerald-500)
- Secondary: `#059669` (emerald-600)
- Tertiary: `#047857` (emerald-700)

**Dark Mode:**
- Primary: `#6ee7b7` (emerald-300)
- Secondary: `#34d399` (emerald-400)
- Tertiary: `#10b981` (emerald-500)

### Typography
- **Body:** Inter (300, 400, 500, 600, 700)
- **Code:** Ubuntu Mono (400, 700)

### Logo
- Light theme: `docs/public/logo.svg` (emerald greens)
- Dark theme: `docs/public/logo-dark.svg` (cyan/blue)

---

## 🐛 Known Issues / TODOs

### cisco-icons-core
- [ ] Enable GitHub Pages in repo settings (source: GitHub Actions)
- [ ] Create first release (v0.1.0) to test publishing
- [ ] Add icon search by tags (currently only name/pascal_name)
- [ ] Add "copy SVG code" button in gallery (currently only copies import path)
- [ ] Consider URL-based pagination (`?page=5`) for shareable links

### cisco-icons-angular (To Investigate)
- [ ] Decide: Standalone components or NgModule?
- [ ] Decide: Codegen all components or single dynamic component?
- [ ] SSR compatibility (Angular Universal)
- [ ] Tree-shaking verification
- [ ] Ivy compilation target

---

## 📝 Session Notes

### What Worked Well
- Parallel background research agents (librarian + explore) saved time
- VitePress was easy to customize (compared to Jekyll)
- Icon filename normalization caught collision issues early
- Pagination pattern (Prev/Next + input) is cleaner than numbered pages

### Lessons Learned
- Always normalize filenames during collation (not just catalog)
- VitePress `serveIconAssets()` middleware critical for dev server
- Readonly arrays from `as const` require spread operator for Vue refs
- Research confirmed "Load More" is standard, but pagination is better for 2000+ items

### Tips for Angular Work
- Check cisco-icons-react for component API patterns
- Use Angular CLI schematics if generating many components
- Test tree-shaking with Webpack Bundle Analyzer
- Consider ViewEncapsulation.None for SVG styling
- Use ChangeDetectionStrategy.OnPush for performance

---

## 🔐 Authentication (GitHub Packages)

**Required for both consuming and publishing:**

Create `.npmrc` in Angular package root:

```ini
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**Generate token:**
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Scope: `read:packages` (consume), `write:packages` (publish)
4. Export: `export GITHUB_TOKEN=ghp_xxxxx` in shell or CI

---

## 📞 Continuation Commands

### When Returning to cisco-icons-core

```bash
cd /home/jorcleme/dev/cisco/cisco-icons-core
git status                    # Check for uncommitted changes
git log -1                    # Verify last commit
bun run docs:dev              # Preview site
bun run docs:build            # Test build
```

### Starting cisco-icons-angular

```bash
cd /home/jorcleme/dev/cisco
ng new cisco-icons-angular --no-standalone --package-manager=bun
cd cisco-icons-angular
# Set up .npmrc for GitHub Packages
bun add @jorcleme/cisco-icons-core
# Begin development...
```

---

## 🎯 Success Criteria

**Angular Package is "complete" when:**
- [ ] All 2,008 icons have Angular components
- [ ] Props: size, weight, color, mirrored all work
- [ ] Tree-shaking verified (unused icons not bundled)
- [ ] README with GitHub Packages installation
- [ ] Published to GitHub Packages
- [ ] Unit tests passing
- [ ] SSR compatible (if applicable)

**Then return here to:**
- [ ] Add `docs/frameworks/angular.md`
- [ ] Update landing page and nav
- [ ] Commit and push
- [ ] Deploy updated docs to GitHub Pages

---

## 📚 Reference Links

**VitePress:**
- Docs: https://vitepress.dev/
- Theme config: https://vitepress.dev/reference/theme-config
- Extending theme: https://vitepress.dev/guide/extending-default-theme

**Phosphor Icons (Architecture Reference):**
- Core repo: https://github.com/phosphor-icons/core
- React repo: https://github.com/phosphor-icons/react

**Angular:**
- Component library guide: https://angular.io/guide/libraries
- ng-packagr: https://github.com/ng-packagr/ng-packagr

**GitHub Packages:**
- Publishing: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry

---

**🚀 Ready to start cisco-icons-angular!**

*This document will be in `/home/jorcleme/dev/cisco/cisco-icons-core/TRANSITION.md` for reference.*
