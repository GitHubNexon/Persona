import React from "react";
import moment from "moment";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiBook,
  FiBriefcase,
  FiShield,
  FiClock,
  FiSmartphone,
  FiCheckCircle,
  FiEdit2,
  FiMessageCircle,
} from "react-icons/fi";
import GoogleMapFrame from "../../components/GoogleMapFrame";

const formatDateTime = (dateString) => {
  return dateString ? moment(dateString).format("MMMM D, YYYY h:mm A") : "-";
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon className="text-gray-500 mt-1" />
    <div>
      <div className="font-medium text-gray-700">{label}</div>
      <div className="text-gray-600">{value || "-"}</div>
    </div>
  </div>
);

const AttendanceTableExpanded = ({ data }) => {
  if (!data) return null;

  const {
    employeeName,
    timeIn,
    timeOut,
    photoURL,
    ipAddress,
    location,
    fieldLocation,
    device,
    notes,
    verified,
    createdAt,
    updatedAt,
  } = data;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <img
          src={photoURL}
          alt="Employee"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiUser /> {employeeName}
          </h2>
          <div className="text-sm text-gray-500">IP: {ipAddress}</div>
          <div className="text-sm text-gray-500">
            Verified:{" "}
            {verified ? (
              <span className="text-green-600 font-medium">Yes</span>
            ) : (
              <span className="text-red-600 font-medium">No</span>
            )}
          </div>
        </div>
      </div>

      {/* Time Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow
          icon={FiClock}
          label="Time In"
          value={formatDateTime(timeIn || "-")}
        />
        <InfoRow
          icon={FiClock}
          label="Time Out"
          value={formatDateTime(timeOut || "-")}
        />
        <InfoRow
          icon={FiEdit2}
          label="Created At"
          value={formatDateTime(createdAt || "-")}
        />
        <InfoRow
          icon={FiEdit2}
          label="Updated At"
          value={formatDateTime(updatedAt || "-")}
        />
      </div>

      {/* Location Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={FiMapPin} label="Field Location" value={fieldLocation} />
        <InfoRow
          icon={FiShield}
          label="Coordinates"
          value={`${location.lat}, ${location.lng}`}
        />
      </div>

      {/* Map Frame */}
      <div className="rounded-lg overflow-hidden">
        {location?.lat && location?.lng ? (
          <GoogleMapFrame lat={location.lat} lng={location.lng} />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-500 text-sm italic border rounded-md">
            No connection or lost data
          </div>
        )}
      </div>

      {/* Device Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoRow
          icon={FiSmartphone}
          label="Device Model"
          value={device?.model}
        />
        <InfoRow icon={FiBriefcase} label="OS" value={device?.os} />
        <InfoRow icon={FiBook} label="Browser" value={device?.browser} />
      </div>

      {/* Notes */}
      {notes && (
        <div className="flex items-start gap-3 text-sm">
          <FiMessageCircle className="text-gray-500 mt-1" />
          <div>
            <div className="font-medium text-gray-700">Notes</div>
            <div className="text-gray-600 whitespace-pre-line">{notes}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTableExpanded;
