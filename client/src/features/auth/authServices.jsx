import { API } from "../../services/api";
import { API_ENDPOINTS } from "../../helpers/constant";

export const authService = {
  async login(credentials) {
    const response = await API.post(API_ENDPOINTS.AUTH.login, credentials);
    return response.data;
  },

  async register(userData) {
    const response = await API.post(API_ENDPOINTS.AUTH.register, userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await API.get(API_ENDPOINTS.AUTH.currentUser);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  }
};