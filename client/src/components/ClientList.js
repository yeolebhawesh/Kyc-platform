import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token"); // stored at login
        const res = await axios.get("http://localhost:5000/clients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClients(res.data);
      } catch (err) {
        console.error("❌ Error fetching clients:", err);
      }
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {clients.map((c) => (
          <li key={c._id}>
            {c.fullName} — {c.businessName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
