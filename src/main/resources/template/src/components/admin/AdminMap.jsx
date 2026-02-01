import { useEffect, useState } from "react";
import api from "../../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AdminMap() {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    api.get("/api/parking-areas").then(res => setAreas(res.data));
  }, []);

  return (
    <div className="admin-map">
      <h3>Live Map</h3>

      <MapContainer center={[28.7041, 77.1025]} zoom={12}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {areas.map(area =>
          area.location?.lat && area.location?.lng ? (
            <Marker
              key={area._id}
              position={[area.location.lat, area.location.lng]}
            >
              <Popup>
                <b>{area.name}</b><br />
                <button>Open Layout</button>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
