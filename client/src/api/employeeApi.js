import axios from "axios";
import { API_BASE_URL } from "./config.js";


const employeeApi = {
  createEmployee: async (userData) => {
    return axios.post(`${API_BASE_URL}/user/create`, userData, {
      withCredentials: true,
    });
  },
};
export default employeeApi;
