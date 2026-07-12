import { useEffect, useState } from 'react';
import { Plus, RefreshCcw } from 'lucide-react';
import { useClientOrganizations } from '../hooks/useClientOrganizations.js';
import { createScenario, fetchScenarios } from '../api/notesApi.js';
import { StatusPill } from '../components/DataTable.jsx';
import './RealScreens.css';

function emptyForm() {
  return { name: '', statusActionSubActionMapping: '', noteTemplate: '', displayOrder: 1 };
}

export function RealScenarioMaster() {
  const { organizations, selectedId, setSelectedId } = useClientOrganizations();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    try {
      setScenarios(await fetchScenarios(selectedId));
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
      await createScenario({
        clientOrganizationId: selectedId,
        name: form.name,
        statusActionSubActionMapping: form.statusActionSubActionMapping,
        noteTemplate: form.noteTemplate,
        displayOrder: Number(form.displayOrder),
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

  return (
    <section className="section real-screen">
      <div className="module-hero">
        <div>
          <span className="module-kicker">Notes</span>
          <h1>Scenario Master</h1>
          <p>Templates agents use to log a claim note with a consistent status/action mapping.</p>
        </div>
        <div className="module-actions">
          {organizations.length > 0 && (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          )}
          <button className="ghost-button" onClick={load}><RefreshCcw size={15} /> Refresh</button>
          <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={15} /> Add Scenario</button>
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}

      <div className="card">
        {loading ? (
          <p className="module-note">Loading scenarios...</p>
        ) : (
          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr><th>Name</th><th>Status &gt; Action &gt; Sub-Action</th><th>Note Template</th><th>Order</th><th>Status</th></tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.statusActionSubActionMapping}</td>
                    <td>{s.noteTemplate}</td>
                    <td>{s.displayOrder}</td>
                    <td><StatusPill value={s.isActive ? 'Active' : 'Inactive'} /></td>
                  </tr>
                ))}
                {scenarios.length === 0 && <tr><td colSpan={5}>No scenarios yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="overlay-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Scenario</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Status &gt; Action &gt; Sub-Action</label>
                <input required placeholder="Denied > Appeal > Timely Filing" value={form.statusActionSubActionMapping} onChange={(e) => setForm((f) => ({ ...f, statusActionSubActionMapping: e.target.value }))} />
              </div>
              <div className="field">
                <label>Note Template</label>
                <textarea required placeholder="Claim {encounter} denied by {payer}." value={form.noteTemplate} onChange={(e) => setForm((f) => ({ ...f, noteTemplate: e.target.value }))} />
              </div>
              <div className="field">
                <label>Display Order</label>
                <input required type="number" min={1} value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} />
              </div>
              {error && <p className="field-error">{error}</p>}
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
