import React from "react";

const DataTablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const limits = [10, 20, 50];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0 text-[0.7em]">
      <div>
        Showing {(currentPage - 1) * limit + 1} -{" "}
        {Math.min(currentPage * limit, totalItems)} of {totalItems} entries
      </div>

      <div className="flex items-center space-x-2">
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {limits.map((l) => (
            <option key={l} value={l}>
              Show {l}
            </option>
          ))}
        </select>

        <button
          className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTablePagination;
