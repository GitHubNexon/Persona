// components/picker/DynamicComboBox.jsx
import React from "react";

const DynamicComboBox = ({
  label,
  name,
  values = [], // array of objects from parent, e.g. users [{_id, name, ...}]
  value, // could be _id or entire object depending on props below
  onChange,
  required = false,
  error = "",
  isSingle = true, // true = value is just _id
  isObject = false, // true = value is full object
  labelKey = "name", // which key to display in option text
  idKey = "_id", // which key to use as option value if isSingle
}) => {
  // Handler when select changes
  const handleChange = (e) => {
    const selectedValue = e.target.value;

    if (isSingle) {
      // Just pass the id string or empty string
      onChange && onChange({ target: { name, value: selectedValue } });
    } else if (isObject) {
      // Find full object by _id
      const selectedObj =
        values.find((item) => String(item[idKey]) === selectedValue) || null;
      onChange && onChange({ target: { name, value: selectedObj } });
    }
  };

  // Compute selected value for the select element
  let selectValue = "";
  if (value) {
    if (isSingle) {
      selectValue = value;
    } else if (isObject) {
      selectValue = value ? value[idKey] : "";
    }
  }

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={selectValue}
        onChange={handleChange}
        className={`p-2 border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {values.map((item, idx) => (
          <option key={idx} value={item[idKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default DynamicComboBox;
