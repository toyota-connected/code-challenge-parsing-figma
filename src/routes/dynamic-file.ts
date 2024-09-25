import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { container } from '../inversify.config';
import { FigmaController } from '../controllers/figma.controller';

module.exports = async function (server: FastifyInstance) {
  server.get('/v1/figma/file/:fileId', {
    schema: {
      description: 'Fetch data from Figma API using a specific file ID',
      tags: ['Figma'],
      params: {
        type: 'object',
        properties: {
          fileId: { type: 'string' },
        },
      },
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
  }, async (request:FastifyRequest, reply:FastifyReply) => {
    const { fileId } = request.params as { fileId: string };
    const figmaController = container.resolve(FigmaController);
    const result = await figmaController.getDataByFileId(fileId, reply);
    reply.send(result);
  });
}
