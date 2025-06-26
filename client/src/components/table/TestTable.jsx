import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import DataTableExpanded from "./DataTableExpanded";
import userApi from "../../api/userApi";
import { showToast } from "./../../utils/toastNotifications";

import { FiEdit, FiEye, FiTrash2, FiArchive } from "react-icons/fi";

const TestTable = () => {
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

  const handleActionClick = (action, row) => {
    showToast(`${action} clicked for CR No: ${row.CRNo}`);
  };

  const actionIcons = {
    Edit: FiEdit,
    View: FiEye,
    Delete: FiTrash2,
    Archive: FiArchive,
  };

  const columns = [
    {
      name: "username",
      cell: "username",
      width: "100px",
      sortable: true,
      sortField: "username",
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
      name: "Particulars",
      cell: "Particulars",
      width: "auto",
      sortable: false,
      align: "left",
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
          {Object.entries(actionIcons).map(([action, Icon]) => (
            <button
              key={action}
              onClick={() => handleActionClick(action, row)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              type="button"
              aria-label={`${action} row ${row.CRNo}`}
            >
              <Icon size={18} />
            </button>
          ))}
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
    <DataTable
      title="Receipts Table"
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
      onSelectionChange={(selected) => console.log("Selected IDs:", selected)}
      showCreateButton={true}
      onCreateClick={() => alert("Create button clicked")}
      expandedComponent={({ data }) => (
        <DataTableExpanded data={data}>
          {(expandedData) => renderExpandedContent(expandedData)}
        </DataTableExpanded>
      )}
      searchPlaceholder="Search receipts..."
    />
  );
};

export default TestTable;
