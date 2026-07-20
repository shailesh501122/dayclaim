import { useEffect, useState } from 'react';
import { RefreshCcw, LayoutDashboard, Zap } from 'lucide-react';
import { useClientOrganizations } from '../hooks/useClientOrganizations.js';
import { fetchAssignmentSummary, fetchInventorySummary, fetchRuleEngineSummary } from '../api/dashboardApi.js';
import { StatCard, DonutCard, HorizontalBars, SimpleBarChart } from '../components/Charts.jsx';
import '../components/DashboardWidgets.css';
import './RealScreens.css';

/**
 * RealDashboard provides a high-fidelity overview of actual system data
 * using premium A$cent Health components and real backend APIs.
 */
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

  useEffect(() => { 
    if (selectedId) load(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Data transformation for Recharts
  const inventoryChartData = inventory?.byBucket ? 
    Object.entries(inventory.byBucket).map(([name, value]) => ({ name, value })) : [];
  
  const assignmentChartData = assignment?.byUser ? 
    Object.entries(assignment.byUser).map(([name, value]) => ({ name, value })) : [];

  return (
    <section className="section real-screen">
      <div className="module-hero">
        <div className="hero-left">
          <span className="module-kicker"><LayoutDashboard size={12} /> Analytics Dashboard</span>
          <h1>System Overview</h1>
          <p>Real-time visibility into claim inventory, allocations, and rule engine performance for the selected business unit.</p>
        </div>
        <div className="module-actions">
          {organizations.length > 0 && (
            <div className="field sm">
              <select 
                className="org-selector" 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                style={{ minWidth: '220px' }}
              >
                {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
              </select>
            </div>
          )}
          <button className="primary-button" onClick={load} disabled={loading}>
            <RefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {(orgsError || error) && (
        <div className="module-error" style={{ margin: '14px 0' }}>
          <h2>Connection Error</h2>
          <p>{orgsError || error}</p>
          <button className="ghost-button sm" onClick={load}>Retry Connection</button>
        </div>
      )}

      {orgsLoading || (loading && !inventory) ? (
        <div className="module-loading">
          <Zap size={32} className="animate-pulse" style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>Retrieving real-time operational data from A$cent backend...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-4 section">
            <StatCard 
              label="Total Open Inventory" 
              value={inventory?.totalOpen?.toLocaleString() ?? '0'} 
              delta="+2.4%" 
              spark={[30, 35, 42, 38, 48, 52, 50]} 
            />
            <StatCard 
              label="Avg Ageing Days" 
              value={inventory?.averageAgeDays ?? '0'} 
              delta="-1.2%" 
              tone="red" 
              invert 
              spark={[45, 43, 46, 42, 40, 38, 41]} 
            />
            <StatCard 
              label="Allocated Claims" 
              value={assignment?.totalAllocated?.toLocaleString() ?? '0'} 
              delta="+5.1%" 
              spark={[60, 65, 70, 75, 82, 88, 84]} 
            />
            <StatCard 
              label="Processed (Last Run)" 
              value={ruleEngine?.lastRunClaimsProcessed?.toLocaleString() ?? '0'} 
              delta={ruleEngine?.lastRunAtUtc ? new Date(ruleEngine.lastRunAtUtc).toLocaleDateString() : 'N/A'}
              tone="indigo" 
              spark={[20, 25, 22, 30, 28, 35, 32]} 
            />
          </div>

          <div className="grid grid-2 section">
            <DonutCard title="Inventory Distribution (Buckets)" data={inventoryChartData} />
            <SimpleBarChart 
              title="Allocation by User (Capacity)" 
              data={assignmentChartData} 
              xKey="name" 
              bars={['value']} 
            />
          </div>

          {ruleEngine?.lastRunAtUtc && (
            <div className="section">
              <HorizontalBars 
                title="Rule Engine Performance by Bucket" 
                data={Object.entries(ruleEngine.byBucket).map(([name, value]) => ({ name, value }))} 
                pivots={false} 
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
