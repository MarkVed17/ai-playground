import React from 'react';
import { PaginationProps } from '../types';
import { classNames } from '../utils';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 9
}) => {
  if (totalPages <= 1) return null;

  // Calculate which pages to show
  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const halfShow = Math.floor(showPages / 2);
    
    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, currentPage + halfShow);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < showPages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + showPages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - showPages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showFirstEllipsis = visiblePages[0] > 2;
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePageChange(page);
    }
  };

  return (
    <nav
      className="flex items-center justify-center space-x-1 mt-8"
      aria-label="Pagination navigation"
      role="navigation"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
        disabled={currentPage === 1}
        className={classNames(
          "w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1",
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        aria-label="Go to previous page"
      >
        <span aria-hidden="true">←</span>
      </button>

      {/* First Page */}
      {showFirstPage && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            aria-label="Go to page 1"
          >
            1
          </button>
          {showFirstEllipsis && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400" aria-hidden="true">
              …
            </span>
          )}
        </>
      )}

      {/* Visible Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          onKeyDown={(e) => handleKeyDown(e, page)}
          className={classNames(
            "w-8 h-8 flex items-center justify-center rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1",
            page === currentPage
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
          aria-label={page === currentPage ? `Current page, page ${page}` : `Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {showLastPage && (
        <>
          {showLastEllipsis && (
            <span className="w-8 h-8 flex items-center justify-center text-gray-400" aria-hidden="true">
              …
            </span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            onKeyDown={(e) => handleKeyDown(e, totalPages)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
        disabled={currentPage === totalPages}
        className={classNames(
          "w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1",
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
        aria-label="Go to next page"
      >
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
};

export default Pagination;