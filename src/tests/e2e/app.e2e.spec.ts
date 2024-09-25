const request = require('supertest');
const getServer = require('../../server');

jest.mock('../../helpers/FileHelper'); 

let fastify:any;

beforeAll(async () => {
  fastify = getServer();
  await fastify.ready();
});

afterAll(async () => {
  await fastify.close();
});

describe('Fastify E2E Tests', () => {
  it('should return error', async () => {
    const response = await request(fastify.server)
      .get('/invalid')
      .expect(404);

    expect(response.body).toEqual({  "error": "Not Found",
      "message": "Route GET:/invalid not found",
    "statusCode": 404 });
  });
});


