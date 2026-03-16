import { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * GameStateContext - Global state management cho game
 * Sử dụng useReducer pattern để tránh prop drilling và tối ưu re-renders
 */

// Initial state
const initialState = {
  screen: 'menu', // menu, selection, battle, gameover
  gameMode: 'pve', // pve, pvp
  playerChar: null,
  cpuChar: null,
  background: null,
  winner: null,
  difficulty: 'medium',
  selectionPhase: 'p1', // p1, p2
  endMessage: null,
};

// Action types
const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  START_GAME: 'START_GAME',
  SELECT_CHARACTER: 'SELECT_CHARACTER',
  SET_BATTLE_READY: 'SET_BATTLE_READY',
  GAME_OVER: 'GAME_OVER',
  RESET_GAME: 'RESET_GAME',
  REMATCH: 'REMATCH',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
};

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, screen: action.payload };

    case ACTIONS.START_GAME:
      return {
        ...state,
        screen: 'selection',
        gameMode: action.payload,
        selectionPhase: 'p1',
        winner: null,
        endMessage: null,
      };

    case ACTIONS.SELECT_CHARACTER:
      const { charId, isP1, nextScreen, randomCpu, randomBg } = action.payload;

      if (isP1) {
        // P1 selected
        if (state.gameMode === 'pve') {
          // PVE: auto select CPU and start battle
          return {
            ...state,
            playerChar: charId,
            cpuChar: randomCpu,
            background: randomBg,
            screen: 'battle',
          };
        } else {
          // PVP: wait for P2
          return {
            ...state,
            playerChar: charId,
            selectionPhase: 'p2',
          };
        }
      } else {
        // P2 selected (PVP only)
        return {
          ...state,
          cpuChar: charId,
          background: randomBg,
          screen: 'battle',
        };
      }

    case ACTIONS.GAME_OVER:
      return {
        ...state,
        screen: 'gameover',
        winner: action.payload.winner,
        endMessage: action.payload.endMessage,
      };

    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
        difficulty: state.difficulty, // Keep difficulty setting
      };

    case ACTIONS.REMATCH:
      return {
        ...state,
        screen: 'battle',
        winner: null,
        endMessage: null,
      };

    case ACTIONS.SET_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
      };

    default:
      return state;
  }
}

// Context
const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);

// Provider
export function GameStateProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

// Hooks
export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (!context) {
    throw new Error('useGameDispatch must be used within GameStateProvider');
  }
  return context;
}

// Action creators
export function useGameActions() {
  const dispatch = useGameDispatch();

  const setScreen = useCallback((screen) => {
    dispatch({ type: ACTIONS.SET_SCREEN, payload: screen });
  }, [dispatch]);

  const startGame = useCallback((gameMode) => {
    dispatch({ type: ACTIONS.START_GAME, payload: gameMode });
  }, [dispatch]);

  const selectCharacter = useCallback((payload) => {
    dispatch({ type: ACTIONS.SELECT_CHARACTER, payload });
  }, [dispatch]);

  const gameOver = useCallback((winner, endMessage) => {
    dispatch({ type: ACTIONS.GAME_OVER, payload: { winner, endMessage } });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_GAME });
  }, [dispatch]);

  const rematch = useCallback(() => {
    dispatch({ type: ACTIONS.REMATCH });
  }, [dispatch]);

  const setDifficulty = useCallback((difficulty) => {
    dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: difficulty });
  }, [dispatch]);

  return {
    setScreen,
    startGame,
    selectCharacter,
    gameOver,
    resetGame,
    rematch,
    setDifficulty,
  };
}

// Selector hook for specific state slices
export function useGameSelector(selector) {
  const state = useGameState();
  return selector(state);
}

// Export constants
export { ACTIONS };
