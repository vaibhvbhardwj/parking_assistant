import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  SquareParking, 
  Plus, 
  Grid2X2,
  Edit,
  Save,
  Layers
} from "lucide-react";
import api from "../../api/axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin/SlotManagement.css";

export default function SlotManagement() {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [parkingArea, setParkingArea] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [createForm, setCreateForm] = useState({
    floor: 1,
    rows: 5,
    columns: 10,
    slotType: "NORMAL",
    startingLetter: "A"
  });

  useEffect(() => {
    if (areaId) {
      loadParkingArea();
      loadSlots();
    }
  }, [areaId, selectedFloor]);

  const loadParkingArea = async () => {
    try {
      const res = await api.get(`/api/parking-areas/${areaId}`);
      setParkingArea(res.data);
    } catch (error) {
      console.error("Error loading parking area:", error);
    }
  };

  const loadSlots = async () => {
    try {
      const res = await api.get(`/api/slots/by-parking/${areaId}?floor=${selectedFloor}`);
      setSlots(res.data.slots);
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/slots/bulk-create", {
        parkingAreaId: areaId,
        ...createForm
      });
      setShowCreateModal(false);
      loadSlots();
      setCreateForm({
        floor: selectedFloor,
        rows: 5,
        columns: 10,
        slotType: "NORMAL",
        startingLetter: "A"
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create slots");
    }
  };

  const handleSlotClick = (slotId) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedSlots.length === 0) return;

    try {
      if (bulkAction.startsWith("status:")) {
        const status = bulkAction.split(":")[1];
        await api.patch("/api/slots/bulk-update-status", {
          slotIds: selectedSlots,
          status
        });
      } else if (bulkAction.startsWith("type:")) {
        // Update each slot individually for type changes
        await Promise.all(
          selectedSlots.map(slotId =>
            api.put(`/api/slots/${slotId}`, { slotType: bulkAction.split(":")[1] })
          )
        );
      }
      
      setSelectedSlots([]);
      setBulkAction("");
      loadSlots();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update slots");
    }
  };

  const getSlotColor = (slot) => {
    if (slot.status === "BOOKED") return "booked";
    if (slot.status === "UNDER_MAINTENANCE") return "maintenance";
    if (slot.slotType === "EV") return "ev";
    if (slot.slotType === "HANDICAPPED") return "handicapped";
    if (slot.slotType === "RESERVED") return "reserved";
    return "available";
  };

  const organizeSlotsByGrid = () => {
    if (slots.length === 0) return [];

    const grid = {};
    slots.forEach(slot => {
      const row = slot.position?.row ?? 0;
      const col = slot.position?.column ?? 0;
      if (!grid[row]) grid[row] = {};
      grid[row][col] = slot;
    });

    return Object.keys(grid).sort((a, b) => a - b).map(row => {
      const cols = grid[row];
      const maxCol = Math.max(...Object.keys(cols).map(Number));
      const rowArray = [];
      for (let i = 0; i <= maxCol; i++) {
        rowArray.push(cols[i] || null);
      }
      return rowArray;
    });
  };

  const gridSlots = organizeSlotsByGrid();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="page-header-admin">
          <div>
            <h1>{parkingArea?.name} - Slots</h1>
            <p>Manage parking slots and layout</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-primary-admin"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Bulk Create Slots
            </button>
          </div>
        </div>

        <div className="slot-controls">
          <div className="floor-selector">
            <Layers size={20} />
            <label>Floor:</label>
            <select 
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
            >
              {Array.from({ length: parkingArea?.totalFloors || 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Floor {i + 1}</option>
              ))}
            </select>
          </div>

          {selectedSlots.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedSlots.length} selected</span>
              <select 
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Select Action</option>
                <optgroup label="Status">
                  <option value="status:AVAILABLE">Set Available</option>
                  <option value="status:UNDER_MAINTENANCE">Set Maintenance</option>
                </optgroup>
                <optgroup label="Type">
                  <option value="type:NORMAL">Set Normal</option>
                  <option value="type:EV">Set EV Charging</option>
                  <option value="type:HANDICAPPED">Set Handicapped</option>
                  <option value="type:RESERVED">Set Reserved</option>
                </optgroup>
              </select>
              <button 
                className="btn-primary-admin"
                onClick={handleBulkUpdate}
                disabled={!bulkAction}
              >
                Apply
              </button>
              <button 
                className="btn-secondary-admin"
                onClick={() => setSelectedSlots([])}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="slot-legend">
          <div className="legend-item">
            <span className="legend-box available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-box booked"></span>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <span className="legend-box maintenance"></span>
            <span>Maintenance</span>
          </div>
          <div className="legend-item">
            <span className="legend-box ev"></span>
            <span>EV Charging</span>
          </div>
          <div className="legend-item">
            <span className="legend-box handicapped"></span>
            <span>Handicapped</span>
          </div>
          <div className="legend-item">
            <span className="legend-box reserved"></span>
            <span>Reserved</span>
          </div>
        </div>

        {slots.length === 0 ? (
          <div className="empty-state">
            <Grid2X2 size={64} />
            <h3>No slots on this floor</h3>
            <p>Create slots using the bulk create option</p>
            <button 
              className="btn-primary-admin"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Create Slots
            </button>
          </div>
        ) : (
          <div className="slot-grid-container">
            <div className="slot-grid">
              {gridSlots.map((row, rowIndex) => (
                <div key={rowIndex} className="slot-row">
                  {row.map((slot, colIndex) => (
                    slot ? (
                      <div
                        key={slot._id}
                        className={`slot-box ${getSlotColor(slot)} ${
                          selectedSlots.includes(slot._id) ? "selected" : ""
                        }`}
                        onClick={() => handleSlotClick(slot._id)}
                      >
                        <span className="slot-number">{slot.slotNumber}</span>
                      </div>
                    ) : (
                      <div key={`empty-${rowIndex}-${colIndex}`} className="slot-box empty"></div>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Bulk Create Slots</h2>
              
              <form onSubmit={handleBulkCreate}>
                <div className="form-group">
                  <label>Floor</label>
                  <select
                    value={createForm.floor}
                    onChange={(e) => setCreateForm({...createForm, floor: parseInt(e.target.value)})}
                  >
                    {Array.from({ length: parkingArea?.totalFloors || 1 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Floor {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="26"
                      value={createForm.rows}
                      onChange={(e) => setCreateForm({...createForm, rows: parseInt(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={createForm.columns}
                      onChange={(e) => setCreateForm({...createForm, columns: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Slot Type</label>
                    <select
                      value={createForm.slotType}
                      onChange={(e) => setCreateForm({...createForm, slotType: e.target.value})}
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="EV">EV Charging</option>
                      <option value="HANDICAPPED">Handicapped</option>
                      <option value="RESERVED">Reserved</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Starting Letter</label>
                    <input
                      type="text"
                      maxLength="1"
                      pattern="[A-Z]"
                      value={createForm.startingLetter}
                      onChange={(e) => setCreateForm({...createForm, startingLetter: e.target.value.toUpperCase()})}
                      placeholder="A"
                    />
                  </div>
                </div>

                <div className="preview-info">
                  <p>This will create <strong>{createForm.rows * createForm.columns}</strong> slots</p>
                  <p>Naming: {createForm.startingLetter}1 to {String.fromCharCode(createForm.startingLetter.charCodeAt(0) + createForm.rows - 1)}{createForm.columns}</p>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary-admin" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-admin">
                    <Save size={20} />
                    Create Slots
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}