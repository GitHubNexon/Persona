import React from "react";

const DataTableColumn = ({ children, width, height, align = "left" }) => {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  return (
    <td
      className={`border border-gray-300 px-5 py-1 ${alignClass}`}
      style={{ width, height }}
    >
      {children}
    </td>
  );
};

export default DataTableColumn;
