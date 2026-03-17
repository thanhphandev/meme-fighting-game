# Contributing to Meme Battle Arena

Thank you for taking the time to contribute! This document outlines the process for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Project Conventions](#project-conventions)

---

## Code of Conduct

Be respectful. Constructive feedback only. Meme references encouraged.

---

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/thanhphandev/meme-fighting-game/issues) first
2. Open a new issue with the **Bug Report** template
3. Include: browser/OS, steps to reproduce, expected vs actual behavior

### Suggesting Features

1. Open an issue with the **Feature Request** template
2. Describe the use case, not just the solution
3. For large changes, wait for maintainer feedback before coding

### Good First Contributions

| Area | Examples |
|---|---|
| 🐸 New characters | Add a new meme character with spritesheet + dialogues |
| 🤖 AI improvements | Better decision-making, combo patterns |
| ⚡ New skill types | Teleport, counter, multi-hit, etc. |
| 🧪 Tests | Unit tests for Fighter, AI, GameEventSystem |
| 🐛 Bug fixes | Check open issues labeled `bug` |
| 📖 Docs | Improve README, add JSDoc comments |

---

## Development Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/meme-fighting-game.git
cd meme-fighting-game

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run lint before committing
pnpm lint

# Run tests
pnpm test
```

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

| Type | When to use |
|---|---|
| `feat` | New feature or character |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build process, dependencies, config |

**Examples:**
```
feat(characters): add Shrek as playable character
fix(fighter): prevent double-hit on dash skill
perf(renderer): reduce canvas state saves in drawDialogues
docs(readme): update controls section
```

---

## Pull Request Process

1. **Branch** off `main`: `git checkout -b feat/your-feature`
2. **Keep PRs focused** — one feature or fix per PR
3. **Lint must pass**: `pnpm lint` with zero errors
4. **Tests**: add tests for new logic where applicable
5. **Update docs**: if you change behavior, update README or JSDoc
6. **PR description**: explain what changed and why

PRs are reviewed within a few days. Feedback will be given as inline comments.

---

## Project Conventions

### File Naming
- React components: `PascalCase.jsx`
- Engine modules: `PascalCase.js`
- Hooks: `useCamelCase.js`

### Code Style
- ESLint config is enforced — run `pnpm lint:fix` to auto-fix
- Prefer `const` over `let`, avoid `var`
- Use `useCallback` / `useMemo` for functions passed as props or used in effects
- Game loop logic stays in `useBattleLogic.js`, not in components

### Adding a Character Checklist

- [ ] Spritesheet added to `public/assets/characters/<id>/spritesheet.png`
- [ ] Character entry added to `CHARACTERS` array in `constants.js`
- [ ] `frameCounts` defined for all animation states
- [ ] Dialogues added to `CharacterDialogues.js` (all 8 event types)
- [ ] Skill `type` is one of: `projectile`, `buff`, `aoe`, `dash`
- [ ] Tested in both PvE and PvP modes

---

Thank you for contributing! 🎮
