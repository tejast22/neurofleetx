import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

export default function AnalyticsPage() {
    const navigate = useNavigate();
    
    const [analytics, setAnalytics] = useState({ weekly: 0, monthly: 0, pending: 0, revenue: 0 });
    const [stats, setStats] = useState({ totalDrivers: 0, totalOrders: 0, deliveredToday: 0 });
    
    const [drivers, setDrivers] = useState([]); 
    const [selectedDriver, setSelectedDriver] = useState(""); 
    const [driverStats, setDriverStats] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, analyticsRes, driversRes] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/stats"),
                    fetch("http://localhost:5000/api/admin/analytics"),
                    fetch("http://localhost:5000/api/admin/drivers")
                ]);
                
                if (statsRes.ok) setStats(await statsRes.json());
                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
                if (driversRes.ok) setDrivers(await driversRes.json());
            } catch (e) { console.error(e); }
        };
        fetchData();
    }, []);

    const fetchDriverStats = async (email) => {
        setSelectedDriver(email); 
        if(!email) { setDriverStats(null); return; }
        
        try {
            const res = await fetch(`http://localhost:5000/api/admin/analytics/driver?email=${email}`);
            if(res.ok) setDriverStats(await res.json());
        } catch(e) { console.error(e); }
    };

    // Chart Data
    const performanceData = [
        { name: 'Today', orders: stats.deliveredToday },
        { name: 'This Week', orders: analytics.weekly },
        { name: 'This Month', orders: analytics.monthly },
    ];

    const pendingCount = analytics.pending || 0;
    const completedCount = (stats.totalOrders || 0) - pendingCount;
    const statusData = [
        { name: 'Completed', value: completedCount > 0 ? completedCount : 1 },
        { name: 'Pending', value: pendingCount },
    ];
    const COLORS = ['#00C49F', '#FFBB28'];

    return (
        <div style={{ background: "#f8f9fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "40px" }}>
            
            {/* HEADER */}
            <div style={{ background: "#1a252f", color: "white", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ margin: 0, fontSize: "24px" }}>📊 Enterprise Analytics</h1>
                <button onClick={() => navigate("/admin")} style={{ padding: "10px 25px", background: "#3498db", color: "white", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" }}>⬅ Dashboard</button>
            </div>

            <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
                
                {/* KPI Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                    <KPICard title="Total Revenue" value={`₹ ${analytics.revenue.toLocaleString()}`} icon="💰" color="#2ecc71" />
                    <KPICard title="Total Orders" value={stats.totalOrders} icon="📦" color="#3498db" />
                    <KPICard title="Active Fleet" value={stats.totalDrivers} icon="🚚" color="#e67e22" />
                    <KPICard title="Pending Jobs" value={analytics.pending} icon="⏳" color="#f1c40f" />
                </div>

                {/* Driver Analysis */}
                <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginTop: 0 }}>👤 Individual Driver Performance</h3>
                    
                    <select 
                        value={selectedDriver} 
                        onChange={(e) => fetchDriverStats(e.target.value)}
                        style={{ padding: "12px", width: "100%", fontSize: "16px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "20px" }}
                    >
                        <option value="">-- Select a Driver to Analyze --</option>
                        {drivers.map(d => (
                            <option key={d.id} value={d.email}>{d.name} ({d.email})</option>
                        ))}
                    </select>

                    {driverStats ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                            <StatsBox color="#2e7d32" bg="#e8f5e9" title="✅ Completed" value={driverStats.completed} />
                            <StatsBox color="#856404" bg="#fff3cd" title="💰 Earned" value={`₹ ${driverStats.revenue}`} />
                            <StatsBox color="#1565c0" bg="#e3f2fd" title="⏳ Pending" value={driverStats.pending} />
                        </div>
                    ) : (
                        <p style={{ textAlign: "center", color: "#888" }}>Select a driver above to see their specific statistics.</p>
                    )}
                </div>

                {/* Charts Section */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", marginTop: "40px" }}>
                    <ChartBox title="📈 Volume Trends">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#3498db" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartBox>
                    <ChartBox title="🍩 Status">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartBox>
                </div>
            </div>
        </div>
    );
}

// Helpers
const KPICard = ({ title, value, icon, color }) => (
    <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><p style={{ margin: "0 0 5px 0", color: "#7f8c8d", fontSize: "14px", fontWeight: "bold" }}>{title}</p><h2 style={{ margin: 0, fontSize: "32px", color: "#2c3e50" }}>{value}</h2></div>
        <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{icon}</div>
    </div>
);

const StatsBox = ({ color, bg, title, value }) => (
    <div style={{ background: bg, padding: "20px", borderRadius: "10px", textAlign: "center", border: `1px solid ${color}50` }}>
        <h3 style={{margin:0, color}}>{title}</h3><h1 style={{margin:"10px 0", color}}>{value}</h1>
    </div>
);

const ChartBox = ({ title, children }) => (
    <div style={{ background: "white", padding: "25px", borderRadius: "15px", height: "350px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
        <h3>{title}</h3>{children}
    </div>
);