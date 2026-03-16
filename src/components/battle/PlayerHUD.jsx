import { memo } from 'react';

/**
 * PlayerHUD Component - HUD cho từng player (health, stamina, cooldown)
 * Memoized để chỉ re-render khi props thay đổi
 */
const PlayerHUD = memo(function PlayerHUD({
  name,
  health,
  delayedHealth,
  stamina,
  cooldown,
  isP1,
  isLowHealth,
  isHitFlash,
  gameMode
}) {
  const borderColor = isP1 ? 'border-cyan-500/50' : 'border-pink-500/50';
  const accentColor = isP1 ? 'cyan' : 'pink';
  const fillClass = isP1 ? 'health-fill-p1' : 'health-fill-p2';
  const skewClass = isP1 ? 'skew-x-[-15deg]' : 'skew-x-[15deg]';
  const containerAlign = isP1 ? '' : 'flex-row-reverse';
  const textAlign = isP1 ? '' : 'text-right items-end';

  return (
    <div className={`w-[320px] md:w-[400px] transition-transform ${isLowHealth ? 'animate-[glitch_0.2s_infinite]' : ''}`}>
      {/* Name & Label */}
      <div className={`flex flex-col mb-2 ${textAlign}`}>
        <span className={`text-xs font-game tracking-widest mb-1 ${isLowHealth ? 'text-red-500' : `text-${accentColor}-500`}`}>
          {isLowHealth
            ? (isP1 ? 'WARNING! LOW HP' : 'FINISH THEM!')
            : (isP1 ? 'PLAYER 1' : (gameMode === 'pve' ? 'CPU ENEMY' : 'PLAYER 2'))
          }
        </span>
        <span className="font-game text-3xl text-white drop-shadow-md truncate max-w-[200px]">
          {name}
        </span>
      </div>

      {/* Health Bar */}
      <div className={`health-container transform ${skewClass} ${borderColor} ${isHitFlash ? 'brightness-150 scale-[1.02]' : ''}`}>
        {/* Delayed health (white/red ghost) */}
        <div
          className={`absolute top-0 h-full transition-all duration-300 ${isP1 ? 'left-0 bg-red-600/50' : 'right-0 bg-white/20'}`}
          style={{ width: `${delayedHealth}%` }}
        />
        {/* Current health */}
        <div
          className={`absolute top-0 h-full ${fillClass} health-segment-mask ${isP1 ? 'left-0' : 'right-0'}`}
          style={{ width: `${health}%` }}
        />
        {/* Damage flash */}
        {isHitFlash && <div className="absolute inset-0 bg-white animate-flash" />}
        {/* Percentage text */}
        <div className={`absolute inset-0 flex items-center px-4 transform ${isP1 ? 'skew-x-[15deg] justify-end' : 'skew-x-[-15deg] justify-start'}`}>
          <span className="font-game text-sm text-white drop-shadow-lg italic">
            {Math.ceil(health)}%
          </span>
        </div>
      </div>

      {/* Stamina & Skill */}
      <div className={`flex gap-3 mt-3 items-center ${containerAlign}`}>
        {/* Stamina bar */}
        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full bg-${accentColor}-400 box-glow-${accentColor} transition-all duration-200`}
            style={{ width: `${stamina}%` }}
          />
        </div>
        {/* Skill Cooldown */}
        <div className={`relative w-12 h-12 bg-neutral-900 border border-${accentColor}-400/50 rounded-lg flex items-center justify-center overflow-hidden`}>
          <div
            className={`absolute bottom-0 left-0 right-0 bg-${accentColor}-400/30 transition-all duration-100`}
            style={{ height: `${100 - cooldown}%` }}
          />
          <span className={`font-game text-lg ${cooldown === 0 ? `text-${accentColor}-400 animate-pulse` : 'text-white/40'}`}>
            {isP1 ? 'E' : (gameMode === 'pvp' ? 'DEL' : 'AI')}
          </span>
        </div>
      </div>
    </div>
  );
});

export default PlayerHUD;
