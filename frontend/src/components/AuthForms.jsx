import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function SignUpForm({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isVet, setIsVet] = useState(false); // State for vet status
 
  const { register } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await register(email, password, name,isVet);
      console.log("Registered successfully:", response);
      
    } catch (error) {
      console.error("Error registering:", error);
      
    }
  };
  return (
    <div>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Name"
          style={{ borderWidth: 5, borderRadius: 10, padding: 5 }}
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          style={{ borderWidth: 5, borderRadius: 10, padding: 5 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          style={{ borderWidth: 5, borderRadius: 10, padding: 5 }}
        />
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              value="vet"
              checked={isVet}
              onChange={() => setIsVet(true)}
            />
            Vet
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              value="not-vet"
              checked={!isVet}
              onChange={() => setIsVet(false)}
            />
            Not a Vet
          </label>
        </div>
        <button
          style={{ borderWidth: 3, borderRadius: 10, padding: 5, fontSize: 20 }}
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <button onClick={onToggle}>Already have an account? Sign In</button>
    </div>
  );
}

export function SignInForm({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password);
      console.log("login successfully:", response);
      
    } catch (error) {
      console.error("Error login:", error);
      
    }
  };
  return (
    <div>
      <h2>Sign In</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <input
          // type="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          style={{ borderWidth: 5, borderRadius: 10, padding: 5 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          style={{ borderWidth: 5, borderRadius: 10, padding: 5 }}
        />
        <button
          style={{ borderWidth: 3, borderRadius: 10, padding: 5, fontSize: 20 }}
          type="submit"
        >
          Sign In
        </button>
      </form>
      <button onClick={onToggle}>Don't have an account? Sign Up</button>
    </div>
  );
}
