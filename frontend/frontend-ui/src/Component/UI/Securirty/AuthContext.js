import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosConfig";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("user_id");

    if (token && role && id) {
      setUserRole(role);
      setUserId(id);
      setAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
    }
  }, []);

  async function login(user_id, password) {
    try {
      const response = await api.post("/auth/login", { user_id, password });
      const { token, role, user_id: loggedInId } = response.data;

      if (!token || !role || !loggedInId) {
        return { success: false, message: "The server returned an incomplete login response." };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", loggedInId);
      setUserRole(role);
      setUserId(loggedInId);
      setAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Unable to sign in. Please try again."
      };
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  }

  const isDoctor = userRole?.toLowerCase() === "doctor";
  const user = useMemo(
    () => (userId ? { user_id: userId, role: userRole } : null),
    [userId, userRole]
  );

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    signOut,
    userRole,
    userId,
    user,
    doctor: isDoctor,
    isDoctor
  }), [isAuthenticated, userRole, userId, user, isDoctor]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
