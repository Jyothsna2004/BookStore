import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFPreview.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPreview = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDFUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shop/products/get/${bookId}`);
        if (response.data && response.data.success && response.data.data) {
          const book = response.data.data;
          if (book.pdfUrl) {
            // Construct the full URL for the PDF
            const fullPdfUrl = `http://localhost:5000${book.pdfUrl}`;
            setPdfUrl(fullPdfUrl);
          } else {
            setError('No PDF preview available for this book');
          }
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Error loading PDF preview: ' + (err.response?.data?.message || err.message));
        console.error('Error loading PDF:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFUrl();
  }, [bookId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
      <div className="text-red-500 text-xl">{error}</div>
      <Button onClick={() => navigate('/read')} className="flex items-center gap-2">
        <Home className="w-4 h-4" />
        Back to Books
      </Button>
    </div>
  );

  if (!pdfUrl) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
      <div className="text-xl">No PDF preview available</div>
      <Button onClick={() => navigate('/read')} className="flex items-center gap-2">
        <Home className="w-4 h-4" />
        Back to Books
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={() => navigate('/read')} variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Books
          </Button>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-lg">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-[800px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
            error={
              <div className="text-red-500 text-center p-4">
                Error loading PDF. Please try again later.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={800}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </Card>
    </div>
  );
};

export default PDFPreview; 