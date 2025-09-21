import axios from "axios";

const BASE_URL = "https://kyc-platform-iu5ehl5v9-bhawesh-yeoles-projects.vercel.app/"; // <-- updated URL

export const login = async (username, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
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
    const res = await axios.post(`${BASE_URL}/verify-mfa`, {
      adminId,
      token: mfaCode, // 👈 backend expects "token"
    });
    return res.data; // { msg, token }
  } catch (err) {
    throw err.response?.data || { msg: "Server error" };
  }
};
