export interface Pokemon {
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export interface BattleRequest {
  pokemon1: string;
  pokemon2: string;
}

export interface BattleResult {
  winner: Pokemon | null;
  loser: Pokemon | null;
  battleSummary: string;
  stats: {
    pokemon1Score: number;
    pokemon2Score: number;
    typeEffectiveness: string;
  };
  pokemon1: Pokemon; // Add the actual Pokemon objects used in battle
  pokemon2: Pokemon;
}