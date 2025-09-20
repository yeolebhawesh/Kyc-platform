import React, { useEffect, useState, useCallback } from "react";
import { getClientById, uploadDocuments } from "../api/clients";

function ClientDetail({ token, clientId }) {
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const fetchClient = useCallback(async () => {
    setError("");
    try {
      const data = await getClientById(token, clientId);
      setClient(data);
    } catch {
      setError("Failed to fetch client");
    }
  }, [token, clientId]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const handleUpload = async () => {
    if (!files.length) return;
    try {
      const updatedClient = await uploadDocuments(token, clientId, files);
      setClient(updatedClient.client || updatedClient);
      setFiles([]);
    } catch {
      setError("Failed to upload documents");
    }
  };

  const handleDownload = async (docId, docName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${client._id}/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = docName || "file";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  if (!client) return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading client...</p>;

  return (
    <div style={{ margin: "40px auto", maxWidth: "800px", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Client Details</h2>
      {["Full Name","Email","Contact Number","Address","Business Name","GST","PAN"].map((label,i)=>(
        <p key={i}><strong>{label}:</strong> {client[["fullName","email","contactNumber","address","businessName","gstNumber","panNumber"][i]] || "-"}</p>
      ))}
      <p><strong>Identity Proofs:</strong> {client.identityProofs?.join(", ") || "-"}</p>

      <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>Documents</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {client.documents?.map(doc => (
          <li key={doc._id} style={{ marginBottom: "8px" }}>
            <button
              onClick={() => handleDownload(doc._id, doc.name)}
              style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer" }}
            >
              {doc.name || "Unnamed file"}
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
        <button onClick={handleUpload} style={{ marginLeft: "10px", background: "#28a745", color: "#fff", padding: "8px 15px", border: "none", borderRadius: "6px", cursor: "pointer" }}>Upload</button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default ClientDetail;
