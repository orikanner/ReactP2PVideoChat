import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserToken, setCurrentUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  const handleAuthSuccess = (data) => {
    const { token, userId, name, email, isVet } = data;
    const user = { id: userId, name, email, isVet };

    setCurrentUser(user);
    setCurrentUserToken(token);
    sessionStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    window.location.reload();
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/signin", { email, password });
      handleAuthSuccess(response.data);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    window.location.reload();
  };

  const register = async (email, password, name, isVet) => {
    try {
      const response = await api.post("/users/signup", { email, password, name, isVet });
      handleAuthSuccess(response.data);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const loadUserFromToken = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await api.get("/users/me");
        setCurrentUserToken(response.data.token);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Failed to load user from token:", error);
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const value = {
    currentUser,
    currentUserToken,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
