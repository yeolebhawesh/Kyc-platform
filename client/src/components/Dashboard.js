import React, { useEffect, useState, useCallback, useRef } from "react";
import { getClients, addClient } from "../api/clients";
import ClientDetail from "./ClientDetail";

function Dashboard({ token }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState("");
  const [newClient, setNewClient] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    address: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
    identityProofs: [],
  });

  const identityOptions = ["Aadhaar Card", "Voter ID", "Passport", "Driving License"];
  const detailRef = useRef(null);

  const fetchClients = useCallback(async () => {
    setError("");
    try {
      const data = await getClients(token);
      if (Array.isArray(data)) setClients(data);
      else setError("Failed to fetch clients");
    } catch {
      setError("Failed to fetch clients");
    }
  }, [token]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleAddClient = async () => {
    setError("");
    try {
      const response = await addClient(token, newClient);
      if (response) {
        setClients(prev => [...prev, response]);
        setNewClient({
          fullName: "", email: "", contactNumber: "", address: "",
          businessName: "", gstNumber: "", panNumber: "", identityProofs: []
        });
      } else setError("Failed to add client");
    } catch {
      setError("Failed to add client");
    }
  };

  const handleIdentityChange = (option) => {
    setNewClient(prev => {
      const current = prev.identityProofs;
      return current.includes(option)
        ? { ...prev, identityProofs: current.filter(o => o !== option) }
        : { ...prev, identityProofs: [...current, option] };
    });
  };

  const handleClientClick = (id) => {
    setSelectedClient(selectedClient === id ? null : id);
    setTimeout(() => {
      if (detailRef.current) detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div style={{
      padding: "30px",
      fontFamily: "'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f2f5 0%, #d9e2ec 100%)"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#222" }}>Admin Dashboard</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Add Client Section */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 50px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#444" }}>Add New Client</h2>
        {["Full Name","Email","Contact Number","Address","Business Name","GST Number","PAN Number"].map((field,i)=>(
          <input
            key={i}
            placeholder={field}
            value={newClient[["fullName","email","contactNumber","address","businessName","gstNumber","panNumber"][i]]}
            onChange={(e)=>setNewClient({...newClient,[["fullName","email","contactNumber","address","businessName","gstNumber","panNumber"][i]]:e.target.value})}
            style={{
              width:"100%",
              padding:"12px",
              borderRadius:"10px",
              border:"1px solid #ccc",
              fontSize:"14px",
              outline:"none",
              marginBottom:"12px",
              transition:"border 0.2s"
            }}
            onFocus={e => e.target.style.border="1px solid #4facfe"}
            onBlur={e => e.target.style.border="1px solid #ccc"}
          />
        ))}

        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontWeight: "bold", marginBottom: "6px" }}>Identity Proofs:</p>
          {identityOptions.map(option => (
            <label key={option} style={{ display: "inline-block", marginRight:"12px", fontSize:"14px" }}>
              <input type="checkbox" checked={newClient.identityProofs.includes(option)} onChange={() => handleIdentityChange(option)} /> {option}
            </label>
          ))}
        </div>

        <button onClick={handleAddClient} style={{
          padding: "12px",
          background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "15px",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={e=>{e.target.style.transform="scale(1.03)"; e.target.style.boxShadow="0 8px 20px rgba(0,0,0,0.3)"}}
        onMouseLeave={e=>{e.target.style.transform="scale(1)"; e.target.style.boxShadow="0 6px 15px rgba(0,0,0,0.2)"}}>
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#444" }}>Clients</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        maxHeight: "400px",
        overflowY: "auto",
        padding: "10px 20px"
      }}>
        {clients.map(c => c && (
          <div
            key={c._id}
            onClick={() => handleClientClick(c._id)}
            style={{
              background: selectedClient === c._id ? "#e0f7fa" : "#fff",
              padding: "18px",
              borderRadius: "16px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s, background 0.3s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 6px 15px rgba(0,0,0,0.1)"; }}
          >
            <h3 style={{ marginBottom: "6px", color: "#222" }}>{c.fullName}</h3>
            <p style={{ marginBottom: "4px", fontSize: "14px", color: "#555" }}>{c.businessName}</p>
            <p style={{ marginBottom: "3px", fontSize: "12px", color: "#777" }}>Contact: {c.contactNumber || "-"}</p>
            <p style={{ marginBottom: "3px", fontSize: "12px", color: "#777" }}>GST: {c.gstNumber || "-"}</p>
            <p style={{ marginBottom: "3px", fontSize: "12px", color: "#777" }}>PAN: {c.panNumber || "-"}</p>
          </div>
        ))}
      </div>

      {/* Client Details Section */}
      <div ref={detailRef} style={{ marginTop: "40px", maxWidth: "900px", marginLeft:"auto", marginRight:"auto" }}>
        {selectedClient && <ClientDetail token={token} clientId={selectedClient} />}
      </div>
    </div>
  );
}

export default Dashboard;
