import React from "react";
import TextInput from "../../components/TextInput";

const EmployeeContactInfo = ({ contactInfo, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split(".");

    if (section && field) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [section]: {
            ...prev.contactInfo[section],
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value,
        },
      }));
    }
  };

  const {
    address = {},
    contactNumber = "",
    emergencyContact = {},
  } = contactInfo || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Address Fields */}
      <TextInput
        label="Street"
        name="address.street"
        value={address.street || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Barangay"
        name="address.barangay"
        value={address.barangay || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="City"
        name="address.city"
        value={address.city || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Region"
        name="address.region"
        value={address.region || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Zip Code"
        name="address.zip"
        value={address.zip || ""}
        onChange={handleChange}
        required
      />

      {/* Contact Number */}
      <TextInput
        label="Contact Number"
        name="contactNumber"
        value={contactNumber}
        onChange={handleChange}
        required
      />

      {/* Emergency Contact Fields */}
      <TextInput
        label="Emergency Contact Name"
        name="emergencyContact.name"
        value={emergencyContact.name || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Relation"
        name="emergencyContact.relation"
        value={emergencyContact.relation || ""}
        onChange={handleChange}
        required
      />
      <TextInput
        label="Emergency Contact Phone"
        name="emergencyContact.phone"
        value={emergencyContact.phone || ""}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default EmployeeContactInfo;
