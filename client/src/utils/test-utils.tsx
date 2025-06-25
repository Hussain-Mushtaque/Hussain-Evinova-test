import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { vi } from 'vitest';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
   ...options,
  });
};

export const mockPokemon = [
  {
    name: 'Pikachu',
    type: ['electric'],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90
    }
  },
  {
    name: 'Charmander',
    type: ['fire'],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65
    }
  },
  {
    name: 'Squirtle',
    type: ['water'],
    baseStats: {
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43
    }
  }
];

export const mockBattleResult = {
  winner: {
    name: 'Pikachu',
    type: ['electric'],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90
    }
  },
  loser: {
    name: 'Charmander',
    type: ['fire'],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65
    }
  },
  battleSummary: 'Pikachu wins! Base stats: Pikachu (270) vs Charmander (309). Type advantage!',
  stats: {
    pokemon1Score: 270,
    pokemon2Score: 309,
    typeEffectiveness: 'Type advantage!'
  },
  pokemon1: {
    name: 'Pikachu',
    type: ['electric'],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90
    }
  },
  pokemon2: {
    name: 'Charmander',
    type: ['fire'],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65
    }
  }
};

export const createMockResponse = (data: any, success = true) => ({
  ok: true,
  json: async () => ({
    success,
    data,
    message: success ? 'Success' : 'Error'
  })
});

export const mockApiSuccess = (data: any) => {
  global.fetch = vi.fn().mockResolvedValue(createMockResponse(data));
};

export const mockApiError = (error: string) => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
};

export const mockApiNetworkError = () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
};
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
