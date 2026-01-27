import { useEffect, useRef, useState } from 'react'
import { Fighter } from '../game/Fighter'
import { AI } from '../game/AI'
import { InputHandler } from '../game/InputHandler'
import { Particle } from '../game/Particle'
import { CONFIG, BACKGROUNDS, MEME_WORDS, CHARACTERS } from '../game/constants'
import { resources } from '../game/ResourceManager'
import { Projectile } from '../game/Projectile'
import { MemeSystem } from '../game/MemeSystem'
import PauseMenu from './PauseMenu'
import { Pause, Maximize } from 'lucide-react'

export default function BattleScreen({ playerChar, cpuChar, background, onGameOver, cpuDifficulty = 'medium', onQuit }) {
    const canvasRef = useRef(null)
    const [hudData, setHudData] = useState({
        p1Health: 100,
        p1DelayedHealth: 100,
        p1Stamina: 100,
        p2Health: 100,
        p2DelayedHealth: 100,
        p2Stamina: 100
    })
    const isFinishedRef = useRef(false)
    const [isPaused, setIsPaused] = useState(false)
    const isPausedRef = useRef(isPaused)

    useEffect(() => {
        isPausedRef.current = isPaused
    }, [isPaused])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const input = new InputHandler()
        let animationId
        let isMounted = true

        // Core Game Objects
        let p1, p2, ai
        let particles = []
        let projectiles = []

        const init = async () => {
            // NEW: Preload images using ResourceManager
            try {
                // Determine assets to load
                const p1Data = CHARACTERS.find(c => c.id === playerChar)
                const p2Data = CHARACTERS.find(c => c.id === cpuChar)
                const assetsToLoad = [
                    { id: playerChar, src: p1Data.asset },
                    { id: cpuChar, src: p2Data.asset }
                ]
                await resources.loadImages(assetsToLoad);

                if (!isMounted) return;

                const p1Img = resources.getImage(playerChar);
                const p2Img = resources.getImage(cpuChar);

                p1 = new Fighter(ctx, 100, playerChar, false, p1Img)
                p2 = new Fighter(ctx, 720, cpuChar, true, p2Img)
                ai = new AI(p2, cpuDifficulty)

                animationId = requestAnimationFrame(gameLoop)
            } catch (err) {
                console.error("Failed to initialize battle:", err);
            }
        }

        let lastTime = 0

        // Particle System
        const spawnParticle = (x, y, type) => {
            particles.push(new Particle(x, y, type))
        }

        // Projectile System
        const spawnProjectile = (x, y, facingRight, ownerId, config) => {
            projectiles.push(new Projectile(x, y, facingRight, ownerId, config));
        }

        // Meme System
        const memeSystem = new MemeSystem();

        // Screen Shake
        let shakeIntensity = 0;
        const addScreenShake = (amount) => {
            shakeIntensity = amount;
        };

        const spawnMeme = (x, y, isSpecial = false, textOverride = null) => {
            const words = isSpecial ?
                ["MUCH WOW", "ABSOLUTE UNIT", "REEEEEEEEEEE", "CHAD ENERGY", "BASED!!!", "GIGACHAD VIBES"] :
                MEME_WORDS;
            const text = textOverride || words[Math.floor(Math.random() * words.length)];
            memeSystem.spawn(x, y, text, isSpecial);

            if (isSpecial) {
                addScreenShake(20);
            }
        }

        const checkProjectileHit = (proj, fighter) => {
            return (proj.x < fighter.hitbox.x + fighter.hitbox.width &&
                proj.x + proj.width > fighter.hitbox.x &&
                proj.y < fighter.hitbox.y + fighter.hitbox.height &&
                proj.y + proj.height > fighter.hitbox.y);
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

            ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight)

            // Apply Screen Shake
            ctx.save();
            if (shakeIntensity > 0) {
                const dx = (Math.random() - 0.5) * shakeIntensity;
                const dy = (Math.random() - 0.5) * shakeIntensity;
                ctx.translate(dx, dy);
                shakeIntensity *= 0.9; // Decay
                if (shakeIntensity < 0.5) shakeIntensity = 0;
            }

            if (!p1 || !p2) {
                ctx.restore();
                return; // Wait for load
            }

            // Update fighters
            if (!p1.isDead) p1.handleInput(input.getPlayerInput())
            if (!p2.isDead) ai.update(deltaTime, p1)

            p1.update(deltaTime, p2, spawnMeme, spawnParticle, spawnProjectile)
            p2.update(deltaTime, p1, spawnMeme, spawnParticle, spawnProjectile)

            // Render Particles
            particles.forEach(p => p.update())
            particles = particles.filter(p => p.alive)
            particles.forEach(p => p.draw(ctx))

            // Handle Projectiles
            projectiles.forEach(proj => {
                proj.update(deltaTime);
                proj.draw(ctx);

                // Check Collision
                if (proj.ownerId !== p1.characterId && !p1.isDead) { // Hits P1
                    if (checkProjectileHit(proj, p1)) {
                        p1.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, spawnParticle);
                        proj.alive = false;
                        spawnMeme(p1.x, p1.y, false, "OOF");
                    }
                }
                if (proj.ownerId !== p2.characterId && !p2.isDead) { // Hits P2
                    if (checkProjectileHit(proj, p2)) {
                        p2.takeDamage(proj.config.damage, proj.vx > 0 ? 1 : -1, spawnParticle);
                        proj.alive = false;
                        spawnMeme(p2.x, p2.y, false, "BONK");
                    }
                }
            });
            projectiles = projectiles.filter(p => p.alive);

            // Draw Meme Texts
            memeSystem.update(deltaTime);
            memeSystem.draw(ctx);

            p1.draw()
            p2.draw()

            ctx.restore(); // Restore transform from screen shake

            // Draw HUD overlay (abstracted to react but stats from objects)
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
                p2Stamina: p2.stamina
            }))

            p1.draw()
            p2.draw()

            if ((p1.isDead || p2.isDead) && !isFinishedRef.current) {
                isFinishedRef.current = true
                // Set Victory Animation
                if (p1.isDead) p2.setVictory();
                else p1.setVictory();

                setTimeout(() => {
                    if (isMounted) onGameOver(p1.isDead ? 'cpu' : 'p1')
                }, 2000)
            }

            animationId = requestAnimationFrame(gameLoop)
        }

        init()

        return () => {
            isMounted = false
            cancelAnimationFrame(animationId)
            input.destroy()
            isFinishedRef.current = false
        }
    }, [playerChar, cpuChar, background, onGameOver])

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
            <div className="absolute top-0 w-full p-8 flex justify-between z-10 pointer-events-none">
                <div className="w-[350px]">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-bangers text-3xl text-white drop-shadow-md">YOU</span>
                        <div className="flex flex-col items-end">
                            <span className="font-comic text-xs text-green-400">FEELS GREAT</span>
                        </div>
                    </div>
                    {/* P1 Health Bar */}
                    <div className="h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative transform skew-x-[-10deg]">
                        {/* Delayed Bar (White/Red) */}
                        <div
                            className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100 ease-linear"
                            style={{ width: `${hudData.p1DelayedHealth}%` }}
                        />
                        {/* Main Bar */}
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 transition-all duration-75"
                            style={{ width: `${hudData.p1Health}%` }}
                        />
                    </div>
                    {/* Stamina */}
                    <div className="h-3 bg-neutral-900 mt-2 rounded-full overflow-hidden w-2/3 ml-0 border border-white/30 transform skew-x-[-10deg]">
                        <div className="h-full bg-blue-400" style={{ width: `${hudData.p1Stamina}%` }} />
                    </div>
                </div>

                <div className="w-[350px] text-right">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-comic text-xs text-red-400">ABSOLUTE UNIT</span>
                        <span className="font-bangers text-3xl text-white drop-shadow-md">CPU</span>
                    </div>
                    {/* P2 Health Bar */}
                    <div className="h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative transform skew-x-[10deg]">
                        {/* Delayed Bar */}
                        <div
                            className="absolute top-0 right-0 h-full bg-white transition-all duration-100 ease-linear"
                            style={{ width: `${hudData.p2DelayedHealth}%` }}
                        />
                        {/* Main Bar */}
                        <div
                            className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-600 to-orange-500 transition-all duration-75"
                            style={{ width: `${hudData.p2Health}%` }}
                        />
                    </div>
                    {/* Stamina */}
                    <div className="h-3 bg-neutral-900 mt-2 rounded-full overflow-hidden w-2/3 ml-auto border border-white/30 transform skew-x-[10deg]">
                        <div className="h-full bg-yellow-400 ml-auto" style={{ width: `${hudData.p2Stamina}%` }} />
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={CONFIG.canvasWidth}
                height={CONFIG.canvasHeight}
                className="block w-full h-full object-cover"
            />

            {/* Meme Text Overlay Removed - Handled by Canvas */}
            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 px-8 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-sm">
                <div><span className="text-orange-400 font-bold">WASD</span> MOVE</div>
                <div><span className="text-orange-400 font-bold">SPACE/J</span> BONK</div>
                <div><span className="text-orange-400 font-bold">SHIFT/K</span> DASH</div>
                <div><span className="text-orange-400 font-bold">E/Q/U</span> SKILL</div>
            </div>
            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setIsPaused(true)}
                    className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-all"
                    title="Pause"
                >
                    <Pause className="w-6 h-6" />
                </button>
                <button
                    onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                        }
                    }}
                    className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-all"
                    title="Toggle Fullscreen"
                >
                    <Maximize className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
