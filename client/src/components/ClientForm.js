import React, { useState } from "react";
import { addClient } from "../services/api";

export default function ClientForm({ onAdded }) {
  const [client, setClient] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    address: "",
    businessName: "",
    gstNumber: "",
    panNumber: "",
  });

  const handleChange = (e) => setClient({ ...client, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addClient(client);
      onAdded(data);
      setClient({
        fullName: "",
        contactNumber: "",
        email: "",
        address: "",
        businessName: "",
        gstNumber: "",
        panNumber: "",
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add client");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Client</h3>
      {Object.keys(client).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={client[key]}
          onChange={handleChange}
        />
      ))}
      <button type="submit">Add</button>
    </form>
  );
}
