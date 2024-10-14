import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.anecma.id/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
