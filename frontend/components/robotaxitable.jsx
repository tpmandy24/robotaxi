import React from "react";
import { OPERATIONAL_STATUSES, CLEANING_STATUSES } from "../constants";

function batteryDescriptor(level) {
  if (level <= 20) return { label: "Low", icon: "⚠" };
  if (level <= 50) return { label: "Medium", icon: "●" };
  return { label: "Good", icon: "✓" };
}

export default function RobotaxiTable({ robotaxis, onStatusChange, onDelete, updatingId }) {
  if (robotaxis.length === 0) {
    return <p className="empty-state">No Robotaxis match the current filters.</p>;
  }

  return (
    <ul className="robotaxi-grid" aria-label="Robotaxi fleet">
      {robotaxis.map((robotaxi) => {
        const battery = batteryDescriptor(robotaxi.battery_level);
        const isUpdating = updatingId === robotaxi.id;

        return (
          <li key={robotaxi.id} className="robotaxi-card">
            <div className="robotaxi-card-header">
              <h2>{robotaxi.model}</h2>
              <span className="vin">VIN: {robotaxi.vin}</span>
            </div>

            <p className="location">
              <span aria-hidden="true">📍</span> {robotaxi.current_location}
            </p>

            <p className={`battery battery-${battery.label.toLowerCase()}`}>
              <span aria-hidden="true">{battery.icon}</span> Battery: {robotaxi.battery_level}% ({battery.label})
            </p>

            <div className="form-field">
              <label htmlFor={`operational-${robotaxi.id}`}>Operational Status</label>
              <select
                id={`operational-${robotaxi.id}`}
                value={robotaxi.operational_status}
                disabled={isUpdating}
                onChange={(event) => onStatusChange(robotaxi.id, { operational_status: event.target.value })}
              >
                {OPERATIONAL_STATUSES.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor={`cleaning-${robotaxi.id}`}>Cleaning Status</label>
              <select
                id={`cleaning-${robotaxi.id}`}
                value={robotaxi.cleaning_status}
                disabled={isUpdating}
                onChange={(event) => onStatusChange(robotaxi.id, { cleaning_status: event.target.value })}
              >
                {CLEANING_STATUSES.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="quick-actions">
              <button
                type="button"
                className="btn btn-success"
                disabled={isUpdating || robotaxi.cleaning_status === "Clean"}
                onClick={() => onStatusChange(robotaxi.id, { cleaning_status: "Clean" })}
              >
                Mark Clean
              </button>
              <button
                type="button"
                className="btn btn-warning"
                disabled={isUpdating || robotaxi.operational_status === "Maintenance"}
                onClick={() => onStatusChange(robotaxi.id, { operational_status: "Maintenance" })}
              >
                Send to Maintenance
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={isUpdating}
                onClick={() => onDelete(robotaxi.id)}
              >
                Remove
              </button>
            </div>

            {isUpdating && (
              <p className="updating-state" role="status" aria-live="polite">
                Saving…
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
