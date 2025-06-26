import React from "react";
import TextInput from "../../components/TextInput";

const EmployeeEducationInfo = ({ educationInfo, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        educationInfo: {
          ...prev.educationInfo,
          [section]: {
            ...prev.educationInfo[section],
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        educationInfo: {
          ...prev.educationInfo,
          [name]: value,
        },
      }));
    }
  };

  const {
    Elementary = {},
    HighSchool = {},
    College = {},
  } = educationInfo || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Elementary */}
      <TextInput
        label="Elementary School Name"
        name="Elementary.name"
        value={Elementary.name || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Elementary Year Graduated"
        name="Elementary.yearGraduated"
        value={Elementary.yearGraduated || ""}
        onChange={handleChange}
        required
      />

      {/* High School */}
      <TextInput
        label="High School Name"
        name="HighSchool.name"
        value={HighSchool.name || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="High School Year Graduated"
        name="HighSchool.yearGraduated"
        value={HighSchool.yearGraduated || ""}
        onChange={handleChange}
        required
      />

      {/* College */}
      <TextInput
        label="College Name"
        name="College.name"
        value={College.name || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="College Year Graduated"
        name="College.yearGraduated"
        value={College.yearGraduated || ""}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default EmployeeEducationInfo;
