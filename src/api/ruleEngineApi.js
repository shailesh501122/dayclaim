import { apiFetch } from './apiClient.js';

export async function fetchRules(clientOrganizationId) {
  const qs = clientOrganizationId ? `?clientOrganizationId=${clientOrganizationId}` : '';
  return apiFetch(`/api/v1/rule-engine/rules${qs}`);
}

export async function createRule(payload) {
  return apiFetch('/api/v1/rule-engine/rules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function executeRules(clientOrganizationId) {
  return apiFetch('/api/v1/rule-engine/execute', {
    method: 'POST',
    body: JSON.stringify(clientOrganizationId),
  });
}
