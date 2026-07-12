import { useEffect, useState } from 'react';
import { Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { useAuth } from '../modules/auth/AuthContext.jsx';
import { useClientOrganizations } from '../hooks/useClientOrganizations.js';
import { createImporterConfig, fetchImporterConfigs } from '../api/importerApi.js';
import { StatusPill } from '../components/DataTable.jsx';
import './RealScreens.css';

const REPORT_TYPES = ['Ageing', 'Denials', 'Charges', 'Payments', 'Adjustments', 'Tasking'];
const SOURCE_TYPES = ['Sftp', 'Scp', 'RestApi', 'Website'];
const DATA_FORMATS = ['Csv', 'Xlsx', 'Json', 'Xml'];
const SCHEDULE_TRIGGERS = ['Scheduled', 'Reactive'];
const CLASSIFICATIONS = ['Standard', 'CustomerSpecific', 'CustomDefined', 'StatusStoring'];

function emptyMapping() {
  return { sourceColumnName: '', targetFieldName: '', classification: 'Standard', isMandatory: false, isUniquePrimaryIdentifier: false, isUniqueSecondaryIdentifier: false, containsPhi: false };
}

function emptyForm() {
  return {
    rcmReportType: 'Ageing', sourceType: 'Sftp', dataFormat: 'Csv', scheduleTrigger: 'Scheduled',
    importFrequencyCron: '0 6 * * *', fieldMappings: [emptyMapping()],
  };
}

export function RealImporterSetup() {
  const { user } = useAuth();
  const canManage = ['Admin', 'Manager', 'Team Leader'].some((r) => (user?.roles || []).includes(r));
  const { organizations, selectedId, setSelectedId } = useClientOrganizations();

  const [configs, setConfigs] = useState([]);
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
      setConfigs(await fetchImporterConfigs(selectedId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [selectedId]);

  function updateMapping(index, patch) {
    setForm((f) => ({
      ...f,
      fieldMappings: f.fieldMappings.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  }

  function addMapping() {
    setForm((f) => ({ ...f, fieldMappings: [...f.fieldMappings, emptyMapping()] }));
  }

  function removeMapping(index) {
    setForm((f) => ({ ...f, fieldMappings: f.fieldMappings.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createImporterConfig({
        clientOrganizationId: selectedId,
        rcmReportType: form.rcmReportType,
        sourceType: form.sourceType,
        dataFormat: form.dataFormat,
        scheduleTrigger: form.scheduleTrigger,
        importFrequencyCron: form.scheduleTrigger === 'Scheduled' ? form.importFrequencyCron : null,
        fieldMappings: form.fieldMappings,
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
          <span className="module-kicker">Importer</span>
          <h1>Importer Setup</h1>
          <p>Configure how claim data is ingested and mapped for a client organization.</p>
        </div>
        <div className="module-actions">
          {organizations.length > 0 && (
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          )}
          <button className="ghost-button" onClick={load}><RefreshCcw size={15} /> Refresh</button>
          {canManage && (
            <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={15} /> Add Config</button>
          )}
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}

      <div className="card">
        {loading ? (
          <p className="module-note">Loading importer configs...</p>
        ) : (
          <div className="table-scroll">
            <table className="user-table">
              <thead>
                <tr><th>Report Type</th><th>Source</th><th>Format</th><th>Trigger</th><th>Cron</th><th>Mappings</th><th>Status</th></tr>
              </thead>
              <tbody>
                {configs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.rcmReportType}</td>
                    <td>{c.sourceType}</td>
                    <td>{c.dataFormat}</td>
                    <td>{c.scheduleTrigger}</td>
                    <td>{c.importFrequencyCron || '—'}</td>
                    <td>{c.fieldMappings.length}</td>
                    <td><StatusPill value={c.isActive ? 'Active' : 'Inactive'} /></td>
                  </tr>
                ))}
                {configs.length === 0 && <tr><td colSpan={7}>No importer configs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="overlay-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card menu-assign-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Importer Config</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Report Type</label>
                <select value={form.rcmReportType} onChange={(e) => setForm((f) => ({ ...f, rcmReportType: e.target.value }))}>
                  {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Source Type</label>
                <select value={form.sourceType} onChange={(e) => setForm((f) => ({ ...f, sourceType: e.target.value }))}>
                  {SOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Data Format</label>
                <select value={form.dataFormat} onChange={(e) => setForm((f) => ({ ...f, dataFormat: e.target.value }))}>
                  {DATA_FORMATS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Schedule Trigger</label>
                <select value={form.scheduleTrigger} onChange={(e) => setForm((f) => ({ ...f, scheduleTrigger: e.target.value }))}>
                  {SCHEDULE_TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {form.scheduleTrigger === 'Scheduled' && (
                <div className="field">
                  <label>Cron</label>
                  <input value={form.importFrequencyCron} onChange={(e) => setForm((f) => ({ ...f, importFrequencyCron: e.target.value }))} />
                </div>
              )}

              <div className="field">
                <label>Field Mappings</label>
                {form.fieldMappings.map((m, i) => (
                  <div className="field-mapping-row" key={i}>
                    <input required placeholder="Source column" value={m.sourceColumnName} onChange={(e) => updateMapping(i, { sourceColumnName: e.target.value })} />
                    <input required placeholder="Target field" value={m.targetFieldName} onChange={(e) => updateMapping(i, { targetFieldName: e.target.value })} />
                    <select value={m.classification} onChange={(e) => updateMapping(i, { classification: e.target.value })}>
                      {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button type="button" className="ghost-button" onClick={() => removeMapping(i)} disabled={form.fieldMappings.length === 1}>
                      <Trash2 size={14} />
                    </button>
                    <div className="checkboxes">
                      <label><input type="checkbox" checked={m.isMandatory} onChange={(e) => updateMapping(i, { isMandatory: e.target.checked })} /> Mandatory</label>
                      <label><input type="checkbox" checked={m.isUniquePrimaryIdentifier} onChange={(e) => updateMapping(i, { isUniquePrimaryIdentifier: e.target.checked })} /> Primary ID</label>
                      <label><input type="checkbox" checked={m.isUniqueSecondaryIdentifier} onChange={(e) => updateMapping(i, { isUniqueSecondaryIdentifier: e.target.checked })} /> Secondary ID</label>
                      <label><input type="checkbox" checked={m.containsPhi} onChange={(e) => updateMapping(i, { containsPhi: e.target.checked })} /> Contains PHI</label>
                    </div>
                  </div>
                ))}
                <button type="button" className="ghost-button" onClick={addMapping}><Plus size={14} /> Add mapping</button>
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
