import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import SelectionScreen from './components/SelectionScreen'
import BattleScreen from './components/BattleScreen'
import { BACKGROUNDS, CHARACTERS } from './game/constants'
import { SoundManager } from './game/SoundManager'
import './index.css'

// Vietnamese GenZ victory/defeat messages
const VICTORY_MESSAGES = [
  { title: 'EZ CLAP! 👏', subtitle: 'Quá dễ, như chơi game mobile vậy 😎' },
  { title: 'GG EZ! 🏆', subtitle: 'Skill issue detected ở đối thủ 💀' },
  { title: 'GIGACHAD! 💪', subtitle: 'Sẵn sàng húp phát nữa chưa?' },
  { title: 'FEELS GOOD! 🐸', subtitle: 'Thắng ngọt như chocolate 🍫' },
  { title: 'ABSOLUTE WIN! 🔥', subtitle: 'Đối thủ đã bị bonk!' },
  { title: 'BASED! ⚡', subtitle: 'Chiến thần đã thức tỉnh!' },
]

const DEFEAT_MESSAGES = [
  { title: 'SKILL ISSUE! 💀', subtitle: 'Tập luyện thêm rồi quay lại nhé~' },
  { title: 'COPE & SEETHE! 😭', subtitle: 'Đừng buồn, ai cũng có ngày xui mà!' },
  { title: 'BONKED! 🔨', subtitle: 'Bị húp mất rồi huhu...' },
  { title: 'SADGE... 😢', subtitle: 'Thử lại đi, bạn làm được mà!' },
  { title: 'NOT STONKS 📉', subtitle: 'F in chat cho bạn...' },
  { title: 'OOF! 💔', subtitle: 'Lần sau sẽ khác thôi!' },
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

    // Pick random message
    const messages = winStatus === 'p1' ? VICTORY_MESSAGES : DEFEAT_MESSAGES
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setEndMessage(randomMessage)

    // Play victory/defeat sound
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

  // Get character data for display
  const getCharacterName = (charId) => {
    return CHARACTERS.find(c => c.id === charId)?.name || 'Unknown'
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <SelectionScreen
              onSelect={selectCharacter}
              title={selectionPhase === 'p1' ? "🎮 PLAYER 1: CHỌN ĐI NÀO!" : "🎮 PLAYER 2: TỚI LƯỢT BẠN!"}
            />
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
            <BattleScreen
              playerChar={playerChar}
              cpuChar={cpuChar}
              background={background}
              onGameOver={onGameOver}
              cpuDifficulty={difficulty}
              gameMode={gameMode}
              onQuit={resetGame}
            />
          </motion.div>
        )}

        {screen === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex flex-col items-center text-center p-8 md:p-12 bg-gradient-to-br from-neutral-900 to-neutral-950 border-4 border-orange-500 rounded-3xl shadow-[0_0_60px_rgba(255,165,0,0.6)] z-50 mx-4"
          >
            {/* Winner indicator */}
            <motion.div
              className={`text-6xl mb-4 ${winner === 'p1' ? 'animate-bounce' : 'animate-pulse'}`}
            >
              {winner === 'p1' ? '🏆' : '💀'}
            </motion.div>

            {/* Main title */}
            <motion.h1
              className={`font-bangers text-5xl md:text-8xl mb-4 ${winner === 'p1'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
                  : 'text-red-500'
                }`}
              animate={winner === 'p1' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {endMessage?.title || (winner === 'p1' ? 'VICTORY!' : 'DEFEAT...')}
            </motion.h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-orange-300 mb-6 font-comic max-w-md">
              {endMessage?.subtitle}
            </p>

            {/* Winner/Loser characters */}
            <div className="flex gap-4 mb-6 text-white/70 font-comic text-sm">
              <span className={winner === 'p1' ? 'text-green-400' : 'text-red-400'}>
                {winner === 'p1' ? '👑' : '💔'} {getCharacterName(playerChar)}
              </span>
              <span>VS</span>
              <span className={winner !== 'p1' ? 'text-green-400' : 'text-red-400'}>
                {winner !== 'p1' ? '👑' : '💔'} {getCharacterName(cpuChar)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <motion.button
                onClick={handleRematch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bangers text-2xl md:text-3xl rounded-full transition-all shadow-lg hover:shadow-orange-500/50"
              >
                🔄 REMATCH
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
                className="px-8 md:px-10 py-3 md:py-4 bg-neutral-700 hover:bg-neutral-600 text-white font-bangers text-2xl md:text-3xl rounded-full transition-all shadow-lg border-2 border-neutral-500"
              >
                🎭 ĐỔI NHÂN VẬT
              </motion.button>

              <motion.button
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-10 py-3 md:py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bangers text-2xl md:text-3xl rounded-full transition-all shadow-lg border-2 border-neutral-600"
              >
                🏠 MENU
              </motion.button>
            </div>

            {/* Pro tip */}
            <motion.p
              className="mt-6 text-white/40 font-comic text-xs md:text-sm max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              💡 Pro tip: Học combo skill + attack để tăng damage!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
