// components/EmployeeBasicInfo.jsx
import React from "react";
import TextInput from "../../components/TextInput";
import StaticComboBox from "../../components/picker/StaticComboBox";

const EmployeeBasicInfo = ({ basicInfo, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TextInput
        label="First Name"
        name="firstName"
        value={basicInfo.firstName || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Last Name"
        name="lastName"
        value={basicInfo.lastName || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Middle Name"
        name="middleName"
        value={basicInfo.middleName || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Birth Date"
        name="birthDate"
        type="date"
        value={basicInfo.birthDate || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Height (cm)"
        name="height"
        type="number"
        value={basicInfo.height || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Weight (kg)"
        name="weight"
        type="number"
        value={basicInfo.weight || ""}
        onChange={handleChange}
      />
      {/* <TextInput
        label="Marital Status"
        name="maritalStatus"
        value={basicInfo.maritalStatus || ""}
        onChange={handleChange}
      /> */}
      <StaticComboBox
        label="Marital Status"
        name="maritalStatus"
        value={basicInfo.maritalStatus || ""}
        onChange={handleChange}
        values={["Single", "Married", "Divorced", "Widowed", "Separated"]}
        required={false}
      />
      <TextInput
        label="Gender"
        name="gender"
        value={basicInfo.gender || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Spouse"
        name="spouse"
        value={basicInfo.spouse || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Profile Image URL"
        name="profileImage"
        value={basicInfo.profileImage || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default EmployeeBasicInfo;
