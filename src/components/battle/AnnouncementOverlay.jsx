import { memo } from 'react';

/**
 * AnnouncementOverlay Component - Hiển thị thông báo FIGHT, KO, etc.
 */
const AnnouncementOverlay = memo(function AnnouncementOverlay({ announcement }) {
  if (!announcement) return null;

  const getAnnouncementClass = () => {
    switch (announcement.type) {
      case 'fight':
        return 'text-6xl md:text-8xl text-yellow-400';
      case 'ko':
        return 'text-7xl md:text-9xl text-red-500';
      default:
        return 'text-4xl md:text-6xl text-white';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      <div
        className={`font-bangers drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-pulse ${getAnnouncementClass()}`}
        style={{
          textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000'
        }}
      >
        {announcement.text}
      </div>
    </div>
  );
});

export default AnnouncementOverlay;
