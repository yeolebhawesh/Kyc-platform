import React, { useState } from "react";
import { login, verifyMfa } from "../api/auth";
import "../styles/Login.css";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [adminId, setAdminId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(username, password);
      setAdminId(data.adminId);
      setStep(2); // show MFA step
    } catch (err) {
      setError(err.msg || "Login failed");
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await verifyMfa(adminId, mfaCode);
      setToken(data.token);
    } catch (err) {
      setError(err.msg || "MFA failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
                
              </button>
            </div>

            <button type="submit">Next</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyMfa}>
            <input
              type="text"
              placeholder="MFA Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              required
            />
            <button type="submit">Verify MFA</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
