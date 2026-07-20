import { useEffect, useState } from 'react';
import { Plus, Play, RefreshCcw } from 'lucide-react';
import { useAuth } from '../modules/auth/AuthContext.jsx';
import { useClientOrganizations } from '../hooks/useClientOrganizations.js';
import { createRule, executeRules, fetchRules } from '../api/ruleEngineApi.js';
import { StatusPill } from '../components/DataTable.jsx';
import './RealScreens.css';

const SCOPES = ['Global', 'Internal', 'Client', 'Payer'];
const BUCKETS = ['Workable', 'NonWorkable', 'Calling', 'NonCalling', 'Review'];
const PRIORITIES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

function emptyForm() {
  return {
    name: '', scope: 'Global', conditionExpression: '', resultBucket: 'Workable',
    resultPriority: '', evaluationOrder: 1, excludeSpecialProjectClaims: false, excludeManualAssignmentClaims: false,
  };
}

export function RealRuleEngine() {
  const { user } = useAuth();
  const isAdmin = (user?.roles || []).includes('Admin');
  const { organizations, selectedId, setSelectedId } = useClientOrganizations();

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setRules(await fetchRules(selectedId || undefined));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [selectedId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const needsOrg = form.scope === 'Client' || form.scope === 'Payer';
      await createRule({
        name: form.name,
        scope: form.scope,
        clientOrganizationId: needsOrg ? selectedId : null,
        payerMasterId: null,
        conditionExpression: form.conditionExpression,
        resultBucket: form.resultBucket,
        resultPriority: form.resultPriority || null,
        excludeSpecialProjectClaims: form.excludeSpecialProjectClaims,
        excludeManualAssignmentClaims: form.excludeManualAssignmentClaims,
        evaluationOrder: Number(form.evaluationOrder),
      });
      setModalOpen(false);
      setForm(emptyForm());
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExecute() {
    if (!selectedId) return;
    setExecuting(true);
    setError('');
    setExecResult(null);
    try {
      setExecResult(await executeRules(selectedId));
    } catch (err) {
      setError(err.message);
    } finally {
      setExecuting(false);
    }
  }

  return (
    <section className="section real-screen">
      <div className="module-hero">
        <div>
          <span className="module-kicker">Rule Engine</span>
          <h1>Rule Engine</h1>
          <p>Rules classify approved claims into a work bucket and priority. Global/Internal rules apply everywhere; Client/Payer rules apply only to the selected organization.</p>
        </div>
        <div className="module-actions">
          {organizations.length > 0 && (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          )}
          <button className="ghost-button" onClick={load}><RefreshCcw size={15} /> Refresh</button>
          <button className="ghost-button" disabled={executing || !selectedId} onClick={handleExecute}>
            <Play size={15} /> {executing ? 'Running...' : 'Execute Rules'}
          </button>
          {isAdmin && (
            <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={15} /> Add Rule</button>
          )}
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}
      {execResult && (
        <div className="card">
          <h3>Execution result</h3>
          <div className="stat-row">
            <div><span>Processed</span><strong>{execResult.claimsProcessed}</strong></div>
            <div><span>Matched</span><strong>{execResult.claimsMatched}</strong></div>
            <div><span>Status</span><strong>{execResult.status}</strong></div>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p className="module-note">Loading rules...</p>
        ) : (
          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th><th>Scope</th><th>Condition</th><th>Bucket</th><th>Priority</th><th>Order</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.scope}</td>
                    <td><code>{r.conditionExpression}</code></td>
                    <td>{r.resultBucket}</td>
                    <td>{r.resultPriority || '—'}</td>
                    <td>{r.evaluationOrder}</td>
                    <td><StatusPill value={r.isActive ? 'Active' : 'Inactive'} /></td>
                  </tr>
                ))}
                {rules.length === 0 && <tr><td colSpan={7}>No rules yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="overlay-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Rule</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Scope</label>
                <select value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}>
                  {SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Condition Expression</label>
                <input required placeholder="balance > 5000" value={form.conditionExpression} onChange={(e) => setForm((f) => ({ ...f, conditionExpression: e.target.value }))} />
              </div>
              <div className="field">
                <label>Result Bucket</label>
                <select value={form.resultBucket} onChange={(e) => setForm((f) => ({ ...f, resultBucket: e.target.value }))}>
                  {BUCKETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Result Priority (optional)</label>
                <select value={form.resultPriority} onChange={(e) => setForm((f) => ({ ...f, resultPriority: e.target.value }))}>
                  <option value="">None</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Evaluation Order</label>
                <input required type="number" min={1} value={form.evaluationOrder} onChange={(e) => setForm((f) => ({ ...f, evaluationOrder: e.target.value }))} />
              </div>
              <div className="field">
                <div className="role-checkboxes">
                  <label className="role-checkbox">
                    <input type="checkbox" checked={form.excludeSpecialProjectClaims} onChange={(e) => setForm((f) => ({ ...f, excludeSpecialProjectClaims: e.target.checked }))} />
                    Exclude special-project claims
                  </label>
                  <label className="role-checkbox">
                    <input type="checkbox" checked={form.excludeManualAssignmentClaims} onChange={(e) => setForm((f) => ({ ...f, excludeManualAssignmentClaims: e.target.checked }))} />
                    Exclude manually-assigned claims
                  </label>
                </div>
              </div>
              <div className="split">
                <button type="button" className="ghost-button" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
