import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/index';
import { container } from '../inversify.config';
import { ILogger } from '../services/logger/logger.interface';

export class FileHelper {
  private static get logger(): ILogger {
    return container.get<ILogger>('ILogger');
  }

  static getCsvFilePath(): string {
    const directoryPath = config.csvFilePath || './csv-files'; 
    this.ensureDirectoryExists(directoryPath);

    const filePath = path.join(directoryPath, config.csvFileName || 'operation_statistics.csv');
    this.logger.info('Writing CSV to:', filePath);
    return filePath;
  }

  // Ensure the directory exists 
  static getLogFilePath(): string {
    const directoryPath = config.logFilePath;
    this.ensureDirectoryExists(directoryPath);
    return path.join(directoryPath, config.logFileName || 'application.log');
  }

  static getJsonFilePath(): string {
    const directoryPath = config.jsonFilePath || './json-files'; 
    this.ensureDirectoryExists(directoryPath);

    const filePath = path.join(directoryPath, config.jsonFileName || 'figma_response.json');
    this.logger.info(`Saving JSON to: ${filePath}`);

    return filePath;
  }

  // Ensure a directory exists, and create it if it doesn't
  static ensureDirectoryExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  // Write data to a file 
  static async writeToFile(filePath: string, data: string, append: boolean = true): Promise<void> {
    this.ensureDirectoryExists(path.dirname(filePath));

    return new Promise((resolve, reject) => {
      const writeOptions = append ? { flags: 'a' } : {}; 
      const stream = fs.createWriteStream(filePath, writeOptions);

      stream.write(data, (err) => {
        if (err) reject(err);
        stream.end();
        resolve();
      });
    });
  }

  // Write CSV data 
  static async writeCsvData(
    filePath: string,
    records: Array<object>,
    headers: Array<{ id: string; title: string }>
  ): Promise<void> {
    const fileExists = fs.existsSync(filePath); 
    this.logger.info('Writing data to CSV:', records); 
    const csvWriter = require('csv-writer').createObjectCsvWriter({
      path: filePath,
      header: headers,
      append: fileExists, 
    });

    try {
      await csvWriter.writeRecords(records);
      this.logger.info('CSV writing successful');
    } catch (error) {
      this.logger.error('Error writing CSV:', error);
    }
  }

  static async writeJsonData(filePath: string, data: any): Promise<void> {
    try {
      let fileData = [];
      fileData.push(data); 

      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2)); // Save the data to the JSON file
      this.logger.info('JSON writing successful');
    } catch (error) {
      this.logger.error('Error writing JSON:', error);
    }
  }
}
