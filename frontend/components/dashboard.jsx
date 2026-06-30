import React, { useState, useEffect, useCallback } from "react";
import RobotaxiTable from "./robotaxitable";
import RobotaxiForm from "./robotaxiform";
import { getRobotaxis, createRobotaxi, updateRobotaxi, deleteRobotaxi } from "../services/api";
import { OPERATIONAL_STATUSES, CLEANING_STATUSES } from "../constants";
import "../styles/app.css";

const EMPTY_FILTERS = { operational_status: "", cleaning_status: "" };

export default function Dashboard() {
  const [robotaxis, setRobotaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [maxBattery, setMaxBattery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loadRobotaxis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRobotaxis(filters);
      setRobotaxis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadRobotaxis();
  }, [loadRobotaxis]);

  const visibleRobotaxis =
    maxBattery === ""
      ? robotaxis
      : robotaxis.filter((robotaxi) => robotaxi.battery_level <= Number(maxBattery));

  async function handleCreate(values) {
    setSubmitting(true);
    setError(null);
    try {
      await createRobotaxi(values);
      setShowForm(false);
      await loadRobotaxis();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id, changes) {
    setUpdatingId(id);
    setError(null);
    const previous = robotaxis;
    setRobotaxis((current) => current.map((robotaxi) => (robotaxi.id === id ? { ...robotaxi, ...changes } : robotaxi)));
    try {
      await updateRobotaxi(id, changes);
    } catch (err) {
      setRobotaxis(previous);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      await deleteRobotaxi(id);
      await loadRobotaxis();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <header className="app-header">
        <h1>Robotaxi Fleet</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close Form" : "+ Add Robotaxi"}
        </button>
      </header>

      <main className="dashboard-content">
        {error && (
          <p className="banner banner-error" role="alert">
            {error}
          </p>
        )}

        {showForm && (
          <RobotaxiForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitting={submitting} />
        )}

        <section className="filter-bar" aria-label="Filter and search robotaxis">
          <div className="form-field">
            <label htmlFor="filter-operational">Operational Status</label>
            <select
              id="filter-operational"
              value={filters.operational_status}
              onChange={(event) => setFilters((prev) => ({ ...prev, operational_status: event.target.value }))}
            >
              <option value="">All</option>
              {OPERATIONAL_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="filter-cleaning">Cleaning Status</label>
            <select
              id="filter-cleaning"
              value={filters.cleaning_status}
              onChange={(event) => setFilters((prev) => ({ ...prev, cleaning_status: event.target.value }))}
            >
              <option value="">All</option>
              {CLEANING_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="filter-battery">Battery at or below (%)</label>
            <input
              id="filter-battery"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 20"
              value={maxBattery}
              onChange={(event) => setMaxBattery(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              setMaxBattery("");
            }}
          >
            Clear Filters
          </button>
        </section>

        {loading ? (
          <p className="loading-state" role="status" aria-live="polite">
            Loading fleet…
          </p>
        ) : (
          <RobotaxiTable
            robotaxis={visibleRobotaxis}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            updatingId={updatingId}
          />
        )}
      </main>
    </div>
  );
}
