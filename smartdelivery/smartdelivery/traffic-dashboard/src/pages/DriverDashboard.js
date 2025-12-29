import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// ✅ Keep importing this, but we will use it differently to avoid crashes
import "leaflet-routing-machine"; 
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// ------------------------------------------
// 🗺️ NAVIGATION COMPONENT (Safe Road-Route Version)
// ------------------------------------------
const NavigationMap = ({ startLat, startLng, destLat, destLng, onRouteFound, progressStep }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const routeLayerRef = useRef(null); // Stores the Blue Line
    const isMounted = useRef(true);

    // 1. INITIALIZE MAP (Runs Once)
    useEffect(() => {
        isMounted.current = true;
        if (!mapContainerRef.current) return;

        // Create Map
        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([startLat, startLng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            mapInstanceRef.current = map;
        }

        // Cleanup
        return () => {
            isMounted.current = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // 2. FETCH & DRAW ROAD ROUTE (Manual Safe Mode)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // A. Define Points
        let currentStartLat = startLat;
        let currentStartLng = startLng;

        if (progressStep === 1) {
            currentStartLat = (startLat + destLat) / 2;
            currentStartLng = (startLng + destLng) / 2;
        } else if (progressStep === 2) {
            currentStartLat = destLat - 0.002;
            currentStartLng = destLng - 0.002;
        }

        const startPoint = L.latLng(currentStartLat, currentStartLng);
        const endPoint = L.latLng(destLat, destLng);

        // B. Clear Previous Route Line
        if (routeLayerRef.current) {
            map.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
        }

        // C. Draw Markers
        // We remove old markers by clearing layers, or simple map recreation approach. 
        // For stability, let's just redraw markers here.
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        L.marker(startPoint, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color:#2ecc71; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px black;"></div>`
            })
        }).addTo(map);

        L.marker(endPoint, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color:#e74c3c; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px black;"></div>`
            })
        }).addTo(map);


        // D. Calculate Route using OSRM Service Directly (No Control)
        // This prevents the "removeLayer" crash because we control the drawing.
        const router = L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        });

        router.route([
            L.Routing.waypoint(startPoint),
            L.Routing.waypoint(endPoint)
        ], (err, routes) => {
            // 🛑 Safety Check: If component unmounted while loading, STOP.
            if (!isMounted.current || !map) return;

            if (routes && routes[0]) {
                const route = routes[0];
                
                // 1. Draw the Road Line Manually
                const line = L.polyline(route.coordinates, {
                    color: '#007bff',
                    weight: 6,
                    opacity: 0.8
                }).addTo(map);
                
                routeLayerRef.current = line;
                map.fitBounds(line.getBounds(), { padding: [50, 50] });

                // 2. Send Stats
                if (onRouteFound) {
                    onRouteFound({
                        dist: (route.summary.totalDistance / 1000).toFixed(1),
                        time: Math.round(route.summary.totalTime / 60)
                    });
                }
            }
        });

    }, [startLat, startLng, destLat, destLng, progressStep, onRouteFound]); 

    return (
        <div style={{ display: "flex", gap: "20px", height: "450px" }}>
            <div ref={mapContainerRef} style={{ flex: 2, borderRadius: "10px", border: "1px solid #ddd" }} />
            <div style={{ flex: 1, background: "white", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", overflowY: "auto" }}>
                <h3 style={{marginTop:0}}>📍 Live Navigation</h3>
                <p>Status: <strong>{progressStep === 0 ? "Starting Route" : `Checkpoint ${progressStep} Reached`}</strong></p>
                <p style={{fontSize:"13px", color:"#7f8c8d"}}>
                    Calculating optimal road path...
                </p>
            </div>
        </div>
    );
};

// ------------------------------------------
// 🚛 MAIN DRIVER DASHBOARD
// ------------------------------------------
export default function DriverDashboard() {
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    
    // Navigation State
    const [checkpoints, setCheckpoints] = useState({ cp1: false, cp2: false });
    const [progressStep, setProgressStep] = useState(0); 
    const [routeStats, setRouteStats] = useState({ dist: 0, time: 0 });

    // 🚦 Traffic & Speed Simulation State
    const [speed, setSpeed] = useState(0);
    const [trafficStatus, setTrafficStatus] = useState({ status: "Clear", color: "#2ecc71", delay: 0 });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return navigate("/");
        setDriver(JSON.parse(storedUser));
        fetchOrders(JSON.parse(storedUser).email || JSON.parse(storedUser).name); 

        // 🏎️ SIMULATION LOOP
        const simulationInterval = setInterval(() => {
            setSpeed(Math.floor(Math.random() * (60 - 20 + 1)) + 20);
            if (Math.random() > 0.9) {
                const rand = Math.random();
                if (rand < 0.33) setTrafficStatus({ status: "Clear 🟢", color: "#2ecc71", delay: 0 });
                else if (rand < 0.66) setTrafficStatus({ status: "Moderate 🟠", color: "#f39c12", delay: 5 });
                else setTrafficStatus({ status: "Heavy 🔴", color: "#e74c3c", delay: 15 });
            }
        }, 3000); 

        return () => clearInterval(simulationInterval);
    }, [navigate]);

    const fetchOrders = async (identifier) => {
        try {
            const res = await fetch(`http://localhost:5000/api/driver/my-orders?driverName=${identifier}`);
            if (res.ok) setMyOrders(await res.json());
        } catch (e) { console.error("Fetch Error:", e); }
    };

    const handleAccept = async (orderId) => {
        await fetch(`http://localhost:5000/api/driver/accept?orderId=${orderId}`, { method: "POST" });
        alert("✅ Job Accepted! Proceed to Merchant.");
        fetchOrders(driver.email || driver.name);
    };

    const handleReject = async (orderId) => {
        if (!window.confirm("Reject this delivery?")) return;
        await fetch(`http://localhost:5000/api/driver/reject?orderId=${orderId}`, { method: "POST" });
        fetchOrders(driver.email || driver.name);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (newStatus === "Delivered") {
            if (!checkpoints.cp1 || !checkpoints.cp2) {
                alert("⚠️ You must complete all Checkpoints first!");
                return;
            }
            await fetch(`http://localhost:5000/api/driver/complete?orderId=${orderId}`, { method: "POST" });
            alert("✅ Delivery Finished! Payment Added.");
            setCheckpoints({ cp1: false, cp2: false });
            setProgressStep(0);
        } else {
            await fetch(`http://localhost:5000/api/driver/update-status?orderId=${orderId}&status=${newStatus}`, { method: "POST" });
            setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
        fetchOrders(driver.email || driver.name);
    };

    const handleCheckpoint = async (step, order) => {
        const startLat = driver.currentLat || 23.0225;
        const startLng = driver.currentLng || 72.5714;
        const destLat = order.destLat;
        const destLng = order.destLng;
        let newLat, newLng;

        if (step === 1) {
            newLat = (startLat + destLat) / 2;
            newLng = (startLng + destLng) / 2;
            setCheckpoints(p => ({...p, cp1: true}));
            setProgressStep(1);
            alert("📍 Checkpoint 1 Reached! Location sent to Admin.");
        } else if (step === 2) {
            newLat = destLat - 0.002;
            newLng = destLng - 0.002;
            setCheckpoints(p => ({...p, cp2: true}));
            setProgressStep(2);
            alert("📍 Checkpoint 2 Reached! Almost at destination.");
        }

        try {
            const driverId = driver.email || driver.name;
            await fetch(`http://localhost:5000/api/driver/update-location?email=${driverId}&lat=${newLat}&lng=${newLng}`, { 
                method: "POST" 
            });
            setDriver(prev => ({ ...prev, currentLat: newLat, currentLng: newLng }));
        } catch (e) {
            console.error("Failed to update location", e);
        }
    };

    const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

    if (!driver) return <div style={{padding:"50px", textAlign:"center"}}>⏳ Loading...</div>;

    const dynamicETA = routeStats.time + trafficStatus.delay;

    return (
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#f4f6f9", minHeight: "100vh" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1a252f", color: "white", padding: "20px 30px", borderRadius: "12px", marginBottom: "30px" }}>
                <div>
                    <h2 style={{ margin: 0 }}>🚛 Driver Console</h2>
                    <p style={{ margin: "5px 0 0 0", opacity: 0.7 }}>Logged in as {driver.name}</p>
                </div>
                <button onClick={handleLogout} style={{ background: "#c0392b", color: "white", border: "none", padding: "10px 20px", borderRadius: "30px", fontWeight: "bold", cursor: "pointer" }}>Logout</button>
            </div>

            {myOrders.length === 0 ? <p style={{textAlign:"center"}}>No active jobs.</p> : (
                myOrders.map(order => (
                    <div key={order.id} style={{ border: "none", borderRadius: "12px", padding: "25px", background: "white", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", marginBottom: "30px" }}>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                            <div>
                                <h3 style={{ margin: 0 }}>📦 Order #{order.id.substring(0, 6)}</h3>
                                <p style={{margin:"5px 0", color: "#7f8c8d"}}>Customer: <strong>{order.customer}</strong></p>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <span style={{ background: order.status === "Assigned" ? "#95a5a6" : "#27ae60", color: "white", padding: "6px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>{order.status}</span>
                                <div style={{ marginTop: "5px", fontSize: "14px", fontWeight: "bold", color: "#27ae60" }}>💵 Earn: ₹{order.price || 0}</div>
                            </div>
                        </div>

                        {/* 1. ASSIGNED */}
                        {order.status === "Assigned" && (
                            <div style={{ textAlign: "center", padding: "30px", background: "#f8f9fa", borderRadius: "10px", border: "2px dashed #bdc3c7" }}>
                                <h3>🔔 New Job Opportunity</h3>
                                <p>Pickup: {order.location}</p>
                                <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px" }}>
                                    <button onClick={() => handleReject(order.id)} style={{ padding: "12px 30px", background: "#c0392b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>✖ Reject</button>
                                    <button onClick={() => handleAccept(order.id)} style={{ padding: "12px 30px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>✅ Accept Job</button>
                                </div>
                            </div>
                        )}

                        {/* 2. ACCEPTED */}
                        {order.status === "Accepted" && (
                            <div style={{ textAlign: "center", padding: "30px", background: "#fff3cd", borderRadius: "10px", border: "1px solid #ffeeba" }}>
                                <h2 style={{ marginTop: 0, color: "#856404" }}>🏪 Proceed to Merchant</h2>
                                <p style={{ fontSize: "18px" }}>Address: <strong>{order.location}</strong></p>
                                <button onClick={() => handleStatusUpdate(order.id, "Picked Up")} style={{ marginTop: "15px", padding: "15px 30px", fontSize: "16px", background: "#ffc107", color: "#212529", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>📦 Confirm Picked Up</button>
                            </div>
                        )}

                        {/* 3. NAVIGATION (Map) */}
                        {(order.status === "Picked Up" || order.status === "In Transit") && (
                            <div>
                                <NavigationMap 
                                    startLat={driver.currentLat || 23.0225} 
                                    startLng={driver.currentLng || 72.5714} 
                                    destLat={order.destLat || 23.0300} 
                                    destLng={order.destLng || 72.5800} 
                                    onRouteFound={setRouteStats}
                                    progressStep={progressStep}
                                />

                                {/* DASHBOARD WIDGET */}
                                <div style={{ background: "#ecf0f1", padding: "20px", borderRadius: "10px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ textAlign: "center", background: "white", padding: "10px 20px", borderRadius: "8px" }}>
                                        <div style={{ fontSize: "12px", color: "#777" }}>SPEED</div>
                                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50" }}>{speed} <span style={{fontSize:"14px"}}>km/h</span></div>
                                    </div>
                                    <div style={{ textAlign: "center", flex: 1, margin: "0 20px", background: trafficStatus.color, color: "white", padding: "10px", borderRadius: "8px" }}>
                                        <div style={{ fontWeight: "bold" }}>TRAFFIC: {trafficStatus.status}</div>
                                        <div style={{ fontSize: "12px" }}>Delay: +{trafficStatus.delay} mins</div>
                                    </div>
                                    <div style={{ textAlign: "center", background: "white", padding: "10px 20px", borderRadius: "8px" }}>
                                        <div style={{ fontSize: "12px", color: "#777" }}>ETA / DIST</div>
                                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#2c3e50" }}>{dynamicETA} min / {routeStats.dist} km</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                                    <button 
                                        disabled={checkpoints.cp1} 
                                        onClick={() => handleCheckpoint(1, order)} 
                                        style={{ flex: 1, padding: "15px", background: checkpoints.cp1 ? "#bdc3c7" : "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: checkpoints.cp1 ? "default" : "pointer", fontWeight: "bold" }}
                                    >
                                        {checkpoints.cp1 ? "✅ Step 1 Done" : "📍 Reach CP 1"}
                                    </button>
                                    <button 
                                        disabled={!checkpoints.cp1 || checkpoints.cp2} 
                                        onClick={() => handleCheckpoint(2, order)} 
                                        style={{ flex: 1, padding: "15px", background: checkpoints.cp2 ? "#bdc3c7" : "#9b59b6", color: "white", border: "none", borderRadius: "5px", cursor: (!checkpoints.cp1 || checkpoints.cp2) ? "default" : "pointer", fontWeight: "bold" }}
                                    >
                                        {checkpoints.cp2 ? "✅ Step 2 Done" : "📍 Reach CP 2"}
                                    </button>
                                </div>

                                <button 
                                    onClick={() => handleStatusUpdate(order.id, "Delivered")} 
                                    disabled={!checkpoints.cp1 || !checkpoints.cp2} 
                                    style={{ width: "100%", marginTop: "15px", padding: "15px", background: (checkpoints.cp1 && checkpoints.cp2) ? "#27ae60" : "#95a5a6", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", fontWeight: "bold", cursor: (checkpoints.cp1 && checkpoints.cp2) ? "pointer" : "not-allowed" }}
                                >
                                    🏁 Complete Delivery
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}