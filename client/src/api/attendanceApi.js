import axios from "axios";
import { API_BASE_URL } from "./config.js";

const attendanceApi = {
  verifyAttendances: async (selectedAttendance, verifiedBy) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/verified`,
        { selectedAttendance, verifiedBy },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying attendances:", error.message);
      throw error;
    }
  },

  cancelVerifiedAttendance: async (selectedAttendance) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/verified-cancel`,
        { selectedAttendance },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling verification:", error.message);
      throw error;
    }
  },

  validateAttendance: async (employeeId) => {
    const response = await axios.get(`${API_BASE_URL}/attendance/validate`, {
      params: { employeeId },
      withCredentials: true,
    });
    return response.data;
  },

  createAttendance: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/create`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating attendance:", error.message);
      throw error;
    }
  },

  getAllAttendance: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "createdAt",
    sortOrder = "asc",
    status = "",
    isEmployee = "",
    employeeId = "",
    hasTimeIn = null,
    hasTimeOut = null,
    filterDate = null
  ) => {
    const response = await axios.get(`${API_BASE_URL}/attendance/get-all`, {
      params: {
        page,
        limit,
        keyword,
        sortBy,
        sortOrder,
        status,
        isEmployee,
        employeeId,
        hasTimeIn,
        hasTimeOut,
        filterDate,
      },
      withCredentials: true,
    });
    return response.data;
  },

  softDeleteRecord: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/soft-delete/${id}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error soft deleting attendance record:", error.message);
      throw error;
    }
  },

  softArchiveRecord: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/soft-archive/${id}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error soft archiving attendance record:", error.message);
      throw error;
    }
  },

  undoDeleteRecord: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/undo-delete/${id}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error undoing delete of attendance record:",
        error.message
      );
      throw error;
    }
  },

  undoArchiveRecord: async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/attendance/undo-archive/${id}`,
        null,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error undoing archive of attendance record:",
        error.message
      );
      throw error;
    }
  },
};

export default attendanceApi;
