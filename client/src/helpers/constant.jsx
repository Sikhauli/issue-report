export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    login: "users/login",
    register: "users/register",
    logout: "users/logout",
    currentUser: "users/me",
  },
  USERS: {
    get: "users",
    update: "users",
    delete: "users",
  },
  ISSUES: {
    get: "issues",
    create: "issues",
    update: "issues",
    delete: "issues",
    stats: "issues/stats",
  }
};

export const getAxiosError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
  
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return error.request.data;
    } else {
      console.error(error);
      return "Internal error occured!";
      // return error.message;
    }
  };