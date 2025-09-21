// src/api/clients.js
import axios from "axios";

// base axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/clients",
});

// Attach token to every request
const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// GET all clients
export const getClients = async (token) => {
  const res = await API.get("/", withAuth(token));
  return res.data; // should return array of clients
};

// GET client by ID
export const getClientById = async (token, clientId) => {
  const res = await API.get(`/${clientId}`, withAuth(token));
  return res.data;
};

// ADD new client
export const addClient = async (token, clientData) => {
  const res = await API.post("/", clientData, withAuth(token));
  return res.data;
};

// UPLOAD documents for a client
export const uploadDocuments = async (token, clientId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await API.post(`/${clientId}/upload`, formData, {
    ...withAuth(token),
    headers: {
      ...withAuth(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
