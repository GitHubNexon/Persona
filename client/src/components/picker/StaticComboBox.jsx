// components/picker/StaticComboBox.jsx
import React from "react";

const StaticComboBox = ({
  label,
  name,
  values = [],
  required = false,
  error = "",
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`p-2 border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {values.map((val, idx) => (
          <option key={idx} value={val}>
            {val}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default StaticComboBox;
