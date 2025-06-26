import React, { useState, useEffect, useMemo } from "react";
import DataTableRow from "./DataTableRow";
import DataTableColumn from "./DataTableColumn";
import DataTableSkeleton from "./DataTableSkeleton";
import DataTableExpanded from "./DataTableExpanded";
import DataTablePagination from "./DataTablePagination";
import { FiPlus, FiSearch } from "react-icons/fi";
import Toastify from "./../Toast/Toastify";
import { showToast } from "../../utils/toastNotifications";

const DataTable = ({
  title,
  columns,
  data,
  loading = false,
  onError = "No Records Found",
  sorting = false,
  sortOrder = "asc",
  sortField = "",
  onSortChange,
  page = 1,
  limit = 10,
  onPageChange,
  totalPages = 1,
  totalItems = 0,
  onLimitChange,
  selection = false,
  onSelectionChange,
  searchPlaceholder = "Search...",
  onSearch,
  showCreateButton = false,
  onCreateClick,
  createButtonLabel = "Create",
  expandedComponent: ExpandedComponent,
  onFetchClick,
  checkboxField,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [toastVisible, setToastVisible] = useState(false);

  const handleFetchClick = () => {
    // setToastVisible(true);
    showToast("Fetch Data Success", "success");
    if (onFetchClick) onFetchClick();
  };

  // Debounce search input by 500ms
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  // Selection handlers
  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    if (onSelectionChange) onSelectionChange(Array.from(newSelected));
  };

  const allRowIds = useMemo(
    () => data?.map((d) => d._id || d.id) || [],
    [data]
  );

  const toggleSelectAll = () => {
    if (selectedRows.size === allRowIds.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      setSelectedRows(new Set(allRowIds));
      if (onSelectionChange) onSelectionChange(allRowIds);
    }
  };

  // Sort handlers
  const handleSort = (field) => {
    if (!sorting) return;
    if (onSortChange) {
      if (sortField === field) {
        onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
      } else {
        onSortChange(field, "asc");
      }
    }
  };

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
        <h2 className="text-[0.7em] font-semibold">{title}</h2>
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {onFetchClick && (
              <button
                className="text-[0.7em] bg-[#03346E] hover:bg-[#021526] text-white px-3 py-1 rounded"
                onClick={handleFetchClick}
              >
                Fetch Latest Data
              </button>
            )}
            <input
              type="text"
              className="text-[0.7em] border rounded pl-8 pr-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {showCreateButton && (
            <button
              className="flex items-center space-x-1 text-[0.7em] bg-[#03346E] hover:bg-[#021526] text-white px-3 py-1 rounded"
              onClick={onCreateClick}
            >
              <FiPlus />
              <span>{createButtonLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[0.7em] border-collapse border border-gray-300">
          <thead>
            <tr>
              {selection && (
                <th className="border border-gray-300 px-2 py-1 text-center w-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === allRowIds.length &&
                      allRowIds.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {ExpandedComponent && (
                <th className="border border-gray-300 w-[80px] px-0 py-1">
                  Show Details
                </th>
              )}
              {columns.map(({ name, width, sortField: sf, sortable }, i) => (
                <th
                  key={i}
                  className={`border border-gray-300 px-2 py-1 cursor-pointer select-none ${
                    sortable ? "hover:bg-gray-100" : ""
                  }`}
                  style={{ width }}
                  onClick={() => sortable && handleSort(sf || name)}
                >
                  <div className="flex items-center justify-between">
                    <span>{name}</span>
                    {sortable && (
                      <span>
                        {sortField === (sf || name)
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : "⇅"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <DataTableSkeleton
                columns={Array(
                  columns.length +
                    (selection ? 1 : 0) +
                    (ExpandedComponent ? 1 : 0)
                ).fill({})}
                rows={limit}
              />
            ) : data && data.length > 0 ? (
              data.map((row) => (
                <DataTableRow
                  key={row._id || row.id}
                  row={row}
                  columns={columns}
                  selection={selection}
                  isSelected={selectedRows.has(row._id || row.id)}
                  onToggleSelect={() => toggleRowSelection(row._id || row.id)}
                  expandedComponent={
                    ExpandedComponent ? <ExpandedComponent data={row} /> : null
                  }
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selection ? 1 : 0) +
                    (ExpandedComponent ? 1 : 0)
                  }
                  className="text-center py-4"
                >
                  {onError}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />

      <Toastify
        isVisible={toastVisible}
        type="info"
        title="Fetching..."
        description="Fetching latest data from the server."
        position="top-right"
        delay={1000}
        onClose={() => setToastVisible(false)}
        closeButton={true}
        onClickClose={true}
      />
    </div>
  );
};

export default DataTable;
