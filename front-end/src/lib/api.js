import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
const API_URL = BASE_URL + "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

if (localStorage.getItem('token')) {
  api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
}

export default api;