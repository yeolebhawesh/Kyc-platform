// client/src/api/auth.js
import axios from "axios";

export const login = async (username, password) => {
  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      username,
      password,
    });
    return res.data; // { msg, adminId }
  } catch (err) {
    throw err.response?.data || { msg: "Server error" };
  }
};

export const verifyMfa = async (adminId, mfaCode) => {
  try {
    const res = await axios.post("http://localhost:5000/auth/verify-mfa", {
      adminId,
      token: mfaCode, // 👈 backend expects "token"
    });
    return res.data; // { msg, token }
  } catch (err) {
    throw err.response?.data || { msg: "Server error" };
  }
};
