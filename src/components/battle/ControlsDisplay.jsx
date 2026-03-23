import { memo, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

/**
 * ControlsDisplay Component - Hiển thị hướng dẫn điều khiển ở bottom
 */
const ControlsDisplay = memo(function ControlsDisplay({ gameMode }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="absolute bottom-4 md:bottom-6 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white/50 hover:text-white hover:bg-black/80 transition-all z-50 flex items-center justify-center"
        title="Hiện hướng dẫn (Show Controls)"
      >
        <Keyboard className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 px-6 md:px-10 py-2 md:py-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white font-comic text-[10px] md:text-sm group z-40 transition-all">
      
      {/* Close Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-400 transition-colors p-1"
        title="Ẩn hướng dẫn (Hide)"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Player 1 Controls */}
      <div className="text-center pr-2">
        <div className="text-green-400 font-bold mb-0.5 md:mb-1">PLAYER 1</div>
        <div className="space-x-1 md:space-x-2">
          <span>WASD</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span>{gameMode === 'pvp' ? 'V (Hit)' : 'J (Hit)'}</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span>{gameMode === 'pvp' ? 'B (Dash)' : 'K (Dash)'}</span>
          <span className="hidden md:inline text-white/30">|</span>
          <span>{gameMode === 'pvp' ? 'N (Skill)' : 'L (Skill)'}</span>
        </div>
      </div>

      {/* Player 2 Controls (PVP only) */}
      {gameMode === 'pvp' && (
        <div className="text-center border-l border-white/20 pl-4 md:pl-8 pr-4">
          <div className="text-orange-400 font-bold mb-0.5 md:mb-1">PLAYER 2</div>
          <div className="space-x-1 md:space-x-2">
            <span>ARROWS</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span>Num1/J</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span>Num2/K</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span>Num3/L</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ControlsDisplay;
