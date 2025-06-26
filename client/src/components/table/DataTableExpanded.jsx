import React from "react";

const DataTableExpanded = ({ data, children }) => {
  return (
    <div className="p-4 text-[0.7em] bg-gray-50 border border-gray-200 rounded">
      {children ? children(data) : <div>No additional Details</div>}
    </div>
  );
};

export default DataTableExpanded;
