module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/node_modules/'], // Exclude node_modules from tests
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],  // Look for .spec.ts or .test.ts files
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],  // Add this for global setup
};
