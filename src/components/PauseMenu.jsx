import { motion } from 'framer-motion';

export default function PauseMenu({ onResume, onRestart, onQuit }) {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col gap-6 p-10 bg-neutral-900 border-4 border-orange-500 rounded-3xl text-center shadow-[0_0_50px_rgba(255,165,0,0.3)]"
            >
                <h2 className="font-bangers text-6xl text-white mb-4">PAUSED</h2>

                <button
                    onClick={onResume}
                    className="px-8 py-3 bg-white text-black font-bangers text-2xl rounded-full hover:scale-110 hover:bg-orange-400 transition-all"
                >
                    RESUME
                </button>
                <button
                    onClick={onRestart}
                    className="px-8 py-3 bg-neutral-800 text-white font-bangers text-2xl rounded-full hover:scale-110 hover:bg-neutral-700 transition-all"
                >
                    RESTART
                </button>
                <button
                    onClick={onQuit}
                    className="px-8 py-3 bg-red-600 text-white font-bangers text-2xl rounded-full hover:scale-110 hover:bg-red-500 transition-all"
                >
                    QUIT TO MENU
                </button>
            </motion.div>
        </div>
    );
}
