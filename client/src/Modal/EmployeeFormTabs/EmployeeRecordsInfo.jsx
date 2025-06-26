import React, { useEffect } from "react";
import TextInput from "../../components/TextInput";
import { showToast } from "../../utils/toastNotifications";

const EmployeeRecordsInfo = ({ employeeRecords, setFormData }) => {
  // Add 1 default row on mount if empty
  useEffect(() => {
    if (employeeRecords.length === 0) {
      setFormData((prev) => ({
        ...prev,
        employeeRecords: [
          {
            companyName: "",
            position: "",
            startDate: "",
            endDate: "",
            salary: 0,
          },
        ],
      }));
    }
  }, [employeeRecords, setFormData]);

  // Check if a record is complete
  const isRecordComplete = (record) => {
    return (
      record.companyName.trim() &&
      record.position.trim() &&
      record.startDate &&
      record.endDate &&
      record.salary > 0
    );
  };

  // Update record at index, then pass only complete records to parent
  const handleChange = (index, field, value) => {
    const updatedRecords = [...employeeRecords];
    updatedRecords[index][field] = value;


    // If any record is incomplete (except the one currently editing), show toast
    const incompleteIndex = updatedRecords.findIndex(
      (rec, i) => i !== index && !isRecordComplete(rec)
    );
    if (incompleteIndex !== -1) {
      showToast(
        `Row ${
          incompleteIndex + 1
        } is incomplete. Please fill out all details.`,
        "error"
      );
    }

    setFormData((prev) => ({
      ...prev,
      employeeRecords: updatedRecords,
    }));
  };

  // Add new record only if all existing are complete
  const addRecord = () => {
    for (let i = 0; i < employeeRecords.length; i++) {
      if (!isRecordComplete(employeeRecords[i])) {
        showToast(
          `Row ${i + 1} is incomplete. Please fill out all details.`,
          "error"
        );
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      employeeRecords: [
        ...prev.employeeRecords,
        {
          companyName: "",
          position: "",
          startDate: "",
          endDate: "",
          salary: 0,
        },
      ],
    }));
  };

  const removeRecord = (index) => {
    const updatedRecords = employeeRecords.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      employeeRecords: updatedRecords,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Company Name</th>
              <th className="p-2">Position</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Salary</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeRecords.map((record, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <TextInput
                    name="companyName"
                    value={record.companyName}
                    onChange={(e) =>
                      handleChange(index, "companyName", e.target.value)
                    }
                    placeholder="Company"
                  />
                </td>
                <td className="p-2">
                  <TextInput
                    name="position"
                    value={record.position}
                    onChange={(e) =>
                      handleChange(index, "position", e.target.value)
                    }
                    placeholder="Position"
                  />
                </td>
                <td className="p-2">
                  <TextInput
                    name="startDate"
                    type="date"
                    value={record.startDate}
                    onChange={(e) =>
                      handleChange(index, "startDate", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <TextInput
                    name="endDate"
                    type="date"
                    value={record.endDate}
                    onChange={(e) =>
                      handleChange(index, "endDate", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <TextInput
                    name="salary"
                    type="number"
                    value={record.salary}
                    onChange={(e) =>
                      handleChange(index, "salary", parseFloat(e.target.value))
                    }
                    placeholder="0"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRecord(index)}
                    className={`text-red-500 hover:text-red-700 ${
                      employeeRecords.length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={employeeRecords.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={addRecord}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Record
        </button>
      </div>
    </div>
  );
};

export default EmployeeRecordsInfo;
