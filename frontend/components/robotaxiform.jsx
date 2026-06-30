import React, { useState } from "react";
import { OPERATIONAL_STATUSES, CLEANING_STATUSES } from "../constants";

const EMPTY_FORM = {
  vin: "",
  model: "",
  battery_level: 100,
  operational_status: "Idle",
  cleaning_status: "Clean",
  current_location: "",
};

export default function RobotaxiForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (form.vin.length !== 17) {
      setFormError("VIN must be exactly 17 characters.");
      return;
    }
    setFormError(null);
    onSubmit({ ...form, battery_level: Number(form.battery_level) });
  }

  return (
    <form className="robotaxi-form" onSubmit={handleSubmit} aria-label="Add a new Robotaxi">
      <h2>Add Robotaxi</h2>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="vin">VIN (17 characters)</label>
        <input
          id="vin"
          name="vin"
          value={form.vin}
          onChange={handleChange}
          minLength={17}
          maxLength={17}
          required
          aria-describedby="vin-hint"
        />
        <span id="vin-hint" className="field-hint">
          Vehicle Identification Number, exactly 17 characters.
        </span>
      </div>

      <div className="form-field">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          name="model"
          value={form.model}
          onChange={handleChange}
          required
          placeholder="Cybercab"
        />
      </div>

      <div className="form-field">
        <label htmlFor="current_location">Current Location</label>
        <input
          id="current_location"
          name="current_location"
          value={form.current_location}
          onChange={handleChange}
          required
          placeholder="Zone A Dropoff"
        />
      </div>

      <div className="form-field">
        <label htmlFor="battery_level">Battery Level (%)</label>
        <input
          id="battery_level"
          name="battery_level"
          type="number"
          min={0}
          max={100}
          value={form.battery_level}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="operational_status">Operational Status</label>
        <select
          id="operational_status"
          name="operational_status"
          value={form.operational_status}
          onChange={handleChange}
        >
          {OPERATIONAL_STATUSES.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="cleaning_status">Cleaning Status</label>
        <select id="cleaning_status" name="cleaning_status" value={form.cleaning_status} onChange={handleChange}>
          {CLEANING_STATUSES.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Adding…" : "Add Robotaxi"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
