import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // We will create this style file next

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN"); // Default tab
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.status === "success") {
        // Check if user is logging into the correct role
        if (data.role !== role) {
          alert(`You are registered as a ${data.role}, please switch tabs!`);
          return;
        }
        
        // Save user info locally
        localStorage.setItem("user", JSON.stringify(data));
        
        if (data.role === "ADMIN") navigate("/admin");
        else navigate("/driver");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login Failed. Is backend running?");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🚗 SmartDelivery Login</h2>
        
        {/* ROLE TABS */}
        <div className="role-tabs">
          <button className={role === "ADMIN" ? "active" : ""} onClick={() => setRole("ADMIN")}>Admin</button>
          <button className={role === "DRIVER" ? "active" : ""} onClick={() => setRole("DRIVER")}>Driver</button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="login-btn">Login as {role}</button>
        </form>

        <div className="auth-links">
          <span onClick={() => alert("Simulated: Check your email for reset link!")}>Forgot Password?</span>
          <span onClick={() => navigate("/register")}>Create New Account</span>
        </div>
      </div>
    </div>
  );
}