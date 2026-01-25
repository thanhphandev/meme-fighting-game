import { motion } from 'framer-motion'
import { CHARACTERS } from '../game/constants'

export default function SelectionScreen({ onSelect }) {
    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl">
            <h2 className="font-bangers text-6xl text-white">SELECT YOUR MEME</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {CHARACTERS.map((char) => (
                    <motion.div
                        key={char.id}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="flex flex-col items-center p-6 bg-neutral-900 border-2 border-neutral-800 rounded-3xl cursor-pointer hover:border-orange-500 transition-colors group"
                        onClick={() => onSelect(char.id)}
                    >
                        <div className="w-32 h-32 relative mb-4 overflow-hidden rounded-2xl bg-neutral-800">
                            {/* Show a preview image (frame 1) */}
                            <img
                                src={`/assets/${char.asset}`}
                                className="absolute max-w-none transform scale-[4]"
                                style={{
                                    left: -0, // Assuming first frame
                                    top: -(char.rows.idle * 256) / 2 // Rough preview alignment
                                }}
                            />
                        </div>
                        <h3 className="font-bangers text-3xl text-white group-hover:text-orange-500">{char.name}</h3>
                        <p className="font-comic text-xs text-neutral-500 text-center mt-2 px-2">{char.description}</p>

                        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                            {Object.entries(char.stats).map(([stat, val]) => (
                                <div key={stat} className="flex flex-col items-center bg-black/30 p-1 rounded-lg">
                                    <span className="text-[10px] text-neutral-600 uppercase">{stat}</span>
                                    <span className="text-sm font-bold text-orange-400">{val}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
