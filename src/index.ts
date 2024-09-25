import 'reflect-metadata';
import { container } from './inversify.config';
import { ILogger } from './services/logger/logger.interface';
import { config } from './config';
import { setupMockedApi } from './mocks/nock-setup';

const getServer = require('./server');

setupMockedApi();
const logger = container.get<ILogger>('ILogger');

const server = getServer();

// Start the server
(async () => {
  try {
    logger.info('Attempting to start the server...');
    const port = config.port as number;
    await server.listen({ port, host: '0.0.0.0' });
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error starting server: ${err.message}`);
    }
    process.exit(1);
  }
})();
