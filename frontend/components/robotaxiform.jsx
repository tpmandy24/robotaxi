import React, { useState, useEffect } from "react";

const EMPTY_FORM = {
  vin: "",
  model: "",
  status: "idle",
  latitude: "",
  longitude: "",
  battery_level: "",
};

export default function RobotaxiForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(initialValue ? { ...EMPTY_FORM, ...initialValue } : EMPTY_FORM);
  }, [initialValue]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      battery_level: form.battery_level === "" ? null : Number(form.battery_level),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        VIN
        <input name="vin" value={form.vin} onChange={handleChange} required />
      </label>
      <label>
        Model
        <input name="model" value={form.model} onChange={handleChange} required />
      </label>
      <label>
        Status
        <input name="status" value={form.status} onChange={handleChange} />
      </label>
      <label>
        Latitude
        <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} />
      </label>
      <label>
        Longitude
        <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} />
      </label>
      <label>
        Battery Level
        <input name="battery_level" type="number" step="any" value={form.battery_level} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
