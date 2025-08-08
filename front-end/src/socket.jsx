import { io } from "socket.io-client";

const socket = io("http://localhost:4001"); // Replace with your server URL

export default socket;