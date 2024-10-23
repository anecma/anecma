import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://api.anecma.id/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
