import React, { useState, useEffect } from "react";
import DataTable from "../../components/table/DataTable";
import DataTableExpanded from "../../components/table/DataTableExpanded";
import attendanceApi from "../../api/attendanceApi";
import userApi from "../../api/userApi";
import { showToast } from "../../utils/toastNotifications";
import Dialog from "../../components/Dialog";
import { FiEdit, FiEye, FiTrash2, FiArchive, FiUnlock } from "react-icons/fi";
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";
import StaticComboBox from "../../components/picker/StaticComboBox";
import AttendanceFormModal from "../../Modal/AttendanceFormModal";
import DynamicComboBox from "../../components/picker/DynamicComboBox";
import AttendanceTableExpanded from "./AttendanceTableExpanded";

const AttendanceVerificationTable = () => {
  const [timeFilter, setTimeFilter] = useState("All");
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    action: null,
    userId: null,
    email: null,
    title: "",
    description: "",
  });
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch users from API on mount or when needed
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userApi.getAllUsers(1, 0); // fetch all or limited users
        setUsers(res.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  // Handler for DynamicComboBox change
  const handleUserChange = (e) => {
    console.log("Selected value:", e.target.value);
    setSelectedUser(e.target.value); // value will be _id or full object depending on props
    setPage(1);
  };

  const handleAction = async (action, id, email) => {
    setDialogConfig({
      isOpen: true,
      action,
      userId: id,
      email,
      title: `Confirm ${action.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      description: `Are you sure you want to ${action
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()} this user? This action cannot be undone.`,
    });
  };

  const confirmAction = async () => {
    try {
      switch (dialogConfig.action) {
        case "delete":
          await userApi.softDeleteUser(dialogConfig.userId);
          showToast("User deleted successfully", "success");
          break;
        case "archive":
          await userApi.softArchiveUser(dialogConfig.userId);
          showToast("User archived successfully", "success");
          break;
        case "undoDelete":
          await userApi.undoDeleteUser(dialogConfig.userId);
          showToast("User restored from delete successful", "success");
          break;
        case "undoArchive":
          await userApi.undoArchiveUser(dialogConfig.userId);
          showToast("User restored from archive successful", "success");
          break;
        case "unlock":
          await userApi.unlockAccount(dialogConfig.email); // Assuming userApi has unlockAccount
          showToast("User unlocked successfully", "success");
          break;
        default:
          break;
      }
      fetchData();
    } catch (error) {
      console.error(`Error performing ${dialogConfig.action}:`, error);
      showToast(`Failed to ${dialogConfig.action} user`, "error");
    } finally {
      setDialogConfig({ ...dialogConfig, isOpen: false });
    }
  };

  const cancelAction = () => {
    setDialogConfig({ ...dialogConfig, isOpen: false });
  };

  // Function to open modal in "add" mode
  const openAddUserModal = () => {
    setSelectedUser(null);
    setModalMode("add");
    setModalOpen(true);
  };

  // Function to open modal in "edit" mode with selected user
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Function to handle modal success (refresh data after add/edit)
  const handleModalSuccess = () => {
    fetchData(); // Refresh user list after add/edit
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  const onChangeDateRangeFilter = (e) => {
    setDateRangeFilter(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      let params = {
        page,
        limit,
        keyword,
        sortField,
        sortOrder,
        status,
      };

      // // If logged in user is an employee, restrict attendance query
      // if (user.userType === "Employee") {
      //   params = {
      //     ...params,
      //     isEmployee: true,
      //     employeeId: user._id,
      //   };
      // }

      // if (selectedUser) {
      //   params.employeeId = selectedUser;
      // }

      if (user.userType === "Employee") {
        params = {
          ...params,
          isEmployee: true,
          employeeId: user._id,
        };
      } else if (selectedUser) {
        // If admin or manager selected a user to filter
        params.employeeId = selectedUser;
      }

      // Add filter for timeIn or timeOut
      if (timeFilter === "Time In") {
        params.hasTimeIn = true;
      } else if (timeFilter === "Time Out") {
        params.hasTimeOut = true;
      }

      //filter date params
      if (dateRangeFilter) {
        params.filterDate = dateRangeFilter;
      }

      const res = await attendanceApi.getAllAttendance(
        params.page,
        params.limit,
        params.keyword,
        params.sortField,
        params.sortOrder,
        params.status,
        params.isEmployee,
        params.employeeId,
        params.hasTimeIn ?? null,
        params.hasTimeOut ?? null,
        params.filterDate ?? null
      );

      await new Promise((res) => setTimeout(res, 1000));

      setData(res.attendance || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalItems || 0);
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const onChangeFilter = (e) => {
    setTimeFilter(e.target.value);
    setPage(1);
  };

  // Reset page to 1 when keyword, sortField, or sortOrder changes
  useEffect(() => {
    setPage(1);
  }, [keyword, sortField, sortOrder, selectedUser]);

  useEffect(() => {
    fetchData();
  }, [
    page,
    limit,
    keyword,
    sortField,
    sortOrder,
    timeFilter,
    dateRangeFilter,
    selectedUser,
  ]);

  const columns = [
    {
      name: "Employee Name",
      cell: "employeeName",
      width: "auto",
      sortable: true,
      sortField: "employeeName",
      align: "left",
    },
    {
      name: "Time In",
      cell: (row) =>
        row.timeIn
          ? moment(row.timeIn).format("MMMM DD, YYYY, h:mm A")
          : "Already Clock In",
      width: "150px",
      sortable: true,
      sortField: "timeIn",
      align: "center",
    },
    {
      name: "Time Out",
      cell: (row) =>
        row.timeOut
          ? moment(row.timeOut).format("MMMM DD, YYYY, h:mm A")
          : "No Time Out Yet",
      width: "150px",
      sortable: true,
      sortField: "timeOut",
      align: "center",
    },
    {
      name: "Notes",
      cell: "notes",
      width: "150px",
      sortable: true,
      sortField: "notes",
      align: "left",
    },
    {
      name: "Status",
      cell: (row) => {
        if (row.status?.isDeleted) return "Deleted";
        if (row.status?.isArchived) return "Archived";
        return "Active";
      },
      width: "100px",
      sortable: false,
      align: "center",
    },
    {
      name: "Verified",
      cell: (row) => {
        if (row.verified) return "Verified";
        return "Not Verified Yet";
      },
      width: "150px",
      sortable: true,
      sortField: "verified",
      align: "left",
    },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <div className="flex space-x-3 justify-center">
    //       <>
    //         {/* <button
    //           onClick={() => openEditUserModal(row)}
    //           className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
    //           title="Edit"
    //           type="button"
    //           aria-label={`Edit user ${row.username}`}
    //         >
    //           <FiEdit size={18} />
    //         </button> */}
    //         {/* {!row.status.isDeleted && !row.status.isArchived && (
    //             <>
    //               <button
    //                 onClick={() => handleAction("delete", row._id, row.email)}
    //                 className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
    //                 title="Delete"
    //                 type="button"
    //                 aria-label={`Delete user ${row.username}`}
    //               >
    //                 <FiTrash2 size={18} />
    //               </button>
    //               <button
    //                 onClick={() => handleAction("archive", row._id, row.email)}
    //                 className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded p-1"
    //                 title="Archive"
    //                 type="button"
    //                 aria-label={`Archive user ${row.username}`}
    //               >
    //                 <FiArchive size={18} />
    //               </button>
    //             </>
    //           )}
    //           {(row.status.isDeleted || row.status.isArchived) && (
    //             <button
    //               onClick={() =>
    //                 handleAction(
    //                   row.status.isDeleted ? "undoDelete" : "undoArchive",
    //                   row._id,
    //                   row.email
    //                 )
    //               }
    //               className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
    //               title="Undo"
    //               type="button"
    //               aria-label={`Undo ${
    //                 row.status.isDeleted ? "delete" : "archive"
    //               } for user ${row.username}`}
    //             >
    //               <FaUndo size={18} />
    //             </button>
    //           )}
    //           {row.lockoutUntil && (
    //             <button
    //               onClick={() => handleUnlock(row.email)}
    //               className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
    //               title="Unlock"
    //               type="button"
    //               aria-label={`Unlock user ${row.username}`}
    //             >
    //               <FiUnlock size={18} />
    //             </button>
    //           )} */}
    //       </>
    //     </div>
    //   ),
    //   width: "150px",
    //   sortable: false,
    //   align: "center",
    // },
  ];

  const handleVerifySelected = async () => {
    if (!selectedRows.length) {
      showToast("Please select at least one row to verify.", "warning");
      return;
    }

    // Map selected row IDs to full row objects from `data`
    const selectedDataRows = data.filter((row) =>
      selectedRows.includes(row._id)
    );

    // Check if any selected rows are already verified
    const invalidSelections = selectedDataRows.filter(
      (row) => row.verified === true
    );

    if (invalidSelections.length > 0) {
      const message =
        invalidSelections.length === 1
          ? "The selected attendance record is already verified and cannot be verified again."
          : "Some selected attendance records are already verified and cannot be verified again.";
      showToast(message, "warning");
      return;
    }

    try {
      const payload = {
        selectedAttendance: selectedRows, // IDs are fine for API call
        verifiedBy: { _id: user._id },
      };
      await attendanceApi.verifyAttendances(
        payload.selectedAttendance,
        payload.verifiedBy
      );
      showToast("Attendances verified successfully.", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to verify attendances:", error);
      showToast("Failed to verify attendances.", "error");
    }
  };

  const handleCancelVerification = async () => {
    if (!selectedRows.length) {
      showToast(
        "Please select at least one row to cancel verification.",
        "warning"
      );
      return;
    }

    // Map selected row IDs to full row objects from `data`
    const selectedDataRows = data.filter((row) =>
      selectedRows.includes(row._id)
    );

    // Check if any selected rows are already verified
    const invalidSelections = selectedDataRows.filter(
      (row) => row.verified === false
    );

    if (invalidSelections.length > 0) {
      const message =
        invalidSelections.length === 1
          ? "The selected attendance record is not verified and cannot be cancelled."
          : "Some selected attendance records are not verified and cannot be cancelled.";
      showToast(message, "warning");
      return;
    }

    try {
      await attendanceApi.cancelVerifiedAttendance(selectedRows);
      showToast("Verification cancelled successfully.", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to cancel verification:", error);
      showToast("Failed to cancel verification.", "error");
    }
  };

  // Your custom expanded row render function
  const renderExpandedContent = (rowData) => (
    <>{<AttendanceTableExpanded data={rowData} />}</>
  );

  return (
    <>
      <div className="mb-4 w-60 m-2">
        <StaticComboBox
          label="Filter Type"
          name="activeFilter"
          value={activeFilter}
          onChange={(e) => {
            const selected = e.target.value;
            setActiveFilter(selected);
            if (selected !== "time") setTimeFilter("All");
            if (selected !== "date") setDateRangeFilter("");
            if (selected !== "user") setSelectedUser(null);
          }}
          // values={["time", "date", "user"]}
          values={
            user.userType !== "Employee"
              ? ["time", "date", "user"]
              : ["time", "date"]
          }
        />
      </div>

      {activeFilter === "time" && (
        <div className="mb-4 w-60 m-2">
          <StaticComboBox
            label="Filter Time In and Time Out"
            name="timeFilter"
            value={timeFilter}
            onChange={onChangeFilter}
            values={["All", "Time In", "Time Out"]}
          />
        </div>
      )}

      {activeFilter === "date" && (
        <div className="mb-4 w-60 m-2">
          <StaticComboBox
            label="Date Range"
            name="dateRangeFilter"
            value={dateRangeFilter}
            onChange={onChangeDateRangeFilter}
            values={["today", "yesterday", "this_week"]}
          />
        </div>
      )}

      {activeFilter === "user" && (
        <div className="mb-4 w-60 m-2">
          <DynamicComboBox
            label="User"
            name="selectedUser"
            values={users}
            value={selectedUser}
            onChange={handleUserChange}
            required={true}
            error={""}
            isSingle={true}
            isObject={false}
            labelKey="username"
            idKey="_id"
          />
        </div>
      )}

      <div className="flex gap-2 mb-4 ml-2">
        <button
          onClick={handleVerifySelected}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Verify Selected
        </button>

        <button
          onClick={handleCancelVerification}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancel Verification
        </button>
      </div>

      <DataTable
        title="Attendance Logs "
        columns={columns}
        data={data}
        loading={loading}
        onError={error || "No Records Found"}
        sorting={true}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
        page={page}
        limit={limit}
        onPageChange={setPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onSearch={setKeyword}
        selection={true}
        // onSelectionChange={(selected) => console.log("Selected IDs:", selected)}
        // showCreateButton={true}
        expandedComponent={({ data }) => (
          <DataTableExpanded data={data}>
            {(expandedData) => renderExpandedContent(expandedData)}
          </DataTableExpanded>
        )}
        // onSelectionChange={handleSelectionChange}
        onSelectionChange={(selected) => setSelectedRows(selected)}
        searchPlaceholder="Search..."
        onFetchClick={fetchData}
        // onCreateClick={openAddUserModal}
        // createButtonLabel="Time In/Out"
      />

      <AttendanceFormModal
        open={modalOpen}
        close={closeModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
        initialData={selectedUser}
      />

      <Dialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />
    </>
  );
};

export default AttendanceVerificationTable;
