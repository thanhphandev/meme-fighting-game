import { motion } from 'framer-motion'
import { Gamepad2, Users, Zap, ChevronRight, Github } from 'lucide-react'
import { useEffect } from 'react'
import { SoundManager } from '../engine/systems/SoundManager'
import SoundControl from './SoundControl'

// Pre-generate stable particle positions to avoid Math.random in render
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 17 + 3) % 100,
    top: (i * 23 + 7) % 100,
    duration: 3 + (i % 5) * 0.5,
    delay: (i % 10) * 0.2,
}))

export default function Menu({ onStart, difficulty = 'medium', onSelectDifficulty }) {

    useEffect(() => {
        SoundManager.playBgm('bgm_menu')
        return () => {
            SoundManager.fadeOutBgm(500)
        }
    }, [])

    const handleButtonClick = (mode) => {
        SoundManager.playSfx('sfx_confirm')
        onStart(mode)
    }

    const handleDifficultyChange = (diff) => {
        SoundManager.playSfx('sfx_select')
        onSelectDifficulty && onSelectDifficulty(diff)
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
            {/* Animated Background */}
            <div className="bg-pattern" />
            <div className="bg-grid" />

            {/* GitHub Link Action */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
                <a 
                    href="https://github.com/thanhphandev/meme-fighting-game" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white transition-all group shadow-lg"
                >
                    <Github className="w-5 h-5 group-hover:scale-110 group-hover:text-cyan-400 transition-all border-none" />
                    <span className="text-game text-sm hidden sm:block group-hover:text-cyan-400 transition-colors mt-0.5">GITHUB</span>
                </a>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {PARTICLES.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 px-4 py-8">

                {/* Logo / Title */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Main Title */}
                    <motion.h1
                        className="text-game text-5xl md:text-7xl lg:text-8xl font-black tracking-wider"
                        animate={{
                            textShadow: [
                                "0 0 20px rgba(0, 240, 255, 0.5)",
                                "0 0 40px rgba(0, 240, 255, 0.8)",
                                "0 0 20px rgba(0, 240, 255, 0.5)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-gradient-cyan">MEME</span>
                        <span className="text-white mx-2">BATTLE</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.div
                        className="mt-2 flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500" />
                        <span className="text-game text-lg md:text-xl text-cyan-400 tracking-[0.3em]">
                            ARENA
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        className="text-display text-sm md:text-base text-white/50 mt-4 tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        ⚡ Game đối kháng meme cực đỉnh ⚡
                    </motion.p>
                </motion.div>

                {/* Main Action Buttons */}
                <motion.div
                    className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* VS CPU Button */}
                    <motion.button
                        onClick={() => handleButtonClick('pve')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex-1 glass-card glass-card-hover p-6 cursor-pointer overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />

                        <div className="relative flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <Gamepad2 className="w-7 h-7 text-black" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-game text-xl md:text-2xl text-white group-hover:text-cyan-400 transition-colors">
                                    VS AI
                                </h3>
                                <p className="text-display text-sm text-white/50">
                                    Đối đầu với AI
                                </p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.button>

                    {/* VS Player Button */}
                    <motion.button
                        onClick={() => handleButtonClick('pvp')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative flex-1 glass-card glass-card-hover p-6 cursor-pointer overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />

                        <div className="relative flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-game text-xl md:text-2xl text-white group-hover:text-pink-400 transition-colors">
                                    VS PLAYER
                                </h3>
                                <p className="text-display text-sm text-white/50">
                                    2 người chơi
                                </p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.button>
                </motion.div>

                {/* Difficulty Selector */}
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-display text-sm text-white/40 uppercase tracking-widest">
                        Độ khó AI
                    </span>
                    <div className="flex gap-2 p-1 bg-black/30 rounded-xl backdrop-blur-sm">
                        {[
                            { key: 'easy', label: 'DỄ', color: 'from-green-400 to-emerald-500', icon: '😊' },
                            { key: 'medium', label: 'VỪA', color: 'from-yellow-400 to-orange-500', icon: '😤' },
                            { key: 'hard', label: 'KHÓ', color: 'from-red-400 to-rose-500', icon: '💀' }
                        ].map(diff => (
                            <motion.button
                                key={diff.key}
                                onClick={() => handleDifficultyChange(diff.key)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-game text-sm md:text-base font-bold transition-all duration-300 ${difficulty === diff.key
                                    ? `bg-gradient-to-r ${diff.color} text-black shadow-lg`
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="mr-1.5">{diff.icon}</span>
                                {diff.label}

                                {/* Active indicator */}
                                {difficulty === diff.key && (
                                    <motion.div
                                        layoutId="difficultyIndicator"
                                        className="absolute -bottom-1 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Sound Controls */}
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="text-display text-xs text-white/30 uppercase tracking-widest">
                        Âm thanh
                    </span>
                    <SoundControl />
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="flex flex-col items-center gap-2 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mt-2">
                        <Zap className="w-3 h-3 text-cyan-500/50" />
                        <span className="text-display">Meme Fighting Game • by Phan Văn Thành</span>
                        <Zap className="w-3 h-3 text-pink-500/50" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
