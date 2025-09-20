import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {token ? (
        <Dashboard token={token} />
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}

export default App;
