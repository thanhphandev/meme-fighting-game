import { memo } from 'react';
import PlayerHUD from './PlayerHUD';

/**
 * HUD Component - Container cho toàn bộ HUD trong battle
 * Bao gồm 2 player HUDs và timer ở giữa
 */
const HUD = memo(function HUD({
  p1Name,
  p2Name,
  p1Health,
  p1DelayedHealth,
  p1Stamina,
  p2Health,
  p2DelayedHealth,
  p2Stamina,
  cooldownP1,
  cooldownP2,
  lowHealthWarning,
  hitFlash,
  gameMode
}) {
  return (
    <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between z-10 pointer-events-none">
      {/* Player 1 HUD */}
      <PlayerHUD
        name={p1Name}
        health={p1Health}
        delayedHealth={p1DelayedHealth}
        stamina={p1Stamina}
        cooldown={cooldownP1}
        isP1={true}
        isLowHealth={lowHealthWarning.p1}
        isHitFlash={hitFlash.p1}
        gameMode={gameMode}
      />

      {/* Center Timer */}
      <div className="flex flex-col items-center pt-2">
        <div className="relative">
          <div className="font-game text-4xl text-orange-500 glow-gold italic skew-x-[-10deg]">
            99
          </div>
        </div>
      </div>

      {/* Player 2 / CPU HUD */}
      <PlayerHUD
        name={p2Name}
        health={p2Health}
        delayedHealth={p2DelayedHealth}
        stamina={p2Stamina}
        cooldown={cooldownP2}
        isP1={false}
        isLowHealth={lowHealthWarning.p2}
        isHitFlash={hitFlash.p2}
        isCPU={gameMode === 'pve'}
        gameMode={gameMode}
      />
    </div>
  );
});

export default HUD;
