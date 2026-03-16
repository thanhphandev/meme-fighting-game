import { memo } from 'react';

/**
 * ControlsDisplay Component - Hiển thị hướng dẫn điều khiển ở bottom
 */
const ControlsDisplay = memo(function ControlsDisplay({ gameMode }) {
  return (
    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 px-4 md:px-8 py-2 md:py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-[10px] md:text-sm">
      {/* Player 1 Controls */}
      <div className="text-center">
        <div className="text-green-400 font-bold mb-0.5 md:mb-1">PLAYER 1</div>
        <div className="space-x-1 md:space-x-2">
          <span>WASD</span>
          <span className="hidden md:inline">|</span>
          <span>J (Hit)</span>
          <span className="hidden md:inline">|</span>
          <span>K (Dash)</span>
          <span className="hidden md:inline">|</span>
          <span>L (Skill)</span>
        </div>
      </div>

      {/* Player 2 Controls (PVP only) */}
      {gameMode === 'pvp' && (
        <div className="text-center border-l border-white/20 pl-4 md:pl-8">
          <div className="text-orange-400 font-bold mb-0.5 md:mb-1">PLAYER 2</div>
          <div className="space-x-1 md:space-x-2">
            <span>ARROWS</span>
            <span className="hidden md:inline">|</span>
            <span>Num 1 / .</span>
            <span className="hidden md:inline">|</span>
            <span>Num 2 / /</span>
            <span className="hidden md:inline">|</span>
            <span>Num 3 / ;</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ControlsDisplay;
