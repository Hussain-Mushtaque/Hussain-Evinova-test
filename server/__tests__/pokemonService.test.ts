import pokemonService from '../src/services/pokemonService';
import { Pokemon } from '../src/types/pokemon';

describe('PokemonService', () => {
  describe('getAllPokemon', () => {
    it('should return an array of pokemon', () => {
      const pokemon = pokemonService.getAllPokemon();

      expect(Array.isArray(pokemon)).toBe(true);
      expect(pokemon.length).toBeGreaterThan(0);

      const firstPokemon = pokemon[0];
      expect(firstPokemon).toHaveProperty('name');
      expect(firstPokemon).toHaveProperty('type');
      expect(firstPokemon).toHaveProperty('hp');
      expect(firstPokemon).toHaveProperty('attack');
      expect(firstPokemon).toHaveProperty('total');
    });
  });

  describe('getPokemonByName', () => {
    it('should return a pokemon when given a valid name', () => {
      const allPokemon = pokemonService.getAllPokemon();
      const firstPokemonName = allPokemon[0].name;

      const pokemon = pokemonService.getPokemonByName(firstPokemonName);

      expect(pokemon).toBeDefined();
      expect(pokemon?.name).toBe(firstPokemonName);
    });

    it('should return undefined when given an invalid name', () => {
      const pokemon = pokemonService.getPokemonByName('NonexistentPokemon');

      expect(pokemon).toBeUndefined();
    });

    it('should be case insensitive', () => {
      const allPokemon = pokemonService.getAllPokemon();
      const firstPokemonName = allPokemon[0].name;

      const pokemon1 = pokemonService.getPokemonByName(firstPokemonName.toLowerCase());
      const pokemon2 = pokemonService.getPokemonByName(firstPokemonName.toUpperCase());

      expect(pokemon1).toBeDefined();
      expect(pokemon2).toBeDefined();
      expect(pokemon1?.name).toBe(firstPokemonName);
      expect(pokemon2?.name).toBe(firstPokemonName);
    });
  });

  describe('battle', () => {
    let pokemon1: Pokemon;
    let pokemon2: Pokemon;

    beforeEach(() => {
      const allPokemon = pokemonService.getAllPokemon();
      pokemon1 = allPokemon[0];
      pokemon2 = allPokemon[1];
    });

    it('should throw error if first pokemon is not found', () => {
      expect(() => {
        pokemonService.battle('NonexistentPokemon', pokemon2.name);
      }).toThrow('Pokémon "NonexistentPokemon" not found');
    });

    it('should throw error if second pokemon is not found', () => {
      expect(() => {
        pokemonService.battle(pokemon1.name, 'NonexistentPokemon');
      }).toThrow('Pokémon "NonexistentPokemon" not found');
    });

    it('should return a valid battle result', () => {
      const result = pokemonService.battle(pokemon1.name, pokemon2.name);

      expect(result).toHaveProperty('winner');
      expect(result).toHaveProperty('loser');
      expect(result).toHaveProperty('battleSummary');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('pokemon1');
      expect(result).toHaveProperty('pokemon2');

      expect(result.stats).toHaveProperty('pokemon1Score');
      expect(result.stats).toHaveProperty('pokemon2Score');
      expect(result.stats).toHaveProperty('typeEffectiveness');

      expect(typeof result.stats.pokemon1Score).toBe('number');
      expect(typeof result.stats.pokemon2Score).toBe('number');
      expect(typeof result.battleSummary).toBe('string');
    });

    it('should determine winner based on scores', () => {
      const result = pokemonService.battle(pokemon1.name, pokemon2.name);

      if (result.stats.pokemon1Score > result.stats.pokemon2Score) {
        expect(result.winner?.name).toBe(pokemon1.name);
        expect(result.loser?.name).toBe(pokemon2.name);
      } else if (result.stats.pokemon2Score > result.stats.pokemon1Score) {
        expect(result.winner?.name).toBe(pokemon2.name);
        expect(result.loser?.name).toBe(pokemon1.name);
      } else {
        // It's a draw
        expect(result.winner).toBeNull();
        expect(result.loser).toBeNull();
      }
    });

    it('should include both pokemon in the result', () => {
      const result = pokemonService.battle(pokemon1.name, pokemon2.name);

      expect(result.pokemon1.name).toBe(pokemon1.name);
      expect(result.pokemon2.name).toBe(pokemon2.name);
    });
  });
});
