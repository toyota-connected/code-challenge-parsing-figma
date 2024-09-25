import { injectable } from 'inversify';
import pino from 'pino';
import * as fs from 'fs';
import * as path from 'path';
import { ILogger } from './logger.interface';
import { config } from '../../config/index';  
import pinoPretty from 'pino-pretty';  

const pinoMultiStream = require('pino-multi-stream'); 

const logFilePath = config.logFilePath;
const logFileName = config.logFileName;
  
if (!fs.existsSync(logFilePath)) {
  fs.mkdirSync(logFilePath);
}

//  A writable stream for the log file
const logFile = path.join(logFilePath, logFileName);
const logFileStream = fs.createWriteStream(logFile, { flags: 'a' });

@injectable()
export class PinoLoggerService implements ILogger {
  private logger: pino.Logger;

  constructor() {
    const streams = [
      { stream: logFileStream },  
      { stream: pinoPretty(), level: 'info' },  
    ];

    this.logger = pinoMultiStream({ level: 'info' }, pinoMultiStream.multistream(streams));

  }

  info(message: string, data?: any): void {
    this.logger.info({ data }, message);
  }

  error(message: string, data?: any): void {
    this.logger.error({ data }, message);
  }
}
