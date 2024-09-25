export interface ICsvWriter {
  writeCsv(data: any): Promise<void>;
}
