import { describe, it, expect } from 'vitest';
import { CHARACTERS, CONFIG } from '../../src/engine/data/constants';

describe('Game Constants', () => {
  it('should have valid character data', () => {
    expect(CHARACTERS.length).toBeGreaterThan(0);

    CHARACTERS.forEach(char => {
      expect(char.id).toBeDefined();
      expect(char.name).toBeDefined();
      expect(char.asset).toBeDefined();
      expect(char.stats).toMatchObject({
        speed: expect.any(Number),
        jump: expect.any(Number),
        damage: expect.any(Number),
      });
      expect(char.rows).toBeDefined();
      expect(char.frameCounts).toBeDefined();
      expect(char.skill).toMatchObject({
        name: expect.any(String),
        type: expect.any(String),
      });
    });
  });

  it('should have valid config', () => {
    expect(CONFIG.canvasWidth).toBeGreaterThan(0);
    expect(CONFIG.canvasHeight).toBeGreaterThan(0);
    expect(CONFIG.gravity).toBeGreaterThan(0);
    expect(CONFIG.baseHp).toBeGreaterThan(0);
    expect(CONFIG.fps).toBe(60);
  });
});
