import React from "react";
import { useNavigate } from "react-router-dom"; // Import Navigation Hook

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // 1. Clear any stored user data (if you use localStorage)
      localStorage.removeItem("user"); 
      // 2. Redirect to Login Page
      navigate("/login");
    }
  };

  // --- SWITCH ROLE FUNCTION ---
  const handleSwitchToDriver = () => {
    navigate("/delivery"); // Go to Delivery Dashboard
  };

  const menuItems = [
    { id: "orders", label: "Dashboard / Orders", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "drivers", label: "Drivers", icon: "🚗" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    // Add other tabs here as needed...
  ];

  return (
    <div style={{ width: "240px", background: "#222d32", color: "#b8c7ce", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      
      {/* BRANDING */}
      <div style={{ padding: "20px", background: "#1a2226", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #444" }}>
        <div style={{ fontSize: "22px", color: "#e91e63" }}>📍</div>
        <div style={{ fontWeight: "bold", fontSize: "16px", color: "white", letterSpacing: "1px" }}>TRACKOMILE</div>
      </div>

      {/* MENU */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", flex: 1 }}>
        {menuItems.map((item) => (
          <li 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{ 
              padding: "15px 20px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center",
              gap: "15px",
              background: activeTab === item.id ? "#5c6bc0" : "transparent",
              color: activeTab === item.id ? "white" : "#b8c7ce",
              borderLeft: activeTab === item.id ? "4px solid white" : "4px solid transparent",
              transition: "0.2s"
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* --- BOTTOM SECTION: SWITCH & LOGOUT --- */}
      <div style={{ padding: "20px", borderTop: "1px solid #444", background: "#1a2226" }}>
        <p style={{ fontSize: "12px", color: "#6c7b88", marginBottom: "10px", textTransform: "uppercase" }}>Switch View</p>
        
        {/* Switch to Driver Button */}
        <button 
          onClick={handleSwitchToDriver}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px", 
            background: "#00c0ef", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer", 
            fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          <span>🚚</span> Driver Mode
        </button>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          style={{ 
            width: "100%", 
            padding: "10px", 
            background: "#dd4b39", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer", 
            fontWeight: "bold",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;