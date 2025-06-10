import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Reader.css';

const Reader = () => {
  const { bookId } = useParams();
  const [bookContent, setBookContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [readingProgress, setReadingProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const contentResponse = await axios.get(`/api/reading/content/${bookId}`);
        const progressResponse = await axios.get(`/api/reading/progress/${bookId}`);
        
        setBookContent(contentResponse.data.content);
        setReadingProgress(progressResponse.data.progress);
        setCurrentPage(progressResponse.data.progress.currentPage);
      } catch (err) {
        setError('Error loading book content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookContent();
  }, [bookId]);

  const updateProgress = async (newPage) => {
    try {
      await axios.post(`/api/reading/progress/${bookId}`, {
        currentPage: newPage,
        lastReadChapter: Math.ceil(newPage / 20), // Assuming 20 pages per chapter
        readingTime: readingProgress.readingTime + 1
      });
      setCurrentPage(newPage);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleNextPage = () => {
    if (currentPage < bookContent.totalPages) {
      updateProgress(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      updateProgress(currentPage - 1);
    }
  };

  if (loading) return <div className="reader-loading">Loading...</div>;
  if (error) return <div className="reader-error">{error}</div>;
  if (!bookContent) return <div className="reader-error">Book content not found</div>;

  return (
    <div className="reader-container">
      <div className="reader-header">
        <h1>{bookContent.title}</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(currentPage / bookContent.totalPages) * 100}%` }}
          />
        </div>
        <div className="page-info">
          Page {currentPage} of {bookContent.totalPages}
        </div>
      </div>

      <div className="reader-content">
        {bookContent.chapters[currentPage - 1]?.content || 'No content available'}
      </div>

      <div className="reader-controls">
        <button 
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === bookContent.totalPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Reader; 