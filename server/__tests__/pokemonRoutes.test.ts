import request from 'supertest';
import express from 'express';
import cors from 'cors';
import pokemonRoutes from '../routes/api/pokemon';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', pokemonRoutes);
  return app;
};

describe('Pokemon API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /api/pokemon', () => {
    it('should return a list of pokemon', async () => {
      const response = await request(app).get('/api/pokemon').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      const firstPokemon = response.body.data[0];
      expect(firstPokemon).toHaveProperty('name');
      expect(firstPokemon).toHaveProperty('type');
      expect(Array.isArray(firstPokemon.type)).toBe(true);
    });

    it('should return pokemon with only name and type properties', async () => {
      const response = await request(app).get('/api/pokemon').expect(200);

      const firstPokemon = response.body.data[0];
      const keys = Object.keys(firstPokemon);

      expect(keys).toEqual(['name', 'type']);
    });
  });

  describe('POST /api/battle', () => {
    let pokemonList: any[];

    beforeEach(async () => {
      const response = await request(app).get('/api/pokemon');
      pokemonList = response.body.data;
    });

    it('should perform a battle between two pokemon', async () => {
      const pokemon1 = pokemonList[0].name;
      const pokemon2 = pokemonList[1].name;

      const response = await request(app).post('/api/battle').send({ pokemon1, pokemon2 }).expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');

      const battleResult = response.body.data;
      expect(battleResult).toHaveProperty('winner');
      expect(battleResult).toHaveProperty('loser');
      expect(battleResult).toHaveProperty('battleSummary');
      expect(battleResult).toHaveProperty('stats');
      expect(battleResult).toHaveProperty('pokemon1');
      expect(battleResult).toHaveProperty('pokemon2');

      expect(battleResult.stats).toHaveProperty('pokemon1Score');
      expect(battleResult.stats).toHaveProperty('pokemon2Score');
      expect(battleResult.stats).toHaveProperty('typeEffectiveness');

      expect(battleResult.pokemon1.name).toBe(pokemon1);
      expect(battleResult.pokemon2.name).toBe(pokemon2);
    });

    it('should return 400 when pokemon1 is missing', async () => {
      const response = await request(app).post('/api/battle').send({ pokemon2: pokemonList[0].name }).expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Both pokemon1 and pokemon2 are required');
    });

    it('should return 400 when pokemon2 is missing', async () => {
      const response = await request(app).post('/api/battle').send({ pokemon1: pokemonList[0].name }).expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Both pokemon1 and pokemon2 are required');
    });

    it('should return 400 when both pokemon are missing', async () => {
      const response = await request(app).post('/api/battle').send({}).expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Both pokemon1 and pokemon2 are required');
    });

    it('should return 400 when same pokemon battles itself', async () => {
      const pokemon = pokemonList[0].name;

      const response = await request(app)
        .post('/api/battle')
        .send({ pokemon1: pokemon, pokemon2: pokemon })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Pokemon cannot battle themselves');
    });

    it('should handle case insensitive pokemon names', async () => {
      const pokemon1 = pokemonList[0].name.toLowerCase();
      const pokemon2 = pokemonList[1].name.toUpperCase();

      const response = await request(app).post('/api/battle').send({ pokemon1, pokemon2 }).expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.pokemon1.name).toBe(pokemonList[0].name);
      expect(response.body.data.pokemon2.name).toBe(pokemonList[1].name);
    });

    it('should return consistent battle results for same matchup', async () => {
      const pokemon1 = pokemonList[0].name;
      const pokemon2 = pokemonList[1].name;

      const response1 = await request(app).post('/api/battle').send({ pokemon1, pokemon2 }).expect(200);

      const response2 = await request(app).post('/api/battle').send({ pokemon1, pokemon2 }).expect(200);

      expect(response1.body.data.stats.pokemon1Score).toBe(response2.body.data.stats.pokemon1Score);
      expect(response1.body.data.stats.pokemon2Score).toBe(response2.body.data.stats.pokemon2Score);
      expect(response1.body.data.winner?.name).toBe(response2.body.data.winner?.name);
    });
  });
});
