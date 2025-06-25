import { Pokemon } from '../types/pokemon';
import * as fs from 'fs';
import * as path from 'path';

class PokemonService {
  private pokemonData: Pokemon[] = [];

  constructor() {
    this.loadPokemonData();
  }

  private loadPokemonData(): void {
    try {
      const dataPath = path.join(__dirname, '../data/pokemon.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      this.pokemonData = JSON.parse(rawData);
      console.log(`Loaded ${this.pokemonData.length} Pokémon`);
    } catch (error) {
      console.error('Failed to load Pokémon data:', error);
      this.pokemonData = [];
    }
  }

  getAllPokemon(): Pokemon[] {
    return this.pokemonData;
  }

  getPokemonByName(name: string): Pokemon | undefined {
    return this.pokemonData.find((p) => p.name.toLowerCase() === name.toLowerCase());
  }

  private getTypeEffectiveness(attackerType: string[], defenderType: string[]): number {
    const effectiveness: Record<string, Record<string, number>> = {
      fire: { grass: 2, water: 0.5, ice: 2, bug: 2, steel: 2 },
      water: { fire: 2, grass: 0.5, electric: 0.5, ground: 2, rock: 2 },
      grass: { water: 2, fire: 0.5, flying: 0.5, ground: 2, rock: 2 },
      electric: { water: 2, flying: 2, ground: 0 },
      ice: { grass: 2, flying: 2, fire: 0.5, dragon: 2, ground: 2 },
      flying: { grass: 2, electric: 0.5, ice: 0.5, fighting: 2, bug: 2 },
      fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2 },
      poison: { grass: 2, fairy: 2 },
      ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2 },
      rock: { fire: 2, ice: 2, flying: 2, bug: 2 },
      bug: { grass: 2, psychic: 2, dark: 2 },
      ghost: { psychic: 2, ghost: 2 },
      steel: { ice: 2, rock: 2, fairy: 2 },
      dragon: { dragon: 2 },
      dark: { psychic: 2, ghost: 2 },
      fairy: { fighting: 2, dragon: 2, dark: 2 },
    };

    let multiplier = 1;

    for (const atk of attackerType) {
      for (const def of defenderType) {
        const row = effectiveness[atk.toLowerCase()];
        if (row && row[def.toLowerCase()]) {
          multiplier *= row[def.toLowerCase()];
        }
      }
    }
    return multiplier;
  }

  private safeToNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  battle(pokemon1Name: string, pokemon2Name: string) {
    const pokemon1 = this.getPokemonByName(pokemon1Name);
    const pokemon2 = this.getPokemonByName(pokemon2Name);

    if (!pokemon1) throw new Error(`Pokémon "${pokemon1Name}" not found`);
    if (!pokemon2) throw new Error(`Pokémon "${pokemon2Name}" not found`);

    // Debug logging to see what we're working with
    console.log('Pokemon 1:', pokemon1);
    console.log('Pokemon 2:', pokemon2);

    const getBaseTotal = (pokemon: Pokemon): number => {
      const hp = this.safeToNumber(pokemon.hp);
      const attack = this.safeToNumber(pokemon.attack);
      const defense = this.safeToNumber(pokemon.defense);

      console.log(`${pokemon.name} stats - HP: ${hp}, Attack: ${attack}, Defense: ${defense}`);
      return hp + attack + defense;
    };

    const p1Base = getBaseTotal(pokemon1);
    const p2Base = getBaseTotal(pokemon2);

    const p1Mult = this.getTypeEffectiveness(pokemon1.type, pokemon2.type);
    const p2Mult = this.getTypeEffectiveness(pokemon2.type, pokemon1.type);

    const p1Score = p1Base * p1Mult;
    const p2Score = p2Base * p2Mult;

    console.log(`Battle scores - ${pokemon1.name}: ${p1Score}, ${pokemon2.name}: ${p2Score}`);

    let winner: Pokemon | null = null;
    let loser: Pokemon | null = null;

    if (p1Score > p2Score) {
      winner = pokemon1;
      loser = pokemon2;
    } else if (p2Score > p1Score) {
      winner = pokemon2;
      loser = pokemon1;
    }

    const typeLine =
      p1Mult > p2Mult
        ? `${pokemon1.name} has type advantage!`
        : p2Mult > p1Mult
        ? `${pokemon2.name} has type advantage!`
        : 'No type advantage';

    const battleSummary = winner
      ? `${winner.name} wins! Base stats: ${pokemon1.name} (${p1Base}) vs ` +
        `${pokemon2.name} (${p2Base}). ${typeLine}`
      : `Draw! Both Pokémon scored ${Math.round(p1Score)}.`;

    return {
      winner,
      loser,
      battleSummary,
      stats: {
        pokemon1Score: Math.round(p1Score),
        pokemon2Score: Math.round(p2Score),
        typeEffectiveness: typeLine,
      },
      pokemon1,
      pokemon2,
    };
  }
}

export default new PokemonService();
