import React, { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import { showToast } from "../utils/toastNotifications";
import userApi from "../api/userApi";
import useBase from "../hooks/useBase";
import TextInput from "../components/TextInput";
import Dialog from "../components/Dialog";
import moment from "moment";
import attendanceApi from "../api/attendanceApi";
import AttendanceTimeInTab from "./AttendanceFormTabs/AttendanceTimeInTab";
import useNotificationCreator from "../hooks/useNotificationCreator";
import { useAuth } from "../contexts/AuthContext";

const AttendanceFormModal = ({
  open,
  close,
  onSuccess,
  initialData = null,
  mode = "add",
}) => {
  const { user } = useAuth();
  const fullName = `${user.basicInfo.firstName} ${user.basicInfo.middleName} ${user.basicInfo.lastName}`;
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: user._id,
    employeeName: fullName,
    timeIn: null,
    timeOut: null,
    photoURL: null,
    fieldLocation: "",
    notes: "",
    location: {
      lat: null,
      lng: null,
    },
  });
  const [timeAction, setTimeAction] = useState("");
  const cameraRef = useRef();
  const { createNotification } = useNotificationCreator();

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: latitude,
            lng: longitude,
          },
        }));
      },
      (error) => {
        showToast("Failed to get your location: " + error.message, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const resetForm = () => {
    setFormData((prev) => ({
      employeeId: user._id,
      employeeName: fullName,
      timeIn: null,
      timeOut: null,
      photoURL: null,
      fieldLocation: "",
      notes: "",
      location: prev.location || { lat: null, lng: null },
    }));
    setTimeAction("");
  };

  const handleClose = () => {
    setShowCloseDialog(true);
    resetForm();
  };

  const confirmClose = () => {
    setShowCloseDialog(false);
    cameraRef.current?.stopCamera();
    resetForm();
    close();
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const normalizedData = {
        employeeId: initialData._id || "",
        employeeName: `${initialData.basicInfo?.firstName || ""} ${
          initialData.basicInfo?.middleName || ""
        } ${initialData.basicInfo?.lastName || ""}`
          .replace(/\s+/g, " ")
          .trim(),
        timeIn: initialData.timeIn
          ? moment(initialData.timeIn).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        timeOut: initialData.timeOut
          ? moment(initialData.timeOut).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        photoURL: initialData.photoURL || "",
        fieldLocation: initialData.fieldLocation || "",
        notes: initialData.notes || "",
        location: {
          lat: initialData.lat,
          lng: initialData.lng,
        },
      };

      setFormData((prev) => ({
        ...prev,
        ...normalizedData,
      }));
    }
  }, [initialData, mode]);

  const validateForm = () => {
    const { photoURL, fieldLocation, location } = formData;

    if (!photoURL) {
      showToast("Photo is required", "error");
      return false;
    }
    if (!fieldLocation || fieldLocation.trim() === "") {
      showToast("Field Location is required", "error");
      return false;
    }

    if (!timeAction || timeAction.trim() === "") {
      showToast(
        "Please select a time action (Time In / Time Out / Both)",
        "error"
      );
      return false;
    }
    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number" ||
      Number.isNaN(location.lat) ||
      Number.isNaN(location.lng)
    ) {
      showToast("Enable location services to Clock In/Out", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const now = moment().toISOString();
      const submitData = {
        ...formData,
      };

      // 👇 Dynamic validation based on timeAction
      if (timeAction === "Time In") {
        const validationRes = await attendanceApi.validateAttendance(user._id);
        if (validationRes?.alreadyClockedIn) {
          showToast("You have already clocked in today.", "error");
          return;
        }
        submitData.timeIn = now;
      } else if (timeAction === "Time Out") {
        const validationRes = await attendanceApi.validateAttendance(user._id);
        if (!validationRes?.alreadyClockedIn) {
          showToast("You haven't clocked in yet today.", "error");
          return;
        }
        if (validationRes?.alreadyClockedOut) {
          showToast("You have already clocked out today.", "error");
          return;
        }
        submitData.timeOut = now;
      } else if (timeAction === "Both") {
        submitData.timeIn = now;
        submitData.timeOut = now;
      }

      // Proceed with submission
      if (mode === "edit") {
        // await userApi.updateUser(initialData._id, submitData);
      } else {
        await attendanceApi.createAttendance(submitData);
        location.reload();
        console.log("Attendance logged successfully", submitData);
        showToast("Attendance logged successfully", "success");
      }

      // Create notification after successful attendance log
      await createNotification({
        type: "info",
        title: "Attendance Logged",
        data: {
          message: {
            employeeId: user._id,
            employeeName: fullName,
            timeIn: submitData.timeIn,
            timeOut: submitData.timeOut,
            location: formData.location,
          },
        },
      });

      onSuccess();
      resetForm();
      close();
    } catch (error) {
      showToast(
        `Failed to ${mode === "edit" ? "update" : timeAction} employee`,
        "error"
      );
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   try {
  //     const validationRes = await attendanceApi.validateAttendance(user._id);
  //     if (validationRes?.alreadyClockedIn) {
  //       showToast("You have already clocked in today.", "error");
  //       return;
  //     }

  //     const now = moment().toISOString();
  //     const submitData = {
  //       ...formData,
  //     };

  //     if (timeAction === "Time In") {
  //       submitData.timeIn = now;
  //     } else if (timeAction === "Time Out") {
  //       submitData.timeOut = now;
  //     } else if (timeAction === "Both") {
  //       submitData.timeIn = now;
  //       submitData.timeOut = now;
  //     }

  //     if (mode === "edit") {
  //       const updateData = { ...submitData };
  //       // await userApi.updateUser(initialData._id, updateData);
  //       // console.log("User Updated:", updateData);
  //       // showToast("User updated successfully", "success");
  //     } else {
  //       await attendanceApi.createAttendance(submitData);
  //       // location.reload();
  //       console.log("Time In Logged:", submitData);
  //       showToast("Time In Logged", "success");
  //     }
  //     onSuccess();
  //     resetForm();
  //     close();
  //   } catch (error) {
  //     showToast(
  //       `Failed to ${mode === "edit" ? "update" : timeAction} employee`,
  //       "error"
  //     );
  //   }
  // };

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        title={mode === "edit" ? "Edit Update Time In" : "Clock In"}
      >
        <div className="max-w-full p-4 overflow-x-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <AttendanceTimeInTab
              formData={formData}
              setFormData={setFormData}
              timeAction={timeAction}
              setTimeAction={setTimeAction}
              ref={cameraRef}
            />

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {mode === "edit" ? "Update Attendance Details" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Dialog
        isOpen={showCloseDialog}
        title="Are you sure?"
        description="Are you sure you want to close without saving?"
        isProceed="Yes, Close"
        isCanceled="Cancel"
        onConfirm={confirmClose}
        onCancel={() => setShowCloseDialog(false)}
      />
    </>
  );
};

export default AttendanceFormModal;
