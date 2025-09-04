import axios from "axios";

// Change to your deployed backend URL
const API = axios.create({
  baseURL: "https://notes-app-03pi.onrender.com/api",
});

export default API;
