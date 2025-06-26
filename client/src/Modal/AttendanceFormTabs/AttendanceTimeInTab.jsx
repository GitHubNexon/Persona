import React, { forwardRef, useEffect, useState } from "react";
import StaticComboBox from "../../components/picker/StaticComboBox";
import AttendanceCamera from "./AttendanceCamera";
import TextInput from "../../components/TextInput";
import { FiMapPin, FiInfo } from "react-icons/fi";

const AttendanceTimeInTab = forwardRef(
  ({ formData, setFormData, timeAction, setTimeAction }, ref) => {
    const [location, setLocation] = useState(null);
    const handleTimeActionChange = (e) => {
      setTimeAction(e.target.value);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            // Optional: Save to formData
            setFormData((prev) => ({
              ...prev,
              location: { latitude, longitude },
            }));
          },
          (error) => {
            console.warn("Location access denied.");
            setLocation(null);
          }
        );
      }
    }, []);

    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <p className="text-sm text-gray-600">
          This camera uses GPS. Please enable location access in your browser to
          capture your current location accurately.
        </p>

        {/* Location Stamp Display */}
        {location ? (
          <div className="flex items-center gap-2 bg-green-50 text-green-800 p-3 rounded-md shadow-sm border border-green-200">
            <FiMapPin className="text-green-600" />
            <div>
              <p className="text-sm font-medium">GPS Location Captured</p>
              <p className="text-xs">
                Latitude: {location.latitude.toFixed(5)} | Longitude:{" "}
                {location.longitude.toFixed(5)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 p-3 rounded-md shadow-sm border border-yellow-200">
            <FiMapPin className="text-yellow-600" />
            <div>
              <p className="text-sm font-medium">Location Not Available</p>
              <p className="text-xs">
                Please allow location access in your browser settings.
              </p>
            </div>
          </div>
        )}

        <StaticComboBox
          label="Select Time Action"
          name="timeAction"
          value={timeAction}
          onChange={handleTimeActionChange}
          values={["Time In", "Time Out"]}
          required={true}
        />

        {timeAction === "Time In" && (
          <p className="text-sm text-gray-600">
            Time In will be recorded automatically.
          </p>
        )}

        {timeAction === "Time Out" && (
          <p className="text-sm text-gray-600">
            Time Out will be recorded automatically.
          </p>
        )}

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Camera
          </label>
          <AttendanceCamera
            ref={ref} // forward the ref here
            photoURL={formData.photoURL}
            setPhotoURL={(base64) =>
              setFormData((prev) => ({ ...prev, photoURL: base64 }))
            }
          />
        </div>

        <StaticComboBox
          label="Field Location"
          name="fieldLocation"
          value={formData.fieldLocation || ""}
          onChange={handleChange}
          values={["On-Site", "Office"]}
          required={false}
        />

        <TextInput
          label="Notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          isArea={true}
        />
      </div>
    );
  }
);

export default AttendanceTimeInTab;
