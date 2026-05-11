import axios from "axios";

const API = axios.create({
  baseURL: "https://device-booking-backend.onrender.com/api",
});

export default API;