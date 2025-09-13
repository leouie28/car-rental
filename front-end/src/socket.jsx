import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:4001";
const socket = io(baseUrl, { autoConnect: true }); // Replace with your server URL

export default socket;