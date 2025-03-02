'use client';

import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { motion } from 'framer-motion';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeParserProps {
  file: File | null;
  onTextExtracted: (text: string) => void;
}

export default function ResumeParser({ file, onTextExtracted }: ResumeParserProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setPageCount(0);
      setCurrentPage(1);
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsLoading(true);
    setError(null);

    // Parse PDF using PDF.js
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPageCount(pdf.numPages);

        // Extract text from all pages
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items.map((item: any) => item.str);
          fullText += textItems.join(' ') + '\n';
        }

        // Pass the extracted text to the parent component
        onTextExtracted(fullText);
        setIsLoading(false);
      } catch (err) {
        console.error('Error parsing PDF:', err);
        setError('Failed to parse PDF. Please try another file.');
        setIsLoading(false);
      }
    };

    loadPdf();

    // Cleanup function to revoke object URL
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, onTextExtracted]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <motion.div
      className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Resume Preview</h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400 p-4 text-center">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
            <iframe
              src={`${previewUrl}#page=${currentPage}`}
              className="w-full h-full"
              title="Resume preview"
            />
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {pageCount}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Filename: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
