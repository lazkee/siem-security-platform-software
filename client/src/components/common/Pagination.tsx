import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PaginationProps } from "../../types/props/alerts/PaginationProps";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex justify-between items-center px-5 py-4 bg-[#2a2a2a] border-t border-[#3a3a3a] rounded-b-[14px]">
      {/* Left section: Page size selector */}
      <div className="flex items-center gap-3 text-[13px] text-[#d0d0d0]">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2.5 py-1.5 rounded-[3px] border border-[#444] bg-[#1f1f1f] text-white text-[13px] cursor-pointer outline-none"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>per page</span>
      </div>

      {/* Center section: Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2.5 py-1.5 rounded-[3px] border text-[13px] flex items-center gap-1.5 transition-all ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed border-[#444] bg-[#1f1f1f] text-[#d0d0d0]"
              : "border-[#444] bg-[#1f1f1f] text-[#d0d0d0] cursor-pointer hover:bg-[#2a2a2a] hover:border-[#60a5fa]"
          }`}
        >
          <IoChevronBack size={14} />
          Previous
        </button>

        {generatePageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="text-[#a6a6a6] px-1">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1.5 rounded-[3px] border text-[13px] min-w-[36px] text-center transition-all ${
                page === currentPage
                  ? "border-[#60a5fa] bg-[rgba(96,165,250,0.15)] text-[#60a5fa] font-semibold cursor-default"
                  : "border-[#444] bg-[#1f1f1f] text-[#d0d0d0] cursor-pointer hover:bg-[#2a2a2a] hover:border-[#60a5fa]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2.5 py-1.5 rounded-[3px] border text-[13px] flex items-center gap-1.5 transition-all ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed border-[#444] bg-[#1f1f1f] text-[#d0d0d0]"
              : "border-[#444] bg-[#1f1f1f] text-[#d0d0d0] cursor-pointer hover:bg-[#2a2a2a] hover:border-[#60a5fa]"
          }`}
        >
          Next
          <IoChevronForward size={14} />
        </button>
      </div>

      {/* Right section: Info */}
      <div className="text-[13px] text-[#a6a6a6]">
        Showing {startItem}-{endItem} of {totalItems}
      </div>
    </div>
  );
};