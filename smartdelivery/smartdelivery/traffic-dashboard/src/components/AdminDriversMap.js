import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AdminDriversMap = ({ drivers }) => {
  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "10px", overflow: "hidden", border: "2px solid #ddd", marginBottom: "20px" }}>
      <MapContainer center={[23.0225, 72.5714]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        {drivers.map((driver) => (
            driver.currentLat && driver.currentLng ? (
                <Marker key={driver.id} position={[driver.currentLat, driver.currentLng]}>
                    <Popup>
                        <strong>{driver.username}</strong><br />
                        Status: {driver.status}<br />
                        Phone: {driver.phone}
                    </Popup>
                </Marker>
            ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default AdminDriversMap;