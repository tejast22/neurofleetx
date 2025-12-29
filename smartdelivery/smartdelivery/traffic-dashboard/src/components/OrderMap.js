import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix for default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- INTERNAL ROUTING COMPONENT ---
const RoutingMachine = ({ start, end }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !start || !end) return;

        // 1. CLEANUP PREVIOUS ROUTE (The Safe Way)
        const cleanup = () => {
            if (routingControlRef.current) {
                try {
                    // 🛑 CRITICAL FIX: Empty the waypoints first to prevent "removeLayer" error
                    routingControlRef.current.setWaypoints([]); 
                    // Then remove the control
                    map.removeControl(routingControlRef.current);
                    routingControlRef.current = null;
                } catch (e) {
                    // Ignore Leaflet internal errors during cleanup
                }
            }
        };

        cleanup(); // Run cleanup before creating a new one

        // 2. CREATE NEW ROUTE
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            lineOptions: {
                styles: [{ color: "blue", weight: 4 }]
            },
            show: false, // Hide text instructions
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            createMarker: function() { return null; } // Hide default markers
        }).addTo(map);

        routingControlRef.current = routingControl;

        // 3. Cleanup when component unmounts or updates
        return () => cleanup();

    }, [map, start, end]); // Re-run when coordinates change

    return null;
};

// --- MAIN MAP COMPONENT ---
const OrderMap = (props) => {
    // Adapter: Handle different prop names
    let start = props.start;
    let end = props.end;

    // Safety check: Default coordinates if missing
    if (!start) start = { lat: 23.0225, lng: 72.5714 };
    if (!end) end = { lat: 23.0300, lng: 72.5800 };

    return (
        <div style={{ height: "350px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "2px solid #ddd" }}>
            {/* Key forces re-render if coordinates change drastically */}
            <MapContainer 
                center={[start.lat, start.lng]} 
                zoom={13} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                />

                {/* Markers */}
                <Marker position={[start.lat, start.lng]}>
                    <Popup>🚚 Driver (Live)</Popup>
                </Marker>

                <Marker position={[end.lat, end.lng]}>
                    <Popup>📦 Customer</Popup>
                </Marker>

                {/* Routing Machine - Handles the Line */}
                <RoutingMachine start={start} end={end} />
            </MapContainer>
        </div>
    );
};

export default OrderMap;