import { forwardRef, memo } from 'react';
import { CONFIG } from '../../engine/data/constants';

/**
 * GameCanvas Component - Canvas rendering cho game battle
 * Sử dụng forwardRef để parent có thể access canvas context
 */
const GameCanvas = memo(forwardRef(function GameCanvas({ koFreeze }, ref) {
  return (
    <canvas
      ref={ref}
      width={CONFIG.canvasWidth}
      height={CONFIG.canvasHeight}
      className={`block w-full h-full object-cover transition-all duration-1000 ${
        koFreeze ? 'grayscale brightness-50 contrast-150' : ''
      }`}
    />
  );
}));

export default GameCanvas;
