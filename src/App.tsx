import React, { useState, useCallback } from 'react';
import { PDFFile, ProcessedPDF } from './types';
import { FileList } from './components/FileList';
import { DropZone } from './components/DropZone';
import { getPageCount, processPDFs } from './utils/pdfUtils';
import { Printer, AlertCircle, FileText, Heart } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesDrop = useCallback(async (newFiles: File[]) => {
    setError(null);
    const pdfFiles: PDFFile[] = [];
    
    for (const file of newFiles) {
      try {
        const pageCount = await getPageCount(file);
        pdfFiles.push({
          file,
          name: file.name,
          pageCount
        });
      } catch (err) {
        console.error('Error processing file:', err);
        setError('Error processing one or more files. Please ensure they are valid PDFs.');
      }
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please add at least one PDF file.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const result: ProcessedPDF = await processPDFs(files);
      
      // Download odd pages
      const oddBlob = new Blob([result.oddPages], { type: 'application/pdf' });
      const oddUrl = URL.createObjectURL(oddBlob);
      const oddLink = document.createElement('a');
      oddLink.href = oddUrl;
      oddLink.download = 'odd_pages.pdf';
      oddLink.click();
      
      // Download even pages
      const evenBlob = new Blob([result.evenPages], { type: 'application/pdf' });
      const evenUrl = URL.createObjectURL(evenBlob);
      const evenLink = document.createElement('a');
      evenLink.href = evenUrl;
      evenLink.download = 'even_pages.pdf';
      evenLink.click();
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(oddUrl);
        URL.revokeObjectURL(evenUrl);
      }, 100);
    } catch (err) {
      console.error('Error processing PDFs:', err);
      setError('An error occurred while processing the PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-down">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              PDF Double-Sided Print Helper
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your single-sided prints into professional double-sided documents
            </p>
          </div>

          <div className="space-y-8">
            <DropZone onFilesDrop={handleFilesDrop} />
            
            {files.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 animate-slide-down">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Files</h2>
                <FileList files={files} onRemove={removeFile} />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-slide-down">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {files.length > 0 && (
              <div className="flex flex-col gap-6 animate-slide-down">
                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className={`relative flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl text-white font-medium text-lg
                    shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                    ${processing
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                >
                  <Printer className="w-5 h-5" />
                  {processing ? 'Processing...' : 'Process PDFs'}
                  {processing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl animate-pulse" />
                  )}
                </button>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-lg">
                  <h3 className="font-semibold text-blue-900 text-lg mb-4">Printing Instructions</h3>
                  <ol className="list-decimal list-inside space-y-3 text-blue-800">
                    <li className="flex gap-2 items-start">
                      <span className="font-medium">Download:</span>
                      <span className="text-blue-700">You'll receive two files: odd_pages.pdf and even_pages.pdf</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-medium">First Print:</span>
                      <span className="text-blue-700">Print odd_pages.pdf selecting "All pages"</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-medium">Prepare:</span>
                      <span className="text-blue-700">Take the printed stack and reinsert it into your printer</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-medium">Check Orientation:</span>
                      <span className="text-blue-700">Ensure pages are oriented correctly for your specific printer model</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="font-medium">Second Print:</span>
                      <span className="text-blue-700">Print even_pages.pdf selecting "All pages"</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          Made with AI and <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by 
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-medium">
            Akankshya Ingale
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;