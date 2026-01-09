import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  // Existing State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN"); 
  const navigate = useNavigate();

  // ✅ NEW STATE: For Forgot Password Flow
  const [mode, setMode] = useState("LOGIN"); // Options: LOGIN, REQUEST_KEY, RESET_PASSWORD
  const [resetKey, setResetKey] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ----------------------------------------------------
  // 1. EXISTING LOGIN LOGIC
  // ----------------------------------------------------
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
        if (data.role !== role) {
          alert(`You are registered as a ${data.role}, please switch tabs!`);
          return;
        }
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

  // ----------------------------------------------------
  // 2. NEW: REQUEST KEY (Step 1)
  // ----------------------------------------------------
  const handleRequestKey = async () => {
    if (!email) return alert("Please enter your email address first.");

    try {
      // Calls the new backend function we added to AuthController
      const res = await fetch(`http://localhost:5000/api/auth/forgot-password?email=${email}`, { method: "POST" });
      
      if (res.ok) {
        alert("✅ Reset Key generated! Check your Backend Console (IntelliJ/Eclipse).");
        setMode("RESET_PASSWORD"); // Switch UI to Step 2
      } else {
        alert("❌ Email not found in database.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  // ----------------------------------------------------
  // 3. NEW: RESET PASSWORD (Step 2)
  // ----------------------------------------------------
  const handleResetPassword = async () => {
    if (!resetKey || !newPassword) return alert("Please fill all fields.");

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, key: resetKey, newPassword })
      });

      if (res.ok) {
        alert("✅ Password Updated Successfully! Please Login.");
        setMode("LOGIN"); // Switch back to Login
        setPassword("");  // Clear field
      } else {
        alert("❌ Invalid Key! Please check the console and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        
        {/* ========================================= */}
        {/* VIEW 1: NORMAL LOGIN (Your Old Code)      */}
        {/* ========================================= */}
        {mode === "LOGIN" && (
          <>
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
              {/* ✅ CHANGED: Switch mode instead of alert */}
              <span onClick={() => setMode("REQUEST_KEY")} style={{ cursor: "pointer", color: "blue" }}>
                Forgot Password?
              </span>
              <span onClick={() => navigate("/register")}>Create New Account</span>
            </div>
          </>
        )}

        {/* ========================================= */}
        {/* VIEW 2: REQUEST KEY (Forgot Password)     */}
        {/* ========================================= */}
        {mode === "REQUEST_KEY" && (
          <>
            <h2>🔑 Recover Password</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Enter your email. We will generate a secure key in the <b>Server Console</b>.
            </p>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>

            <button onClick={handleRequestKey} className="login-btn" style={{ backgroundColor: "#e67e22" }}>
              Generate Key
            </button>
            
            <div className="auth-links" style={{ justifyContent: "center", marginTop: "15px" }}>
              <span onClick={() => setMode("LOGIN")}>Back to Login</span>
            </div>
          </>
        )}

        {/* ========================================= */}
        {/* VIEW 3: RESET PASSWORD (Enter Key)        */}
        {/* ========================================= */}
        {mode === "RESET_PASSWORD" && (
          <>
            <h2>🔐 Set New Password</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Check your backend terminal for the Key.
            </p>

            <div className="input-group">
              <label>Reset Key</label>
              <input type="text" placeholder="e.g. A1B2C3" value={resetKey} onChange={e => setResetKey(e.target.value)} />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>

            <button onClick={handleResetPassword} className="login-btn" style={{ backgroundColor: "#27ae60" }}>
              Update Password
            </button>

            <div className="auth-links" style={{ justifyContent: "center", marginTop: "15px" }}>
              <span onClick={() => setMode("LOGIN")}>Cancel</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}