import React from "react";

export default function RobotaxiTable({ robotaxis, onEdit, onDelete }) {
  if (!robotaxis.length) {
    return <p>No robotaxis found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>VIN</th>
          <th>Model</th>
          <th>Status</th>
          <th>Battery</th>
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {robotaxis.map((robotaxi) => (
          <tr key={robotaxi.id}>
            <td>{robotaxi.vin}</td>
            <td>{robotaxi.model}</td>
            <td>{robotaxi.status}</td>
            <td>{robotaxi.battery_level ?? "—"}</td>
            <td>
              {robotaxi.latitude != null && robotaxi.longitude != null
                ? `${robotaxi.latitude}, ${robotaxi.longitude}`
                : "—"}
            </td>
            <td>
              <button onClick={() => onEdit(robotaxi)}>Edit</button>
              <button onClick={() => onDelete(robotaxi.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
