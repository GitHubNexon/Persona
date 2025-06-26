import React from "react";
import TextInput from "../../components/TextInput";
import StaticComboBox from "../../components/picker/StaticComboBox";

const EmployeeInfo = ({ employeeInfo, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      employeeInfo: {
        ...prev.employeeInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TextInput
        label="Employee Id"
        name="employeeId"
        value={employeeInfo.employeeId || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Position"
        name="position"
        value={employeeInfo.position || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Department"
        name="department"
        value={employeeInfo.department || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Date Hired"
        name="dateHired"
        type="date"
        value={employeeInfo.dateHired || ""}
        onChange={handleChange}
        required
      />
      <StaticComboBox
        label="Employment Status"
        name="employmentStatus"
        value={employeeInfo.employmentStatus || ""}
        onChange={handleChange}
        values={["Active", "Inactive", "On Leave", "Terminated"]}
        required={false}
      />
    </div>
  );
};

export default EmployeeInfo;
