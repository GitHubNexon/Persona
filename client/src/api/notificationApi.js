import axios from "axios";
import { API_BASE_URL } from "./config.js";

axios.defaults.withCredentials = true;

const notificationApi = {
  createNotification: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notification/create`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error.message);
      throw error;
    }
  },
};

export default notificationApi;
