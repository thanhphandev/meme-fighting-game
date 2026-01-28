import { useState } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { SoundManager } from '../game/SoundManager';

export default function SoundControl({ className = '' }) {
    const [muteStates, setMuteStates] = useState(SoundManager.getMuteStates());

    const updateStates = () => {
        setMuteStates(SoundManager.getMuteStates());
    };

    const toggleMute = () => {
        SoundManager.toggleMute();
        updateStates();
    };

    const toggleBgm = () => {
        SoundManager.toggleBgmMute();
        updateStates();
    };

    const toggleSfx = () => {
        SoundManager.toggleSfxMute();
        updateStates();
    };

    const buttonBase = "relative p-3 rounded-xl transition-all duration-300 backdrop-blur-sm border";

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Master Mute */}
            <button
                onClick={toggleMute}
                className={`${buttonBase} ${muteStates.isMuted
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-lg shadow-red-500/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-cyan-500/30 hover:text-cyan-400'
                    }`}
                title={muteStates.isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
                {muteStates.isMuted ? (
                    <VolumeX className="w-5 h-5" />
                ) : (
                    <Volume2 className="w-5 h-5" />
                )}
            </button>

            {/* BGM Toggle */}
            <button
                onClick={toggleBgm}
                className={`${buttonBase} ${muteStates.isBgmMuted
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-lg shadow-orange-500/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-cyan-500/30 hover:text-cyan-400'
                    }`}
                title={muteStates.isBgmMuted ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
            >
                {muteStates.isBgmMuted ? (
                    <Music2 className="w-5 h-5 opacity-60" />
                ) : (
                    <Music className="w-5 h-5" />
                )}
            </button>

            {/* SFX Toggle */}
            <button
                onClick={toggleSfx}
                className={`${buttonBase} ${muteStates.isSfxMuted
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-lg shadow-yellow-500/20'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-cyan-500/30 hover:text-cyan-400'
                    }`}
                title={muteStates.isSfxMuted ? 'Bật hiệu ứng âm' : 'Tắt hiệu ứng âm'}
            >
                <span className={`text-game text-xs font-bold ${muteStates.isSfxMuted ? 'opacity-60' : ''}`}>
                    SFX
                </span>
            </button>
        </div>
    );
}
