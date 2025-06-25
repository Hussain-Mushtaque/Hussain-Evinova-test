import type { Pokemon, BattleResult } from '../types/pokemon';

const API_BASE_URL = 'http://localhost:3000/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`API call failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
      await delay(delayMs);
      delayMs *= 2;
    }
  }
  throw new Error('Max retries exceeded');
};

const healthCheck = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

export const pokemonApi = {
  isServerReady: healthCheck,

  getAllPokemon: async (): Promise<Pokemon[]> => {
    return retryApiCall(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/pokemon`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Failed to fetch Pokemon');
      }
      return data.data;
    });
  },
battle: async (pokemon1: string, pokemon2: string): Promise<BattleResult> => {
  return retryApiCall(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for battles

    const response = await fetch(`${API_BASE_URL}/battle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pokemon1, pokemon2 }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Battle failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Battle simulation error');
    }
    return data.data;
  });
}
};