import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useClientOrganizations } from '../hooks/useClientOrganizations.js';
import { fetchAssignmentSummary, fetchInventorySummary, fetchRuleEngineSummary } from '../api/dashboardApi.js';
import './RealScreens.css';

function BreakdownList({ data }) {
  const entries = Object.entries(data || {});
  if (entries.length === 0) return <p className="module-note">No data yet.</p>;
  return (
    <ul className="breakdown-list">
      {entries.map(([key, value]) => (
        <li key={key}><span>{key}</span><strong>{value}</strong></li>
      ))}
    </ul>
  );
}

export function RealDashboard() {
  const { organizations, selectedId, setSelectedId, loading: orgsLoading, error: orgsError } = useClientOrganizations();
  const [inventory, setInventory] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [ruleEngine, setRuleEngine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    try {
      const [inv, asg, re] = await Promise.all([
        fetchInventorySummary(selectedId),
        fetchAssignmentSummary(selectedId),
        fetchRuleEngineSummary(selectedId),
      ]);
      setInventory(inv);
      setAssignment(asg);
      setRuleEngine(re);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [selectedId]);

  return (
    <section className="section real-screen">
      <div className="module-hero">
        <div>
          <span className="module-kicker">Dashboard</span>
          <h1>Overview</h1>
          <p>Live counts from your actual claim inventory, allocations, and last Rule Engine run.</p>
        </div>
        <div className="module-actions">
          {organizations.length > 0 && (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          )}
          <button className="ghost-button" onClick={load}><RefreshCcw size={15} /> Refresh</button>
        </div>
      </div>

      {orgsError && <p className="field-error">{orgsError}</p>}
      {error && <p className="field-error">{error}</p>}
      {orgsLoading && <p className="module-note">Loading client organizations...</p>}
      {!orgsLoading && organizations.length === 0 && <p className="module-note">No client organizations yet.</p>}

      {loading ? (
        <p className="module-note">Loading...</p>
      ) : (
        <div className="real-card-grid">
          <div className="card">
            <h3>Inventory</h3>
            <div className="stat-row">
              <div><span>Total Open</span><strong>{inventory?.totalOpen ?? 0}</strong></div>
              <div><span>Avg Age (days)</span><strong>{inventory?.averageAgeDays ?? 0}</strong></div>
            </div>
            <p className="module-note">By bucket</p>
            <BreakdownList data={inventory?.byBucket} />
          </div>

          <div className="card">
            <h3>Assignment</h3>
            <div className="stat-row">
              <div><span>Allocated</span><strong>{assignment?.totalAllocated ?? 0}</strong></div>
              <div><span>Rolled Back</span><strong>{assignment?.totalRolledBack ?? 0}</strong></div>
            </div>
            <p className="module-note">By user</p>
            <BreakdownList data={assignment?.byUser} />
          </div>

          <div className="card">
            <h3>Rule Engine — Last Run</h3>
            {ruleEngine?.lastRunAtUtc ? (
              <>
                <div className="stat-row">
                  <div><span>Processed</span><strong>{ruleEngine.lastRunClaimsProcessed}</strong></div>
                  <div><span>Matched</span><strong>{ruleEngine.lastRunClaimsMatched}</strong></div>
                </div>
                <p className="module-note">{new Date(ruleEngine.lastRunAtUtc).toLocaleString()} · by bucket</p>
                <BreakdownList data={ruleEngine?.byBucket} />
              </>
            ) : (
              <p className="module-note">No rule execution run yet.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
