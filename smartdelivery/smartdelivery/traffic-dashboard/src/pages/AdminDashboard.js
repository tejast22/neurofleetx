import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OrderMap from "../components/OrderMap";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({ totalDrivers: 0, totalOrders: 0, deliveredToday: 0 });
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // AI Reports State
  const [driverReports, setDriverReports] = useState({});
  const [loadingReport, setLoadingReport] = useState("");

  // Map & Selection State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  
  // 🔥 NEW: State for Real-Time Live Location
  const [liveLocation, setLiveLocation] = useState(null);

  const [newOrder, setNewOrder] = useState({
    customer: "", location: "", destLat: "", destLng: ""
  });

  // --- FETCH DATA (Initial Load) ---
  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, driversRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/stats"),
        fetch("http://localhost:5000/api/admin/orders"),
        fetch("http://localhost:5000/api/admin/drivers")
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());

    } catch (error) { console.error("Network Error:", error); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HELPERS ---
  
  // ✅ FIX: Wrapped in useCallback to prevent ESLint Warning
  const getDriverEmail = useCallback((driverNameOrEmail) => {
    const driver = drivers.find(d => d.name === driverNameOrEmail || d.email === driverNameOrEmail);
    return driver ? driver.email : driverNameOrEmail;
  }, [drivers]); // Dependencies: Re-create only if drivers list changes

  // --- 🔥 LIVE TRACKING EFFECT ---
  // This runs ONLY when a map is open. It polls the server every 5 seconds.
  useEffect(() => {
    let intervalId;

    if (selectedOrder) {
      const email = getDriverEmail(selectedOrder.driver);

      const fetchLiveLocation = async () => {
        try {
          // Call the NEW backend endpoint
          const res = await fetch(`http://localhost:5000/api/admin/driver-location?email=${email}`);
          if (res.ok) {
            const data = await res.json();
            // Only update if we got valid coordinates
            if (data.lat && data.lng) {
              console.log("📍 Live Update:", data);
              setLiveLocation({ lat: data.lat, lng: data.lng });
            }
          }
        } catch (error) {
          console.error("Error fetching live location", error);
        }
      };

      // 1. Fetch immediately
      fetchLiveLocation();

      // 2. Fetch every 5 seconds
      intervalId = setInterval(fetchLiveLocation, 5000);
    }

    // Cleanup: Stop timer when map closes
    return () => clearInterval(intervalId);
  }, [selectedOrder, getDriverEmail]); // ✅ Added getDriverEmail to dependencies

  // --- ACTIONS ---

  const handleViewMap = (order) => {
    // Reset previous live location to avoid jumping
    setLiveLocation(null); 
    setSelectedOrder(order);
  };

  const handleCreateOrder = async () => {
    if (!newOrder.customer || !newOrder.location) return alert("Fill all fields");
    const orderData = { ...newOrder, destLat: newOrder.destLat || 23.0300, destLng: newOrder.destLng || 72.5800 };

    await fetch("http://localhost:5000/api/admin/orders/create", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData)
    });
    alert("✅ New Order Created!");
    setNewOrder({ customer: "", location: "", destLat: "", destLng: "" });
    fetchData();
  };

  const handleAssignDriver = async (orderId) => {
    if (!selectedDriver) return alert("Please select a driver first!");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/assign?orderId=${orderId}&driverName=${selectedDriver}`, { method: "POST" });
      if (res.ok) { alert(`✅ Driver assigned successfully!`); fetchData(); setSelectedDriver(""); }
      else { alert("Failed to assign driver."); }
    } catch (error) { console.error("Assign Error:", error); }
  };

  const generateAIReport = async (driverEmail) => {
    setLoadingReport(driverEmail);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/driver-report?email=${driverEmail}`);
      if (!res.ok) throw new Error("Server Error");
      const data = await res.json();
      setDriverReports(prev => ({ ...prev, [driverEmail]: data.report }));
    } catch (e) { alert("Failed to generate report"); }
    finally { setLoadingReport(""); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); alert("Logged Out"); navigate("/"); };

  // --- FILTER: Show only Active Orders (Hide Delivered) ---
  const activeOrders = orders.filter(o => o.status !== "Delivered");

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f4f6f9", fontFamily: "Arial, sans-serif" }}>

      {/* --- HEADER --- */}
      <div style={{ background: "#2c3e50", color: "white", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
        <h2 style={{ margin: 0 }}>🚗 TrackMile Admin</h2>
        <div>
          <button onClick={() => navigate("/history")} style={{ background: "#34495e", color: "white", border: "1px solid #555", padding: "10px 20px", marginRight: "10px", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>📜 Order History</button>
          <button onClick={() => navigate("/analytics")} style={{ background: "#8e44ad", color: "white", border: "none", padding: "10px 20px", marginRight: "10px", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>📊 Analytics</button>
          <button onClick={handleLogout} style={{ background: "#c62828", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* --- STATS CARDS --- */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>Total Drivers</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#2c3e50" }}>{stats.totalDrivers}</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", flex: 1, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#7f8c8d" }}>Active Orders</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#2980b9" }}>{activeOrders.length}</p>
          </div>
          <div style={{ background: "#d4edda", padding: "20px", borderRadius: "10px", flex: 1, boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#155724" }}>Delivered Today</h3>
            <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#155724" }}>{stats.deliveredToday}</p>
          </div>
        </div>

        {/* --- CREATE ORDER --- */}
        <div style={{ background: "white", padding: "25px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0 }}>➕ Create New Order</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input placeholder="Customer Name" value={newOrder.customer} onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })} style={{ padding: "12px", flex: 2, borderRadius: "5px", border: "1px solid #ddd" }} />
            <input placeholder="Address" value={newOrder.location} onChange={e => setNewOrder({ ...newOrder, location: e.target.value })} style={{ padding: "12px", flex: 3, borderRadius: "5px", border: "1px solid #ddd" }} />
            <input placeholder="Lat" type="number" value={newOrder.destLat} onChange={e => setNewOrder({ ...newOrder, destLat: e.target.value })} style={{ padding: "12px", flex: 1, borderRadius: "5px", border: "1px solid #ddd" }} />
            <input placeholder="Lng" type="number" value={newOrder.destLng} onChange={e => setNewOrder({ ...newOrder, destLng: e.target.value })} style={{ padding: "12px", flex: 1, borderRadius: "5px", border: "1px solid #ddd" }} />
            <button onClick={handleCreateOrder} style={{ background: "#2980b9", color: "white", border: "none", padding: "12px 25px", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>Create</button>
          </div>
        </div>

        {/* --- MAP SECTION --- */}
        {selectedOrder && (
          <div style={{ marginBottom: "30px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <div>
                <h3 style={{ margin: 0 }}>🗺️ Tracking Order #{selectedOrder.id.substring(0, 8)}</h3>
                <p style={{ margin: "5px 0", color: "#7f8c8d" }}>
                  Driver: <strong>{getDriverEmail(selectedOrder.driver)}</strong> ➡️ Customer: <strong>{selectedOrder.customer}</strong>
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ cursor: "pointer", background: "#e74c3c", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px" }}>Close Map</button>
            </div>
            {/* 🔥 Pass LIVE location. If null (loading), use default */}
            <OrderMap 
                start={liveLocation || { lat: 23.0225, lng: 72.5714 }} 
                end={{ lat: selectedOrder.destLat, lng: selectedOrder.destLng }} 
                popupText={`Delivering to: ${selectedOrder.customer}`} 
            />
          </div>
        )}

        {/* --- ACTIVE ORDERS TABLE --- */}
        <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
          <h3 style={{ marginTop: 0 }}>📋 Pending & Active Deliveries</h3>
          <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ecf0f1", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Customer</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Assigned Driver</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.length === 0 ? <tr><td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>No active orders.</td></tr> :
                activeOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{o.id.substring(0, 6)}...</td>
                    <td style={{ padding: "12px" }}><strong>{o.customer}</strong><br /><small style={{ color: "#7f8c8d" }}>{o.location}</small></td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", background: o.status === "Assigned" ? "#fff3cd" : "#f8d7da", color: o.status === "Assigned" ? "#856404" : "#721c24" }}>{o.status}</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {o.driver !== "Unassigned" ? (<span style={{ fontWeight: "bold", color: "#2980b9" }}>👤 {o.driver}</span>) : (
                        <select onChange={(e) => setSelectedDriver(e.target.value)} style={{ padding: "8px", borderRadius: "4px", borderColor: "#ddd", width: "100%" }}>
                          <option value="">Select Driver...</option>
                          {drivers.map(d => (<option key={d.id} value={d.email || d.name}>{d.name} {d.email ? `(${d.email})` : ""}</option>))}
                        </select>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {o.driver !== "Unassigned" ? (
                        <button onClick={() => handleViewMap(o)} style={{ background: "#3498db", color: "white", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "4px" }}>View Map</button>
                      ) : (
                        <button onClick={() => handleAssignDriver(o.id)} style={{ background: "#f39c12", color: "white", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "4px" }}>Assign</button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* --- DRIVER LIST & AI REPORTS --- */}
        <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0 }}>👨‍✈️ Driver Fleet & Performance</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Driver Name</th>
                <th style={{ padding: "10px" }}>Email</th>
                <th style={{ padding: "10px" }}>Vehicle</th>
                <th style={{ padding: "10px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => {
                const driverId = d.email || d.name;
                return (
                  <React.Fragment key={d.id}>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{d.name}</td>
                      <td style={{ padding: "10px", color: "#555" }}>{d.email}</td>
                      <td style={{ padding: "10px" }}>{d.vehicle}</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => generateAIReport(driverId)}
                          disabled={loadingReport === driverId}
                          style={{ background: loadingReport === driverId ? "#ccc" : "linear-gradient(45deg, #6a11cb, #2575fc)", color: "white", border: "none", padding: "8px 15px", cursor: "pointer", borderRadius: "20px", fontWeight: "bold" }}
                        >
                          {loadingReport === driverId ? "⏳ Generating..." : "✨ AI Review"}
                        </button>
                      </td>
                    </tr>
                    {driverReports[driverId] && (
                      <tr style={{ background: "#fdf8ff" }}>
                        <td colSpan="4" style={{ padding: "15px 20px" }}>
                          <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
                            <span style={{ fontSize: "20px" }}>🤖</span>
                            <div>
                              <strong style={{ color: "#6a11cb" }}>Llama 3 Performance Analysis:</strong>
                              <p style={{ margin: "5px 0", color: "#444", fontStyle: "italic", lineHeight: "1.5" }}>"{driverReports[driverId]}"</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}