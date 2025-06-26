import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { showToast } from "../utils/toastNotifications";
import userApi from "../api/userApi";
import useBase from "../hooks/useBase";
import TextInput from "../components/TextInput";
import Dialog from "../components/Dialog";
import moment from "moment";
import EmployeeBasicInfo from "./EmployeeFormTabs/EmployeeBasicInfo";
import EmployeeContactInfo from "./EmployeeFormTabs/EmployeeContactInfo";
import EmployeeEducationInfo from "./EmployeeFormTabs/EmployeeEducationInfo";
import EmployeeGovernmentInfo from "./EmployeeFormTabs/EmployeeGovernmentInfo";
import EmployeeRecordsInfo from "./EmployeeFormTabs/EmployeeRecordsInfo";
import EmployeeInfo from "./EmployeeFormTabs/EmployeeInfo";

const EmployeeFormModal = ({
  open,
  close,
  onSuccess,
  initialData = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    basicInfo: {
      firstName: "",
      lastName: "",
      middleName: "",
      birthDate: moment().format("YYYY-MM-DD"),
      height: 0,
      weight: 0,
      spouse: "",
      // namesOfChildren: [], // be followed
      maritalStatus: "",
      gender: "",
      profileImage: "",
    },
    contactInfo: {
      address: {
        zip: "",
        street: "",
        city: "",
        barangay: "",
        region: "",
      },
      contactNumber: "",
      emergencyContact: {
        name: "",
        relation: "",
        phone: "",
      },
    },
    educationInfo: {
      Elementary: {
        name: "",
        yearGraduated: null,
      },
      HighSchool: {
        name: "",
        yearGraduated: null,
      },
      College: {
        name: "",
        yearGraduated: null,
      },
    },
    employeeRecords: [
      {
        companyName: "",
        position: "",
        startDate: moment().toDate(),
        endDate: moment().toDate(),
        salary: 0,
      },
    ],
    governmentInfo: {
      sss: "",
      pagIbig: "",
      philHealth: "",
      tin: "",
      passportNo: "",
      driversLicense: "",
      postalId: "",
      votersId: "",
      nbi: "",
      policeClearance: "",
      barangayClearance: "",
    },
    employeeInfo: {
      employeeId: "",
      position: "",
      department: "",
      dateHired: moment().format("YYYY-MM-DD"),
      employmentStatus: "",
    },
  });
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("basicInfo");

  const tabs = [
    {
      key: "basicInfo",
      label: "Basic Information",
      Component: EmployeeBasicInfo,
    },
    {
      key: "contactInfo",
      label: "Contact Information",
      Component: EmployeeContactInfo,
    },
    {
      key: "educationInfo",
      label: "Education",
      Component: EmployeeEducationInfo,
    },
    {
      key: "governmentInfo",
      label: "Government IDs",
      Component: EmployeeGovernmentInfo,
    },
    {
      key: "employeeRecords",
      label: "Employee Recent Records",
      Component: EmployeeRecordsInfo,
    },
    {
      key: "employeeInfo",
      label: "Employee Company Info",
      Component: EmployeeInfo,
    },
  ];

  const handleClose = () => {
    setShowCloseDialog(true);
  };

  const confirmClose = () => {
    setShowCloseDialog(false);
    close();
  };

  //v1
  // useEffect(() => {
  //   if (mode === "edit" && initialData) {
  //     setFormData({
  //       ...initialData,
  //     });
  //   }
  // }, [initialData, mode]);

  //v2
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const normalizedData = {
        ...initialData,
        basicInfo: {
          ...initialData.basicInfo,
          birthDate: initialData.basicInfo?.birthDate
            ? moment(initialData.basicInfo.birthDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        },
        contactInfo: {
          ...initialData.contactInfo,
        },
        educationInfo: {
          ...initialData.educationInfo,
          Elementary: {
            ...initialData.educationInfo?.Elementary,
          },
          HighSchool: {
            ...initialData.educationInfo?.HighSchool,
          },
          College: {
            ...initialData.educationInfo?.College,
          },
        },
        employeeRecords: (initialData.employeeRecords || []).map((record) => ({
          ...record,
          startDate: record.startDate
            ? moment(record.startDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
          endDate: record.endDate
            ? moment(record.endDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        })),
        governmentInfo: {
          ...initialData.governmentInfo,
        },
        employeeInfo: {
          ...initialData.employeeInfo,
          dateHired: initialData.employeeInfo?.dateHired
            ? moment(initialData.employeeInfo.dateHired).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        },
      };

      setFormData((prev) => ({
        ...prev,
        ...normalizedData,
      }));
    }
  }, [initialData, mode]);

  const isRecordEmpty = (record) =>
    !record.companyName.trim() &&
    !record.position.trim() &&
    !record.startDate &&
    !record.endDate &&
    (record.salary === 0 ||
      record.salary === null ||
      record.salary === undefined);

  const filterCompleteEmployeeRecords = (employeeRecords) => {
    return employeeRecords.filter(
      (record) =>
        record.companyName.trim() &&
        record.position.trim() &&
        record.startDate &&
        record.endDate &&
        record.salary > 0
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { employeeRecords } = formData;
    const completeRecords = filterCompleteEmployeeRecords(employeeRecords);
    const hasIncompleteRecord = employeeRecords.some(
      (record) => !isRecordEmpty(record) && !completeRecords.includes(record)
    );
    if (hasIncompleteRecord) {
      showToast(
        "Please complete all employee records before submitting.",
        "error"
      );
      return;
    }
    const submitData = { ...formData };

    const allEmpty = employeeRecords.every(isRecordEmpty);
    if (allEmpty) {
      delete submitData.employeeRecords;
    } else {
      submitData.employeeRecords = completeRecords;
    }

    try {
      // if (mode === "edit" && initialData) {
      if (mode === "edit") {
        const updateData = { ...submitData };
        // if (!updateData.password) delete updateData.password;
        await userApi.updateUser(submitData._id, updateData);
        console.log("User Updated:", updateData);
        showToast("User updated successfully", "success");
      } else {
        // await userApi.createUser(formData);
        // console.log("User Created:", formData);
        showToast("User created successfully", "success");
      }
      onSuccess();
      close();
    } catch (error) {
      showToast(
        `Failed to ${mode === "edit" ? "update" : "create"} user`,
        "error"
      );
    }
  };

  return (
    <>
      <Modal
        open={open}
        close={handleClose}
        title={
          mode === "edit" ? "Edit Employee Details" : "Create Employee Details"
        }
      >
        <div className="max-w-full p-4">
          <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-300 mb-4 space-x-4 max-w-full">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                className={`px-4 py-2 font-semibold shrink-0 ${
                  activeTab === key
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "basicInfo" && (
              <EmployeeBasicInfo
                basicInfo={formData.basicInfo}
                setFormData={setFormData}
              />
            )}
            {activeTab === "contactInfo" && (
              <EmployeeContactInfo
                contactInfo={formData.contactInfo}
                setFormData={setFormData}
              />
            )}
            {activeTab === "educationInfo" && (
              <EmployeeEducationInfo
                educationInfo={formData.educationInfo}
                setFormData={setFormData}
              />
            )}

            {activeTab === "governmentInfo" && (
              <EmployeeGovernmentInfo
                governmentInfo={formData.governmentInfo}
                setFormData={setFormData}
              />
            )}

            {activeTab === "employeeRecords" && (
              <EmployeeRecordsInfo
                employeeRecords={formData.employeeRecords}
                setFormData={setFormData}
              />
            )}
            {activeTab === "employeeInfo" && (
              <EmployeeInfo
                employeeInfo={formData.employeeInfo}
                setFormData={setFormData}
              />
            )}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {mode === "edit"
                  ? "Update Employee Details"
                  : "Create Employee Details"}
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

export default EmployeeFormModal;
