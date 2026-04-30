import { createContext, useContext, useState, useEffect } from "react";
import api from "../../../api/axiosConfig";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Only fetch non-sensitive data
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("user_id");

    if (token) {
      setAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  async function login(user_id, password) {
    try {
      // Uses Axios, so base URL is automatically appended
      const response = await api.post("/auth/login", { user_id, password });

      const { token, role, user_id: loggedInId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", loggedInId);

      setAuthenticated(true);
      setUserRole(role);
      setUserId(loggedInId);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Login failed"
      };
    }
  }

  function signOut() {
    localStorage.clear();
    setAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signOut, userRole, userId, isDoctor: userRole === 'Doctor' }}>
      {children}
    </AuthContext.Provider>
  );
}
