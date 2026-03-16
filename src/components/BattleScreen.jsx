import { useState, useCallback } from 'react';
import { Pause, Maximize, Minimize } from 'lucide-react';
import SoundControl from './SoundControl';
import { useBattleLogic } from '../hooks/useBattleLogic';
import { VSIntro, HUD, GameCanvas, PauseOverlay, AnnouncementOverlay, ControlsDisplay } from './battle';
import { BACKGROUNDS } from '../engine/data/constants';

/**
 * BattleScreen Component - Đã được refactor để tối ưu performance
 * Tách thành các sub-components và sử dụng useBattleLogic hook
 */
export default function BattleScreen({ playerChar, cpuChar, background, onGameOver, cpuDifficulty = 'medium', onQuit, gameMode = 'pve' }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  const {
    canvasRef,
    hudData,
    showVsIntro,
    lowHealthWarning,
    hitFlash,
    koFreeze
  } = useBattleLogic({
    playerChar,
    cpuChar,
    background,
    onGameOver,
    cpuDifficulty,
    gameMode,
    isPaused,
    onAnnouncement: (ann) => {
      setAnnouncement(ann);
      setTimeout(() => setAnnouncement(null), ann.timer || 2000);
    }
  });

  // Track fullscreen changes
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const bgData = BACKGROUNDS.find(b => b.id === background?.id) || background;

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      style={{
        backgroundImage: bgData?.asset ? `url(/assets/${bgData.asset})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlays */}
      <div className="scanlines" />
      <div className={`vignette ${lowHealthWarning.p1 ? 'vignette-danger' : ''}`} />

      {/* VS Intro Cinematic */}
      {showVsIntro && (
        <VSIntro
          playerChar={playerChar}
          cpuChar={cpuChar}
          p1Name={hudData.p1Name}
          p2Name={hudData.p2Name}
        />
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <PauseOverlay
          onResume={() => setIsPaused(false)}
          onRestart={onQuit}
          onQuit={onQuit}
        />
      )}

      {/* HUD Layer */}
      <HUD
        p1Name={hudData.p1Name}
        p2Name={hudData.p2Name}
        p1Health={hudData.p1Health}
        p1DelayedHealth={hudData.p1DelayedHealth}
        p1Stamina={hudData.p1Stamina}
        p2Health={hudData.p2Health}
        p2DelayedHealth={hudData.p2DelayedHealth}
        p2Stamina={hudData.p2Stamina}
        cooldownP1={hudData.cooldownP1}
        cooldownP2={hudData.cooldownP2}
        lowHealthWarning={lowHealthWarning}
        hitFlash={hitFlash}
        gameMode={gameMode}
      />

      {/* Game Canvas */}
      <GameCanvas ref={canvasRef} koFreeze={koFreeze} />

      {/* Controls Display */}
      <ControlsDisplay gameMode={gameMode} />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <SoundControl />
        <div className="w-px bg-white/20" />
        <button
          onClick={() => setIsPaused(true)}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
          title="Tạm dừng (ESC)"
        >
          <Pause className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
          title="Toàn màn hình"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Announcement Overlay */}
      <AnnouncementOverlay announcement={announcement} />
    </div>
  );
}
