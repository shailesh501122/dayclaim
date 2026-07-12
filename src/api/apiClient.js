export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SESSION_KEY = 'dayclaim.session';

function readAccessToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw)?.accessToken : null;
  } catch {
    return null;
  }
}

export async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    return body.detail || body.title || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

/// Authenticated JSON fetch — attaches the bearer token from the current
/// session and normalizes network/HTTP failures into a thrown Error with a
/// message safe to show directly in the UI.
export async function apiFetch(path, options = {}) {
  const token = readAccessToken();
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Could not reach the API at ${API_BASE_URL}. Is the backend running?`);
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) return null;
  return response.json();
}
