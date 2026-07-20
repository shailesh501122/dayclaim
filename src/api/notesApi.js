import { apiFetch } from './apiClient.js';

export async function fetchScenarios(clientOrganizationId) {
  return apiFetch(`/api/v1/notes/scenarios?clientOrganizationId=${clientOrganizationId}`);
}

export async function createScenario(payload) {
  return apiFetch('/api/v1/notes/scenarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
