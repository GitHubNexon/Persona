import React, { useState } from "react";
import UserType from "../sub-pages/UserType";
import UsersTable from "../sub-pages/UsersTable";
import TestTable from "../components/table/TestTable";
import SystemUsersTable from "../containers/SystemUsersTable";
import EmployeeInfoTable from "../containers/EmployeeInformation/EmployeeInfoTable";


const AdminNav = () => {
  const [activeTab, setActiveTab] = useState("UserType");

  return (
    <div>
      <div className="border-b overflow-auto">
        <ul className="flex text-[0.9em] pt-4 mb-2">
          {[
            { name: "UserType", label: "User Type" },
            { name: "System Users", label: "System Users" },
            { name: "Employee Info", label: "Employee Information" },

          ].map((tab) => (
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
      <div className="mt-4">
        {activeTab === "UserType" && <UserType />}
        {/* {activeTab === "Users" && <UsersTable />} */}
        {activeTab === "System Users" && <SystemUsersTable />}
        {activeTab === "Employee Info" && <EmployeeInfoTable />}

      </div>
    </div>
  );
};

export default AdminNav;
