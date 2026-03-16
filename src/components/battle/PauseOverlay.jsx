import { memo } from 'react';
import PauseMenu from '../PauseMenu';

/**
 * PauseOverlay Component - Overlay hiển thị khi game pause
 */
const PauseOverlay = memo(function PauseOverlay({ onResume, onRestart, onQuit }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <PauseMenu
        onResume={onResume}
        onRestart={onRestart}
        onQuit={onQuit}
      />
    </div>
  );
});

export default PauseOverlay;
