import { describe, it, expect, beforeEach, vi } from 'vitest';
import { pokemonApi } from '../api';
import { mockPokemon, mockBattleResult } from '../../utils/test-utils';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const createMockResponse = (options: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<any>;
  text?: () => Promise<string>;
}): Response => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  statusText: options.statusText ?? 'OK',
  json: options.json ?? (async () => ({})),
  text: options.text ?? (async () => ''),
  headers: new Headers(),
  redirected: false,
  type: 'basic',
  url: '',
  clone: () => ({} as Response),
  body: null,
  bodyUsed: false,
} as Response);

describe('Pokemon API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isServerReady', () => {
    it('returns true when server is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const result = await pokemonApi.isServerReady();
      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/health', {
        signal: expect.any(AbortSignal),
      });
    });

    it('returns false when server is not healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await pokemonApi.isServerReady();
      expect(result).toBe(false);
    });

    it('returns false when fetch throws an error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await pokemonApi.isServerReady();
      expect(result).toBe(false);
    });
  });

  describe('getAllPokemon', () => {
    it('fetches pokemon successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockPokemon,
        }),
      });

      const result = await pokemonApi.getAllPokemon();
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/pokemon', {
        signal: expect.any(AbortSignal),
      });
    });

    it('throws error when response is not ok', async () => {
      const errorResponse = createMockResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      
      mockFetch.mockResolvedValue(errorResponse);

      await expect(pokemonApi.getAllPokemon()).rejects.toThrow('HTTP error! status: 500');
    });

    it('throws error when API returns success: false', async () => {
      const errorResponse = createMockResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          success: false,
          message: 'Server error',
        }),
      });
      
      mockFetch.mockResolvedValue(errorResponse);

      await expect(pokemonApi.getAllPokemon()).rejects.toThrow('Failed to fetch Pokemon');
    });

    it('retries on failure and eventually succeeds', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockPokemon,
        }),
      });

      const result = await pokemonApi.getAllPokemon();
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('throws error after max retries', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(pokemonApi.getAllPokemon()).rejects.toThrow('Network error');
      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial call + 2 retries
    });
  });

  describe('battle', () => {
    it('performs battle successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockBattleResult,
        }),
      });

      const result = await pokemonApi.battle('Pikachu', 'Charmander');
      expect(result).toEqual(mockBattleResult);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemon1: 'Pikachu', pokemon2: 'Charmander' }),
        signal: expect.any(AbortSignal),
      });
    });

    it('throws error when battle response is not ok', async () => {
      const errorResponse = createMockResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      
      mockFetch.mockResolvedValue(errorResponse);

      await expect(pokemonApi.battle('Pikachu', 'Charmander')).rejects.toThrow('Battle failed: Internal Server Error');
    });

    it('throws error when battle API returns success: false', async () => {
      const errorResponse = createMockResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          success: false,
          message: 'Battle simulation failed',
        }),
      });
      
      mockFetch.mockResolvedValue(errorResponse);

      await expect(pokemonApi.battle('Pikachu', 'Charmander')).rejects.toThrow('Battle simulation failed');
    });

    it('retries battle on failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockBattleResult,
        }),
      });

      const result = await pokemonApi.battle('Pikachu', 'Charmander');
      expect(result).toEqual(mockBattleResult);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
