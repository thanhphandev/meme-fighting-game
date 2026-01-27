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
  const [difficulty, setDifficulty] = useState('medium') // New State

  const [gameMode, setGameMode] = useState('pve') // 'pve', 'pvp'
  const [selectionPhase, setSelectionPhase] = useState('p1') // 'p1', 'p2'

  const startGame = (mode) => {
    setGameMode(mode)
    setSelectionPhase('p1')
    setScreen('selection')
  }

  const selectCharacter = (char) => {
    if (selectionPhase === 'p1') {
      setPlayerChar(char)
      if (gameMode === 'pve') {
        // Random CPU char and Random BG
        const otherChars = CHARACTERS.map(c => c.id).filter(id => id !== char)
        const randomCpu = otherChars[Math.floor(Math.random() * otherChars.length)]
        const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
        setCpuChar(randomCpu)
        setBackground(randomBg)
        setScreen('battle')
      } else {
        // PvP - P2 Select
        setSelectionPhase('p2')
        // Don't change screen, just stay on selection for P2
      }
    } else {
      // P2 Select
      setCpuChar(char) // Reuse cpuChar state for P2
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
      setBackground(randomBg)
      setScreen('battle')
    }
  }

  const onGameOver = (winStatus) => {
    setWinner(winStatus) // 'p1' or 'cpu' (cpu is p2)
    setScreen('gameover')
  }

  const resetGame = () => {
    setScreen('menu')
    setPlayerChar(null)
    setCpuChar(null)
    setWinner(null)
    setSelectionPhase('p1')
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
              title={selectionPhase === 'p1' ? "PLAYER 1: CHOOSE!" : "PLAYER 2: CHOOSE!"}
            />
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
              cpuDifficulty={difficulty}
              gameMode={gameMode}
              onQuit={resetGame}
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
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Quick restart same chars
                  setScreen('battle') // This might need a reset effect if not unmounted
                  // Actually, since we unmount BattleScreen, re-mounting it should restart it.
                  // But we need to ensure state is clear.
                  // The easiest way is to re-set screen.
                  setWinner(null)
                  // If we just set screen to battle, it re-renders.
                }}
                className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bangers text-3xl rounded-full transition-transform hover:scale-110 active:scale-95 shadow-lg"
              >
                REMATCH
              </button>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-neutral-700 hover:bg-neutral-600 text-white font-bangers text-3xl rounded-full transition-transform hover:scale-110 active:scale-95 shadow-lg border-2 border-neutral-500"
              >
                MENU
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
