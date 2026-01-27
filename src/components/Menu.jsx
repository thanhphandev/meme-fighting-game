import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function Menu({ onStart, difficulty = 'medium', onSelectDifficulty }) {
    return (
        <div className="flex flex-col items-center gap-12 overflow-auto h-screen">
            <div className="relative">
                <motion.h1
                    className="font-bangers text-[120px] text-white leading-none tracking-tighter text-center"
                    animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    MEME BATTLE<br />
                    <span className="text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">JS EDITION</span>
                </motion.h1>
            </div>

            <div className="flex gap-6">
                <motion.button
                    onClick={() => onStart('pve')}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative flex items-center gap-4 px-12 py-6 bg-white text-black font-bangers text-4xl rounded-2xl shadow-[0_10px_0_#999] hover:shadow-[0_5px_0_#999] hover:translate-y-[5px] transition-all"
                >
                    <Play className="fill-black w-10 h-10 group-hover:animate-ping" />
                    VS CPU
                </motion.button>

                <motion.button
                    onClick={() => onStart('pvp')}
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="group relative flex items-center gap-4 px-12 py-6 bg-orange-500 text-white font-bangers text-4xl rounded-2xl shadow-[0_10px_0_#b45309] hover:shadow-[0_5px_0_#b45309] hover:translate-y-[5px] transition-all"
                >
                    <Play className="fill-white w-10 h-10 group-hover:animate-ping" />
                    VS PLAYER
                </motion.button>
            </div>

            {/* Difficulty Selector */}
            <div className="flex gap-4">
                {['easy', 'medium', 'hard'].map(diff => (
                    <button
                        key={diff}
                        onClick={() => onSelectDifficulty && onSelectDifficulty(diff)}
                        className={`px-6 py-2 rounded-xl font-bangers text-xl uppercase transition-all ${difficulty === diff ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                            }`}
                    >
                        {diff}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 mt-10 flex-wrap justify-center max-w-2xl">
                {['DOGE', 'PEPE', 'NYAN', 'CAPY', 'SAMURAI', 'NINJA', 'DINO', 'CHICKEN'].map((m) => (
                    <span key={m} className="px-4 py-2 bg-neutral-800 rounded-lg text-neutral-400 font-comic text-sm border border-neutral-700">
                        #{m}
                    </span>
                ))}
            </div>
        </div>
    )
}
