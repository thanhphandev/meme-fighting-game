import { memo } from 'react';
import { CHARACTERS } from '../../engine/data/constants';

/**
 * VSIntro Component - Màn hình intro VS giữa 2 nhân vật
 * Đã được memoize để tránh re-render không cần thiết
 */
const VSIntro = memo(function VSIntro({ playerChar, cpuChar, p1Name, p2Name }) {
  const p1Data = CHARACTERS.find(c => c.id === playerChar);
  const p2Data = CHARACTERS.find(c => c.id === cpuChar);

  const getSpriteStyle = (charData) => ({
    backgroundImage: `url(/assets/${charData?.asset})`,
    backgroundSize: `600% ${(charData?.rowCount || 8) * 100}%`,
    backgroundPosition: `0% ${charData?.rows?.idle * (100 / ((charData?.rowCount || 8) - 1))}%`,
  });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative w-full h-full flex items-center justify-between px-20">
        {/* Player 1 */}
        <div className="flex flex-col items-center animate-[cinematic-intro_0.6s_ease-out_forwards]">
          <div className="w-64 h-64 rounded-2xl border-4 border-cyan-400 bg-cyan-900/20 overflow-hidden box-glow-cyan">
            <div
              style={getSpriteStyle(p1Data)}
              className="w-full h-full scale-150 translate-y-4"
            />
          </div>
          <h2 className="text-game text-4xl mt-6 text-cyan-400 glow-cyan">{p1Name}</h2>
        </div>

        {/* VS Text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <h1 className="text-game text-9xl text-orange-500 animate-pulse italic skew-x-12 drop-shadow-[0_0_30px_rgba(255,165,0,0.8)]">
            VS
          </h1>
        </div>

        {/* Player 2 / CPU */}
        <div className="flex flex-col items-center animate-[cinematic-intro_0.6s_ease-out_0.2s_forwards] opacity-0">
          <div className="w-64 h-64 rounded-2xl border-4 border-pink-500 bg-pink-900/20 overflow-hidden box-glow-pink">
            <div
              style={getSpriteStyle(p2Data)}
              className="w-full h-full scale-150 translate-y-4 flip-horizontal"
            />
          </div>
          <h2 className="text-game text-4xl mt-6 text-pink-500 glow-pink">{p2Name}</h2>
        </div>
      </div>
    </div>
  );
});

export default VSIntro;
