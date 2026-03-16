import { motion } from 'framer-motion';
import { Play, RotateCcw, Home, Sliders, Volume2, Music } from 'lucide-react';
import { useState } from 'react';
import { SoundManager } from '../engine/systems/SoundManager';
import SoundControl from './SoundControl';

export default function PauseMenu({ onResume, onRestart, onQuit }) {
    const [showSettings, setShowSettings] = useState(false);
    const [bgmVolume, setBgmVolume] = useState(SoundManager.bgmVolume * 100);
    const [sfxVolume, setSfxVolume] = useState(SoundManager.sfxVolume * 100);

    const handleResume = () => {
        SoundManager.playSfx('sfx_confirm');
        onResume();
    };

    const handleRestart = () => {
        SoundManager.playSfx('sfx_select');
        onRestart();
    };

    const handleQuit = () => {
        SoundManager.playSfx('sfx_cancel');
        onQuit();
    };

    const handleBgmVolumeChange = (value) => {
        setBgmVolume(value);
        SoundManager.setBgmVolume(value / 100);
    };

    const handleSfxVolumeChange = (value) => {
        setSfxVolume(value);
        SoundManager.setSfxVolume(value / 100);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative glass-card border-gradient p-6 md:p-8 min-w-[320px] md:min-w-[400px] mx-4"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-4xl mb-2"
                    >
                        ⏸️
                    </motion.div>
                    <h2 className="text-game text-3xl md:text-4xl text-white tracking-wider">
                        TẠM DỪNG
                    </h2>
                </div>

                {!showSettings ? (
                    <div className="flex flex-col gap-3">
                        {/* Resume Button */}
                        <motion.button
                            onClick={handleResume}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 hover:border-cyan-400 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <Play className="w-5 h-5 text-black fill-current" />
                            </div>
                            <span className="text-game text-lg text-white group-hover:text-cyan-400 transition-colors">
                                TIẾP TỤC
                            </span>
                        </motion.button>

                        {/* Restart Button */}
                        <motion.button
                            onClick={handleRestart}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <RotateCcw className="w-5 h-5 text-white/70" />
                            </div>
                            <span className="text-game text-lg text-white/70 group-hover:text-white transition-colors">
                                CHƠI LẠI
                            </span>
                        </motion.button>

                        {/* Settings Button */}
                        <motion.button
                            onClick={() => setShowSettings(true)}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                <Sliders className="w-5 h-5 text-white/70" />
                            </div>
                            <span className="text-game text-lg text-white/70 group-hover:text-white transition-colors">
                                CÀI ĐẶT
                            </span>
                        </motion.button>

                        {/* Quit Button */}
                        <motion.button
                            onClick={handleQuit}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-400 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-game text-lg text-white/70 group-hover:text-red-400 transition-colors flex-1 text-left">
                                THOÁT
                            </span>
                        </motion.button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* Settings Panel */}
                        <div className="space-y-4">
                            <h3 className="text-game text-lg text-cyan-400 flex items-center gap-2">
                                <Volume2 className="w-5 h-5" />
                                Âm thanh
                            </h3>

                            {/* Quick Mute */}
                            <div className="flex justify-center">
                                <SoundControl />
                            </div>

                            {/* BGM Volume */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-display text-sm text-white/60 flex items-center gap-2">
                                        <Music className="w-4 h-4" />
                                        Nhạc nền
                                    </label>
                                    <span className="text-game text-sm text-cyan-400">
                                        {Math.round(bgmVolume)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={bgmVolume}
                                    onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
                                    className="w-full slider-cyan"
                                />
                            </div>

                            {/* SFX Volume */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-display text-sm text-white/60 flex items-center gap-2">
                                        <Volume2 className="w-4 h-4" />
                                        Hiệu ứng
                                    </label>
                                    <span className="text-game text-sm text-cyan-400">
                                        {Math.round(sfxVolume)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sfxVolume}
                                    onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                                    className="w-full slider-cyan"
                                />
                            </div>
                        </div>

                        {/* Back Button */}
                        <motion.button
                            onClick={() => setShowSettings(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-game text-base text-black font-bold hover:from-cyan-400 hover:to-cyan-500 transition-all"
                        >
                            ← QUAY LẠI
                        </motion.button>
                    </div>
                )}

                {/* Footer hint */}
                <p className="text-display text-[11px] text-white/30 text-center mt-4">
                    Nhấn ESC để tiếp tục
                </p>
            </motion.div>
        </div>
    );
}
