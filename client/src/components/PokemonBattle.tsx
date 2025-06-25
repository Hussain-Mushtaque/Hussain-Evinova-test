import React, { useState, useEffect } from "react";
import type { Pokemon, BattleResult } from "../types/pokemon";
import { pokemonApi } from "../services/api";

const PokemonBattle: React.FC = () => {
 const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState<string>("");
  const [selectedPokemon2, setSelectedPokemon2] = useState<string>("");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [serverStatus, setServerStatus] = useState<"checking" | "ready" | "error">("checking");

  useEffect(() => {
    const initialise = async () => {
      setServerStatus("checking");
      setError("");
      try {
        const isReady = await pokemonApi.isServerReady();
        if (!isReady) throw new Error("Server is not ready yet");
        setServerStatus("ready");
        const data = await pokemonApi.getAllPokemon();
        setPokemon(data);
      } catch (err) {
        setServerStatus("error");
        const msg = err instanceof Error ? err.message : "Failed to connect to server";
        setError(`${msg}. Please make sure the server is running and try refreshing.`);
      }
    };
    initialise();
  }, []);

   const retryConnection = async () => {
    setServerStatus("checking");
    setError("");
    try {
      const isReady = await pokemonApi.isServerReady();
      if (!isReady) throw new Error("Server is still not ready");
      setServerStatus("ready");
      const data = await pokemonApi.getAllPokemon();
      setPokemon(data);
    } catch (err) {
      setServerStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to connect to server";
      setError(`${msg}. Please make sure the server is running.`);
    }
  };

  const handlePokemon1Change = (pokemonName: string) => {
    setSelectedPokemon1(pokemonName);
    if (pokemonName === selectedPokemon2) {
      setSelectedPokemon2("");
    }
  };

  const handlePokemon2Change = (pokemonName: string) => {
    setSelectedPokemon2(pokemonName);
    if (pokemonName === selectedPokemon1) {
      setSelectedPokemon1("");
    }
  };

  const handleBattle = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      setError("Please select both Pokémon");
      return;
    }
    if (selectedPokemon1 === selectedPokemon2) {
      setError("Please select two different Pokémon for battle!");
      return;
    }

    setLoading(true);
    setError("");
    setBattleResult(null);

    try {
      const result = await pokemonApi.battle(selectedPokemon1, selectedPokemon2);
      setBattleResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Battle failed");
    } finally {
      setLoading(false);
    }
  };

  const resetBattle = () => {
    setSelectedPokemon1("");
    setSelectedPokemon2("");
    setBattleResult(null);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          ⚔️ Pokémon Battle Simulator
        </h1>

       {serverStatus === "checking" && (
          <div className="flex items-center bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Connecting to server...
          </div>
        )}

       {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex justify-between items-center">
            <span>{error}</span>
            {serverStatus === "error" && (
              <button onClick={retryConnection} className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-semibold">
                Retry
              </button>
            )}
          </div>
        )}

        {serverStatus === "ready" && (
          <>
           <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                  Select First Pokémon
                </h3>
                <select
                  value={selectedPokemon1}
                  onChange={(e) => handlePokemon1Change(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Choose Pokémon...</option>
                  {pokemon
                    .filter((p) => p.name !== selectedPokemon2) // Preventing selecting the same Pokemon
                    .map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.type.join(", ")})
                      </option>
                    ))}
                </select>
                {selectedPokemon2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: {selectedPokemon2} is already selected as Player 2
                  </p>
                )}
                {selectedPokemon1 && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="font-medium text-red-800">Selected: {selectedPokemon1}</p>
                    <p className="text-sm text-red-600">Type: {pokemon.find((p) => p.name === selectedPokemon1)?.type.join(", ")}</p>
                  </div>
                )}
              </div>

             <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                  Select Second Pokémon
                </h3>
                <select
                  value={selectedPokemon2}
                  onChange={(e) => handlePokemon2Change(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Choose Pokémon...</option>
                  {pokemon
                    .filter((p) => p.name !== selectedPokemon1) // Prevent selecting the same Pokemon
                    .map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.type.join(", ")})
                      </option>
                    ))}
                </select>
                {selectedPokemon1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: {selectedPokemon1} is already selected as Player 1
                  </p>
                )}
                {selectedPokemon2 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800">Selected: {selectedPokemon2}</p>
                    <p className="text-sm text-blue-600">Type: {pokemon.find((p) => p.name === selectedPokemon2)?.type.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleBattle}
                disabled={loading || !selectedPokemon1 || !selectedPokemon2}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 ${
                  loading || !selectedPokemon1 || !selectedPokemon2
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 shadow-lg"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Battling...
                  </span>
                ) : (
                  "⚔️ Start Battle!"
                )}
              </button>

              <button onClick={resetBattle} className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                🔄 Reset
              </button>
            </div>

            {battleResult && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">🏆 Battle Result</h2>

                {battleResult.winner ? (
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-green-700 mb-2">🏆 {battleResult.winner.name} Wins!</h3>
                    <p className="text-lg text-green-600">{battleResult.battleSummary}</p>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-yellow-700 mb-2">🤝 It's a Draw!</h3>
                    <p className="text-lg text-yellow-600">{battleResult.battleSummary}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-3">Final Scores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{battleResult.pokemon1.name}:</span>
                        <span className="font-semibold">{battleResult.stats.pokemon1Score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{battleResult.pokemon2.name}:</span>
                        <span className="font-semibold">{battleResult.stats.pokemon2Score}</span>
                      </div>
                    </div>
                  </div>

                 <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-800 mb-3">Type Effectiveness</h4>
                    <p className="text-sm text-gray-600">
                      {battleResult.stats.typeEffectiveness}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonBattle;