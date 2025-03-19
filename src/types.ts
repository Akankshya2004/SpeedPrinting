export interface PDFFile {
  file: File;
  name: string;
  pageCount?: number;
  preview?: string;
}

export interface ProcessedPDF {
  oddPages: Uint8Array;
  evenPages: Uint8Array;
  fileName: string;
}