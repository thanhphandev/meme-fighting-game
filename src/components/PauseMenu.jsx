import { motion } from 'framer-motion';
import { Play, RotateCcw, Home, Sliders } from 'lucide-react';
import { useState } from 'react';
import { SoundManager } from '../game/SoundManager';
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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="flex flex-col gap-4 md:gap-6 p-6 md:p-10 bg-gradient-to-br from-neutral-900 to-neutral-950 border-4 border-orange-500 rounded-3xl text-center shadow-[0_0_60px_rgba(255,165,0,0.4)] mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-center gap-3">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-4xl"
                    >
                        ⏸️
                    </motion.div>
                    <h2 className="font-bangers text-4xl md:text-6xl text-white">TẠM DỪNG</h2>
                </div>

                {/* Settings Toggle */}
                {!showSettings ? (
                    <>
                        {/* Main Buttons */}
                        <motion.button
                            onClick={handleResume}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bangers text-xl md:text-2xl rounded-full hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg"
                        >
                            <Play className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                            TIẾP TỤC
                        </motion.button>

                        <motion.button
                            onClick={handleRestart}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-neutral-800 text-white font-bangers text-xl md:text-2xl rounded-full hover:bg-neutral-700 transition-all border-2 border-neutral-600"
                        >
                            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                            CHƠI LẠI
                        </motion.button>

                        <motion.button
                            onClick={() => setShowSettings(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-neutral-800 text-white font-bangers text-xl md:text-2xl rounded-full hover:bg-neutral-700 transition-all border-2 border-neutral-600"
                        >
                            <Sliders className="w-5 h-5 md:w-6 md:h-6" />
                            CÀI ĐẶT ÂM THANH
                        </motion.button>

                        <motion.button
                            onClick={handleQuit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-3 px-8 py-3 md:py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white font-bangers text-xl md:text-2xl rounded-full hover:from-red-500 hover:to-rose-600 transition-all shadow-lg"
                        >
                            <Home className="w-5 h-5 md:w-6 md:h-6" />
                            THOÁT VỀ MENU
                        </motion.button>
                    </>
                ) : (
                    <>
                        {/* Sound Settings */}
                        <div className="flex flex-col gap-4 p-4 bg-black/30 rounded-xl">
                            <h3 className="font-bangers text-xl text-orange-400">🔊 Cài đặt âm thanh</h3>

                            {/* Quick Mute Controls */}
                            <div className="flex justify-center">
                                <SoundControl />
                            </div>

                            {/* BGM Volume */}
                            <div className="flex flex-col gap-2">
                                <label className="font-comic text-sm text-white/70 text-left">
                                    🎵 Nhạc nền: {Math.round(bgmVolume)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={bgmVolume}
                                    onChange={(e) => handleBgmVolumeChange(Number(e.target.value))}
                                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-orange"
                                />
                            </div>

                            {/* SFX Volume */}
                            <div className="flex flex-col gap-2">
                                <label className="font-comic text-sm text-white/70 text-left">
                                    🔈 Hiệu ứng: {Math.round(sfxVolume)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sfxVolume}
                                    onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-orange"
                                />
                            </div>
                        </div>

                        <motion.button
                            onClick={() => setShowSettings(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-orange-500 text-white font-bangers text-xl rounded-full hover:bg-orange-400 transition-all"
                        >
                            ← QUAY LẠI
                        </motion.button>
                    </>
                )}

                {/* Keyboard hint */}
                <p className="text-white/40 font-comic text-xs mt-2">
                    Nhấn ESC để tiếp tục
                </p>
            </motion.div>
        </div>
    );
}
