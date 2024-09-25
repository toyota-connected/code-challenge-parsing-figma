# Code Challenge: Parsing Figma

## Overview
A user on the translations team needs to know some information about Text within our designs to inform their decision when translating content.

They ask for the following information:
- Text Content
- Font size
- Font face
- Font weight
- Line height
- Dimensions of the Text box (width/height)

To be collected for all `Text` nodes in [this Figma file](https://www.figma.com/design/FLca5Z5BpSca7dtQFmJva9/Code-Challenge%3A-Text-Node-Parsing?node-id=0-1&t=sohqCRNKwXKngMnh-11) (Please request access from your interview team).

### Goals
Write a script which aggregates this data and makes a request to a mocked API at the fake URL `http://test-url.com/translations/text-parts`.

- Must use the Figma API directly (See [Endpoints](https://www.figma.com/developers/api#files-endpoints))
- Must use Typescript
- Helper libraries/ packages for common functionalties are encouraged
- **Bonus**: CSV reports are collected and written to disk which log statistics of the operation

### Deliverables
1. Pull this repository, make changes, and create a Pull Request
2. Include documentation on how to run the script, and how to observe its outputs

## Summary of Features

* Fetches text node data from the Figma API and extracts key information (text content, font details, etc.).
* Uses Inversify for dependency injection, making the app modular and easy to extend or test.
* Generates CSV reports for logging operation statistics such as number of nodes processed, request status, and processing time.
* Logs real-time information using the Pino logger, with log levels configurable via environment variables.
* Saves extracted data to a JSON file for persistent storage.
* REST API built on Fastify with extensible routes for future endpoints.
* Unit and integration tests using Jest and Supertest for reliability.
* Scalable and easily deployable with modular architecture and cloud-ready features.
* By integrating Swagger into the app, you ensure that your API is both well-documented and easy to test, facilitating better collaboration and faster development.
* API versioning to ensure backward compatibility with older clients if you need to introduce breaking changes.
* Configured CORS (Cross-Origin Resource Sharing)  to prevent unauthorized external domains from accessing the API
* Follow the Separation of Concerns (SoC) principle by making sure that each module/class focuses on one responsibility.
* Enabled the compression for API responses to reduce the size of the data being transferred.

## Setup

Install Dependencies
```sh
npm install
```

## Build Instructions

### Set Up Figma API Token

Ensure you have updated the FIGMA_API_TOKEN in the .env file, located in the root directory, with the personal access token from your Figma account.


You can obtain the Figma API Token by following the instructions on the [Figma API documentation](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens).

#### .env File

```sh
PORT=3000
FIGMA_API_TOKEN=your_figma_api_token_here  # Replace with your actual Figma API token
FIGMA_FILE_ID=default_file_id 
FIGMA_API_URL=https://api.figma.com/v1  # Figma API Base URL
CSV_FILE_PATH=./csv-files
CSV_FILE_NAME=operation_statistics.csv
LOG_FILE_PATH=./logs
LOG_FILE_NAME=application.log
JSON_FILE_PATH=./json-files
JSON_FILE_NAME=figma_response.json
```

You can modify the PORT, LOG_LEVEL, JSON_FILE_NAME, and paths for LOG_FILE_PATH and CSV_FILE_PATH as per your specific project requirements.

#### Building the Application

To build the application, run the following command:

```sh
npm run build
```

## Starting the Server

Once everything is configured, you can start the Fastify server with the following command:

```sh
npm run start
```

For development with hot-reloading, use this command:


```sh
npm run dev
```

## Making Requests and Observing Output

### Make requests (e.g., using curl, Postman, Web Browser)

1. Fetch Data from Default Figma File

To retrieve data from the default Figma file ID specified in the .env file (which can be updated based on your access), execute the following command in your terminal:

```sh
curl http://localhost:3000/v1/figma/file/default-file
```

Alternatively, you can access the same endpoint through a web browser or tools like Postman by using the URL:

```sh
http://localhost:3000/v1/figma/file/default-file
```

The response will be returned in JSON format, similar to the following example:

```js
[
  {
    "content": "Settings",
    "fontSize": 32,
    "fontFamily": "Toyota Type W02",
    "fontWeight": 600,
    "lineHeight": 39,
    "width": 128,
    "height": 39
  },
  {
    "content": "Display",
    "fontSize": 32,
    "fontFamily": "Toyota Type W02",
    "fontWeight": 400,
    "lineHeight": 39,
    "width": 113,
    "height": 39
  }
]
```

Additionally, after each successful API request, a JSON file is generated and saved to the location specified in your .env file **(./json-files/figma_response.json)**.

This file can be shared with the translation team for further use.

2. Fetch Data Using a Specific Figma File ID

You can also retrieve data using a specific Figma file ID by calling the following endpoint (make sure you have access to the file):

```sh
curl http://localhost:3000/v1/figma/file/{fileId}
```

Alternatively, use Postman or a browser to send a request to this endpoint. The response format will be the same as with the default file ID.

## Run tests

The application includes **unit, integration, and end-to-end tests**. To run the complete test suite, use the following command:

```sh
npm run test
```

This will execute all the tests and provide feedback on the correctness and performance of the application.

## Explanation of Package Roles

### Core App

- inversify: For dependency injection (DI) in services and controllers.
- axios: For making HTTP requests (Figma API).
- fastify: For handling API requests and responses.
- dotenv: For managing environment variables.
- pino: For structured logging in the app.
- reflect-metadata: Required for Inversify's DI system to work.
- swagger plugin: Provides OpenAPI specification generation.
- swaggerUI plugin: Provides an interactive Swagger UI accessible at /swagger/documentation.
- fastify/cors: prevent unauthorized external domains from accessing the API
- @fastify/compress: Compression for API Responses

### Testing & Development

- jest: For unit and integration testing.
- ts-jest: Jest plugin for TypeScript support.
- supertest: HTTP testing library for route testing.
- nock: For mocking HTTP requests during testing.
- typescript: TypeScript compiler.
- ts-node-dev: Hot-reloading during development.
- ts-node: To run TypeScript files without compiling.

This setup ensures that the app can interact with the Figma API, generate logs, manage dependencies, and perform testing efficiently.

## Statistics of the operation in CVS file

In this application, the CSV file serves as a report for logging the statistics of the operation

### CSV File Overview

The CSV file is meant to store **metrics** and **statistics** about each operation performed by the app, such as fetching data from the Figma API and processing the text nodes.

### Data Saved in the CSV

* Timestamp: When the operation occurred.
* Number of Text Nodes Processed: How many nodes were extracted from the Figma file.
* Request and Response Information: Status codes, response times, payload sizes, etc.
* Processing Time: How long it took to process the text nodes.

### CSV File Path

The CSV_FILE_PATH environment variable in the .env file defines where the CSV file is saved. The default path is **./cvs-files**, and the file is named **operation_statistics.csv**, and in the prod environments the cloud resources like AWS S3 buckets can be used for the saving path.

## Logging Mechanism in the App

The logging mechanism in this application is built using the Pino logger, which is known for its high performance.

### Log Levels

info: General information about the application's operation, such as successful API requests or the number of nodes processed.

error: Errors or issues that occur during runtime, such as failures in fetching data from the Figma API.
You can control the verbosity of logs by setting the LOG_LEVEL environment variable. For instance, setting LOG_LEVEL=debug would allow more detailed logs to appear.

### Log Output

The logs can be output to the console (using Pino's pino-pretty for human-readable formatting) or, in production, they can be redirected to files or external logging systems (such as CloudWatch, Loggly, etc.).

## Swagger in the App

- Auto-generated API documentation: Swagger generates OpenAPI-compliant documentation for all Fastify routes.
- Interactive Swagger UI: Users can explore the API and test endpoints directly from the browser at /swagger/documentation.
- Detailed endpoint information: Each route includes descriptions, response formats, and status codes.
- Real-time API testing: Users can send live requests to API endpoints directly from Swagger UI.
- Easy configuration: Routes are documented by adding a schema to - the Fastify route definition, allowing for quick updates and easy maintenance.
