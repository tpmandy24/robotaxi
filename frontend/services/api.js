const BASE_URL = "http://localhost:8000/api";

async function handleResponse(response) {
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) detail = body.detail;
    } catch {
      // response had no JSON body
    }
    throw new Error(detail);
  }
  if (response.status === 204) return null;
  return response.json();
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getRobotaxis(filters = {}) {
  const response = await fetch(`${BASE_URL}/robotaxis/${buildQuery(filters)}`);
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
