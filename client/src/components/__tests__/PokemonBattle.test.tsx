import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PokemonBattle from '../PokemonBattle';
import { render, mockPokemon, mockBattleResult } from '../../utils/test-utils';

vi.mock('../../services/api', () => ({
  pokemonApi: {
    isServerReady: vi.fn(),
    getAllPokemon: vi.fn(),
    battle: vi.fn(),
  },
}));

describe('PokemonBattle Component', () => {
  const user = userEvent.setup();
  let mockPokemonApi: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { pokemonApi } = await import('../../services/api');
    mockPokemonApi = pokemonApi;
    
    vi.mocked(pokemonApi.isServerReady).mockResolvedValue(true);
    vi.mocked(pokemonApi.getAllPokemon).mockResolvedValue(mockPokemon);
  });

  it('renders the component with title', async () => {
    render(<PokemonBattle />);
    
    expect(screen.getByText(/Pokémon Battle Simulator/)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Select First Pokémon')).toBeInTheDocument();
    });
  });

  it('loads pokemon data on mount', async () => {
    render(<PokemonBattle />);
    
    await waitFor(() => {
      expect(screen.getAllByDisplayValue('Choose Pokémon...')[0]).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Charmander (fire)')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Squirtle (water)')[0]).toBeInTheDocument();
    });
  });

  it('shows error when failing to load pokemon', async () => {
    const { pokemonApi } = await import('../../services/api');
    vi.mocked(pokemonApi.getAllPokemon).mockRejectedValue(new Error('Network error'));

    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('prevents selecting the same pokemon twice', async () => {
    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });

    const firstSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(firstSelect, 'Pikachu');

    const secondSelect = screen.getAllByRole('combobox')[1];
    const secondOptions = Array.from(secondSelect.querySelectorAll('option')).map(opt => opt.textContent);
    
    expect(secondOptions).not.toContain('Pikachu (electric)');
    expect(secondOptions).toContain('Charmander (fire)');
    expect(secondOptions).toContain('Squirtle (water)');
  });

  it('shows error when trying to battle without selecting both pokemon', async () => {
    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });

    const battleButton = screen.getByRole('button', { name: /start battle/i });
    expect(battleButton).toBeDisabled();
    
    const firstSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(firstSelect, 'Pikachu');
    
    expect(battleButton).toBeDisabled();
  });

  it('performs a battle successfully', async () => {
    mockPokemonApi.battle.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockBattleResult), 100))
    );

    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'Pikachu');
    await user.selectOptions(selects[1], 'Charmander');

    const battleButton = screen.getByRole('button', { name: /start battle/i });
    await user.click(battleButton);

    expect(screen.getByText('Battling...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('🏆 Battle Result')).toBeInTheDocument();
      expect(screen.getByText(/Pikachu Wins!/)).toBeInTheDocument();
    });
  });

  it('shows error when battle fails', async () => {
    vi.mocked(mockPokemonApi.battle).mockRejectedValue(new Error('Battle failed'));

    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'Pikachu');
    await user.selectOptions(selects[1], 'Charmander');

    const battleButton = screen.getByRole('button', { name: /start battle/i });
    await user.click(battleButton);

    await waitFor(() => {
      expect(screen.getByText('Battle failed')).toBeInTheDocument();
    });
  });

  it('resets the battle correctly', async () => {
    vi.mocked(mockPokemonApi.battle).mockResolvedValue(mockBattleResult);

    render(<PokemonBattle />);

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'Pikachu');
    await user.selectOptions(selects[1], 'Charmander');

    const battleButton = screen.getByRole('button', { name: /start battle/i });
    await user.click(battleButton);

    await waitFor(() => {
      expect(screen.getByText('🏆 Battle Result')).toBeInTheDocument();
    });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(selects[0]).toHaveValue('');
    expect(selects[1]).toHaveValue('');
    expect(screen.queryByText('🏆 Battle Result')).not.toBeInTheDocument();
  });

  it('disables battle button when loading or no pokemon selected', async () => {
    render(<PokemonBattle />);
    await waitFor(() => {
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();
    });

    const battleButton = screen.getByRole('button', { name: /start battle/i });
    
    expect(battleButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getAllByText('Pikachu (electric)')[0]).toBeInTheDocument();
    });
    expect(battleButton).toBeDisabled();

    const firstSelect = screen.getAllByRole('combobox')[0];
    await user.selectOptions(firstSelect, 'Pikachu');
    expect(battleButton).toBeDisabled();

    const secondSelect = screen.getAllByRole('combobox')[1];
    await user.selectOptions(secondSelect, 'Charmander');
    expect(battleButton).not.toBeDisabled();
  });
});
