import axios from "axios";

const http = axios.create({
  baseURL: "/api",                       // <— đi qua proxy
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

export default http;
