import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function JobPagination({
  currentPage,
  totalPages,
  onPageChange,
}: JobPaginationProps) {
  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-body-md font-medium transition-all ${
            page === currentPage
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
          }`}>
          {page}
        </button>
      ))}

      <button
        className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default JobPagination;
