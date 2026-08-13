const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("rototuna_token");
}

export function setToken(token) {
  localStorage.setItem("rototuna_token", token);
}

export function clearToken() {
  localStorage.removeItem("rototuna_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => request("/auth/me"),

  alumni: (search = "") =>
    request(`/alumni${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  createAlumni: (data) =>
    request("/alumni", { method: "POST", body: JSON.stringify(data) }),

  deleteAlumni: (id) =>
    request(`/alumni/${id}`, { method: "DELETE" }),

  archive: () => request("/archive"),

  createArchive: (data) =>
    request("/archive", { method: "POST", body: JSON.stringify(data) }),

  deleteArchive: (id) =>
    request(`/archive/${id}`, { method: "DELETE" }),

  events: () => request("/events"),

  createEvent: (data) =>
    request("/events", { method: "POST", body: JSON.stringify(data) }),

  deleteEvent: (id) =>
    request(`/events/${id}`, { method: "DELETE" }),
};
