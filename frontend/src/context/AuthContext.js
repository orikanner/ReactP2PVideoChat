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

  async function login(email, password) {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signin",
        { email, password }
      );
      setCurrentUser(response.data);
      setCurrentUserToken(response.data.token);
      sessionStorage.setItem("token", response.data.token); // Assuming the server responds with a token
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      window.location.reload();
      return response.data;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      throw error; 
    }
  }

  function logout() {
    setCurrentUser(null);
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    window.location.reload();
  }

  async function register(emailParam, password, nameParam, isVetParam) {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        { email:emailParam, password, name:nameParam, isVet:isVetParam }
      );
  
      // Assuming the response.data.data contains the user details and token
      const { userId, name, email, isVet, token } = response.data  
      // Create a user object that includes the necessary details
      const user = {
        id: userId,
        name: name,
        email: email,
        isVet: isVet
      };
      setCurrentUser(user); // Set the current user with the user object
      setCurrentUserToken(token); // Set the current user's token
      sessionStorage.setItem("token", token); // Store the token in sessionStorage
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set the authorization header for subsequent requests
      window.location.reload();
      return response.data; // Return the full response data for further processing if needed
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      throw error; // Re-throw the error for handling in UI components
    }
  }
  

  async function loadUserFromToken() {
    const token = sessionStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get("http://localhost:8080/api/users/me");
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
  }

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
