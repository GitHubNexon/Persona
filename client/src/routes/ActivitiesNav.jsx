import React, { useState } from "react";
import AttendanceTable from "../containers/AttendancePage/AttendanceTable";
import AttendanceVerificationTable from "../containers/AttendancePage/AttendanceVerificationTable";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ActivitiesNav = () => {
  const [activeTab, setActiveTab] = useState("Attendance-logs");
  const { user } = useAuth();

  // List of tabs with metadata: name, label, component, and user types that CANNOT access it
  const tabs = [
    {
      name: "Attendance-logs",
      label: "Attendance logs",
      component: <AttendanceTable />,
      restrictedFor: [], // accessible to all
    },
    {
      name: "Attendance-verification",
      label: "Attendance Verification",
      component: <AttendanceVerificationTable />,
      restrictedFor: ["Employee"], // Employees cannot access this tab
    },
    // Add more tabs here with restrictedFor arrays as needed
  ];

  // Filter tabs for current user, exclude tabs restricted for user's userType
  const allowedTabs = tabs.filter(
    (tab) => !tab.restrictedFor.includes(user.userType)
  );

  // Redirect if user has no authorized tabs at all (optional)
  if (allowedTabs.length === 0) {
    return <Navigate to="/" replace />;
  }

  // Ensure activeTab is valid for user, else fallback to first allowed tab
  const activeTabObj =
    allowedTabs.find((tab) => tab.name === activeTab) || allowedTabs[0];

  // Update activeTab if current activeTab is invalid for this user
  React.useEffect(() => {
    if (activeTabObj.name !== activeTab) {
      setActiveTab(activeTabObj.name);
    }
  }, [activeTab, activeTabObj]);

  return (
    <div>
      <div className="border-b overflow-auto">
        <ul className="flex text-[0.9em] pt-4 mb-2">
          {allowedTabs.map((tab) => (
            <li
              key={tab.name}
              className={`py-1 px-4 border-b-[5px] whitespace-nowrap cursor-pointer ${
                activeTab === tab.name
                  ? "border-blue-500 font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeTabObj.component}</div>
    </div>
  );
};

export default ActivitiesNav;
