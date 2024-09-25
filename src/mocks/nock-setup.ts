import nock from 'nock';
import { container } from '../inversify.config';
import { ILogger } from '../services/logger/logger.interface';

export function setupMockedApi() {
  const logger = container.get<ILogger>('ILogger');

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // Mock the POST request to the fake API during development or test mode
    nock('http://test-url.com').persist().post('/translations/text-parts').reply(200, { success: true });

    logger.info('Mocked API for development or test mode has been set up.');
  }
}
