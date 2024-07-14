import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav>
      <ul style={{marginBottom:"20px"}} className="pagination">
        {pages.map((page) => (
          <a href='#'  key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <a href='#' className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </a>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;