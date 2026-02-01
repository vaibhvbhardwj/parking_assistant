import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/user/Sidebar";
import Topbar from "../../components/user/Topbar";
import "../../styles/user/vehicles.css";
import "../../styles/user/dashboard.css";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const res = await api.get("/api/vehicles/my");
    setVehicles(res.data);
  };

  const addVehicle = async () => {
    await api.post("/api/vehicles/add", {
      vehicleNumber,
      vehicleType
    });
    setVehicleNumber("");
    loadVehicles();
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="vehicles-page">
          <h2>🚗 My Vehicles</h2>

          <div className="add-vehicle-form">
            <input
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />

            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="EV">Electric Vehicle</option>
            </select>

            <button onClick={addVehicle}>Add Vehicle</button>
          </div>

          <div className="vehicles-list">
            {vehicles.map(v => (
              <div key={v._id} className="vehicle-card">
                <b>{v.vehicleNumber}</b>
                <span>{v.vehicleType}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}