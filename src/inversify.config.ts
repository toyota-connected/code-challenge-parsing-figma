import { Container } from 'inversify';
import { FigmaService } from './services/figma/figma.service';
import { PinoLoggerService } from './services/logger/logger.service';
import { FastCsvWriterService } from './services/csv-writer/FastCsvWriterService';
import { FigmaController } from './controllers/figma.controller';  
import { ILogger } from './services/logger/logger.interface';
import { ICsvWriter } from './services/csv-writer/csv-writer.interface';

// Create the Inversify container
const container = new Container();

// Bind interfaces to implementations
container.bind<ILogger>('ILogger').to(PinoLoggerService);
container.bind<ICsvWriter>('ICsvWriter').to(FastCsvWriterService);
container.bind(FigmaService).toSelf();  
container.bind(FigmaController).toSelf();  

export { container };
