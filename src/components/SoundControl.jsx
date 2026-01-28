/**
 * SoundControl Component
 * UI controls for muting/unmuting BGM and SFX
 */
import { useState, useEffect } from 'react';
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

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Master Mute */}
            <button
                onClick={toggleMute}
                className={`p-2 rounded-lg transition-all duration-200 ${muteStates.isMuted
                        ? 'bg-red-500/80 hover:bg-red-400'
                        : 'bg-white/10 hover:bg-white/20'
                    } text-white backdrop-blur-sm border border-white/20`}
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
                className={`p-2 rounded-lg transition-all duration-200 ${muteStates.isBgmMuted
                        ? 'bg-orange-500/80 hover:bg-orange-400'
                        : 'bg-white/10 hover:bg-white/20'
                    } text-white backdrop-blur-sm border border-white/20`}
                title={muteStates.isBgmMuted ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
            >
                {muteStates.isBgmMuted ? (
                    <Music2 className="w-5 h-5 opacity-50" />
                ) : (
                    <Music className="w-5 h-5" />
                )}
            </button>

            {/* SFX Toggle */}
            <button
                onClick={toggleSfx}
                className={`p-2 rounded-lg transition-all duration-200 ${muteStates.isSfxMuted
                        ? 'bg-yellow-500/80 hover:bg-yellow-400'
                        : 'bg-white/10 hover:bg-white/20'
                    } text-white backdrop-blur-sm border border-white/20`}
                title={muteStates.isSfxMuted ? 'Bật hiệu ứng âm' : 'Tắt hiệu ứng âm'}
            >
                <span className={`text-xs font-bold ${muteStates.isSfxMuted ? 'opacity-50' : ''}`}>
                    SFX
                </span>
            </button>
        </div>
    );
}
