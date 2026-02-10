# 🚦 Quick Checklist: Before Leaving This Repo

## ⚠️ MUST DO BEFORE SWITCHING TO ANGULAR

### 1. Commit Uncommitted Work
```bash
git status                     # Review changes
git add docs/ .github/workflows/deploy.yml .gitignore scripts/collate.ts
git commit -m "feat(docs): add VitePress site with Mint Emerald theme and pagination gallery"
git push origin main
```

**Files to commit:**
- ✅ `docs/.vitepress/config.ts` (logo, fonts)
- ✅ `docs/.vitepress/theme/` (style.css, IconGallery.vue, index.ts)
- ✅ `docs/index.md` + all guide/framework pages
- ✅ `docs/public/logo.svg` + `logo-dark.svg`
- ✅ `.github/workflows/deploy.yml`
- ✅ `.gitignore`
- ✅ `scripts/collate.ts`

### 2. Verify Build
```bash
bun run build                  # Should pass ✅
bun run docs:build             # Should pass ✅
```

### 3. (Optional) Enable GitHub Pages
- Go to: https://github.com/jorcleme/cisco-icons-core/settings/pages
- Source: "GitHub Actions"
- Save

---

## 🎯 Starting cisco-icons-angular

### Setup New Project
```bash
cd /home/jorcleme/dev/cisco

# Option 1: Standalone (recommended for Angular 14+)
ng new cisco-icons-angular --standalone --package-manager=bun

# Option 2: NgModule (traditional)
ng new cisco-icons-angular --no-standalone --package-manager=bun

cd cisco-icons-angular
```

### Configure GitHub Packages Auth
```bash
# Create .npmrc
cat > .npmrc << EOF
@jorcleme:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
EOF

# Set token in environment
export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

### Install Dependencies
```bash
bun add @jorcleme/cisco-icons-core
bun add -D @types/node
```

### Start Development
```bash
# Read TRANSITION.md for full architecture guidance
cat /home/jorcleme/dev/cisco/cisco-icons-core/TRANSITION.md
```

---

## 🔙 Returning to cisco-icons-core Later

### When Angular Package is Complete

1. **Navigate back:**
   ```bash
   cd /home/jorcleme/dev/cisco/cisco-icons-core
   ```

2. **Add Angular docs:**
   - Create `docs/frameworks/angular.md` (template in TRANSITION.md)
   - Update `docs/.vitepress/config.ts` nav/sidebar
   - Update `docs/index.md` to mention Angular
   - Update README.md

3. **Commit and deploy:**
   ```bash
   git add docs/ README.md
   git commit -m "docs: add Angular framework documentation"
   git push origin main
   ```

---

## 📋 Quick Reference

| File | Purpose |
|------|---------|
| `TRANSITION.md` | **Full context document** (read this in Angular workspace) |
| `CHECKLIST.md` | This file (immediate action items) |

**Build Commands:**
- `bun run build` → Build package
- `bun run docs:dev` → Preview docs
- `bun run docs:build` → Build docs

**Key Stats:**
- 2,008 icons total (1,512 Phosphor + 496 Cisco)
- Fonts: Inter (body) + Ubuntu Mono (code)
- Theme: Mint Emerald (emerald greens)

---

**✅ You're ready to switch to cisco-icons-angular!**
