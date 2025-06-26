import React, { useState, useEffect } from "react";
import DataTable from "../components/table/DataTable";
import DataTableExpanded from "../components/table/DataTableExpanded";
import userApi from "../api/userApi";
import { showToast } from "../utils/toastNotifications";
import UserFormModal from "../modal/UserFormModal";
import {
  FaSort,
  FaTrash,
  FaArchive,
  FaUndo,
  FaLockOpen,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import Dialog from "../components/Dialog";

import { FiEdit, FiEye, FiTrash2, FiArchive, FiUnlock } from "react-icons/fi";

const SystemUsersTable = () => {
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
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    action: null,
    userId: null,
    email: null,
    title: "",
    description: "",
  });

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

  const handleUnlock = (email) => {
    handleAction("unlock", null, email);
  };

  const shouldShowActions = (email) => {
    const protectedEmails = ["admin@mail.com"];
    return !protectedEmails.includes(email.toLowerCase());
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

  // Reset page to 1 when keyword, sortField, or sortOrder changes
  useEffect(() => {
    setPage(1);
  }, [keyword, sortField, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userApi.getAllUsers(
        page,
        limit,
        keyword,
        sortField,
        sortOrder
      );
      await new Promise((res) => setTimeout(res, 1000));
      setData(res.users || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalItems || 0);
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, keyword, sortField, sortOrder]);

  const columns = [
    {
      name: "username",
      cell: "username",
      width: "auto",
      sortable: true,
      sortField: "username",
      align: "center",
    },
    {
      name: "Role",
      cell: "userType",
      width: "auto",
      sortable: true,
      sortField: "userType",
      align: "center",
    },
    {
      name: "Created At",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      width: "150px",
      sortable: true,
      sortField: "createdAt",
      align: "center",
    },
    {
      name: "Email",
      cell: "email",
      width: "150px",
      sortable: true,
      sortField: "email",
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
      name: "Lockout Until",
      cell: (row) =>
        row.lockoutUntil ? new Date(row.lockoutUntil).toLocaleString() : "N/A",
      width: "150px",
      sortable: false,
      align: "left",
    },
    {
      name: "Failed Attempts",
      cell: (row) => row.failedAttempts ?? 0,
      width: "150px",
      sortable: true,
      sortField: "failedAttempts",
      align: "center",
    },
    {
      name: "FullName",
      cell: (row) =>
        [
          row.basicInfo?.firstName,
          row.basicInfo?.middleName,
          row.basicInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ") || "-",
      width: "200px",
      sortable: false,
      align: "left",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-3 justify-center">
          {shouldShowActions(row.email) && (
            <>
              <button
                onClick={() => openEditUserModal(row)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                title="Edit"
                type="button"
                aria-label={`Edit user ${row.username}`}
              >
                <FiEdit size={18} />
              </button>
              {!row.status.isDeleted && !row.status.isArchived && (
                <>
                  <button
                    onClick={() => handleAction("delete", row._id, row.email)}
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                    title="Delete"
                    type="button"
                    aria-label={`Delete user ${row.username}`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleAction("archive", row._id, row.email)}
                    className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded p-1"
                    title="Archive"
                    type="button"
                    aria-label={`Archive user ${row.username}`}
                  >
                    <FiArchive size={18} />
                  </button>
                </>
              )}
              {(row.status.isDeleted || row.status.isArchived) && (
                <button
                  onClick={() =>
                    handleAction(
                      row.status.isDeleted ? "undoDelete" : "undoArchive",
                      row._id,
                      row.email
                    )
                  }
                  className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
                  title="Undo"
                  type="button"
                  aria-label={`Undo ${
                    row.status.isDeleted ? "delete" : "archive"
                  } for user ${row.username}`}
                >
                  <FaUndo size={18} />
                </button>
              )}
              {row.lockoutUntil && (
                <button
                  onClick={() => handleUnlock(row.email)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  title="Unlock"
                  type="button"
                  aria-label={`Unlock user ${row.username}`}
                >
                  <FiUnlock size={18} />
                </button>
              )}
            </>
          )}
        </div>
      ),
      width: "150px",
      sortable: false,
      align: "center",
    },
  ];

  // Your custom expanded row render function
  const renderExpandedContent = (rowData) => (
    <>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis adipisci
      nisi assumenda laborum repudiandae doloremque, culpa itaque! Laboriosam
      quo praesentium, architecto harum voluptas illo voluptatum. Molestias
      autem qui eum fugit?
    </>
  );

  return (
    <>
      <DataTable
        title="System Users Table"
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
        // selection={true}
        onSelectionChange={(selected) => console.log("Selected IDs:", selected)}
        showCreateButton={true}
        // expandedComponent={({ data }) => (
        //   <DataTableExpanded data={data}>
        //     {(expandedData) => renderExpandedContent(expandedData)}
        //   </DataTableExpanded>
        // )}
        searchPlaceholder="Search..."
        onFetchClick={fetchData}
        onCreateClick={openAddUserModal}
      />

      <UserFormModal
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

export default SystemUsersTable;
