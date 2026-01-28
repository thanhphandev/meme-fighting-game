import { motion } from 'framer-motion'
import { Play, Settings, Gamepad2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SoundManager } from '../game/SoundManager'
import SoundControl from './SoundControl'

export default function Menu({ onStart, difficulty = 'medium', onSelectDifficulty }) {
    const [showSettings, setShowSettings] = useState(false)

    // Play menu BGM on mount
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
        <div className="flex flex-col items-center gap-8 md:gap-12 overflow-auto h-screen py-8 px-4">
            {/* Title */}
            <div className="relative">
                <motion.h1
                    className="font-bangers text-6xl md:text-[120px] text-white leading-none tracking-tighter text-center"
                    animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    MEME BATTLE<br />
                    <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                        JS EDITION
                    </span>
                </motion.h1>

                {/* Vietnamese tagline */}
                <motion.p
                    className="text-center text-white/60 font-comic text-sm md:text-lg mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    ✨ Game đối kháng meme đỉnh nhất! ✨
                </motion.p>
            </div>

            {/* Main Buttons */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <motion.button
                    onClick={() => handleButtonClick('pve')}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative flex items-center gap-4 px-8 md:px-12 py-4 md:py-6 bg-white text-black font-bangers text-2xl md:text-4xl rounded-2xl shadow-[0_10px_0_#999] hover:shadow-[0_5px_0_#999] hover:translate-y-[5px] transition-all"
                >
                    <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 group-hover:animate-bounce" />
                    <div className="flex flex-col items-start">
                        <span>VS CPU</span>
                        <span className="text-xs md:text-sm font-comic text-neutral-500">Đấu với máy</span>
                    </div>
                </motion.button>

                <motion.button
                    onClick={() => handleButtonClick('pvp')}
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative flex items-center gap-4 px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bangers text-2xl md:text-4xl rounded-2xl shadow-[0_10px_0_#b45309] hover:shadow-[0_5px_0_#b45309] hover:translate-y-[5px] transition-all"
                >
                    <Play className="fill-white w-8 h-8 md:w-10 md:h-10 group-hover:animate-ping" />
                    <div className="flex flex-col items-start">
                        <span>VS PLAYER</span>
                        <span className="text-xs md:text-sm font-comic text-white/70">2 người chơi</span>
                    </div>
                </motion.button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col items-center gap-3">
                <span className="text-white/60 font-comic text-sm">Độ khó CPU:</span>
                <div className="flex gap-2 md:gap-4">
                    {[
                        { key: 'easy', label: 'DỄ', emoji: '😊', color: 'from-green-500 to-emerald-600' },
                        { key: 'medium', label: 'VỪA', emoji: '😤', color: 'from-yellow-500 to-orange-500' },
                        { key: 'hard', label: 'KHÓ', emoji: '💀', color: 'from-red-500 to-rose-600' }
                    ].map(diff => (
                        <motion.button
                            key={diff.key}
                            onClick={() => handleDifficultyChange(diff.key)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bangers text-lg md:text-xl uppercase transition-all ${difficulty === diff.key
                                    ? `bg-gradient-to-r ${diff.color} text-white scale-110 shadow-lg ring-2 ring-white/50`
                                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                }`}
                        >
                            <span className="mr-1">{diff.emoji}</span>
                            {diff.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Sound Controls */}
            <div className="flex flex-col items-center gap-2">
                <span className="text-white/60 font-comic text-sm">🔊 Âm thanh:</span>
                <SoundControl />
            </div>

            {/* Character Tags */}
            <motion.div
                className="flex gap-3 md:gap-6 flex-wrap justify-center max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {[
                    { name: 'DOGE', emoji: '🐕' },
                    { name: 'PEPE', emoji: '🐸' },
                    { name: 'NYAN', emoji: '🌈' },
                    { name: 'CAPY', emoji: '🧘' },
                    { name: 'SAMURAI', emoji: '⚔️' },
                    { name: 'NINJA', emoji: '🌑' },
                    { name: 'DINO', emoji: '🦖' },
                    { name: 'LUFFY', emoji: '🏴‍☠️' },
                    { name: 'ZORO', emoji: '🗡️' },
                ].map((m) => (
                    <motion.span
                        key={m.name}
                        whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-neutral-800/80 rounded-lg text-neutral-300 font-comic text-xs md:text-sm border border-neutral-700 cursor-default hover:border-orange-500/50 transition-colors backdrop-blur-sm"
                    >
                        {m.emoji} #{m.name}
                    </motion.span>
                ))}
            </motion.div>

            {/* Footer Credits */}
            <motion.div
                className="text-center text-white/30 font-comic text-xs mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Made with 💖 | Vietnamese GenZ Edition
            </motion.div>
        </div>
    )
}
