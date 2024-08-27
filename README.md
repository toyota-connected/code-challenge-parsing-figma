# Code Challenge: Parsing Figma

## Overview
A user on the translations team needs to know the text content, font size, font face, and dimensions of the text box (width/height) for all `Text` nodes in [this Figma file](https://www.figma.com/design/FLca5Z5BpSca7dtQFmJva9/Code-Challenge%3A-Text-Node-Parsing?node-id=0-1&t=sohqCRNKwXKngMnh-11) (Please request access from your interview team).

### Goals
Write a script which aggregates this data and makes a request to a mocked API at the URL http://test-url/translations/text-parts.

- Must use the Figma API directly (See [Endpoints](https://www.figma.com/developers/api#files-endpoints))
- Must use Typescript
- Helper libraries/ packages for common functionalties are encouraged
- **Bonus**: CSV reports are collected and written to disk which log statistics of the operation

### Deliverables
1. Pull this repository, make changes, and create a Pull Request
2. Include documentation on how to run the script, and how to observe its outputs

## Setup

Install Dependencies
```sh
npm install
```

## Build

Run scripting
```sh
npm run build
```
