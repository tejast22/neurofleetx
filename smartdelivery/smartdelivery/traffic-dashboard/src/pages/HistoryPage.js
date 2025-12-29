import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, driversRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/orders"),
                    fetch("http://localhost:5000/api/admin/drivers")
                ]);
                if (ordersRes.ok) setOrders(await ordersRes.json());
                if (driversRes.ok) setDrivers(await driversRes.json());
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    // 1. Get ONLY Delivered Orders
    const historyOrders = orders.filter(o => o.status === "Delivered");

    // 2. Apply Driver Filter if selected
    const displayedOrders = selectedDriver 
        ? historyOrders.filter(o => o.driver === selectedDriver)
        : historyOrders;

    // Calculate Total Revenue for the filtered list
    const totalRevenue = displayedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

    return (
        <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ margin: 0, color: "#2c3e50" }}>📜 Order History</h1>
                    <p style={{ color: "#7f8c8d" }}>Archive of all completed deliveries</p>
                </div>
                <button onClick={() => navigate("/admin")} style={{ padding: "10px 20px", background: "#34495e", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>⬅ Back to Admin</button>
            </div>

            {/* CONTROLS */}
            <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ flex: 1, marginRight: "20px" }}>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Filter by Driver:</label>
                    <select 
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                        <option value="">Show All Drivers</option>
                        {drivers.map(d => (
                            <option key={d.id} value={d.email}>{d.name} ({d.email})</option>
                        ))}
                    </select>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "14px", color: "#7f8c8d" }}>Total Earned (Filtered):</span>
                    <h2 style={{ margin: 0, color: "#27ae60" }}>₹ {totalRevenue.toLocaleString()}</h2>
                </div>
            </div>

            {/* TABLE */}
            <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#ecf0f1", textAlign: "left" }}>
                            <th style={{ padding: "15px" }}>Order ID</th>
                            <th style={{ padding: "15px" }}>Customer</th>
                            <th style={{ padding: "15px" }}>Driver</th>
                            <th style={{ padding: "15px" }}>Date</th>
                            <th style={{ padding: "15px" }}>Amount</th>
                            <th style={{ padding: "15px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#888" }}>No records found.</td></tr>
                        ) : (
                            displayedOrders.map(order => (
                                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "15px", fontWeight: "bold" }}>#{order.id.substring(0, 6)}</td>
                                    <td style={{ padding: "15px" }}>
                                        {order.customer}<br/>
                                        <small style={{color:"#888"}}>{order.location}</small>
                                    </td>
                                    <td style={{ padding: "15px", color: "#2980b9" }}>{order.driver}</td>
                                    <td style={{ padding: "15px" }}>{order.orderDate || "N/A"}</td>
                                    <td style={{ padding: "15px", fontWeight: "bold", color: "#27ae60" }}>₹ {order.price}</td>
                                    <td style={{ padding: "15px" }}>
                                        <span style={{ background: "#d4edda", color: "#155724", padding: "5px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
                                            DELIVERED
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}