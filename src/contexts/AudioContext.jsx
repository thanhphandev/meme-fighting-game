import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SoundManager } from '../engine/systems/SoundManager';

/**
 * AudioContext - Quản lý audio state và SoundManager
 * Thay thế singleton pattern để dễ test và kiểm soát hơn
 */

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize SoundManager on mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        await SoundManager.preload();
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to preload audio:', err);
      }
    };

    initAudio();

    return () => {
      SoundManager.stopBgm();
    };
  }, []);

  // Sync mute state with SoundManager
  useEffect(() => {
    const states = SoundManager.getMuteStates();
    if (states.isMuted !== isMuted) {
      SoundManager.toggleMute();
    }
  }, [isMuted]);

  // Actions
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playBgm = useCallback((bgmName, loop = true) => {
    SoundManager.playBgm(bgmName, loop);
    setCurrentBgm(bgmName);
  }, []);

  const stopBgm = useCallback(() => {
    SoundManager.stopBgm();
    setCurrentBgm(null);
  }, []);

  const playSfx = useCallback((sfxName) => {
    SoundManager.playSfx(sfxName);
  }, []);

  const setBgmVol = useCallback((vol) => {
    setBgmVolume(vol);
    SoundManager.setBgmVolume?.(vol);
  }, []);

  const setSfxVol = useCallback((vol) => {
    setSfxVolume(vol);
    SoundManager.setSfxVolume?.(vol);
  }, []);

  const value = {
    isMuted,
    bgmVolume,
    sfxVolume,
    currentBgm,
    isLoaded,
    toggleMute,
    playBgm,
    stopBgm,
    playSfx,
    setBgmVolume: setBgmVol,
    setSfxVolume: setSfxVol,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
