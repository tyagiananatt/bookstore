import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { bookService } from '../services/api';
import Header from '../components/Header';
import './PDFViewer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
      if (!data.pdfUrl) {
        setPdfError(true);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setPdfError(true);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError(true);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.25));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  if (loading) {
    return (
      <div className="pdf-viewer">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (pdfError || !book?.pdfUrl) {
    return (
      <div className="pdf-viewer">
        <Header />
        <div className="error-container">
          <h2>PDF Not Available</h2>
          <p>This book doesn't have a PDF file available yet.</p>
          <button onClick={() => navigate('/library')}>Back to Library</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="pdf-viewer-container">
        <div className="pdf-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-btn" onClick={() => navigate('/library')}>
              <FiX /> Close
            </button>
            <div className="book-info">
              <h2>{book.title}</h2>
              <p>by {book.author}</p>
            </div>
          </div>
          <div className="toolbar-center">
            <button className="toolbar-btn" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <FiChevronLeft />
            </button>
            <span className="page-info">
              Page {pageNumber} of {numPages}
            </span>
            <button className="toolbar-btn" onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <FiChevronRight />
            </button>
          </div>
          <div className="toolbar-right">
            <button className="toolbar-btn" onClick={zoomOut} disabled={scale <= 0.5}>
              <FiZoomOut />
            </button>
            <span className="zoom-info">{Math.round(scale * 100)}%</span>
            <button className="toolbar-btn" onClick={zoomIn} disabled={scale >= 3}>
              <FiZoomIn />
            </button>
            <button className="toolbar-btn" onClick={toggleDarkMode}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>

        <div className="pdf-content">
          <Document
            file={book.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="pdf-loading">
                <div className="spinner"></div>
                <p>Loading PDF...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;

