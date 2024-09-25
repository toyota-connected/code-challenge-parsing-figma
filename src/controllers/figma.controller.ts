import { inject, injectable } from 'inversify';
import axios from 'axios';
import { FigmaService } from '../services/figma/figma.service';
import { ILogger } from '../services/logger/logger.interface';
import { ICsvWriter } from '../services/csv-writer/csv-writer.interface';
import { TextNode } from '../models/TextNode';
import { FigmaNodeType } from '../models/FigmaNodeType';
import { FileHelper } from '../helpers/FileHelper';
import { config } from '../config';

@injectable()
export class FigmaController {
  constructor(
    @inject(FigmaService) private figmaService: FigmaService,
    @inject('ILogger') private logger: ILogger,
    @inject('ICsvWriter') private csvWriter: ICsvWriter
  ) {}
  

  async getDataByDefaultFile(request: any, reply: any) {
    // Fetch data from Figma API
    const figmaData = await this.figmaService.fetchTextNodes(config.figmaFileId);
    const extractedTextNodes = this.extractTextNodes(figmaData);

    this.logger.info(`Extracted ${extractedTextNodes.length} Text Nodes from Figma API`);

    // Set custom header for nodes processed
    reply.header('x-nodes-processed', extractedTextNodes.length);

    // Make POST request to mocked API
    await this.sendDataToMockedAPI(extractedTextNodes);

    return extractedTextNodes;
  }


  async getDataByFileId(fileId: string, reply: any) {
    try {
      const figmaData = await this.figmaService.fetchTextNodes(fileId);
      const extractedTextNodes = this.extractTextNodes(figmaData);

      this.logger.info(`Extracted ${extractedTextNodes.length} Text Nodes from Figma API for File ID: ${fileId}`);

      reply.header('x-nodes-processed', extractedTextNodes.length);

      await this.sendDataToMockedAPI(extractedTextNodes);

      return extractedTextNodes;
    } catch (error) {
      this.logger.error(`Error occurred while fetching data for File ID ${fileId}:`, error);
      throw new Error(`Failed to fetch data for File ID: ${fileId}`);
    }
  }



   extractTextNodes(figmaData: any): TextNode[] {
    const textNodes: TextNode[] = [];
    const document = figmaData.document;

    function getNodes(node: any) {
      if (node.type === FigmaNodeType.TEXT) {
        const textNode = new TextNode(
          node.characters || '',
          node.style?.fontSize || 0,
          node.style?.fontFamily || 'Unknown',
          node.style?.fontWeight || 0,
          node.style?.lineHeightPx || 0,
          node.absoluteBoundingBox?.width || 0,
          node.absoluteBoundingBox?.height || 0
        );
        textNodes.push(textNode);
      }
      if (node.children) {
        node.children.forEach(getNodes);
      }
    }

    getNodes(document);

    this.saveToFile(textNodes);
    return textNodes; 
  }

   async saveToFile(textNodes: TextNode[]) {
    const jsonFilePath = FileHelper.getJsonFilePath();
    await FileHelper.writeJsonData(jsonFilePath, textNodes);
  }

  async sendDataToMockedAPI(textNodes: TextNode[]): Promise<void> {
    const apiUrl = 'http://test-url.com/translations/text-parts';

    try {
      const response = await axios.post(apiUrl, textNodes);

      this.logger.info(`Successfully sent text nodes to mocked API: ${response.status}`);
    } catch (error) {
      this.logger.error(`Error sending data to mocked API:`, error);
      throw new Error('Failed to send data to the mocked API');
    }
  }
}
