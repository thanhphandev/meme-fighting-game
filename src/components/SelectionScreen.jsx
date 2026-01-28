import { motion } from 'framer-motion'
import { CHARACTERS } from '../game/constants'
import { SoundManager } from '../game/SoundManager'
import { Swords, Wind, Zap, Flame, Shield } from 'lucide-react'

// Skill type icons mapping
const skillIcons = {
    projectile: Flame,
    buff: Shield,
    aoe: Zap,
    dash: Wind,
}

export default function SelectionScreen({ onSelect, title = "SELECT YOUR MEME" }) {

    const handleSelect = (charId) => {
        SoundManager.playSfx('sfx_select')
        onSelect(charId)
    }

    return (
        <div className="relative flex flex-col items-center gap-6 w-full max-w-6xl px-4 min-h-screen py-8">
            {/* Background Effects */}
            <div className="bg-pattern" />
            <div className="bg-grid" />

            {/* Title */}
            <motion.div
                className="relative z-10 text-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h2 className="text-game text-3xl md:text-5xl text-white tracking-wider">
                    {title}
                </h2>
                <div className="mt-2 flex items-center justify-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500" />
                    <Swords className="w-5 h-5 text-cyan-400" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500" />
                </div>
            </motion.div>

            {/* Characters Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 w-full max-h-[70vh] overflow-y-auto p-2 custom-scrollbar">
                {CHARACTERS.map((char, index) => {
                    const SkillIcon = skillIcons[char.skill.type] || Zap

                    return (
                        <motion.div
                            key={char.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.4 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => handleSelect(char.id)}
                            className="group relative glass-card glass-card-hover cursor-pointer overflow-hidden"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Character Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <motion.div
                                    style={{
                                        backgroundImage: `url(/assets/${char.asset})`,
                                        backgroundSize: `600% ${(char.rowCount || 8) * 100}%`,
                                        backgroundPosition: `0% ${char.rows.idle * (100 / ((char.rowCount || 8) - 1))}%`,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    className="transform group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Skill Badge */}
                                <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
                                    <SkillIcon className="w-4 h-4 text-cyan-400" />
                                </div>

                                {/* Top gradient fade */}
                                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                            </div>

                            {/* Character Info */}
                            <div className="p-3 md:p-4">
                                {/* Name */}
                                <h3 className="text-game text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors truncate">
                                    {char.name}
                                </h3>

                                {/* Stats Row */}
                                <div className="flex gap-2 mt-2">
                                    {Object.entries(char.stats).map(([stat, val]) => (
                                        <div
                                            key={stat}
                                            className="flex items-center gap-1 px-2 py-1 rounded bg-black/30"
                                        >
                                            <span className="text-[10px] text-white/40">
                                                {stat === 'speed' ? '💨' : stat === 'jump' ? '⬆️' : '⚔️'}
                                            </span>
                                            <span className="text-xs font-bold text-white/80">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Skill Name */}
                                <div className="mt-2 px-2 py-1 rounded bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                    <span className="text-display text-[10px] md:text-xs text-purple-300 truncate block">
                                        {char.skill.name}
                                    </span>
                                </div>
                            </div>

                            {/* Selection Border Glow */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-500/50 transition-colors pointer-events-none" />
                        </motion.div>
                    )
                })}
            </div>

            {/* Help Text */}
            <motion.p
                className="relative z-10 text-display text-xs md:text-sm text-white/40 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                💡 Click vào nhân vật để chọn • Mỗi nhân vật có skill đặc biệt riêng!
            </motion.p>
        </div>
    )
}
