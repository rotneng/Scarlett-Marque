import axios from "axios";

const api = "http://localhost:3000"; 
const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  },
});

export default axiosInstance;
