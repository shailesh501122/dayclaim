import { useEffect, useState } from 'react';
import { fetchClientOrganizations } from '../api/dashboardApi.js';

/// Loads the client-org list once and tracks which one is selected, so every
/// real (non-placeholder) screen that needs a clientOrganizationId shares the
/// same loading/error/selection behavior instead of repeating it.
export function useClientOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientOrganizations()
      .then((orgs) => {
        setOrganizations(orgs);
        if (orgs.length > 0) setSelectedId(orgs[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { organizations, selectedId, setSelectedId, loading, error };
}
