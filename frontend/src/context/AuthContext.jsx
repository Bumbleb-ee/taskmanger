import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/auth/me");
          setUser({ ...res.data, token });
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return null; // Don't render until we check auth

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};