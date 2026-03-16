import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import { BACKGROUNDS, CHARACTERS } from './engine/data/constants'
import { SoundManager } from './engine/systems/SoundManager'
import { Trophy, Skull, RotateCcw, Users, Home, Zap } from 'lucide-react'
import './index.css'

// Lazy load heavy components for code splitting
const SelectionScreen = lazy(() => import('./components/SelectionScreen'))
const BattleScreen = lazy(() => import('./components/BattleScreen'))

// Vietnamese GenZ victory/defeat messages
const VICTORY_MESSAGES = [
  { title: 'EZ CLAP!', subtitle: 'Quá dễ, như chơi game mobile vậy 😎', emoji: '👏' },
  { title: 'GG EZ!', subtitle: 'Skill issue detected ở đối thủ', emoji: '🏆' },
  { title: 'GIGACHAD!', subtitle: 'Sẵn sàng húp phát nữa chưa?', emoji: '💪' },
  { title: 'BASED!', subtitle: 'Chiến thần đã thức tỉnh!', emoji: '⚡' },
  { title: 'FLAWLESS!', subtitle: 'Đối thủ đã bị bonk!', emoji: '🔥' },
]

const DEFEAT_MESSAGES = [
  { title: 'SKILL ISSUE!', subtitle: 'Tập luyện thêm rồi quay lại nhé~', emoji: '💀' },
  { title: 'BONKED!', subtitle: 'Bị húp mất rồi huhu...', emoji: '🔨' },
  { title: 'SADGE...', subtitle: 'Thử lại đi, bạn làm được mà!', emoji: '😢' },
  { title: 'NOT STONKS', subtitle: 'F in chat cho bạn...', emoji: '📉' },
  { title: 'REKT!', subtitle: 'Lần sau sẽ khác thôi!', emoji: '💔' },
]

function App() {
  const [screen, setScreen] = useState('menu')
  const [playerChar, setPlayerChar] = useState(null)
  const [cpuChar, setCpuChar] = useState(null)
  const [background, setBackground] = useState(null)
  const [winner, setWinner] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [gameMode, setGameMode] = useState('pve')
  const [selectionPhase, setSelectionPhase] = useState('p1')
  const [endMessage, setEndMessage] = useState(null)

  const startGame = (mode) => {
    SoundManager.playSfx('sfx_confirm')
    setGameMode(mode)
    setSelectionPhase('p1')
    setScreen('selection')
  }

  const selectCharacter = (char) => {
    SoundManager.playSfx('sfx_select')

    if (selectionPhase === 'p1') {
      setPlayerChar(char)
      if (gameMode === 'pve') {
        const otherChars = CHARACTERS.map(c => c.id).filter(id => id !== char)
        const randomCpu = otherChars[Math.floor(Math.random() * otherChars.length)]
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
        setCpuChar(randomCpu)
        setBackground(randomBg)
        setScreen('battle')
      } else {
        setSelectionPhase('p2')
      }
    } else {
      setCpuChar(char)
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
      setBackground(randomBg)
      setScreen('battle')
    }
  }

  const onGameOver = (winStatus) => {
    setWinner(winStatus)
    const messages = winStatus === 'p1' ? VICTORY_MESSAGES : DEFEAT_MESSAGES
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setEndMessage(randomMessage)
    SoundManager.playBgm('bgm_victory', false)
    setScreen('gameover')
  }

  const handleRematch = () => {
    SoundManager.playSfx('sfx_confirm')
    setWinner(null)
    setEndMessage(null)
    setScreen('battle')
  }

  const resetGame = () => {
    SoundManager.playSfx('sfx_cancel')
    setScreen('menu')
    setPlayerChar(null)
    setCpuChar(null)
    setWinner(null)
    setEndMessage(null)
    setSelectionPhase('p1')
  }

  const getCharacterName = (charId) => {
    return CHARACTERS.find(c => c.id === charId)?.name || 'Unknown'
  }

  return (
    <div className="w-screen h-screen bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Menu
              onStart={startGame}
              difficulty={difficulty}
              onSelectDifficulty={setDifficulty}
            />
          </motion.div>
        )}

        {screen === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-game">Loading...</p>
              </div>
            }>
              <SelectionScreen
                onSelect={selectCharacter}
                title={selectionPhase === 'p1' ? "PLAYER 1 — CHỌN ĐI!" : "PLAYER 2 — TỚI LƯỢT!"}
              />
            </Suspense>
          </motion.div>
        )}

        {screen === 'battle' && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-game text-xl text-orange-400">Loading Battle...</p>
              </div>
            }>
              <BattleScreen
                playerChar={playerChar}
                cpuChar={cpuChar}
                background={background}
                onGameOver={onGameOver}
                cpuDifficulty={difficulty}
                gameMode={gameMode}
                onQuit={resetGame}
              />
            </Suspense>
          </motion.div>
        )}

        {screen === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Background with blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/90 to-black/90 backdrop-blur-sm" />
            <div className="bg-pattern opacity-50" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg"
            >
              {/* Icon */}
              <motion.div
                animate={winner === 'p1' ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {
                  y: [0, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl md:text-8xl mb-6"
              >
                {endMessage?.emoji || (winner === 'p1' ? '🏆' : '💀')}
              </motion.div>

              {/* Title */}
              <motion.h1
                className={`text-game text-4xl md:text-6xl tracking-wider mb-4 ${winner === 'p1' ? 'text-gradient-cyan glow-cyan' : 'text-gradient-pink glow-pink'
                  }`}
              >
                {endMessage?.title || (winner === 'p1' ? 'VICTORY!' : 'DEFEAT...')}
              </motion.h1>

              {/* Subtitle */}
              <p className="text-display text-lg md:text-xl text-white/70 mb-6">
                {endMessage?.subtitle}
              </p>

              {/* Character Results */}
              <div className="flex items-center gap-4 mb-8 text-display text-sm">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${winner === 'p1' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                  {winner === 'p1' ? <Trophy className="w-4 h-4 text-cyan-400" /> : <Skull className="w-4 h-4 text-red-400" />}
                  <span className={winner === 'p1' ? 'text-cyan-400' : 'text-red-400'}>
                    {getCharacterName(playerChar)}
                  </span>
                </div>
                <span className="text-white/30">VS</span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${winner !== 'p1' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                  {winner !== 'p1' ? <Trophy className="w-4 h-4 text-cyan-400" /> : <Skull className="w-4 h-4 text-red-400" />}
                  <span className={winner !== 'p1' ? 'text-cyan-400' : 'text-red-400'}>
                    {getCharacterName(cpuChar)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 w-full max-w-md">
                <motion.button
                  onClick={handleRematch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-game text-lg text-black font-bold hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/30"
                >
                  <RotateCcw className="w-5 h-5" />
                  REMATCH
                </motion.button>

                <motion.button
                  onClick={() => {
                    SoundManager.playSfx('sfx_select')
                    setWinner(null)
                    setEndMessage(null)
                    setSelectionPhase('p1')
                    setScreen('selection')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-card border border-white/20 text-game text-lg text-white hover:border-white/40 transition-all"
                >
                  <Users className="w-5 h-5" />
                  ĐỔI CHAR
                </motion.button>

                <motion.button
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass-card border border-white/10 text-game text-lg text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <Home className="w-5 h-5" />
                  MENU
                </motion.button>
              </div>

              {/* Pro tip */}
              <motion.p
                className="mt-6 text-display text-xs text-white/30 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Zap className="w-3 h-3" />
                Pro tip: Combo skill + attack để tăng damage!
                <Zap className="w-3 h-3" />
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
