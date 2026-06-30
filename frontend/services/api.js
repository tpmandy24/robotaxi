const BASE_URL = "http://localhost:8000";

async function handleResponse(response) {
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getRobotaxis(skip = 0, limit = 100) {
  const response = await fetch(`${BASE_URL}/robotaxis/?skip=${skip}&limit=${limit}`);
  return handleResponse(response);
}

export async function getRobotaxi(id) {
  const response = await fetch(`${BASE_URL}/robotaxis/${id}`);
  return handleResponse(response);
}

export async function createRobotaxi(robotaxi) {
  const response = await fetch(`${BASE_URL}/robotaxis/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(robotaxi),
  });
  return handleResponse(response);
}

export async function updateRobotaxi(id, robotaxi) {
  const response = await fetch(`${BASE_URL}/robotaxis/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(robotaxi),
  });
  return handleResponse(response);
}

export async function deleteRobotaxi(id) {
  const response = await fetch(`${BASE_URL}/robotaxis/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
