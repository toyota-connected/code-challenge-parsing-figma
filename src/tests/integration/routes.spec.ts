import Fastify from 'fastify';
import path from 'path';
import nock from 'nock';
import { config } from '../../config';

jest.mock('../../helpers/FileHelper');

let server: any;
const fastifyAutoload = require('@fastify/autoload');

beforeAll(() => {
  server = Fastify();
  server.register(fastifyAutoload, {
    dir: path.join(__dirname, '../../routes')
  });
});

afterAll(async () => {
  await server.close();
  nock.cleanAll();  // Clean all nocks after each test
});

describe('Route Integration Tests', () => {
  it('should send data to the mocked API and return success', async () => {
    nock('https://api.figma.com')
      .get('/v1/files/'+ config.figmaFileId)
      .reply(200, {
        document: {
          children: [
            {
              type: 'TEXT',
              characters: 'Hello World',
              style: { fontSize: 16, fontFamily: 'Arial', fontWeight: 400, lineHeightPx: 24 },
              absoluteBoundingBox: { width: 100, height: 50 }
            }
          ]
        }
      });

    nock('http://test-url.com')
      .post('/translations/text-parts')
      .reply(200, { success: true });

    const response = await server.inject({
      method: 'GET',
      url: '/v1/figma/file/'+config.figmaFileId
    });

    expect(response.statusCode).toBe(200);
  });
});
