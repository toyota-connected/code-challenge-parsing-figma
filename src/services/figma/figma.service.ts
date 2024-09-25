import axios from 'axios';
import { injectable } from 'inversify';  
import { config } from '../../config/index';  


@injectable()  
export class FigmaService {
  private figmaApiToken: string;
  private figmaApiUrl: string;

  constructor() {
    this.figmaApiToken = config.figmaApiToken;  
    this.figmaApiUrl = config.figmaApiUrl;      
  }

  // Fetch the text nodes from the Figma API
  async fetchTextNodes(fileId: string): Promise<any> {
    const url = `${this.figmaApiUrl}/files/${fileId}`;  
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Figma-Token': this.figmaApiToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching text nodes from Figma API', error);
      throw error;
    }
  }
}
