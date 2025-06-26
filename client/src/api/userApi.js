import axios from "axios";
import { API_BASE_URL } from "./config.js";

const userApi = {
  getAllUsers: async (
    page = 1,
    limit = 10,
    keyword = "",
    sortBy = "createdAt",
    sortOrder = "asc",
    date = "",
    status = ""
  ) => {
    const response = await axios.get(`${API_BASE_URL}/user/get-all`, {
      params: { page, limit, keyword, sortBy, sortOrder, date, status },
      withCredentials: true,
    });
    return response.data;
  },

  createUser: async (userData) => {
    return axios.post(`${API_BASE_URL}/user/create`, userData, {
      withCredentials: true,
    });
  },

  updateUser: async (id, userData) => {
    return axios.patch(`${API_BASE_URL}/user/update/${id}`, userData, {
      withCredentials: true,
    });
  },

  deleteUser: async (id) => {
    return axios.delete(`${API_BASE_URL}/user/delete/${id}`, {
      withCredentials: true,
    });
  },

  softDeleteUser: async (id) => {
    return axios.post(
      `${API_BASE_URL}/user/soft-delete/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  softArchiveUser: async (id) => {
    return axios.post(
      `${API_BASE_URL}/user/soft-archive/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  undoDeleteUser: async (id) => {
    return axios.post(
      `${API_BASE_URL}/user/undo-delete/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  undoArchiveUser: async (id) => {
    return axios.post(
      `${API_BASE_URL}/user/undo-archive/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
  },

  unlockAccount: async (email) => {
    try {
      const response = await axios.post(
        "/auth/unlock",
        { email },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to unlock account:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : error;
    }
  },
};

export default userApi;
