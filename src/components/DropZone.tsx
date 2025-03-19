import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`relative overflow-hidden group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-white/50'
        }`}
    >
      <input {...getInputProps()} />
      <div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-blue-200">
          <Upload className={`w-10 h-10 transition-colors ${isDragActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} />
        </div>
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? (
            'Drop your PDF files here'
          ) : (
            'Drag & drop PDF files here'
          )}
        </p>
        <p className="text-sm text-gray-500">
          or click to select files
        </p>
      </div>
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100/0 via-blue-100/30 to-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity" 
           style={{ 
             backgroundSize: '200% 100%',
             animation: 'gradient 2s linear infinite'
           }} />
    </div>
  );
}