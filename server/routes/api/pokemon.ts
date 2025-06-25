import { Router, Request, Response } from 'express';
import pokemonService from '../../src/services/pokemonService';
import { BattleRequest } from '../../src/types/pokemon';

const router = Router();

router.get('/pokemon', (req: Request, res: Response) => {
  try {
    const pokemon = pokemonService.getAllPokemon();
    const pokemonNames = pokemon.map((p) => ({
      name: p.name,
      type: p.type,
    }));
    res.json({ success: true, data: pokemonNames });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Pokemon data',
    });
  }
});

router.post<{}, any, BattleRequest>('/battle', (req: Request<{}, any, BattleRequest>, res: Response): void => {
  try {
    const { pokemon1, pokemon2 } = req.body;

    if (!pokemon1 || !pokemon2) {
      res.status(400).json({
        success: false,
        message: 'Both pokemon1 and pokemon2 are required',
      });
      return;
    }

    if (pokemon1.toLowerCase() === pokemon2.toLowerCase()) {
      res.status(400).json({
        success: false,
        message: 'Pokemon cannot battle themselves',
      });
      return;
    }

    const result = pokemonService.battle(pokemon1, pokemon2);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Battle simulation failed' });
    }
  }
});

export default router;
