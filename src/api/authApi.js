import { API_BASE_URL, parseErrorMessage } from './apiClient.js';

export async function loginRequest(username, password) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(`Could not reach the API at ${API_BASE_URL}. Is the backend running?`);
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
}

export async function logoutRequest(refreshToken) {
  if (!refreshToken) return;
  try {
    await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Best-effort — the local session is cleared regardless of whether this call succeeds.
  }
}
