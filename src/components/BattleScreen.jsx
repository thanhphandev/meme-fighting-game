import { useEffect, useRef, useState } from 'react'
import { Fighter } from '../game/Fighter'
import { AI } from '../game/AI'
import { InputHandler } from '../game/InputHandler'
import { Particle } from '../game/Particle'
import { CONFIG, BACKGROUNDS, MEME_WORDS } from '../game/constants'

export default function BattleScreen({ playerChar, cpuChar, background, onGameOver }) {
    const canvasRef = useRef(null)
    const [hudData, setHudData] = useState({
        p1Health: 100,
        p1Stamina: 100,
        p2Health: 100,
        p2Stamina: 100
    })
    const [memeTexts, setMemeTexts] = useState([])
    const isFinishedRef = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const input = new InputHandler()
        const p1 = new Fighter(ctx, 100, playerChar)
        const p2 = new Fighter(ctx, 720, cpuChar, true)
        const ai = new AI(p2)


        let lastTime = 0
        let animationId
        let isMounted = true

        // Particle System
        let particles = []
        const spawnParticle = (x, y, type) => {
            particles.push(new Particle(x, y, type))
        }

        const spawnMeme = (x, y, isSpecial = false) => {
            const words = isSpecial ?
                ["MUCH WOW", "ABSOLUTE UNIT", "REEEEEEEEEEE", "CHAD ENERGY", "BASED!!!", "GIGACHAD VIBES"] :
                MEME_WORDS;
            const text = words[Math.floor(Math.random() * words.length)]
            const id = Date.now() + Math.random()
            setMemeTexts(prev => [...prev, { id, text, x: x + (Math.random() * 40 - 20), y: y + (Math.random() * 40 - 20), isSpecial }])
            setTimeout(() => {
                setMemeTexts(prev => prev.filter(m => m.id !== id))
            }, 800)

            if (isSpecial) {
                // Screen shake
                canvas.classList.add('animate-bounce');
                setTimeout(() => canvas.classList.remove('animate-bounce'), 500);
            }
        }

        const gameLoop = (timeStamp) => {
            if (!isMounted) return
            const deltaTime = timeStamp - lastTime
            lastTime = timeStamp

            ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight)

            // Draw background

            // Update fighters
            if (!p1.isDead) p1.handleInput(input.getPlayerInput())
            if (!p2.isDead) ai.update(deltaTime, p1)

            p1.update(deltaTime, p2, spawnMeme, spawnParticle)
            p2.update(deltaTime, p1, spawnMeme, spawnParticle)

            // Render Particles
            particles.forEach(p => p.update())
            particles = particles.filter(p => p.alive)
            particles.forEach(p => p.draw(ctx))

            // Draw HUD overlay (abstracted to react but stats from objects)
            setHudData({
                p1Health: (p1.health / CONFIG.baseHp) * 100,
                p1Stamina: p1.stamina,
                p2Health: (p2.health / CONFIG.baseHp) * 100,
                p2Stamina: p2.stamina
            })

            p1.draw()
            p2.draw()

            if ((p1.isDead || p2.isDead) && !isFinishedRef.current) {
                isFinishedRef.current = true
                setTimeout(() => {
                    if (isMounted) onGameOver(p1.isDead ? 'cpu' : 'p1')
                }, 2000)
            }

            animationId = requestAnimationFrame(gameLoop)
        }

        const init = async () => {
            const loadImg = (img) => {
                if (img.complete) return Promise.resolve()
                return new Promise(r => img.onload = r)
            }
            await Promise.all([loadImg(p1.image), loadImg(p2.image)])
            if (isMounted) animationId = requestAnimationFrame(gameLoop)
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
            {/* HUD React Layer */}
            <div className="absolute top-0 w-full p-8 flex justify-between z-10 pointer-events-none">
                <div className="w-[350px]">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-bangers text-3xl text-white drop-shadow-md">YOU</span>
                        <span className="font-comic text-xs text-green-400">FEELS GREAT</span>
                    </div>
                    <div className="h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 transition-all duration-300"
                            style={{ width: `${hudData.p1Health}%` }}
                        />
                    </div>
                    <div className="h-2 bg-neutral-900 mt-1 rounded-full overflow-hidden w-1/2 ml-auto">
                        <div className="h-full bg-blue-400" style={{ width: `${hudData.p1Stamina}%` }} />
                    </div>
                </div>

                <div className="w-[350px] text-right">
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-comic text-xs text-red-400">ABSOLUTE UNIT</span>
                        <span className="font-bangers text-3xl text-white drop-shadow-md">CPU</span>
                    </div>
                    <div className="h-8 bg-neutral-900 border-2 border-white rounded-xl overflow-hidden shadow-lg relative">
                        <div
                            className="h-full bg-gradient-to-l from-red-600 to-orange-500 transition-all duration-300 ml-auto"
                            style={{ width: `${hudData.p2Health}%` }}
                        />
                    </div>
                    <div className="h-2 bg-neutral-900 mt-1 rounded-full overflow-hidden w-1/2 mr-auto">
                        <div className="h-full bg-blue-400 ml-auto" style={{ width: `${hudData.p2Stamina}%` }} />
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={CONFIG.canvasWidth}
                height={CONFIG.canvasHeight}
                className="block w-full h-full object-cover"
            />

            {/* Meme Text Overlay */}
            {memeTexts.map(m => (
                <div
                    key={m.id}
                    className={`absolute font-comic font-black ${m.isSpecial ? 'text-6xl text-yellow-400 animate-special-meme' : 'text-4xl text-white animate-meme-popup'} pointer-events-none drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase`}
                    style={{ left: m.x, top: m.y }}
                >
                    {m.text}
                </div>
            ))}
            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 px-8 py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-sm">
                <div><span className="text-orange-400 font-bold">WASD</span> MOVE</div>
                <div><span className="text-orange-400 font-bold">SPACE/J</span> BONK</div>
                <div><span className="text-orange-400 font-bold">SHIFT/K</span> DASH</div>
                <div><span className="text-orange-400 font-bold">E/Q/U</span> SKILL</div>
            </div>
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
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 text-white rounded hover:bg-white/20"
                title="Toggle Fullscreen"
            >
                ⛶
            </button>
        </div>
    )
}
