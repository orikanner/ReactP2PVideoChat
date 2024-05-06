import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthBox from './components/AuthBox';  // This handles both SignIn and SignUp
import VideoCall from './components/VideoCall'; 

function App() {
  const { currentUser, logout } = useAuth();
  

  const renderHeader = () => {
    return (
      <header style={{ padding: "10px", borderBottom: "1px solid black", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 25,backgroundColor:"#29335C" }}>
        <h1 style={{ fontSize: 35, fontWeight: "bold",color:"#fff" }}>Hello {currentUser.name}</h1>
        <h2 style={{ fontSize: 30, fontWeight: "bold",color:"#fff" }}>Online Vet Center</h2>
        <nav>
          <ul style={{ listStyleType: "none", padding: 0, display: "flex", alignItems: "center" }}>
            <li style={{ marginRight: "10px", borderWidth: 2, borderRadius: 20, padding: 15, borderColor: "#fff", }}>
              <button style={{color:"#fff",fontSize:20}} onClick={logout}>Sign Out</button>
            </li>
          </ul>
        </nav>
      </header>
    );
  };

  return (
    <Router>
      {currentUser ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderHeader()}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Routes>
              <Route path="/dashboard/videocall" element={<VideoCall />} />
              <Route path="*" element={<Navigate to="/dashboard/videocall" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/authbox" element={<AuthBox />} />
          <Route path="*" element={<Navigate to="/authbox" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;



