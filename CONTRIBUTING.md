# Contributing to @jorcleme/cisco-icons-core

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something great together.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/cisco-icons-core.git
cd cisco-icons-core
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/jorcleme/cisco-icons-core.git
```

## Development Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Build the project

```bash
bun run build
```

This runs the full pipeline: `clean → collate → catalog → vite build → tsc`

### 3. Individual build steps

```bash
# Copy and process SVGs from raw/ to assets/
bun run collate

# Generate the icon catalog (src/icons.ts) from assets/
bun run catalog

# Build the metadata bundle (dist/)
bun run build:lib
```

## Project Structure

```
cisco-icons-core/
├── raw/                     # Source SVG files (canonical source)
│   ├── thin/                # Phosphor thin weight
│   ├── light/               # Phosphor light weight
│   ├── regular/             # Phosphor regular weight
│   ├── bold/                # Phosphor bold weight
│   ├── fill/                # Phosphor fill weight
│   ├── duotone/             # Phosphor duotone weight
│   └── cisco/               # Cisco branded icons
├── assets/                  # Processed SVGs (committed, published)
│   ├── phosphor/
│   │   ├── thin/
│   │   ├── light/
│   │   ├── regular/
│   │   ├── bold/
│   │   ├── fill/
│   │   └── duotone/
│   └── cisco/
│       └── regular/
├── scripts/                 # Build tooling
│   ├── index.ts             # Shared constants and utilities
│   ├── collate.ts           # raw/ → assets/ processing
│   └── catalog.ts           # Generates src/icons.ts metadata
├── src/                     # TypeScript source
│   ├── types.ts             # IconWeight, IconFamily, IconEntry
│   ├── icons.ts             # Generated icon catalog
│   └── index.ts             # Re-exports
├── dist/                    # Compiled metadata bundle (gitignored)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Making Changes

### Types of Contributions

#### Adding New Icons

1. Place SVG files in the appropriate `raw/` subdirectory:
   - Cisco icons → `raw/cisco/`
   - Phosphor icons → `raw/{weight}/` (all 6 weights)
2. Run `bun run build` to process and catalog them
3. Verify the icon appears in `src/icons.ts`
4. Submit a PR

#### Bug Fixes

1. Check existing issues to avoid duplicates
2. Create a new issue describing the bug
3. Fork, fix, and submit a PR referencing the issue

#### Build Script Changes

1. Open an issue to discuss the change first
2. Wait for maintainer feedback before implementing
3. Ensure `bun run build` still works end-to-end

#### Documentation

- Fix typos, improve clarity, add examples
- Documentation PRs are always welcome

### Code Style

- Use TypeScript with strict mode
- Follow existing patterns in the codebase
- No `as any`, `@ts-ignore`, or `@ts-expect-error`
- Prefer Bun for all operations

### SVG Guidelines

- All SVGs should use `currentColor` for fill/stroke (the collate step handles this)
- Cisco icon filenames should be prefixed with `icon-` or `Icon-`
- Phosphor icons follow the `{name}-{weight}.svg` convention

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation changes                     |
| `style`    | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring                          |
| `test`     | Adding or updating tests                  |
| `chore`    | Maintenance tasks                         |
| `build`    | Build system changes                      |

### Examples

```bash
feat(icons): add new cisco catalyst icons
fix(collate): handle SVGs with spaces in filenames
docs(readme): add Vite usage example
build(scripts): improve name normalization for cisco icons
chore(deps): update vite to 6.5.0
```

## Pull Request Process

### Before Submitting

1. Sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

2. Run the full build:

```bash
bun run build
```

3. Ensure your branch is up to date

### PR Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why, not how
3. **Link Issues**: Reference related issues with `Fixes #123` or `Closes #123`
4. **Keep PRs Focused**: One feature/fix per PR

### Review Process

1. Maintainers will review within a few days
2. Address feedback promptly
3. Once approved, a maintainer will merge

## Reporting Issues

### Bug Reports

Use the [bug report template](https://github.com/jorcleme/cisco-icons-core/issues/new?template=bug_report.md) and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, bundler, OS)

### Feature Requests

Use the [feature request template](https://github.com/jorcleme/cisco-icons-core/issues/new?template=feature_request.md) and include:

- Clear description of the feature
- Use case / motivation
- Proposed API if applicable

### Icon Requests

Use the [icon request template](https://github.com/jorcleme/cisco-icons-core/issues/new?template=icon_request.md). New icons added here automatically propagate to downstream libraries.

### Security Issues

For security vulnerabilities, please email jorcleme@cisco.com directly instead of opening a public issue.

## Downstream Libraries

This core package is consumed as a git submodule by:

- [@jorcleme/cisco-icons-svelte](https://github.com/jorcleme/cisco-icons-svelte)
- [@jorcleme/cisco-icons-react](https://github.com/jorcleme/cisco-icons-react)

Changes here propagate downstream, so please be mindful of breaking changes to the `assets/` directory structure or `src/` exports.

## Questions?

- Open a [Discussion](https://github.com/jorcleme/cisco-icons-core/discussions) for general questions
- Check existing issues and discussions first

---

Thank you for contributing!
