import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDriversMap from '../components/AdminDriversMap';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("");
    
    // Form State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDriver, setCurrentDriver] = useState({
        id: '', username: '', email: '', phone: '', password: '', currentLat: 23.0225, currentLng: 72.5714
    });

    useEffect(() => {
        fetchDrivers();
        fetchPendingOrders();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/drivers');
            setDrivers(res.data);
        } catch (error) { console.error("Error fetching drivers"); }
    };

    const fetchPendingOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/orders/pending');
            setPendingOrders(res.data);
        } catch (error) { console.error("Error fetching orders"); }
    };

    // --- CRUD OPERATIONS ---
    const handleSaveDriver = async () => {
        const payload = {
            ...currentDriver,
            currentLat: parseFloat(currentDriver.currentLat),
            currentLng: parseFloat(currentDriver.currentLng)
        };
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/admin/driver/update/${currentDriver.id}`, payload);
                alert("✅ Driver Updated!");
            } else {
                await axios.post('http://localhost:5000/api/admin/driver/add', payload);
                alert("✅ Driver Added!");
            }
            setShowModal(false);
            fetchDrivers(); 
        } catch (error) { alert("❌ Error saving driver"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this driver?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/driver/delete/${id}`);
                fetchDrivers();
            } catch (error) { alert("Error deleting driver"); }
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentDriver({ id: '', username: '', email: '', phone: '', password: '123', currentLat: 23.0225, currentLng: 72.5714 });
        setShowModal(true);
    };

    const openEditModal = (driver) => {
        setIsEditing(true);
        setCurrentDriver(driver);
        setShowModal(true);
    };

    const handleAssign = async (driverId) => {
        if (!selectedOrder) return alert("Select an order first!");
        try {
            await axios.post(`http://localhost:5000/api/admin/assign?orderId=${selectedOrder}&driverId=${driverId}`);
            alert("✅ Driver Assigned!");
            fetchPendingOrders();
        } catch (error) { alert("Failed to assign."); }
    };

    return (
        // 1. Force the container to take full screen
        <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
            
            {/* 2. Sidebar with fixed width and PROPS passed */}
            <div style={{ width: "250px", flexShrink: 0, height: "100%" }}>
                {/* Passing dummy props to ensure Sidebar renders correctly */}
                <Sidebar activeTab="drivers" setActiveTab={() => {}} />
            </div>

            {/* 3. Main Content with White Background to stand out against grey */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#f4f7f6" }}>
                
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                    <h1 style={{color: "#333", margin: 0}}>🚖 Manage Drivers</h1>
                    <button 
                        onClick={openAddModal} 
                        style={{padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}
                    >
                        + Add New Driver
                    </button>
                </div>
                
                {/* Map Component */}
                <AdminDriversMap drivers={drivers} />

                {/* --- TABLE SECTION --- */}
                <div style={{marginTop: "20px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"}}>
                    <h2>Driver List</h2>
                    
                    <div style={{marginBottom: "15px"}}>
                        <label>Assign Pending Order: </label>
                        <select onChange={(e) => setSelectedOrder(e.target.value)} value={selectedOrder} style={{padding: "8px", border: "1px solid #ccc"}}>
                            <option value="">-- Select Order --</option>
                            {pendingOrders.map(o => <option key={o.id} value={o.id}>{o.id} - {o.customer}</option>)}
                        </select>
                    </div>

                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                            <tr style={{background: "#eee", textAlign: "left"}}>
                                <th style={{padding: "10px"}}>Name</th>
                                <th style={{padding: "10px"}}>Status</th>
                                <th style={{padding: "10px"}}>Phone</th>
                                <th style={{padding: "10px"}}>Location</th>
                                <th style={{padding: "10px"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver, index) => (
                                <tr key={driver.id || index} style={{borderBottom: "1px solid #ddd"}}>
                                    <td style={{padding: "10px"}}>{driver.username}</td>
                                    <td style={{padding: "10px"}}>{driver.status}</td>
                                    <td style={{padding: "10px"}}>{driver.phone}</td>
                                    <td style={{padding: "10px"}}>{driver.currentLat ? "📍 Live" : "N/A"}</td>
                                    <td style={{padding: "10px"}}>
                                        <button onClick={() => openEditModal(driver)} style={{marginRight:"5px"}}>✏️</button>
                                        <button onClick={() => handleDelete(driver.id)} style={{marginRight:"5px"}}>🗑️</button>
                                        <button onClick={() => handleAssign(driver.id)}>Assign</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MODAL --- */}
                {showModal && (
                    <div className="modal-overlay" style={{position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex: 1000}}>
                        <div className="modal-content" style={{background:"white", padding:"20px", borderRadius:"10px", width:"400px", display:"flex", flexDirection:"column", gap:"10px"}}>
                            <h3>{isEditing ? "Edit Driver" : "Add New Driver"}</h3>
                            <input type="text" placeholder="Name" value={currentDriver.username} onChange={e => setCurrentDriver({...currentDriver, username: e.target.value})} style={{padding:"8px"}} />
                            <input type="email" placeholder="Email" value={currentDriver.email} onChange={e => setCurrentDriver({...currentDriver, email: e.target.value})} style={{padding:"8px"}} />
                            <input type="text" placeholder="Phone" value={currentDriver.phone} onChange={e => setCurrentDriver({...currentDriver, phone: e.target.value})} style={{padding:"8px"}} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <input type="number" placeholder="Lat" value={currentDriver.currentLat} onChange={e => setCurrentDriver({...currentDriver, currentLat: e.target.value})} style={{padding:"8px"}} />
                                <input type="number" placeholder="Lng" value={currentDriver.currentLng} onChange={e => setCurrentDriver({...currentDriver, currentLng: e.target.value})} style={{padding:"8px"}} />
                            </div>
                            <div style={{display:"flex", justifyContent:"flex-end", gap:"10px", marginTop:"10px"}}>
                                <button onClick={handleSaveDriver} style={{padding:"8px 15px", background:"green", color:"white", border:"none"}}>Save</button>
                                <button onClick={() => setShowModal(false)} style={{padding:"8px 15px", background:"red", color:"white", border:"none"}}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drivers;