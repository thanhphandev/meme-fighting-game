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
    const [showVsIntro, setShowVsIntro] = useState(true)
    const [lowHealthWarning, setLowHealthWarning] = useState({ p1: false, p2: false })
    const [hitFlash, setHitFlash] = useState({ p1: false, p2: false })
    const [koFreeze, setKoFreeze] = useState(false)
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

        // P1 Controls (WASD + J/K/L) - Avoid Shift/Ctrl to prevent sticky keys
        const p1Keys = {
            left: ['a'], right: ['d'], up: ['w'],
            attack: ['j', ' '], roll: ['k'], skill: ['l', 'u']
        }
        inputP1 = new InputHandler(p1Keys)

        if (gameMode === 'pvp') {
            // P2 Controls (Arrows + NumPad)
            const p2Keys = {
                left: ['arrowleft'], right: ['arrowright'], up: ['arrowup'],
                attack: ['1', 'numpad1', '.'], // Num1 or Period
                roll: ['2', 'numpad2', '/'],   // Num2 or Slash
                skill: ['3', 'numpad3', ';']   // Num3 or Semicolon
            }
            inputP2 = new InputHandler(p2Keys)
        } else {
            const mergedKeys = {
                left: ['a', 'arrowleft'], right: ['d', 'arrowright'], up: ['w', 'arrowup'],
                attack: ['j', ' ', 'enter'], roll: ['k', 'shift'], skill: ['l', 'u', 'e']
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

                // Start countdown after VS intro
                setTimeout(() => {
                    setShowVsIntro(false)
                    eventSystem.startCountdown()
                }, 3000)

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
        const handleHit = (x, y, isSpecial = false, textOverride = null, isP1Target = false) => {
            spawnMeme(x, y, isSpecial, textOverride)
            SoundManager.playSfx(isSpecial ? 'sfx_hit_heavy' : 'sfx_hit')

            // Trigger HUD flash
            if (isP1Target) {
                setHitFlash(prev => ({ ...prev, p1: true }))
                setTimeout(() => setHitFlash(prev => ({ ...prev, p1: false })), 200)
            } else {
                setHitFlash(prev => ({ ...prev, p2: true }))
                setTimeout(() => setHitFlash(prev => ({ ...prev, p2: false })), 200)
            }
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

                p1.update(deltaTime, p2, (x, y, s, t) => handleHit(x, y, s, t, false), spawnParticle, spawnProjectile)
                p2.update(deltaTime, p1, (x, y, s, t) => handleHit(x, y, s, t, true), spawnParticle, spawnProjectile)
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

            // // Draw Distance Ruler & AI State Indicator
            // const drawDistanceRuler = () => {
            //     const p1Center = p1.x + p1.width / 2
            //     const p2Center = p2.x + p2.width / 2
            //     const distance = Math.abs(p2Center - p1Center)
            //     const isChasing = distance > 150

            //     // Draw ruler line between fighters
            //     ctx.strokeStyle = isChasing ? 'rgba(100, 200, 255, 0.6)' : 'rgba(255, 100, 100, 0.6)'
            //     ctx.lineWidth = 3
            //     ctx.setLineDash([5, 5])
            //     ctx.beginPath()
            //     ctx.moveTo(p1Center, p1.y + p1.height / 2)
            //     ctx.lineTo(p2Center, p2.y + p2.height / 2)
            //     ctx.stroke()
            //     ctx.setLineDash([])

            //     // Draw distance markers
            //     const midX = (p1Center + p2Center) / 2
            //     const midY = (p1.y + p1.height / 2 + p2.y + p2.height / 2) / 2

            //     // Draw threshold line at 150px
            //     const thresholdX = p1Center + (p2Center > p1Center ? 150 : -150)
            //     ctx.strokeStyle = 'rgba(255, 200, 0, 0.7)'
            //     ctx.lineWidth = 2
            //     ctx.setLineDash([3, 3])
            //     ctx.beginPath()
            //     ctx.moveTo(thresholdX, p1.y + p1.height / 2 - 20)
            //     ctx.lineTo(thresholdX, p2.y + p2.height / 2 + 20)
            //     ctx.stroke()
            //     ctx.setLineDash([])

            //     // Distance label
            //     ctx.font = 'bold 16px Arial, sans-serif'
            //     ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            //     ctx.textAlign = 'center'
            //     ctx.fillText(`${Math.round(distance)}px`, midX, midY - 10)

            //     // Draw state indicator bubble
            //     const bubbleX = midX
            //     const bubbleY = midY + 30
            //     const bubbleRadius = 25

            //     // Bubble background
            //     ctx.fillStyle = isChasing ? 'rgba(100, 150, 255, 0.8)' : 'rgba(255, 100, 100, 0.8)'
            //     ctx.beginPath()
            //     ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2)
            //     ctx.fill()

            //     // Bubble border
            //     ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
            //     ctx.lineWidth = 2
            //     ctx.beginPath()
            //     ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2)
            //     ctx.stroke()

            //     // State text
            //     ctx.font = 'bold 14px Arial, sans-serif'
            //     ctx.fillStyle = 'rgba(255, 255, 255, 1)'
            //     ctx.textAlign = 'center'
            //     ctx.textBaseline = 'middle'
            //     ctx.fillText(isChasing ? 'CHASE' : 'ATTACK', bubbleX, bubbleY)

            //     // Draw threshold marker label
            //     ctx.font = '12px Arial, sans-serif'
            //     ctx.fillStyle = 'rgba(255, 200, 0, 0.8)'
            //     ctx.textAlign = 'center'
            //     ctx.fillText('150px', thresholdX, p1.y - 5)
            // }

            // drawDistanceRuler()

            p1.draw()
            p2.draw()

            // Draw Event System overlays
            eventSystem.draw(ctx)

            ctx.restore()

            // Update HUD
            const p1HpPercent = (p1.health / CONFIG.baseHp) * 100
            const p2HpPercent = (p2.health / CONFIG.baseHp) * 100

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
            }))

            setLowHealthWarning({
                p1: p1HpPercent < 25,
                p2: p2HpPercent < 25
            })

            // Game End
            if ((p1.isDead || p2.isDead) && !isFinishedRef.current) {
                isFinishedRef.current = true
                setKoFreeze(true) // Start freeze frame

                // Slow down and desaturate
                setTimeout(() => {
                    setKoFreeze(false)
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
                }, 1000)
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
            {/* Overlays */}
            <div className="scanlines" />
            <div className={`vignette ${lowHealthWarning.p1 ? 'vignette-danger' : ''}`} />

            {/* VS Intro Cinematic */}
            {showVsIntro && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-20" />

                    {/* Character Portraits Intro */}
                    <div className="relative w-full h-full flex items-center justify-between px-20">
                        <div className="flex flex-col items-center animate-[cinematic-intro_0.6s_ease-out_forwards]">
                            <div className="w-64 h-64 rounded-2xl border-4 border-cyan-400 bg-cyan-900/20 overflow-hidden box-glow-cyan">
                                <img src={`/assets/${CHARACTERS.find(c => c.id === playerChar)?.asset}`} className="w-full h-full object-contain scale-150 translate-y-4" alt="p1" />
                            </div>
                            <h2 className="text-game text-4xl mt-6 text-cyan-400 glow-cyan">{hudData.p1Name}</h2>
                        </div>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <h1 className="text-game text-9xl text-orange-500 animate-pulse italic skew-x-12 drop-shadow-[0_0_30px_rgba(255,165,0,0.8)]">VS</h1>
                        </div>

                        <div className="flex flex-col items-center animate-[cinematic-intro_0.6s_ease-out_0.2s_forwards] opacity-0">
                            <div className="w-64 h-64 rounded-2xl border-4 border-pink-500 bg-pink-900/20 overflow-hidden box-glow-pink">
                                <img src={`/assets/${CHARACTERS.find(c => c.id === cpuChar)?.asset}`} className="w-full h-full object-contain scale-150 translate-y-4 flip-horizontal" alt="p2" />
                            </div>
                            <h2 className="text-game text-4xl mt-6 text-pink-500 glow-pink">{hudData.p2Name}</h2>
                        </div>
                    </div>
                </div>
            )}

            {isPaused && (
                <PauseMenu
                    onResume={() => setIsPaused(false)}
                    onRestart={() => onQuit()}
                    onQuit={onQuit}
                />
            )}

            {/* HUD React Layer */}
            <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between z-10 pointer-events-none">
                {/* Player 1 HUD */}
                <div className={`w-[320px] md:w-[400px] transition-transform ${lowHealthWarning.p1 ? 'animate-[glitch_0.2s_infinite]' : ''}`}>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                            <span className={`text-xs font-game tracking-widest mb-1 ${lowHealthWarning.p1 ? 'text-red-500' : 'text-cyan-400'}`}>
                                {lowHealthWarning.p1 ? 'WARNING! LOW HP' : 'PLAYER 1'}
                            </span>
                            <span className="font-game text-3xl text-white drop-shadow-md truncate max-w-[200px]">
                                {hudData.p1Name}
                            </span>
                        </div>
                    </div>
                    {/* P1 Health Bar Container */}
                    <div className={`health-container transform skew-x-[-15deg] border-cyan-500/50 ${hitFlash.p1 ? 'brightness-150 scale-[1.02]' : ''}`}>
                        <div
                            className="absolute top-0 left-0 h-full bg-red-600/50 transition-all duration-300"
                            style={{ width: `${hudData.p1DelayedHealth}%` }}
                        />
                        <div
                            className="absolute top-0 left-0 h-full health-fill-p1 health-segment-mask"
                            style={{ width: `${hudData.p1Health}%` }}
                        />
                        {/* Damage flash layer */}
                        {hitFlash.p1 && <div className="absolute inset-0 bg-white animate-flash" />}
                        {/* Health percentage overlay */}
                        <div className="absolute inset-0 flex items-center justify-end px-4 transform skew-x-[15deg]">
                            <span className="font-game text-sm text-white drop-shadow-lg italic">
                                {Math.ceil(hudData.p1Health)}%
                            </span>
                        </div>
                    </div>
                    {/* Stamina & Skill */}
                    <div className="flex gap-3 mt-3 items-center">
                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-cyan-400 box-glow-cyan transition-all duration-200" style={{ width: `${hudData.p1Stamina}%` }} />
                        </div>
                        {/* Skill Cooldown */}
                        <div className="relative w-12 h-12 bg-neutral-900 border border-cyan-400/50 rounded-lg flex items-center justify-center overflow-hidden">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-cyan-400/30 transition-all duration-100"
                                style={{ height: `${100 - hudData.cooldownP1}%` }}
                            />
                            <span className={`font-game text-lg ${hudData.cooldownP1 === 0 ? 'text-cyan-400 animate-pulse' : 'text-white/40'}`}>E</span>
                        </div>
                    </div>
                </div>

                {/* Center - Timer/State */}
                <div className="flex flex-col items-center pt-2">
                    <div className="relative">
                        <div className="font-game text-4xl text-orange-500 glow-gold italic skew-x-[-10deg]">
                            99
                        </div>
                    </div>
                </div>

                {/* Player 2 / CPU HUD */}
                <div className={`w-[320px] md:w-[400px] text-right transition-transform ${lowHealthWarning.p2 ? 'animate-[glitch_0.2s_infinite]' : ''}`}>
                    <div className="flex flex-col items-end mb-2">
                        <span className={`text-xs font-game tracking-widest mb-1 ${lowHealthWarning.p2 ? 'text-red-500' : 'text-pink-500'}`}>
                            {lowHealthWarning.p2 ? 'FINISH THEM!' : (gameMode === 'pve' ? 'CPU ENEMY' : 'PLAYER 2')}
                        </span>
                        <span className="font-game text-3xl text-white drop-shadow-md truncate max-w-[200px]">
                            {hudData.p2Name}
                        </span>
                    </div>
                    {/* P2 Health Bar Container */}
                    <div className={`health-container transform skew-x-[15deg] border-pink-500/50 ${hitFlash.p2 ? 'brightness-150 scale-[1.02]' : ''}`}>
                        <div
                            className="absolute top-0 right-0 h-full bg-white/20 transition-all duration-300"
                            style={{ width: `${hudData.p2DelayedHealth}%` }}
                        />
                        <div
                            className="absolute top-0 right-0 h-full health-fill-p2 health-segment-mask"
                            style={{ width: `${hudData.p2Health}%` }}
                        />
                        {/* Damage flash layer */}
                        {hitFlash.p2 && <div className="absolute inset-0 bg-white animate-flash" />}
                        {/* Health percentage overlay */}
                        <div className="absolute inset-0 flex items-center justify-start px-4 transform skew-x-[-15deg]">
                            <span className="font-game text-sm text-white drop-shadow-lg italic">
                                {Math.ceil(hudData.p2Health)}%
                            </span>
                        </div>
                    </div>
                    {/* Stamina & Skill */}
                    <div className="flex gap-3 mt-3 items-center flex-row-reverse">
                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-pink-500 box-glow-pink transition-all duration-200" style={{ width: `${hudData.p2Stamina}%` }} />
                        </div>
                        {/* Skill Cooldown */}
                        <div className="relative w-12 h-12 bg-neutral-900 border border-pink-500/50 rounded-lg flex items-center justify-center overflow-hidden">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-pink-500/30 transition-all duration-100"
                                style={{ height: `${100 - hudData.cooldownP2}%` }}
                            />
                            <span className={`font-game text-lg ${hudData.cooldownP2 === 0 ? 'text-pink-500 animate-pulse' : 'text-white/40'}`}>
                                {gameMode === 'pvp' ? 'DEL' : 'AI'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={CONFIG.canvasWidth}
                height={CONFIG.canvasHeight}
                className={`block w-full h-full object-cover transition-all duration-1000 ${koFreeze ? 'grayscale brightness-50 contrast-150' : ''}`}
            />

            {/* Instructions Panel - Responsive */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 px-4 md:px-8 py-2 md:py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-[10px] md:text-sm">
                <div className="text-center">
                    <div className="text-green-400 font-bold mb-0.5 md:mb-1">PLAYER 1</div>
                    <div className="space-x-1 md:space-x-2">
                        <span>WASD</span>
                        <span className="hidden md:inline">|</span>
                        <span>J (Hit)</span>
                        <span className="hidden md:inline">|</span>
                        <span>K (Dash)</span>
                        <span className="hidden md:inline">|</span>
                        <span>L (Skill)</span>
                    </div>
                </div>
                {gameMode === 'pvp' && (
                    <div className="text-center border-l border-white/20 pl-4 md:pl-8">
                        <div className="text-orange-400 font-bold mb-0.5 md:mb-1">PLAYER 2</div>
                        <div className="space-x-1 md:space-x-2">
                            <span>ARROWS</span>
                            <span className="hidden md:inline">|</span>
                            <span>Num 1 / .</span>
                            <span className="hidden md:inline">|</span>
                            <span>Num 2 / /</span>
                            <span className="hidden md:inline">|</span>
                            <span>Num 3 / ;</span>
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
