import React from "react";

const SkeletonBox = () => (
  <div className="bg-gray-300 animate-pulse rounded h-4 w-full"></div>
);

const DataTableSkeleton = ({ rows = 10, columns }) => {
  const colsCount = columns.length;

  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col, colIndex) => (
            <td key={colIndex} className="border border-gray-300 px-2 py-1">
              <SkeletonBox />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default DataTableSkeleton;
