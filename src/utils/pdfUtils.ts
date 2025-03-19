import { PDFDocument } from 'pdf-lib';
import { PDFFile, ProcessedPDF } from '../types';

export async function getPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}

export async function processPDFs(files: PDFFile[]): Promise<ProcessedPDF> {
  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();
  
  // Merge all PDFs
  for (const file of files) {
    const arrayBuffer = await file.file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
    
    // Add blank page if needed for double-sided printing
    if (pdf.getPageCount() % 2 !== 0) {
      mergedPdf.addPage();
    }
  }

  // Split into odd and even pages
  const oddPdf = await PDFDocument.create();
  const evenPdf = await PDFDocument.create();
  
  const pageCount = mergedPdf.getPageCount();
  
  for (let i = 0; i < pageCount; i++) {
    const page = await (i % 2 === 0 ? oddPdf : evenPdf)
      .copyPages(mergedPdf, [i]);
    (i % 2 === 0 ? oddPdf : evenPdf).addPage(page[0]);
  }

  return {
    oddPages: await oddPdf.save(),
    evenPages: await evenPdf.save(),
    fileName: 'merged_document.pdf'
  };
}