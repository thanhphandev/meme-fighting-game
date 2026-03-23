import { Monitor, Smartphone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MobileWarning() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Check if screen is small or touch device
      const isMobileDevice = window.innerWidth < 1024 || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0)
        
      if (isMobileDevice) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 text-center"
        >
          <div className="relative flex flex-col items-center max-w-sm glass-card p-8 rounded-2xl border border-pink-500/30 w-full overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/80 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative mb-6 text-pink-500 z-10 mt-2">
              <Smartphone className="w-16 h-16 relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full"
              />
            </div>
            
            <h2 className="text-game text-2xl mb-4 text-gradient-pink z-10">THIẾT BỊ KHÔNG PHÙ HỢP</h2>
            <p className="text-display text-white/70 mb-8 leading-relaxed z-10 text-sm">
              Meme Battle Arena là game đối kháng yêu cầu màn hình rộng, bàn phím cứng và thao tác nhanh nhạy. <br/><br/>
              Khuyến nghị trải nghiệm trên <strong>Máy tính / Laptop</strong> để có trải nghiệm chiến đấu tốt nhất!
            </p>

            <div className="flex flex-col gap-3 w-full z-10">
              <div className="flex items-center justify-center gap-3 text-cyan-400 bg-cyan-500/10 px-6 py-3 rounded-xl border border-cyan-500/20">
                <Monitor className="w-5 h-5" />
                <span className="font-bold tracking-wider text-sm">HÃY CHƠI TRÊN PC</span>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-white/40 hover:text-white/80 text-xs mt-2 underline transition-colors"
              >
                Tôi biết, vẫn muốn xem thử
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
