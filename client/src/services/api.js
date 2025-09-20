import axios from "axios";

const API = axios.create({
  baseURL: "/",
});

// Add token automatically if stored
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginAdmin = (data) => API.post("/auth/login", data);
export const verifyMFA = (data) => API.post("/auth/mfa", data);

export const getClients = () => API.get("/clients");
export const addClient = (data) => API.post("/clients", data);
export const uploadDocuments = (clientId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return API.post(`/clients/${clientId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
