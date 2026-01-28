import { motion } from 'framer-motion'
import { CHARACTERS } from '../game/constants'
import { SoundManager } from '../game/SoundManager'

export default function SelectionScreen({ onSelect, title = "SELECT YOUR MEME" }) {

    const handleHover = () => {
        // Light hover sound
    }

    const handleSelect = (charId) => {
        SoundManager.playSfx('sfx_select')
        onSelect(charId)
    }

    return (
        <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-6xl px-4">
            <motion.h2
                className="font-bangers text-4xl md:text-6xl text-white text-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                {title}
            </motion.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-h-[65vh] overflow-y-auto p-2 md:p-4 custom-scrollbar">
                {CHARACTERS.map((char, index) => (
                    <motion.div
                        key={char.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                        className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-neutral-700 rounded-2xl md:rounded-3xl cursor-pointer hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-200 group relative"
                        onClick={() => handleSelect(char.id)}
                        onMouseEnter={handleHover}
                    >
                        {/* Character Preview */}
                        <div className="w-20 h-20 md:w-32 md:h-32 relative mb-2 md:mb-4 overflow-hidden rounded-xl md:rounded-2xl bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                            <motion.div
                                style={{
                                    backgroundImage: `url(/assets/${char.asset})`,
                                    backgroundSize: `600% ${(char.rowCount || 8) * 100}%`,
                                    backgroundPosition: `0% ${char.rows.idle * (100 / ((char.rowCount || 8) - 1))}%`,
                                    width: '100%',
                                    height: '100%'
                                }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Skill indicator */}
                            <div className="absolute bottom-1 right-1 bg-purple-600/80 rounded px-1.5 py-0.5 text-[8px] md:text-[10px] text-white font-bold backdrop-blur-sm">
                                {char.skill.type === 'projectile' ? '🎯' :
                                    char.skill.type === 'buff' ? '⬆️' :
                                        char.skill.type === 'aoe' ? '💫' :
                                            char.skill.type === 'dash' ? '💨' : '⚡'}
                            </div>
                        </div>

                        {/* Name */}
                        <h3 className="font-bangers text-xl md:text-3xl text-white group-hover:text-orange-500 transition-colors text-center truncate w-full">
                            {char.name}
                        </h3>

                        {/* Description */}
                        <p className="font-comic text-[10px] md:text-xs text-neutral-500 text-center mt-1 md:mt-2 px-1 md:px-2 line-clamp-2">
                            {char.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2 md:mt-4 w-full">
                            {Object.entries(char.stats).map(([stat, val]) => (
                                <div key={stat} className="flex flex-col items-center bg-black/30 p-1 rounded-lg">
                                    <span className="text-[8px] md:text-[10px] text-neutral-500 uppercase">
                                        {stat === 'speed' ? '💨' : stat === 'jump' ? '⬆️' : '⚔️'}
                                    </span>
                                    <span className="text-xs md:text-sm font-bold text-orange-400">{val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Skill Name */}
                        <div className="mt-2 md:mt-3 w-full">
                            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg px-2 py-1 text-center border border-purple-500/30">
                                <span className="text-[9px] md:text-xs text-purple-300 font-comic">
                                    {char.skill.name}
                                </span>
                            </div>
                        </div>

                        {/* Hover overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* Help text */}
            <motion.p
                className="text-white/50 font-comic text-xs md:text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                💡 Click vào nhân vật để chọn | Mỗi nhân vật có skill đặc biệt riêng!
            </motion.p>
        </div>
    )
}
