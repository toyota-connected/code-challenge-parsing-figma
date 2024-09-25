import 'reflect-metadata';  
import { inject, injectable } from 'inversify';
import { ICsvWriter } from './csv-writer.interface';
import { FileHelper } from '../../helpers/FileHelper';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class FastCsvWriterService implements ICsvWriter {

  constructor(
    @inject('ILogger') private logger: ILogger,
  ) {}

  async writeCsv(data: any): Promise<void> {
    const filePath = FileHelper.getCsvFilePath(); 
     this.logger.info('Preparing to write CSV at:', filePath);

    const headers = [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'requestType', title: 'Request Type' },
      { id: 'endpoint', title: 'API Endpoint' },
      { id: 'statusCode', title: 'Response Status Code' },
      { id: 'requestPayloadSize', title: 'Request Payload Size (bytes)' },
      { id: 'responsePayloadSize', title: 'Response Payload Size (bytes)' },
      { id: 'processingTime', title: 'Processing Time (ms)' },
      { id: 'nodesProcessed', title: 'Nodes Processed' },
      { id: 'clientIp', title: 'Client IP' },
      { id: 'userAgent', title: 'User Agent' },
    ];

    this.logger.info('Data to be written:', data); 

    try {
      await FileHelper.writeCsvData(filePath, [data], headers);  
    } catch (error) {
      this.logger.error('Error writing to CSV file:', error);
    }
  }
}
