import dotenv from 'dotenv';

dotenv.config(); 
export const config = {
  figmaApiToken: process.env.FIGMA_API_TOKEN || '',
  figmaFileId: process.env.FIGMA_FILE_ID || '',
  figmaApiUrl: process.env.FIGMA_API_URL || 'https://api.figma.com/v1', // Default to Figma API v1 URL
  csvFilePath: process.env.CSV_FILE_PATH || './reports',
  logFilePath: process.env.LOG_FILE_PATH || './logs',
  logFileName: process.env.LOG_FILE_NAME || 'application.log',
  port: process.env.PORT || 3000, 
  logLevel: process.env.LOG_LEVEL || 'info', // Default log level 
  csvFileName: process.env.CSV_FILE_NAME || 'operation_statistics.csv', 
  jsonFilePath: process.env.JSON_FILE_PATH || './json-files',
  jsonFileName: process.env.JSON_FILE_NAME ||'figma_response.json',
};

if (!config.figmaApiToken) {
  throw new Error('FIGMA_API_TOKEN is missing in the environment variables');
}

if (!config.figmaFileId) {
  throw new Error('FIGMA_FILE_ID is missing in the environment variables');
}
