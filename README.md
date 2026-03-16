# Meme Fighting Game

A browser-based 2D fighting game featuring popular meme characters. Built with React, Canvas API, and optimized for 60fps performance.

![Game Screenshot](screenshot.png)

## Features

- **20+ Meme Characters**: Choose from buff doge, pepe, zoro, luffy gear 5, and more
- **Multiple Game Modes**: PvE vs AI or PvP local multiplayer
- **Special Skills**: Each character has unique skills (projectiles, buffs, AoE, dashes)
- **Smooth 60fps Combat**: Canvas-based rendering with particle effects
- **Meme Dialogues**: Character-specific dialogues during battles
- **Responsive UI**: Works on desktop with keyboard controls

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Game Engine**: Custom Canvas-based engine with ECS pattern
- **State Management**: React Context + useReducer
- **Build**: Optimized code splitting and lazy loading

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

## Project Structure

```
src/
├── components/          # React UI components
│   ├── battle/         # Battle screen sub-components
│   ├── Menu.jsx
│   ├── SelectionScreen.jsx
│   └── ...
├── contexts/           # Global state contexts
│   ├── GameStateContext.jsx
│   └── AudioContext.jsx
├── engine/             # Game engine modules
│   ├── core/          # Core systems (AI, Input, Events)
│   ├── entities/      # Game entities (Fighter, Particle)
│   ├── systems/       # Managers (Sound, Resources)
│   └── data/          # Constants, dialogues
├── game/              # Legacy game modules (backward compat)
├── hooks/             # Custom React hooks
│   └── useBattleLogic.js
└── App.jsx
```

## Controls

### Player 1
- **WASD**: Move
- **J**: Attack
- **K**: Dash/Roll
- **L**: Skill

### Player 2 (PvP)
- **Arrow Keys**: Move
- **Num 1 / .**: Attack
- **Num 2 / /**: Dash
- **Num 3 / ;**: Skill

## Architecture

### Performance Optimizations

1. **Code Splitting**: Lazy loading for SelectionScreen and BattleScreen
2. **Memoization**: All battle sub-components use React.memo
3. **Custom Hook**: Game logic separated from UI rendering
4. **Canvas Optimization**: Object pooling for particles, efficient RAF scheduling
5. **Bundle Splitting**: Vite manual chunks for vendors and game engine

### State Management

- `GameStateContext`: Global game state with useReducer
- `AudioContext`: Sound management (replaces singleton)
- `useBattleLogic`: Encapsulates all battle game loop logic

## Adding New Characters

1. Add character data to `src/game/constants.js`:
```javascript
{
  id: 'new_char',
  name: 'Character Name',
  asset: 'characters/new_char/spritesheet.png',
  stats: { speed: 8, jump: 16, damage: 18 },
  rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7 },
  frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 4, skill: 6, hit: 3, ko: 1 },
  skill: {
    name: 'SKILL NAME',
    type: 'projectile', // or 'buff', 'aoe', 'dash'
    data: { /* skill config */ }
  }
}
```

2. Add spritesheet to `public/characters/new_char/spritesheet.png` (6 columns x 8 rows)

## License

MIT License

