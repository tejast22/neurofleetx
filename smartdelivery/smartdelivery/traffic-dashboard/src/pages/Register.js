import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "DRIVER", vehicle: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.status === "success") {
        alert("Registration Successful! Please Login.");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>📝 Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="DRIVER">Driver</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="******" onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          {formData.role === "DRIVER" && (
            <div className="input-group">
              <label>Vehicle Type</label>
              <input type="text" placeholder="Tata Ace, Bike, etc." onChange={e => setFormData({...formData, vehicle: e.target.value})} required />
            </div>
          )}

          <button type="submit" className="login-btn">Register</button>
        </form>
        <p style={{textAlign:"center", marginTop:"15px", cursor:"pointer", color:"#3498db"}} onClick={() => navigate("/")}>Already have an account? Login</p>
      </div>
    </div>
  );
}