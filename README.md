<div align="center">

# ⚔️ Meme Battle Arena

**A browser-based 2D fighting game featuring your favorite internet meme characters.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Play Now](#) · [Report Bug](https://github.com/thanhphandev/meme-fighting-game/issues) · [Request Feature](https://github.com/thanhphandev/meme-fighting-game/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Controls](#-controls)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Adding Characters](#-adding-a-new-character)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎮 About

Meme Battle Arena is an open-source 2D fighting game that runs entirely in the browser. Pick from 20+ iconic internet meme characters — each with unique stats, special skills, and Vietnamese GenZ-style battle dialogues — and fight against AI or a friend on the same keyboard.

Built with a custom Canvas-based game engine on top of React, targeting a locked 60 FPS with a fixed-timestep game loop.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🐸 **20+ Characters** | Buff Doge, Pepe, Capybara, Zoro, Luffy Gear 5, Cell Perfect, and more |
| 🤖 **PvE vs AI** | Three difficulty levels: Easy / Medium / Hard |
| 👥 **Local PvP** | Two players on the same keyboard |
| ⚡ **Unique Skills** | Projectiles, AoE, dash attacks, and buff skills per character |
| 💬 **Battle Dialogues** | Character-specific Vietnamese GenZ dialogue bubbles |
| 🎨 **Particle Effects** | Hit sparks, blood, dust, and meme text popups |
| 🔊 **Full Audio** | BGM, SFX, per-channel mute and volume control |
| 📱 **Responsive UI** | Fullscreen support, clean HUD with health and stamina bars |

---

## 🛠 Tech Stack

- **Runtime**: React 19, Vite 7
- **Rendering**: HTML5 Canvas API (custom engine, no game framework)
- **Styling**: Tailwind CSS 4, Framer Motion
- **State**: React Context + `useReducer`
- **Audio**: Web Audio API via custom `SoundManager`
- **Tooling**: ESLint 9, Vitest, pnpm

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8 (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/thanhphandev/meme-fighting-game.git
cd meme-fighting-game

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Commands

```bash
pnpm build       # Production build → dist/
pnpm preview     # Preview production build locally
pnpm lint        # Run ESLint
pnpm lint:fix    # Auto-fix lint errors
pnpm test        # Run tests (Vitest)
pnpm coverage    # Generate test coverage report
```

---

## 🎮 Controls

### Player 1

| Action | Key |
|---|---|
| Move | `W` `A` `S` `D` |
| Attack | `J` or `Space` |
| Dash / Roll | `K` |
| Special Skill | `L` or `U` |

### Player 2 (PvP only)

| Action | Key |
|---|---|
| Move | `Arrow Keys` |
| Attack | `Numpad 1` or `.` |
| Dash / Roll | `Numpad 2` or `/` |
| Special Skill | `Numpad 3` or `;` |

> **Tip:** Hold the direction away from your opponent while being attacked to block. Blocking reduces damage by 80%.

---

## 📁 Project Structure

```
meme-fighting-game/
├── public/
│   └── assets/
│       ├── characters/          # Spritesheets (one folder per character)
│       ├── backgrounds/         # Stage backgrounds
│       └── sounds/              # BGM and SFX files
├── src/
│   ├── components/
│   │   ├── battle/              # HUD, Canvas, VSIntro, Overlays
│   │   ├── BattleScreen.jsx
│   │   ├── Menu.jsx
│   │   ├── SelectionScreen.jsx
│   │   └── ...
│   ├── contexts/
│   │   ├── GameStateContext.jsx  # Global game state (useReducer)
│   │   └── AudioContext.jsx      # Audio state bridge
│   ├── engine/
│   │   ├── core/
│   │   │   ├── AI.js             # CPU opponent logic
│   │   │   ├── InputHandler.js   # Keyboard input with buffering
│   │   │   └── GameEventSystem.js # Announcements, countdowns, dialogues
│   │   ├── entities/
│   │   │   ├── Fighter.js        # Player/CPU entity & state machine
│   │   │   ├── Projectile.js     # Projectile physics
│   │   │   └── Particle.js       # Visual effect particles
│   │   ├── systems/
│   │   │   ├── SoundManager.js   # BGM/SFX with volume & mute control
│   │   │   ├── ResourceManager.js # Image preloading & caching
│   │   │   └── MemeSystem.js     # Floating meme text popups
│   │   └── data/
│   │       ├── constants.js      # Character definitions, CONFIG, BACKGROUNDS
│   │       └── CharacterDialogues.js # Per-character dialogue lines
│   ├── hooks/
│   │   └── useBattleLogic.js     # Game loop, input, rendering orchestration
│   └── App.jsx                   # Screen router
├── tests/
│   ├── unit/
│   └── integration/
├── vite.config.js
└── vitest.config.js
```

---

## 🏗 Architecture

### Game Loop

The game uses a **fixed-timestep loop** at 60 FPS decoupled from React's render cycle:

```
requestAnimationFrame
  └── accumulate elapsed time
      └── updateGameLogic(16.67ms) × N   ← physics, AI, input, dialogues
          └── renderGame()               ← canvas draw, HUD state sync
```

All mutable game state lives in `useRef` to avoid triggering React re-renders. Only HUD data (health, stamina, cooldowns) is synced to React state once per frame.

### Fighter State Machine

Each `Fighter` runs a simple state machine:

```
idle ──► run ──► jump / fall
  │               │
  ▼               ▼
attack ──► hit ──► ko
  │
  ▼
skill ──► roll
```

Input is buffered for 150ms so attacks registered slightly early still connect.

### Skill System

Four skill archetypes defined per character in `constants.js`:

| Type | Behavior |
|---|---|
| `projectile` | Spawns a physics-driven projectile |
| `buff` | Applies a temporary stat multiplier |
| `aoe` | Tick-damage in a radius around the caster |
| `dash` | Fast directional dash with optional invincibility |

---

## 🧩 Adding a New Character

1. **Add the spritesheet** to `public/assets/characters/<id>/spritesheet.png`
   - Grid layout: 6 columns × N rows, each frame 256×256 px

2. **Register in `src/engine/data/constants.js`**:

```js
{
  id: 'my_char',
  name: 'My Character',
  asset: 'characters/my_char/spritesheet.png',
  description: 'Short description.',
  stats: { speed: 8, jump: 16, damage: 18 },
  rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7 },
  frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
  skill: {
    name: 'SKILL NAME',
    type: 'projectile', // 'projectile' | 'buff' | 'aoe' | 'dash'
    data: { speedX: 15, speedY: 0, damage: 25, width: 40, height: 40,
            color: '#ff0', shape: 'circle', life: 60, knockback: 15, effect: 'fireball' }
  }
}
```

3. **Add dialogues** in `src/engine/data/CharacterDialogues.js`:

```js
my_char: {
  intro:  ["Ready!", "Let's go!"],
  attack: ["Take this!", "Hit!"],
  skill:  ["ULTIMATE!", "Special move!"],
  hit:    ["Ow!", "That hurt!"],
  block:  ["Blocked!", "Nope!"],
  win:    ["Victory!", "GG!"],
  lose:   ["Nooo!", "GG..."],
  taunt:  ["Too slow!", "Come on!"],
}
```

That's it — the character will appear in the selection screen automatically.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and ensure lint passes: `pnpm lint`
4. Commit using conventional commits: `git commit -m "feat: add new character"`
5. Push and open a Pull Request

Please open an issue first for major changes so we can discuss the approach.

### Good First Issues

- Adding new meme characters
- Improving AI behavior
- Adding new skill types
- Writing more unit tests
- Improving mobile/touch support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project. If you build something cool with it, a star ⭐ is always appreciated.

---

<div align="center">

Made with ❤️ by [thanhphandev](https://github.com/thanhphandev)

</div>
