import React, { useState, useEffect, useCallback } from "react";
import RobotaxiTable from "./robotaxitable";
import RobotaxiForm from "./robotaxiform";
import { getRobotaxis, createRobotaxi, updateRobotaxi, deleteRobotaxi } from "../services/api";

export default function Dashboard() {
  const [robotaxis, setRobotaxis] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const loadRobotaxis = useCallback(async () => {
    try {
      const data = await getRobotaxis();
      setRobotaxis(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadRobotaxis();
  }, [loadRobotaxis]);

  async function handleSubmit(values) {
    try {
      if (editing) {
        await updateRobotaxi(editing.id, values);
      } else {
        await createRobotaxi(values);
      }
      setShowForm(false);
      setEditing(null);
      await loadRobotaxis();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRobotaxi(id);
      await loadRobotaxis();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(robotaxi) {
    setEditing(robotaxi);
    setShowForm(true);
  }

  return (
    <div>
      <h1>Robotaxi Fleet Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        Add Robotaxi
      </button>
      {showForm && (
        <RobotaxiForm
          initialValue={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      <RobotaxiTable robotaxis={robotaxis} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
