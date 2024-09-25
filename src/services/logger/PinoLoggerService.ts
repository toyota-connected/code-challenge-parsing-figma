import { injectable } from 'inversify';
import pino from 'pino';
import { ILogger } from './logger.interface';
import { FileHelper } from '../../helpers/FileHelper';
import pinoPretty from 'pino-pretty';
import * as fs from 'fs'; 

const pinoMultiStream = require('pino-multi-stream');

@injectable()
export class PinoLoggerService implements ILogger {
  private logger: pino.Logger;

  constructor() {
    const logFilePath = FileHelper.getLogFilePath();
    const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    const streams = [
      { stream: logFileStream },  
      { stream: pinoPretty(), level: 'info' },  
    ];

    this.logger = pinoMultiStream({ level: 'info' }, pinoMultiStream.multistream(streams));
  } 

  info(message: string, data?: any): void {
    const logData = `[INFO] ${message} - ${JSON.stringify(data || {})}\n`;
    FileHelper.writeToFile(FileHelper.getLogFilePath(), logData).catch(err => {
      console.error('Error writing log file:', err);
    });
  }

  error(message: string, data?: any): void {
    const logData = `[ERROR] ${message} - ${JSON.stringify(data || {})}\n`;
    FileHelper.writeToFile(FileHelper.getLogFilePath(), logData).catch(err => {
      console.error('Error writing log file:', err);
    });
  }
}
