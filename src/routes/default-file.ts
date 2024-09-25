import { FastifyInstance } from 'fastify';
import { container } from '../inversify.config';
import { FigmaController } from '../controllers/figma.controller';

module.exports = async function (server: FastifyInstance) {
  server.get('/figma/file/default-file', {
    schema: {
      description: 'Fetch data from Figma API using the default file ID',
      tags: ['Figma'],
      response: {
        200: {
          description: 'Successful response',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              fontSize: { type: 'number' },
              fontFamily: { type: 'string' },
              fontWeight: { type: 'number' },
              lineHeight: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
            },
          },
        },
      },
    },
  }, async (request:any, reply:any) => {
    const figmaController = container.resolve(FigmaController);
    const report = await figmaController.getDataByDefaultFile(request, reply);
    reply.send(report);
  });
}
