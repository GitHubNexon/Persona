import React from "react";
import moment from "moment";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiBook,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";

const formatDate = (dateString) => {
  return dateString ? moment(dateString).format("MMMM D, YYYY") : "-";
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <Icon className="text-blue-600 mt-1" size={18} />
    <div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-sm text-gray-600 break-words">{value || "-"}</p>
    </div>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-6 mb-6">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const EmployeeExpandedInfo = ({ data }) => {
  const {
    basicInfo,
    contactInfo,
    educationInfo,
    employeeInfo,
    governmentInfo,
    email,
    username,
    status,
  } = data || {};

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Employee Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Basic Information">
          <InfoRow
            icon={FiUser}
            label="Full Name"
            value={`${basicInfo?.firstName || ""} ${
              basicInfo?.middleName || ""
            } ${basicInfo?.lastName || ""}`}
          />
          <InfoRow icon={FiUser} label="Gender" value={basicInfo?.gender} />
          <InfoRow
            icon={FiUser}
            label="Birth Date"
            value={formatDate(basicInfo?.birthDate)}
          />
          <InfoRow
            icon={FiUser}
            label="Height / Weight"
            value={`${basicInfo?.height || "-"} cm / ${
              basicInfo?.weight || "-"
            } kg`}
          />
          <InfoRow icon={FiUser} label="Spouse" value={basicInfo?.spouse} />
          <InfoRow
            icon={FiUser}
            label="Marital Status"
            value={basicInfo?.maritalStatus}
          />
        </SectionCard>

        <SectionCard title="Contact Information">
          <InfoRow
            icon={FiMapPin}
            label="Address"
            value={`${contactInfo?.address?.street || ""}, ${
              contactInfo?.address?.barangay || ""
            }, ${contactInfo?.address?.city || ""}, ${
              contactInfo?.address?.region || ""
            }, ${contactInfo?.address?.zip || ""}`}
          />
          <InfoRow
            icon={FiPhone}
            label="Contact Number"
            value={contactInfo?.contactNumber}
          />
          <InfoRow
            icon={FiPhone}
            label="Emergency Contact"
            value={`${contactInfo?.emergencyContact?.name || ""} (${
              contactInfo?.emergencyContact?.relation || ""
            }) - ${contactInfo?.emergencyContact?.phone || ""}`}
          />
        </SectionCard>

        <SectionCard title="Education Background">
          <InfoRow
            icon={FiBook}
            label="Elementary"
            value={`${educationInfo?.Elementary?.name || ""} - ${
              educationInfo?.Elementary?.yearGraduated || ""
            }`}
          />
          <InfoRow
            icon={FiBook}
            label="High School"
            value={`${educationInfo?.HighSchool?.name || ""} - ${
              educationInfo?.HighSchool?.yearGraduated || ""
            }`}
          />
          <InfoRow
            icon={FiBook}
            label="College"
            value={`${educationInfo?.College?.name || ""} - ${
              educationInfo?.College?.yearGraduated || ""
            }`}
          />
        </SectionCard>

        <SectionCard title="Employment Information">
          <InfoRow
            icon={FiBriefcase}
            label="Employee ID"
            value={employeeInfo?.employeeId}
          />
          <InfoRow
            icon={FiBriefcase}
            label="Position / Department"
            value={`${employeeInfo?.position} / ${employeeInfo?.department}`}
          />
          <InfoRow
            icon={FiBriefcase}
            label="Date Hired"
            value={formatDate(employeeInfo?.dateHired)}
          />
          <InfoRow
            icon={FiBriefcase}
            label="Employment Status"
            value={employeeInfo?.employmentStatus}
          />
        </SectionCard>

        <SectionCard title="Government Information">
          <InfoRow icon={FiShield} label="SSS" value={governmentInfo?.sss} />
          <InfoRow icon={FiShield} label="TIN" value={governmentInfo?.tin} />
          <InfoRow
            icon={FiShield}
            label="Passport No."
            value={governmentInfo?.passportNo}
          />
        </SectionCard>

        <SectionCard title="Account Information">
          <InfoRow icon={FiUser} label="Username" value={username} />
          <InfoRow icon={FiUser} label="Email" value={email} />
          <InfoRow
            icon={FiUser}
            label="Account Status"
            value={
              status?.isDeleted
                ? "Deleted"
                : status?.isArchived
                ? "Archived"
                : "Active"
            }
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default EmployeeExpandedInfo;
