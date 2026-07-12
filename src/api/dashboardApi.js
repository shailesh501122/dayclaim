import { apiFetch } from './apiClient.js';

export async function fetchClientOrganizations() {
  return apiFetch('/api/v1/dashboard/client-organizations');
}

export async function fetchInventorySummary(clientOrganizationId) {
  return apiFetch(`/api/v1/dashboard/inventory-summary?clientOrganizationId=${clientOrganizationId}`);
}

export async function fetchAssignmentSummary(clientOrganizationId) {
  return apiFetch(`/api/v1/dashboard/assignment-summary?clientOrganizationId=${clientOrganizationId}`);
}

export async function fetchRuleEngineSummary(clientOrganizationId) {
  return apiFetch(`/api/v1/dashboard/rule-engine-summary?clientOrganizationId=${clientOrganizationId}`);
}
