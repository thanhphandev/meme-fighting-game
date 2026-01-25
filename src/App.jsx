import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import SelectionScreen from './components/SelectionScreen'
import BattleScreen from './components/BattleScreen'
import { BACKGROUNDS, CHARACTERS } from './game/constants'
import './index.css'

function App() {
  const [screen, setScreen] = useState('menu') // 'menu', 'selection', 'battle', 'gameover'
  const [playerChar, setPlayerChar] = useState(null)
  const [cpuChar, setCpuChar] = useState(null)
  const [background, setBackground] = useState(null)
  const [winner, setWinner] = useState(null)

  const startGame = () => {
    setScreen('selection')
  }

  const selectCharacter = (char) => {
    setPlayerChar(char)
    // Random CPU char and Random BG
    const otherChars = CHARACTERS.map(c => c.id).filter(id => id !== char)
    const randomCpu = otherChars[Math.floor(Math.random() * otherChars.length)]
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]

    setCpuChar(randomCpu)
    setBackground(randomBg)
    setScreen('battle')
  }

  const onGameOver = (winStatus) => {
    setWinner(winStatus) // 'p1' or 'cpu'
    setScreen('gameover')
  }

  const resetGame = () => {
    setScreen('menu')
    setPlayerChar(null)
    setCpuChar(null)
    setWinner(null)
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
            <Menu onStart={startGame} />
          </motion.div>
        )}

        {screen === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <SelectionScreen onSelect={selectCharacter} />
          </motion.div>
        )}

        {screen === 'battle' && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BattleScreen
              playerChar={playerChar}
              cpuChar={cpuChar}
              background={background}
              onGameOver={onGameOver}
            />
          </motion.div>
        )}

        {screen === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center text-center p-10 bg-black/90 border-4 border-orange-500 rounded-3xl shadow-[0_0_50px_rgba(255,165,0,0.5)] z-50"
          >
            <h1 className="font-bangers text-8xl text-white mb-6 animate-pulse">
              {winner === 'p1' ? 'EZ CLAP!' : 'SKILL ISSUE!'}
            </h1>
            <p className="text-2xl text-orange-400 mb-8 font-comic">
              {winner === 'p1' ? 'FEELS GOOD MAN' : 'COPE & SEETHE'}
            </p>
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bangers text-3xl rounded-full transition-transform hover:scale-110 active:scale-95 shadow-lg"
            >
              GO AGAIN BRUH
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
