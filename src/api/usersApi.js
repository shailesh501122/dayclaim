import { apiFetch } from './apiClient.js';

export async function fetchUsers(page = 1, pageSize = 50) {
  return apiFetch(`/api/v1/users?page=${page}&pageSize=${pageSize}`);
}

export async function fetchRoles() {
  return apiFetch('/api/v1/users/roles');
}

export async function createUser(payload) {
  return apiFetch('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id, payload) {
  return apiFetch(`/api/v1/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function activateUser(id) {
  return apiFetch(`/api/v1/users/${id}/activate`, { method: 'POST' });
}

export async function deactivateUser(id) {
  return apiFetch(`/api/v1/users/${id}/deactivate`, { method: 'POST' });
}

export async function deleteUser(id) {
  return apiFetch(`/api/v1/users/${id}`, { method: 'DELETE' });
}
