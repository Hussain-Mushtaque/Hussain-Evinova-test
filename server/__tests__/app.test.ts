import request from 'supertest';
import app from '../app';

describe('App Integration Tests', () => {
  describe('Health Check', () => {
    it('should respond to health check endpoint', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service', 'pokemon-battle-api');
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/pokemon')
        .set('Access-Control-Request-Headers', 'content-type')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-methods');
      expect(response.headers).toHaveProperty('access-control-allow-headers');
    });
  });

  describe('Error Handling', () => {

    it('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/api/battle')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.status).toBe(400);
    });
  });

  describe('Full Battle Flow', () => {
    it('should complete a full battle flow', async () => {
      const pokemonResponse = await request(app)
        .get('/api/pokemon')
        .expect(200);

      expect(pokemonResponse.body.success).toBe(true);
      expect(pokemonResponse.body.data.length).toBeGreaterThan(1);

      const pokemon1 = pokemonResponse.body.data[0].name;
      const pokemon2 = pokemonResponse.body.data[1].name;

      const battleResponse = await request(app)
        .post('/api/battle')
        .send({ pokemon1, pokemon2 })
        .expect(200);

      expect(battleResponse.body.success).toBe(true);
      expect(battleResponse.body.data).toHaveProperty('winner');
      expect(battleResponse.body.data).toHaveProperty('battleSummary');
      expect(battleResponse.body.data.pokemon1.name).toBe(pokemon1);
      expect(battleResponse.body.data.pokemon2.name).toBe(pokemon2);

      const result = battleResponse.body.data;
      expect(typeof result.stats.pokemon1Score).toBe('number');
      expect(typeof result.stats.pokemon2Score).toBe('number');
      expect(typeof result.battleSummary).toBe('string');
      expect(result.battleSummary.length).toBeGreaterThan(0);
    });
  });
});
