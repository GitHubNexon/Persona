import React, { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import DataTableColumn from "./DataTableColumn";

const DataTableRow = ({
  row,
  columns,
  selection = false,
  isSelected = false,
  onToggleSelect,
  expandedComponent = null,
  checkboxField = null,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={`border border-gray-300 hover:bg-gray-50`}>
        {selection && (
          <td className="border border-gray-300 px-2 py-1 text-center">
            {/* <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
            /> */}
            <input
              type="checkbox"
              checked={checkboxField ? row[checkboxField] : isSelected}
              onChange={onToggleSelect}
            />
          </td>
        )}
        {expandedComponent !== null && (
          <td
            className="border border-gray-300 w-[32px] h-[32px] cursor-pointer text-center"
            onClick={() => setExpanded(!expanded)}
            aria-label="Expand row"
          >
            <div className="flex items-center justify-center h-full">
              {expanded ? (
                <FiChevronDown size={16} />
              ) : (
                <FiChevronRight size={16} />
              )}
            </div>
          </td>
        )}
        {columns.map(({ cell, width, height, align = "left" }, i) => (
          <DataTableColumn key={i} width={width} height={height} align={align}>
            {typeof cell === "function" ? cell(row) : row[cell]}
          </DataTableColumn>
        ))}
      </tr>
      {expanded && expandedComponent && (
        <tr>
          <td
            colSpan={columns.length + (selection ? 1 : 0) + 1}
            className="bg-gray-100 p-2"
          >
            {expandedComponent}
          </td>
        </tr>
      )}
    </>
  );
};

export default DataTableRow;
