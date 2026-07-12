import { apiFetch } from './apiClient.js';

export async function fetchImporterConfigs(clientOrganizationId) {
  return apiFetch(`/api/v1/importer-configs?clientOrganizationId=${clientOrganizationId}`);
}

export async function createImporterConfig(payload) {
  return apiFetch('/api/v1/importer-configs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
