import 'reflect-metadata';  // Ensure reflect-metadata is imported
import { container } from '../../inversify.config';
import { FigmaController } from '../../controllers/figma.controller';
import { FigmaService } from '../../services/figma/figma.service';
import { ILogger } from '../../services/logger/logger.interface';
import { ICsvWriter } from '../../services/csv-writer/csv-writer.interface';
import nock from 'nock';
import { config } from '../../config';

jest.mock('../../helpers/FileHelper'); 

// Mock the services
const mockFigmaService: jest.Mocked<FigmaService> = {
  fetchTextNodes: jest.fn(),
} as unknown as jest.Mocked<FigmaService>;


describe('FigmaController Unit Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();  
  });

  it('should extract text nodes from Figma data', async () => {
    nock('https://api.figma.com')
    .get('/v1/files/'+ config.figmaFileId)
    .reply(200, {
      document: {
        children: [
          {
            type: 'TEXT',
            characters: 'Test Contents',
            style: { fontSize: 16, fontFamily: 'Toyota W2', fontWeight: 400, lineHeightPx: 24 },
            absoluteBoundingBox: { width: 100, height: 50 }
          }
        ]
      }
    });


    const figmaController = container.resolve(FigmaController); 

    mockFigmaService.fetchTextNodes.mockResolvedValueOnce({
      document: {
        children: [
          {
            type: 'TEXT',
            characters: 'Test Contents',
            style: { fontSize: 16, fontFamily: 'Toyota W2', fontWeight: 400, lineHeightPx: 24 },
            absoluteBoundingBox: { width: 100, height: 50 },
          },
        ],
      },
    });

    const result = await figmaController.getDataByDefaultFile({}, { header: jest.fn() });
    expect(result).toEqual([
      {
        content: 'Test Contents',
        fontSize: 16,
        fontFamily: 'Toyota W2',
        fontWeight: 400,
        lineHeight: 24,
        width: 100,
        height: 50,
      },
    ]);
  });
});
