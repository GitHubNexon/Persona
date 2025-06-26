import React from "react";
import TextInput from "../../components/TextInput";

const EmployeeGovernmentInfo = ({ governmentInfo, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      governmentInfo: {
        ...prev.governmentInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TextInput
        label="SSS"
        name="sss"
        value={governmentInfo.sss || ""}
        onChange={handleChange}
      />
      <TextInput
        label="PAG-IBIG"
        name="pagIbig"
        value={governmentInfo.pagIbig || ""}
        onChange={handleChange}
      />
      <TextInput
        label="PhilHealth"
        name="philHealth"
        value={governmentInfo.philHealth || ""}
        onChange={handleChange}
      />
      <TextInput
        label="TIN"
        name="tin"
        value={governmentInfo.tin || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Passport Number"
        name="passportNo"
        value={governmentInfo.passportNo || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Driver's License"
        name="driversLicense"
        value={governmentInfo.driversLicense || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Postal ID"
        name="postalId"
        value={governmentInfo.postalId || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Voter's ID"
        name="votersId"
        value={governmentInfo.votersId || ""}
        onChange={handleChange}
      />
      <TextInput
        label="NBI Clearance"
        name="nbi"
        value={governmentInfo.nbi || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Police Clearance"
        name="policeClearance"
        value={governmentInfo.policeClearance || ""}
        onChange={handleChange}
      />
      <TextInput
        label="Barangay Clearance"
        name="barangayClearance"
        value={governmentInfo.barangayClearance || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default EmployeeGovernmentInfo;
