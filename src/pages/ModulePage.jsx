import { Activity, AlertTriangle, CheckCircle2, Clock3, Database, Download, Plus, RefreshCcw } from 'lucide-react';
import { DataTable, ProgressCell, StatusPill } from '../components/DataTable.jsx';
import { StatCard } from '../components/Charts.jsx';

const payerNames = ['UHC Choice Plus', 'BCBS of TX', 'Cigna Open Access', 'Aetna PPO', 'Medicare TX', 'Humana Gold'];
const owners = ['Ananya Iyer', 'Rahul Menon', 'Priya S', 'Neha R', 'Vikram Rao', 'Amit K'];
const clients = ['Austin Heart Group', 'NorthStar Ortho', 'Lakeside GI', 'Metro Urology'];

function buildRows(title) {
  return Array.from({ length: 10 }, (_, index) => {
    const amount = 8420 + index * 6187;
    return {
      id: `${title.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'M')}-${2026}-${1040 + index}`,
      encounter: `ENC-2026-${104382 + index * 73}`,
      client: clients[index % clients.length],
      payer: payerNames[index % payerNames.length],
      owner: owners[index % owners.length],
      balance: `$${amount.toLocaleString('en-US')}.00`,
      priority: `P${(index % 6) + 1}`,
      status: ['Active', 'Pending Approval', 'In Progress', 'Success', 'Review'][index % 5],
      age: ['0-30', '31-60', '61-90', '91-120', '120+'][index % 5],
      updated: `2026-03-${String(28 - index).padStart(2, '0')}`,
      completion: 48 + index * 5,
    };
  });
}

export function ModulePage({ title, group }) {
  const rows = buildRows(title);
  const columns = [
    { key: 'id', label: 'Record ID' },
    { key: 'encounter', label: 'Encounter #' },
    { key: 'client', label: 'Client' },
    { key: 'payer', label: 'Payer' },
    { key: 'owner', label: 'Owner' },
    { key: 'balance', label: 'Balance', numeric: true },
    { key: 'priority', label: 'Priority', type: 'priority', filter: 'select' },
    { key: 'age', label: 'Ageing', filter: 'select', render: (value) => <span className="pill pill-indigo">{value}</span> },
    { key: 'completion', label: 'Completion', numeric: true, render: (value) => <ProgressCell value={Math.min(value, 96)} /> },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    { key: 'updated', label: 'Updated' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <section className="section module-page">
      <div className="module-hero">
        <div>
          <span className="module-kicker">{group}</span>
          <h1>{title}</h1>
          <p>Operational workspace with dummy healthcare AR data, filters, exports, activity, and approval context.</p>
        </div>
        <div className="module-actions">
          <button className="ghost-button"><RefreshCcw size={15} /> Refresh</button>
          <button className="ghost-button"><Download size={15} /> Export</button>
          <button className="primary-button"><Plus size={15} /> Add Record</button>
        </div>
      </div>

      <div className="grid grid-4 cards-four section">
        <StatCard label="Open Records" value="4,283" delta="+8.4%" />
        <StatCard label="Touched Today" value="912" delta="+12.1%" />
        <StatCard label="Pending Approval" value="147" delta="-3.2%" />
        <StatCard label="Financial Impact" value="$2.84M" delta="+6.8%" />
      </div>

      <div className="grid grid-3 section">
        <div className="card insight-card">
          <Database size={20} />
          <div><strong>Latest import</strong><span>2026-03-28 06:10 from DayClaim.ai DW</span></div>
        </div>
        <div className="card insight-card">
          <Clock3 size={20} />
          <div><strong>SLA window</strong><span>82% of records are inside target turnaround.</span></div>
        </div>
        <div className="card insight-card">
          <Activity size={20} />
          <div><strong>Routing signal</strong><span>High priority claims are routed to AR Follow-up.</span></div>
        </div>
      </div>

      <div className="section">
        <DataTable title={`${title} Worklist`} columns={columns} rows={rows} filteredText="4,283" totalText="12,847" />
      </div>

      <div className="grid grid-2 section">
        <div className="card">
          <h3>Activity Timeline</h3>
          {[
            ['Validation completed', '912 rows passed payer/category checks.', CheckCircle2],
            ['Approval required', '147 records are waiting for supervisor action.', AlertTriangle],
            ['Automation complete', 'Rule Engine updated priority buckets.', CheckCircle2],
          ].map(([label, detail, Icon]) => (
            <div className="timeline-item" key={label}>
              <Icon size={17} />
              <div><strong>{label}</strong><span>{detail}</span></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Current Status Mix</h3>
          <div className="status-mix">
            {['Active', 'Pending Approval', 'In Progress', 'Review', 'Success'].map((status) => <StatusPill key={status} value={status} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
