import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { GameStateProvider } from '../../src/contexts/GameStateContext';
import { useGameState, useGameActions } from '../../src/contexts/GameStateContext';
import React from 'react';

const wrapper = ({ children }) => (
  React.createElement(GameStateProvider, null, children)
);

describe('GameStateContext', () => {
  it('should have initial state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper });

    expect(result.current.screen).toBe('menu');
    expect(result.current.gameMode).toBe('pve');
    expect(result.current.playerChar).toBeNull();
    expect(result.current.cpuChar).toBeNull();
  });

  it('should update screen on start game', () => {
    const { result } = renderHook(() => ({
      state: useGameState(),
      actions: useGameActions()
    }), { wrapper });

    result.current.actions.startGame('pve');

    expect(result.current.state.screen).toBe('selection');
    expect(result.current.state.gameMode).toBe('pve');
  });
});
