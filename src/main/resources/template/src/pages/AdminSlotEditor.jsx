import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminSlotEditor() {
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(5);

  useEffect(() => {
    api.get("/api/parking-areas").then(res => setAreas(res.data));
  }, []);

  const createSlots = async () => {
    await api.post("/api/slots/bulk-create", {
      parkingAreaId: areaId,
      rows,
      columns: cols
    });
    alert("Slots created successfully");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Slot Layout Editor</h2>

      <select onChange={e => setAreaId(e.target.value)}>
        <option>Select Parking Area</option>
        {areas.map(a => (
          <option key={a._id} value={a._id}>{a.name}</option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} />
        <input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} />
      </div>

      <div style={{ margin: "20px 0" }}>
        {[...Array(rows)].map((_, r) => (
          <div key={r} style={{ display: "flex" }}>
            {[...Array(cols)].map((_, c) => (
              <div
                key={c}
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid #333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {String.fromCharCode(65 + r)}{c + 1}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button onClick={createSlots}>Save Layout</button>
    </div>
  );
}

export default AdminSlotEditor;
