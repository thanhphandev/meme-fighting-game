import { useEffect, useRef, useState, useCallback } from 'react'
import { Fighter } from '../game/Fighter'
import { AI } from '../game/AI'
import { InputHandler } from '../game/InputHandler'
import { Particle } from '../game/Particle'
import { CONFIG, BACKGROUNDS, MEME_WORDS, CHARACTERS } from '../game/constants'
import { resources } from '../game/ResourceManager'
import { Projectile } from '../game/Projectile'
import { MemeSystem } from '../game/MemeSystem'
import { SoundManager } from '../game/SoundManager'
import { GameEventSystem, GAME_STATES } from '../game/GameEventSystem'
import { DIALOGUE_EVENTS } from '../game/CharacterDialogues'
import PauseMenu from './PauseMenu'
import SoundControl from './SoundControl'
import { Pause, Maximize, Minimize } from 'lucide-react'

export default function BattleScreen({ playerChar, cpuChar, background, onGameOver, cpuDifficulty = 'medium', onQuit, gameMode = 'pve' }) {
    const canvasRef = useRef(null)
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
    })

    const isFinishedRef = useRef(false)
    const [isPaused, setIsPaused] = useState(false)
    const isPausedRef = useRef(isPaused)
    const [gameState, setGameState] = useState(GAME_STATES.LOADING)
    const [announcement, setAnnouncement] = useState(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const effectAssets = useRef({})

    useEffect(() => {
        isPausedRef.current = isPaused
    }, [isPaused])

    // Track fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        // INPUT SETUP
        let inputP1, inputP2

        // P1 Controls (WASD + Space/Shift/E)
        const p1Keys = {
            left: ['a'], right: ['d'], up: ['w'],
            attack: [' '], roll: ['shift'], skill: ['e']
        }
        inputP1 = new InputHandler(p1Keys)

        if (gameMode === 'pvp') {
            const p2Keys = {
                left: ['arrowleft'], right: ['arrowright'], up: ['arrowup'],
                attack: ['enter'], roll: ['control'], skill: ['delete', 'backspace']
            }
            inputP2 = new InputHandler(p2Keys)
        } else {
            const mergedKeys = {
                left: ['a', 'arrowleft'], right: ['d', 'arrowright'], up: ['w', 'arrowup'],
                attack: [' ', 'enter'], roll: ['shift', 'control'], skill: ['e', 'delete']
            }
            inputP1 = new InputHandler(mergedKeys)
        }

        let animationId
        let isMounted = true

        // Core Game Objects
        let p1, p2, ai
        let particles = []
        let projectiles = []

        // Game Event System
        const eventSystem = new GameEventSystem({
            onStateChange: (state) => {
                setGameState(state)
            },
            onAnnouncement: (ann) => {
                setAnnouncement(ann)
                setTimeout(() => setAnnouncement(null), ann.timer || 2000)
            }
        })

        // Track last states for dialogue triggers
        let lastP1State = ''
        let lastP2State = ''
        let introShown = false

        const init = async () => {
            try {
                // Preload sounds
                await SoundManager.preload()

                // Start battle BGM
                SoundManager.playBgm('bgm_battle')

                // Preload effects
                const effectNames = ['impact', 'slash', 'fireball', 'shockwave', 'buff_aura', 'shuriken', 'egg_bomb', 'fist_giant', 'hearts', 'slime_shot', 'beach_ball', 'tornado', 'water_spin'];
                const effectLoadPromises = effectNames.map(name => {
                    return new Promise(resolve => {
                        const img = new Image();
                        img.src = `/assets/effects/${name}.png`;
                        img.onload = () => { effectAssets.current[name] = img; resolve(); };
                        img.onerror = () => { console.warn('Failed to load effect', name); resolve(); };
                    });
                });
                await Promise.all(effectLoadPromises);

                // Preload character images
                const p1Data = CHARACTERS.find(c => c.id === playerChar)
                const p2Data = CHARACTERS.find(c => c.id === cpuChar)
                const assetsToLoad = [
                    { id: playerChar, src: p1Data.asset },
                    { id: cpuChar, src: p2Data.asset }
                ]
                await resources.loadImages(assetsToLoad)

                if (!isMounted) return

                const p1Img = resources.getImage(playerChar)
                const p2Img = resources.getImage(cpuChar)

                // Initialize Fighters
                p1 = new Fighter(ctx, 100, playerChar, false, p1Img, true)
                const isP2AI = gameMode === 'pve'
                p2 = new Fighter(ctx, 720, cpuChar, isP2AI, p2Img, false)

                if (isP2AI) {
                    ai = new AI(p2, cpuDifficulty)
                }

                // Start countdown
                eventSystem.startCountdown()
                animationId = requestAnimationFrame(gameLoop)

            } catch (err) {
                console.error("Failed to initialize battle:", err)
            }
        }

        let lastTime = 0

        // Particle System
        const spawnParticle = (x, y, type) => {
            const image = effectAssets.current[type];
            particles.push(new Particle(x, y, type, image))
        }

        // Projectile System
        const spawnProjectile = (x, y, facingRight, ownerId, config) => {
            const image = config.effect ? effectAssets.current[config.effect] : null;
            projectiles.push(new Projectile(x, y, facingRight, ownerId, config, image))
            SoundManager.playSfx('sfx_projectile')
        }

        // Meme System
        const memeSystem = new MemeSystem()

        // Screen Shake
        let shakeIntensity = 0
        const addScreenShake = (amount) => {
            shakeIntensity = amount
        }

        const spawnMeme = (x, y, isSpecial = false, textOverride = null) => {
            const words = isSpecial ?
                ["MUCH WOW", "ABSOLUTE UNIT", "REEEEEEEEEEE", "CHAD ENERGY", "BASED!!!", "GIGACHAD VIBES"] :
                MEME_WORDS
            const text = textOverride || words[Math.floor(Math.random() * words.length)]
            memeSystem.spawn(x, y, text, isSpecial)

            if (isSpecial) {
                addScreenShake(20)
            }
        }

        // Enhanced hit handler with sound and dialogue
        const handleHit = (x, y, isSpecial = false, textOverride = null) => {
            spawnMeme(x, y, isSpecial, textOverride)
            SoundManager.playSfx(isSpecial ? 'sfx_hit_heavy' : 'sfx_hit')
        }

        const checkProjectileHit = (proj, fighter) => {
            return (proj.x < fighter.hitbox.x + fighter.hitbox.width &&
                proj.x + proj.width > fighter.hitbox.x &&
                proj.y < fighter.hitbox.y + fighter.hitbox.height &&
                proj.y + proj.height > fighter.hitbox.y)
        }

        // Dialogue cooldown tracking
        let dialogueCooldown = 0
        const DIALOGUE_COOLDOWN = 3000 // 3 seconds between dialogues

        const tryShowDialogue = (characterId, event, x, y, isPlayer1, force = false) => {
            if (!force && dialogueCooldown > 0) return
            eventSystem.showDialogue(characterId, event, x, y, isPlayer1)
            dialogueCooldown = DIALOGUE_COOLDOWN
        }

        const gameLoop = (timeStamp) => {
            if (!isMounted) return

            if (isPausedRef.current) {
                lastTime = timeStamp
                animationId = requestAnimationFrame(gameLoop)
                return
            }

            const deltaTime = timeStamp - lastTime
            lastTime = timeStamp

            // Update dialogue cooldown
            if (dialogueCooldown > 0) dialogueCooldown -= deltaTime

            ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight)

            // Apply Screen Shake
            ctx.save()
            if (shakeIntensity > 0) {
                const dx = (Math.random() - 0.5) * shakeIntensity
                const dy = (Math.random() - 0.5) * shakeIntensity
                ctx.translate(dx, dy)
                shakeIntensity *= 0.9
                if (shakeIntensity < 0.5) shakeIntensity = 0
            }

            if (!p1 || !p2) {
                ctx.restore()
                eventSystem.update(deltaTime)
                eventSystem.draw(ctx)
                animationId = requestAnimationFrame(gameLoop)
                return
            }

            // Update Event System
            eventSystem.update(deltaTime)

            // Show intro dialogues once
            if (!introShown && eventSystem.state === GAME_STATES.FIGHTING) {
                introShown = true
                setTimeout(() => {
                    tryShowDialogue(playerChar, DIALOGUE_EVENTS.INTRO, p1.x + p1.width / 2, p1.y, true, true)
                }, 500)
                setTimeout(() => {
                    tryShowDialogue(cpuChar, DIALOGUE_EVENTS.INTRO, p2.x + p2.width / 2, p2.y, false, true)
                }, 1000)
            }

            // Only process game logic when fighting
            if (eventSystem.state === GAME_STATES.FIGHTING) {
                // Update fighters inputs
                if (!p1.isDead) p1.handleInput(inputP1.getPlayerInput())

                if (gameMode === 'pve') {
                    if (!p2.isDead && ai) ai.update(deltaTime, p1)
                } else {
                    if (!p2.isDead) p2.handleInput(inputP2.getPlayerInput())
                }

                // Track state changes for dialogues
                const p1StateChanged = p1.state !== lastP1State
                const p2StateChanged = p2.state !== lastP2State

                if (p1StateChanged) {
                    if (p1.state === 'attack') {
                        tryShowDialogue(playerChar, DIALOGUE_EVENTS.ATTACK, p1.x + p1.width / 2, p1.y, true)
                    } else if (p1.state === 'skill') {
                        tryShowDialogue(playerChar, DIALOGUE_EVENTS.SKILL, p1.x + p1.width / 2, p1.y, true, true)
                        SoundManager.playSfx('sfx_skill_activate')
                    } else if (p1.state === 'hit') {
                        tryShowDialogue(playerChar, DIALOGUE_EVENTS.HIT, p1.x + p1.width / 2, p1.y, true)
                    } else if (p1.state === 'roll') {
                        SoundManager.playSfx('sfx_dash')
                    } else if (p1.state === 'jump') {
                        SoundManager.playSfx('sfx_jump')
                    }
                    lastP1State = p1.state
                }

                if (p2StateChanged) {
                    if (p2.state === 'attack') {
                        tryShowDialogue(cpuChar, DIALOGUE_EVENTS.ATTACK, p2.x + p2.width / 2, p2.y, false)
                    } else if (p2.state === 'skill') {
                        tryShowDialogue(cpuChar, DIALOGUE_EVENTS.SKILL, p2.x + p2.width / 2, p2.y, false, true)
                        SoundManager.playSfx('sfx_skill_activate')
                    } else if (p2.state === 'hit') {
                        tryShowDialogue(cpuChar, DIALOGUE_EVENTS.HIT, p2.x + p2.width / 2, p2.y, false)
                    } else if (p2.state === 'roll') {
                        SoundManager.playSfx('sfx_dash')
                    }
                    lastP2State = p2.state
                }

                // Block dialogues
                if (p1.isBlocking && Math.random() < 0.02) {
                    tryShowDialogue(playerChar, DIALOGUE_EVENTS.BLOCK, p1.x + p1.width / 2, p1.y, true)
                    SoundManager.playSfx('sfx_block')
                }
                if (p2.isBlocking && Math.random() < 0.02) {
                    tryShowDialogue(cpuChar, DIALOGUE_EVENTS.BLOCK, p2.x + p2.width / 2, p2.y, false)
                    SoundManager.playSfx('sfx_block')
                }

                p1.update(deltaTime, p2, handleHit, spawnParticle, spawnProjectile)
                p2.update(deltaTime, p1, handleHit, spawnParticle, spawnProjectile)
            }

            // Render Particles
            particles.forEach(p => p.update())
            particles = particles.filter(p => p.alive)
            particles.forEach(p => p.draw(ctx))

            // Handle Projectiles
            projectiles.forEach(proj => {
                proj.update(deltaTime)
                proj.draw(ctx)

                if (proj.ownerId !== p1.characterId && !p1.isDead) {
                    if (checkProjectileHit(proj, p1)) {
                        p1.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, spawnParticle)
                        proj.alive = false
                        handleHit(p1.x, p1.y, false, "OOF")
                    }
                }
                if (proj.ownerId !== p2.characterId && !p2.isDead) {
                    if (checkProjectileHit(proj, p2)) {
                        p2.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, spawnParticle)
                        proj.alive = false
                        handleHit(p2.x, p2.y, false, "BONK")
                    }
                }
            })
            projectiles = projectiles.filter(p => p.alive)

            // Draw Meme Texts
            memeSystem.update(deltaTime)
            memeSystem.draw(ctx)

            p1.draw()
            p2.draw()

            // Draw Event System overlays
            eventSystem.draw(ctx)

            ctx.restore()

            // Update HUD
            setHudData(prev => ({
                p1Health: (p1.health / CONFIG.baseHp) * 100,
                p1DelayedHealth: prev.p1DelayedHealth > (p1.health / CONFIG.baseHp) * 100
                    ? Math.max((p1.health / CONFIG.baseHp) * 100, prev.p1DelayedHealth - 0.3)
                    : (p1.health / CONFIG.baseHp) * 100,
                p1Stamina: p1.stamina,
                p2Health: (p2.health / CONFIG.baseHp) * 100,
                p2DelayedHealth: prev.p2DelayedHealth > (p2.health / CONFIG.baseHp) * 100
                    ? Math.max((p2.health / CONFIG.baseHp) * 100, prev.p2DelayedHealth - 0.3)
                    : (p2.health / CONFIG.baseHp) * 100,
                p2Stamina: p2.stamina,
                p1Name: prev.p1Name,
                p2Name: prev.p2Name,
                cooldownP1: Math.max(0, p1.skillCooldown / CONFIG.skillCooldown * 100),
                cooldownP2: Math.max(0, p2.skillCooldown / CONFIG.skillCooldown * 100),
            }))

            // Game End
            if ((p1.isDead || p2.isDead) && !isFinishedRef.current) {
                isFinishedRef.current = true

                // Show win/lose dialogues
                if (p1.isDead) {
                    p2.setVictory()
                    SoundManager.playSfx('announce_ko')
                    setTimeout(() => {
                        tryShowDialogue(cpuChar, DIALOGUE_EVENTS.WIN, p2.x + p2.width / 2, p2.y, false, true)
                        tryShowDialogue(playerChar, DIALOGUE_EVENTS.LOSE, p1.x + p1.width / 2, p1.y, true, true)
                    }, 800)
                } else {
                    p1.setVictory()
                    SoundManager.playSfx('announce_ko')
                    setTimeout(() => {
                        tryShowDialogue(playerChar, DIALOGUE_EVENTS.WIN, p1.x + p1.width / 2, p1.y, true, true)
                        tryShowDialogue(cpuChar, DIALOGUE_EVENTS.LOSE, p2.x + p2.width / 2, p2.y, false, true)
                    }, 800)
                }

                SoundManager.fadeOutBgm(1500)

                setTimeout(() => {
                    if (isMounted) onGameOver(p1.isDead ? 'cpu' : 'p1')
                }, 2500)
            }

            animationId = requestAnimationFrame(gameLoop)
        }

        init()

        return () => {
            isMounted = false
            cancelAnimationFrame(animationId)
            if (inputP1) inputP1.destroy()
            if (inputP2) inputP2.destroy()
            isFinishedRef.current = false
            SoundManager.stopBgm()
        }
    }, [playerChar, cpuChar, background, onGameOver, gameMode, cpuDifficulty])

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }, [])

    return (
        <div
            className="relative w-full h-full bg-black overflow-hidden"
            style={{
                backgroundImage: `url(/assets/${background.asset})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {isPaused && (
                <PauseMenu
                    onResume={() => setIsPaused(false)}
                    onRestart={() => onQuit()}
                    onQuit={onQuit}
                />
            )}

            {/* HUD React Layer */}
            <div className="absolute top-0 w-full p-4 md:p-8 flex justify-between z-10 pointer-events-none">
                {/* Player 1 HUD */}
                <div className="w-[300px] md:w-[350px]">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-bangers text-2xl md:text-3xl text-white drop-shadow-md truncate max-w-[180px]">
                            {hudData.p1Name}
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="font-comic text-[10px] md:text-xs text-green-400">
                                {hudData.p1Health > 66 ? 'FEELS GREAT! 🔥' : hudData.p1Health > 33 ? 'STILL OK...' : 'NOT STONKS 📉'}
                            </span>
                        </div>
                    </div>
                    {/* P1 Health Bar */}
                    <div className="h-6 md:h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative transform skew-x-[-10deg]">
                        <div
                            className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100 ease-linear"
                            style={{ width: `${hudData.p1DelayedHealth}%` }}
                        />
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 transition-all duration-75"
                            style={{ width: `${hudData.p1Health}%` }}
                        />
                        {/* Health percentage */}
                        <span className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-lg transform skew-x-[10deg]">
                            {Math.ceil(hudData.p1Health)}%
                        </span>
                    </div>
                    {/* Stamina */}
                    <div className="flex gap-2 mt-2">
                        <div className="h-2.5 md:h-3 bg-neutral-900 rounded-full overflow-hidden flex-1 border border-white/30 transform skew-x-[-10deg]">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150" style={{ width: `${hudData.p1Stamina}%` }} />
                        </div>
                        {/* Skill Cooldown Indicator */}
                        <div className="relative w-8 h-8 md:w-10 md:h-10 transform skew-x-[-10deg]">
                            <div className="absolute inset-0 bg-neutral-900 rounded-lg border border-white/30 overflow-hidden">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-purple-500/80 transition-all duration-100"
                                    style={{ height: `${100 - hudData.cooldownP1}%` }}
                                />
                            </div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white transform skew-x-[10deg]">
                                E
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center - VS / Timer */}
                <div className="flex flex-col items-center">
                    <div className="font-bangers text-3xl md:text-5xl text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.8)]">
                        VS
                    </div>
                    <div className="text-white/60 text-[10px] md:text-xs font-comic mt-1">
                        {gameState === GAME_STATES.COUNTDOWN ? 'GET READY!' :
                            gameState === GAME_STATES.FIGHTING ? 'FIGHT!' : ''}
                    </div>
                </div>

                {/* Player 2 / CPU HUD */}
                <div className="w-[300px] md:w-[350px] text-right">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-comic text-[10px] md:text-xs text-red-400">
                            {hudData.p2Health > 66 ? 'DANGEROUS! ⚠️' : hudData.p2Health > 33 ? 'WEAKENING...' : 'ONE MORE! 💀'}
                        </span>
                        <span className="font-bangers text-2xl md:text-3xl text-white drop-shadow-md truncate max-w-[180px]">
                            {hudData.p2Name}
                        </span>
                    </div>
                    {/* P2 Health Bar */}
                    <div className="h-6 md:h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative transform skew-x-[10deg]">
                        <div
                            className="absolute top-0 right-0 h-full bg-white transition-all duration-100 ease-linear"
                            style={{ width: `${hudData.p2DelayedHealth}%` }}
                        />
                        <div
                            className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-600 to-orange-500 transition-all duration-75"
                            style={{ width: `${hudData.p2Health}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-lg transform skew-x-[-10deg]">
                            {Math.ceil(hudData.p2Health)}%
                        </span>
                    </div>
                    {/* Stamina */}
                    <div className="flex gap-2 mt-2 justify-end">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 transform skew-x-[10deg]">
                            <div className="absolute inset-0 bg-neutral-900 rounded-lg border border-white/30 overflow-hidden">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-purple-500/80 transition-all duration-100"
                                    style={{ height: `${100 - hudData.cooldownP2}%` }}
                                />
                            </div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white transform skew-x-[-10deg]">
                                {gameMode === 'pvp' ? 'DEL' : 'AI'}
                            </span>
                        </div>
                        <div className="h-2.5 md:h-3 bg-neutral-900 rounded-full overflow-hidden flex-1 border border-white/30 transform skew-x-[10deg]">
                            <div className="h-full bg-gradient-to-l from-yellow-400 to-amber-500 ml-auto transition-all duration-150" style={{ width: `${hudData.p2Stamina}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={CONFIG.canvasWidth}
                height={CONFIG.canvasHeight}
                className="block w-full h-full object-cover"
            />

            {/* Instructions Panel - Responsive */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 px-4 md:px-8 py-2 md:py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-[10px] md:text-sm">
                <div className="text-center">
                    <div className="text-green-400 font-bold mb-0.5 md:mb-1">PLAYER 1</div>
                    <div className="space-x-1 md:space-x-2">
                        <span>WASD</span>
                        <span className="hidden md:inline">|</span>
                        <span>SPACE</span>
                        <span className="hidden md:inline">|</span>
                        <span>SHIFT</span>
                        <span className="hidden md:inline">|</span>
                        <span>E</span>
                    </div>
                </div>
                {gameMode === 'pvp' && (
                    <div className="text-center border-l border-white/20 pl-4 md:pl-8">
                        <div className="text-orange-400 font-bold mb-0.5 md:mb-1">PLAYER 2</div>
                        <div className="space-x-1 md:space-x-2">
                            <span>ARROWS</span>
                            <span className="hidden md:inline">|</span>
                            <span>ENTER</span>
                            <span className="hidden md:inline">|</span>
                            <span>CTRL</span>
                            <span className="hidden md:inline">|</span>
                            <span>DEL</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls - Top Right */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                {/* Sound Controls */}
                <SoundControl />

                <div className="w-px bg-white/20" />

                <button
                    onClick={() => setIsPaused(true)}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                    title="Tạm dừng (ESC)"
                >
                    <Pause className="w-5 h-5" />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                    title="Toàn màn hình"
                >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
            </div>

            {/* Announcement Overlay */}
            {announcement && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                    <div
                        className={`font-bangers drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-pulse ${announcement.type === 'fight' ? 'text-6xl md:text-8xl text-yellow-400' :
                            announcement.type === 'ko' ? 'text-7xl md:text-9xl text-red-500' :
                                'text-4xl md:text-6xl text-white'
                            }`}
                        style={{
                            textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
                        }}
                    >
                        {announcement.text}
                    </div>
                </div>
            )}
        </div>
    )
}
