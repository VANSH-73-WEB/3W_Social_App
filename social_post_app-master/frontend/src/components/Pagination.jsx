import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="pager" aria-label="Feed pagination">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
