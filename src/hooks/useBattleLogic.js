import { useEffect, useRef, useState, useCallback } from 'react';
import { Fighter } from '../engine/entities/Fighter';
import { AI } from '../engine/core/AI';
import { InputHandler } from '../engine/core/InputHandler';
import { Particle } from '../engine/entities/Particle';
import { CONFIG, CHARACTERS } from '../engine/data/constants';
import { resources } from '../engine/systems/ResourceManager';
import { Projectile } from '../engine/entities/Projectile';
import { MemeSystem } from '../engine/systems/MemeSystem';
import { SoundManager } from '../engine/systems/SoundManager';
import { GameEventSystem, GAME_STATES } from '../engine/core/GameEventSystem';
import { DIALOGUE_EVENTS } from '../engine/data/CharacterDialogues';

/**
 * useBattleLogic Hook - Quản lý toàn bộ game logic cho battle screen
 * Tách biệt game loop khỏi UI rendering để tối ưu performance
 */
export function useBattleLogic({
  playerChar,
  cpuChar,
  background,
  onGameOver,
  cpuDifficulty = 'medium',
  gameMode = 'pve',
  isPaused,
  onAnnouncement
}) {
  const canvasRef = useRef(null);
  const isFinishedRef = useRef(false);
  const effectAssets = useRef({});

  // HUD State
  const [hudData, setHudData] = useState({
    p1Health: 100,
    p1DelayedHealth: 100,
    p1Stamina: 100,
    p2Health: 100,
    p2DelayedHealth: 100,
    p2Stamina: 100,
    p1Name: CHARACTERS.find(c => c.id === playerChar)?.name || 'PLAYER 1',
    p2Name: gameMode === 'pvp' ? (CHARACTERS.find(c => c.id === cpuChar)?.name || 'PLAYER 2') : 'CPU',
    cooldownP1: 0,
    cooldownP2: 0,
  });

  const [gameState, setGameState] = useState(GAME_STATES.LOADING);
  const [showVsIntro, setShowVsIntro] = useState(true);
  const [lowHealthWarning, setLowHealthWarning] = useState({ p1: false, p2: false });
  const [hitFlash, setHitFlash] = useState({ p1: false, p2: false });
  const [koFreeze, setKoFreeze] = useState(false);

  // Refs for game objects (không trigger re-render)
  const gameRefs = useRef({
    p1: null,
    p2: null,
    ai: null,
    particles: [],
    projectiles: [],
    memeSystem: null,
    eventSystem: null,
    animationId: null,
    lastTime: 0,
    dialogueCooldown: 0,
    lastP1State: '',
    lastP2State: '',
    introShown: false,
    shakeIntensity: 0,
    isMounted: true,
    initialized: false
  });

  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  const addScreenShake = useCallback((amount) => {
    gameRefs.current.shakeIntensity = amount;
  }, []);

  const DIALOGUE_COOLDOWN = 3000;

  // Spawn meme text
  const spawnMeme = useCallback((x, y, isSpecial = false, textOverride = null) => {
    const memeSystem = gameRefs.current.memeSystem;
    if (!memeSystem) return;

    const words = isSpecial
      ? ["MUCH WOW", "ABSOLUTE UNIT", "REEEEEEEEEEE", "CHAD ENERGY", "BASED!!!", "GIGACHAD VIBES"]
      : ["WOW!", "BONK!", "MUCH HURT", "SO BATTLE", "BRUH", "EZ", "OOF"];
    const text = textOverride || words[Math.floor(Math.random() * words.length)];
    memeSystem.spawn(x, y, text, isSpecial);

    if (isSpecial) addScreenShake(20);
  }, [addScreenShake]);

  // Hit handler
  const handleHit = useCallback((x, y, isSpecial = false, textOverride = null, isP1Target = false) => {
    spawnMeme(x, y, isSpecial, textOverride);
    SoundManager.playSfx(isSpecial ? 'sfx_hit_heavy' : 'sfx_hit');

    // Trigger HUD flash
    if (isP1Target) {
      setHitFlash(prev => ({ ...prev, p1: true }));
      setTimeout(() => setHitFlash(prev => ({ ...prev, p1: false })), 200);
    } else {
      setHitFlash(prev => ({ ...prev, p2: true }));
      setTimeout(() => setHitFlash(prev => ({ ...prev, p2: false })), 200);
    }
  }, [spawnMeme]);

  // Refs for callbacks (để dùng trong gameLoop mà không trigger re-render)
  const handleHitRef = useRef(handleHit);
  const onAnnouncementRef = useRef(onAnnouncement);
  const onGameOverRef = useRef(onGameOver);

  // Update refs khi callbacks thay đổi
  useEffect(() => {
    handleHitRef.current = handleHit;
    onAnnouncementRef.current = onAnnouncement;
    onGameOverRef.current = onGameOver;
  }, [handleHit, onAnnouncement, onGameOver]);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    gameRefs.current.isMounted = true;

    // Input setup
    let inputP1;
    let inputP2 = null;

    if (gameMode === 'pvp') {
      // Separated keys for PVP to avoid crossing arms and allow 2 players on same keyboard
      const p1Keys = { left: ['a'], right: ['d'], up: ['w'], attack: ['v'], roll: ['b'], skill: ['n'] };
      const p2Keys = { left: ['arrowleft'], right: ['arrowright'], up: ['arrowup'], attack: ['numpad1', 'j'], roll: ['numpad2', 'k'], skill: ['numpad3', 'l'] };
      inputP1 = new InputHandler(p1Keys);
      inputP2 = new InputHandler(p2Keys);
    } else {
      const mergedKeys = { left: ['a', 'arrowleft'], right: ['d', 'arrowright'], up: ['w', 'arrowup'], attack: ['j', ' ', 'enter'], roll: ['k', 'shift'], skill: ['l', 'u', 'e'] };
      inputP1 = new InputHandler(mergedKeys);
    }

    // Lưu vào refs để dùng trong cleanup và đảm bảo tồn tại
    gameRefs.current.inputP1 = inputP1;
    gameRefs.current.inputP2 = inputP2;

    // Event system
    const eventSystem = new GameEventSystem({
      onStateChange: setGameState,
      onAnnouncement: (...args) => onAnnouncementRef.current(...args)
    });
    gameRefs.current.eventSystem = eventSystem;

    // Meme system
    gameRefs.current.memeSystem = new MemeSystem();

    // Projectile collision check
    const checkProjectileHit = (proj, fighter) => (
      proj.x < fighter.hitbox.x + fighter.hitbox.width &&
      proj.x + proj.width > fighter.hitbox.x &&
      proj.y < fighter.hitbox.y + fighter.hitbox.height &&
      proj.y + proj.height > fighter.hitbox.y
    );

    // Show dialogue helper
    const tryShowDialogue = (characterId, event, x, y, isPlayer1, force = false) => {
      if (!force && gameRefs.current.dialogueCooldown > 0) return;
      eventSystem.showDialogue(characterId, event, x, y, isPlayer1);
      gameRefs.current.dialogueCooldown = DIALOGUE_COOLDOWN;
    };

    // Only init once - prevent re-running on hot reload or re-render
    if (gameRefs.current.initialized) return;
    gameRefs.current.initialized = true;

    const init = async () => {
      try {
        await SoundManager.preload();
        SoundManager.playBgm('bgm_battle');

        // Preload effects
        const effectNames = ['impact', 'slash', 'fireball', 'shockwave', 'buff_aura', 'shuriken', 'egg_bomb', 'fist_giant', 'hearts', 'slime_shot', 'beach_ball', 'tornado', 'water_spin'];
        await Promise.all(effectNames.map(name => new Promise(resolve => {
          const img = new Image();
          img.src = `/assets/effects/${name}.png`;
          img.onload = () => { effectAssets.current[name] = img; resolve(); };
          img.onerror = () => resolve();
        })));

        // Preload character images
        const p1Data = CHARACTERS.find(c => c.id === playerChar);
        const p2Data = CHARACTERS.find(c => c.id === cpuChar);
        await resources.loadImages([{ id: playerChar, src: p1Data.asset }, { id: cpuChar, src: p2Data.asset }]);

        if (!gameRefs.current.isMounted) return;

        const p1Img = resources.getImage(playerChar);
        const p2Img = resources.getImage(cpuChar);

        gameRefs.current.p1 = new Fighter(ctx, 100, playerChar, false, p1Img, true);
        gameRefs.current.p2 = new Fighter(ctx, 720, cpuChar, gameMode === 'pve', p2Img, false);

        if (gameMode === 'pve') {
          gameRefs.current.ai = new AI(gameRefs.current.p2, cpuDifficulty);
        }

        setTimeout(() => {
          setShowVsIntro(false);
          eventSystem.startCountdown();
        }, 3000);

        gameRefs.current.animationId = requestAnimationFrame((ts) => {
          gameRefs.current.lastTime = ts;
          gameRefs.current.animationId = requestAnimationFrame(gameLoop);
        });
      } catch (err) {
        if (import.meta.env.DEV) console.error("Failed to initialize battle:", err);
      }
    };

    // Fixed timestep game loop - Cố định 60 FPS
    const FIXED_TIME_STEP = 1000 / 60; // ~16.67ms
    let accumulator = 0;

    const gameLoop = (timeStamp) => {
      if (!gameRefs.current.isMounted) return;

      if (isPausedRef.current) {
        gameRefs.current.lastTime = timeStamp;
        gameRefs.current.animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const elapsed = timeStamp - gameRefs.current.lastTime;
      gameRefs.current.lastTime = timeStamp;

      // Tích lũy thời gian chưa xử lý (capped để tránh spiral of death)
      accumulator += Math.min(elapsed, 100);

      // Update logic với fixed timestep - có thể update nhiều lần nếu cần
      while (accumulator >= FIXED_TIME_STEP) {
        updateGameLogic(FIXED_TIME_STEP);
        accumulator -= FIXED_TIME_STEP;
      }

      // Render mượt với interpolation (nếu cần)
      renderGame();

      gameRefs.current.animationId = requestAnimationFrame(gameLoop);
    };

    const updateGameLogic = (deltaTime) => {
      // Update dialogue cooldown
      if (gameRefs.current.dialogueCooldown > 0) gameRefs.current.dialogueCooldown -= deltaTime;

      const { eventSystem } = gameRefs.current;
      eventSystem.update(deltaTime);

      const { p1, p2, ai, inputP1, inputP2 } = gameRefs.current;
      if (!p1 || !p2 || !inputP1) return;

      // Game logic
      if (eventSystem.state === GAME_STATES.FIGHTING) {
        const p1Input = inputP1.getPlayerInput();
        if (!p1.isDead) p1.handleInput(p1Input);
        if (gameMode === 'pve') {
          if (!p2.isDead && ai) ai.update(deltaTime, p1);
        } else {
          if (!p2.isDead && inputP2) p2.handleInput(inputP2.getPlayerInput());
        }

        // State change tracking for dialogues
        if (p1.state !== gameRefs.current.lastP1State) {
          if (p1.state === 'attack') tryShowDialogue(playerChar, DIALOGUE_EVENTS.ATTACK, p1.x + p1.width / 2, p1.y, true);
          else if (p1.state === 'skill') {
            tryShowDialogue(playerChar, DIALOGUE_EVENTS.SKILL, p1.x + p1.width / 2, p1.y, true, true);
            SoundManager.playSfx('sfx_skill_activate');
          } else if (p1.state === 'hit') tryShowDialogue(playerChar, DIALOGUE_EVENTS.HIT, p1.x + p1.width / 2, p1.y, true);
          else if (p1.state === 'roll') SoundManager.playSfx('sfx_dash');
          else if (p1.state === 'jump') SoundManager.playSfx('sfx_jump');
          gameRefs.current.lastP1State = p1.state;
        }

        if (p2.state !== gameRefs.current.lastP2State) {
          if (p2.state === 'attack') tryShowDialogue(cpuChar, DIALOGUE_EVENTS.ATTACK, p2.x + p2.width / 2, p2.y, false);
          else if (p2.state === 'skill') {
            tryShowDialogue(cpuChar, DIALOGUE_EVENTS.SKILL, p2.x + p2.width / 2, p2.y, false, true);
            SoundManager.playSfx('sfx_skill_activate');
          } else if (p2.state === 'hit') tryShowDialogue(cpuChar, DIALOGUE_EVENTS.HIT, p2.x + p2.width / 2, p2.y, false);
          else if (p2.state === 'roll') SoundManager.playSfx('sfx_dash');
          gameRefs.current.lastP2State = p2.state;
        }

        // Block dialogues
        if (p1.isBlocking && Math.random() < 0.02) {
          tryShowDialogue(playerChar, DIALOGUE_EVENTS.BLOCK, p1.x + p1.width / 2, p1.y, true);
          SoundManager.playSfx('sfx_block');
        }
        if (p2.isBlocking && Math.random() < 0.02) {
          tryShowDialogue(cpuChar, DIALOGUE_EVENTS.BLOCK, p2.x + p2.width / 2, p2.y, false);
          SoundManager.playSfx('sfx_block');
        }

        p1.update(deltaTime, p2, (x, y, s, t) => handleHitRef.current(x, y, s, t, false), (x, y, type) => {
          const image = effectAssets.current[type];
          gameRefs.current.particles.push(new Particle(x, y, type, image));
        }, (x, y, facingRight, ownerId, config) => {
          const image = config.effect ? effectAssets.current[config.effect] : null;
          gameRefs.current.projectiles.push(new Projectile(x, y, facingRight, ownerId, config, image));
          SoundManager.playSfx('sfx_projectile');
        });

        p2.update(deltaTime, p1, (x, y, s, t) => handleHitRef.current(x, y, s, t, true), (x, y, type) => {
          const image = effectAssets.current[type];
          gameRefs.current.particles.push(new Particle(x, y, type, image));
        }, (x, y, facingRight, ownerId, config) => {
          const image = config.effect ? effectAssets.current[config.effect] : null;
          gameRefs.current.projectiles.push(new Projectile(x, y, facingRight, ownerId, config, image));
          SoundManager.playSfx('sfx_projectile');
        });
      }
    };

    const renderGame = () => {
      const { p1, p2, particles, projectiles, memeSystem, eventSystem, shakeIntensity } = gameRefs.current;

      ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

      // Screen shake
      ctx.save();
      if (shakeIntensity > 0) {
        const dx = (Math.random() - 0.5) * shakeIntensity;
        const dy = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(dx, dy);
        gameRefs.current.shakeIntensity *= 0.9;
        if (gameRefs.current.shakeIntensity < 0.5) gameRefs.current.shakeIntensity = 0;
      }

      // Check p1/p2 tồn tại trước khi vẽ
      if (!p1 || !p2) {
        ctx.restore();
        eventSystem.draw(ctx);
        return;
      }

      // Intro dialogues
      if (!gameRefs.current.introShown && eventSystem.state === GAME_STATES.FIGHTING) {
        gameRefs.current.introShown = true;
        setTimeout(() => {
          if (!gameRefs.current.isMounted) return;
          tryShowDialogue(playerChar, DIALOGUE_EVENTS.INTRO, p1.x + p1.width / 2, p1.y, true, true);
        }, 500);
        setTimeout(() => {
          if (!gameRefs.current.isMounted) return;
          tryShowDialogue(cpuChar, DIALOGUE_EVENTS.INTRO, p2.x + p2.width / 2, p2.y, false, true);
        }, 1000);
      }

      // Render particles
      particles.forEach(p => p.update());
      gameRefs.current.particles = particles.filter(p => p.alive);
      gameRefs.current.particles.forEach(p => p.draw(ctx));

      // Handle projectiles
      projectiles.forEach(proj => {
        proj.update(FIXED_TIME_STEP);
        proj.draw(ctx);

        if (proj.ownerId !== p1.characterId && !p1.isDead && checkProjectileHit(proj, p1)) {
          p1.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, (x, y, type) => {
            const image = effectAssets.current[type];
            particles.push(new Particle(x, y, type, image));
          });
          proj.alive = false;
          handleHitRef.current(p1.x, p1.y, false, "OOF", true);
        }
        if (proj.ownerId !== p2.characterId && !p2.isDead && checkProjectileHit(proj, p2)) {
          p2.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, (x, y, type) => {
            const image = effectAssets.current[type];
            particles.push(new Particle(x, y, type, image));
          });
          proj.alive = false;
          handleHitRef.current(p2.x, p2.y, false, "BONK", false);
        }
      });
      gameRefs.current.projectiles = projectiles.filter(p => p.alive);

      // Draw meme texts
      memeSystem.update(FIXED_TIME_STEP);
      memeSystem.draw(ctx);

      // Draw fighters
      p1.draw();
      p2.draw();

      // Draw Event System overlays
      eventSystem.draw(ctx);

      ctx.restore();

      // Update HUD state
      const p1HpPercent = (p1.health / CONFIG.baseHp) * 100;
      const p2HpPercent = (p2.health / CONFIG.baseHp) * 100;

      setHudData(prev => ({
        p1Health: p1HpPercent,
        p1DelayedHealth: prev.p1DelayedHealth > p1HpPercent
          ? Math.max(p1HpPercent, prev.p1DelayedHealth - 0.3)
          : p1HpPercent,
        p1Stamina: p1.stamina,
        p2Health: p2HpPercent,
        p2DelayedHealth: prev.p2DelayedHealth > p2HpPercent
          ? Math.max(p2HpPercent, prev.p2DelayedHealth - 0.3)
          : p2HpPercent,
        p2Stamina: p2.stamina,
        p1Name: prev.p1Name,
        p2Name: prev.p2Name,
        cooldownP1: Math.max(0, p1.skillCooldown / CONFIG.skillCooldown * 100),
        cooldownP2: Math.max(0, p2.skillCooldown / CONFIG.skillCooldown * 100),
      }));

      setLowHealthWarning({ p1: p1HpPercent < 25, p2: p2HpPercent < 25 });

      // Game End
      if ((p1.isDead || p2.isDead) && !isFinishedRef.current) {
        isFinishedRef.current = true;
        setKoFreeze(true);

        setTimeout(() => {
          setKoFreeze(false);
          if (p1.isDead) {
            p2.setVictory();
            SoundManager.playSfx('announce_ko');
            setTimeout(() => {
              if (!gameRefs.current.isMounted) return;
              tryShowDialogue(cpuChar, DIALOGUE_EVENTS.WIN, p2.x + p2.width / 2, p2.y, false, true);
            }, 800);
            setTimeout(() => {
              if (!gameRefs.current.isMounted) return;
              tryShowDialogue(playerChar, DIALOGUE_EVENTS.LOSE, p1.x + p1.width / 2, p1.y, true, true);
            }, 1400);
          } else {
            p1.setVictory();
            SoundManager.playSfx('announce_ko');
            setTimeout(() => {
              if (!gameRefs.current.isMounted) return;
              tryShowDialogue(playerChar, DIALOGUE_EVENTS.WIN, p1.x + p1.width / 2, p1.y, true, true);
            }, 800);
            setTimeout(() => {
              if (!gameRefs.current.isMounted) return;
              tryShowDialogue(cpuChar, DIALOGUE_EVENTS.LOSE, p2.x + p2.width / 2, p2.y, false, true);
            }, 1400);
          }

          SoundManager.fadeOutBgm(1500);
          setTimeout(() => {
            if (gameRefs.current.isMounted) onGameOverRef.current(p1.isDead ? 'cpu' : 'p1');
          }, 2500);
        }, 1000);
      }
    };

    init();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const refs = gameRefs.current;
      refs.isMounted = false;
      refs.initialized = false;
      cancelAnimationFrame(refs.animationId);
      refs.inputP1?.destroy();
      refs.inputP2?.destroy();
      isFinishedRef.current = false;
      SoundManager.stopBgm();
    };
  // Chỉ re-run khi character, game mode thực sự thay đổi - KHÔNG bao gồm isPaused, callbacks
  }, [playerChar, cpuChar, background, cpuDifficulty, gameMode]);

  // isPaused is handled via isPausedRef inside the game loop to avoid re-initializing

  return {
    canvasRef,
    hudData,
    gameState,
    showVsIntro,
    lowHealthWarning,
    hitFlash,
    koFreeze,
    setShowVsIntro
  };
}
