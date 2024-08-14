import { useState, useEffect } from "react";
import './Pagination.css';

export default function Pagination({ totalItems, loadPage, pageItems = 5, currentPage }) {
  const [page, setPage] = useState(currentPage || 0);
  const totalBtns = Math.ceil(totalItems / pageItems);

  useEffect(() => {
    setPage(currentPage || 0);
  }, [currentPage]);

  function handlePageChange(value) {
    setPage(value);
    loadPage({ page: value });
  }

  function renderButtons() {
    const buttons = [];
    for (let i = 0; i < totalBtns; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-item ${page === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  }

  return (
    <div className="pagination-list">
      {renderButtons()}
    </div>
  );
}
