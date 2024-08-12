import React from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
};

const TablePagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = 5;

    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const generatePaginationItems = () => {
        const items: JSX.Element[] = [];
        let startPage = 1;
        let endPage = totalPages;

        if (totalPages > visiblePages) {
            const halfVisiblePages = Math.floor(visiblePages / 2);
            startPage = Math.max(currentPage - halfVisiblePages, 1);
            endPage = Math.min(startPage + visiblePages - 1, totalPages);
            if (endPage - startPage + 1 < visiblePages) {
                startPage = endPage - visiblePages + 1;
            }
        }

        if (startPage > 1) {
            items.push(<li key="startEllipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <a className="page-link" onClick={() => paginate(i)} href="javascript:void(0)">{i}</a>
                </li>
            );
        }

        if (endPage < totalPages) {
            items.push(<li key="endEllipsis" className="page-item disabled"><span className="page-link">...</span></li>);
        }

        return items;
    };

    return (
        <ul className="pagination mb-5 my-5">
            <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a className="page-link" onClick={() => paginate(currentPage - 1)} href="javascript:void(0)">Previous</a>
            </li>
            {generatePaginationItems()}
            <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a className="page-link" onClick={() => paginate(currentPage + 1)} href="javascript:void(0)">Next</a>
            </li>
        </ul>
    );
};

export default TablePagination;
