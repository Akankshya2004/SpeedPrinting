import React from 'react';
import { Trash2, File } from 'lucide-react';
import { PDFFile } from '../types';

interface FileListProps {
  files: PDFFile[];
  onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div
          key={file.name + index}
          className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-blue-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <File className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{file.name}</p>
              {file.pageCount && (
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}