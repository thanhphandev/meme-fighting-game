/**
 * Game Engine - Core modules for the fighting game
 * Barrel exports cho tất cả engine modules
 */

// Core systems
export { AI } from './core/AI';
export { InputHandler } from './core/InputHandler';
export { GameEventSystem, GAME_STATES } from './core/GameEventSystem';

// Entities
export { Fighter } from './entities/Fighter';
export { Particle } from './entities/Particle';
export { Projectile } from './entities/Projectile';

// Systems
export { MemeSystem } from './systems/MemeSystem';
export { SoundManager } from './systems/SoundManager';
export { ResourceManager, resources } from './systems/ResourceManager';

// Data
export { getDialogue, DIALOGUE_EVENTS, CHARACTER_DIALOGUES } from './data/CharacterDialogues';
export { CONFIG, CHARACTERS, BACKGROUNDS } from './data/constants';

// Skills
export * from './skills';
