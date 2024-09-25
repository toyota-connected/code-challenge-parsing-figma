import { container } from './inversify.config';
import { ILogger } from './services/logger/logger.interface';
import { FastCsvWriterService } from './services/csv-writer/FastCsvWriterService';
import path from 'path';


const Fastify = require('fastify');
const autoload = require('@fastify/autoload');
const logger = container.get<ILogger>('ILogger');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');

 function getServer() {

  const server = Fastify({
    // Disable Fastify's internal logger
    logger: false, 
  });


  server.register(require('@fastify/cors'), {
    origin: '*', // Configure for specific domains in production
  });
  

  // Register the swagger plugin
  server.register(swagger, {
    openapi: {
      info: {
        title: 'Figma API',
        description: 'API documentation for Figma-related endpoints',
        version: '1.0.0',
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  // Register the swagger-ui plugin
  server.register(swaggerUI, {
    routePrefix: '/swagger/documentation',
  });

  //  Load routes 
  server.register(autoload, {
    dir: path.join(__dirname, 'routes'),
  });

  const metricsStore: any = {}; 

  // Fastify 'onRequest' hook
  server.addHook('onRequest', async (request: any, reply: any) => {
    const requestId = request.id; 
    metricsStore[requestId] = {
      timestamp: new Date().toISOString(),
      requestType: request.method,
      endpoint: request.url,
      requestPayloadSize: request.headers['content-length'] || 0,
      clientIp: request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress,
      userAgent: request.headers['user-agent'] || '',
      startTime: process.hrtime(), 
    };
  });

  // Fastify 'onResponse' hook
  server.addHook('onResponse', async (request: any, reply: any) => {
    const requestId = request.id;
    const metrics = metricsStore[requestId];
    if (!metrics) return; 

    const { startTime } = metrics;
    const endTime = process.hrtime(startTime);
    // Convert to milliseconds
    const processingTime = endTime[0] * 1000 + endTime[1] / 1e6; 

    const fullMetrics = {
      ...metrics,
      responsePayloadSize: reply.getHeader('content-length') || 0,
      statusCode: reply.statusCode,
      processingTime, 
      nodesProcessed: reply.getHeader('x-nodes-processed') || 0,
    };

    // Clean up 
    delete metricsStore[requestId]; 

    // Log metrics to CSV
    const csvWriter = container.resolve(FastCsvWriterService);
    await csvWriter.writeCsv(fullMetrics); 
    logger.info('Metrics captured:', fullMetrics);
  });

  server.setErrorHandler((error: any, request: any, reply: any) => {
    logger.error(`Error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    reply.status(500).send({ error: 'Internal Server Error' });
  });

  return server;
}

module.exports = getServer

