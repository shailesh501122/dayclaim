import { apiFetch } from './apiClient.js';

export async function fetchMyMenuAccess() {
  return apiFetch('/api/v1/menuaccess/me');
}

export async function fetchUserMenuAccess(userId) {
  return apiFetch(`/api/v1/menuaccess/${userId}`);
}

export async function setUserMenuAccess(userId, menuPaths) {
  return apiFetch(`/api/v1/menuaccess/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ menuPaths }),
  });
}
