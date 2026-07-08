import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  Filter,
  Plus,
  RefreshCcw,
  Save,
  Search,
} from 'lucide-react';
import { DataTable, ProgressCell, StatusPill } from '../components/DataTable.jsx';
import { StatCard } from '../components/Charts.jsx';

const payerNames = ['UHC Choice Plus', 'BCBS of TX', 'Cigna Open Access', 'Aetna PPO', 'Medicare TX', 'Humana Gold'];
const owners = ['Ananya Iyer', 'Rahul Menon', 'Priya S', 'Neha R', 'Vikram Rao', 'Amit K'];
const clients = ['Austin Heart Group', 'NorthStar Ortho', 'Lakeside GI', 'Metro Urology'];
const departments = ['AR', 'Appeal', 'Payment Posting', 'Coding', 'Patient Calling', 'Client', 'Adjustment'];

function getModuleKind(group, title) {
  const text = `${group} ${title}`.toLowerCase();
  if (text.includes('master') || text.includes('employee info') || text.includes('role management')) return 'master';
  if (text.includes('report') || text.includes('analytics') || text.includes('dashboard') || text.includes('trend')) return 'report';
  if (text.includes('import') || text.includes('upload') || text.includes('batch')) return 'import';
  if (text.includes('assignment') || text.includes('allocation') || text.includes('wfm') || text.includes('production')) return 'worklist';
  return 'module';
}

function buildRows(title, kind) {
  return Array.from({ length: 15 }, (_, index) => {
    const amount = 8420 + index * 6187;
    const name = owners[index % owners.length];
    return {
      sr: index + 1,
      id: `${title.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'MOD')}-${2026}-${1040 + index}`,
      empId: 4800 + index * 73,
      lastName: name.split(' ')[1] || 'Kumar',
      firstName: name.split(' ')[0],
      gender: index % 3 === 0 ? 'F' : 'M',
      division: 'Operation',
      department: departments[index % departments.length],
      designation: ['Trainee - AR', 'Sr. Executive AR', 'Team Lead - Quality', 'Manager - Operations'][index % 4],
      role: ['User', 'Supervisor', 'Quality Manager', ''][index % 4],
      encounter: `ENC-2026-${104382 + index * 73}`,
      client: clients[index % clients.length],
      payer: payerNames[index % payerNames.length],
      owner: name,
      jobDate: `2026-03-${String(28 - (index % 18)).padStart(2, '0')}`,
      balance: `$${amount.toLocaleString('en-US')}.00`,
      priority: `P${(index % 6) + 1}`,
      status: ['Active', 'Pending Approval', 'In Progress', 'Success', 'Review'][index % 5],
      age: ['0-30', '31-60', '61-90', '91-120', '120+'][index % 5],
      total: 48 + index * 7,
      efficiency: `${74 + (index % 18)}%`,
      updated: `2026-03-${String(28 - index).padStart(2, '0')}`,
      completion: 48 + index * 3,
      fileName: `${title.replace(/\s+/g, '_')}_${String(index + 1).padStart(2, '0')}.xlsx`,
      passed: (8400 + index * 122).toLocaleString('en-US'),
      failed: 12 + index * 3,
      kind,
    };
  });
}

function getColumns(kind) {
  if (kind === 'master') {
    return [
      { key: 'sr', label: 'SR.NO.', numeric: true },
      { key: 'empId', label: 'EMPID', numeric: true },
      { key: 'lastName', label: 'LAST NAME' },
      { key: 'firstName', label: 'FIRST NAME' },
      { key: 'gender', label: 'GENDER', filter: 'select' },
      { key: 'division', label: 'DIVISION', filter: 'select' },
      { key: 'department', label: 'DEPARTMENT', filter: 'select' },
      { key: 'designation', label: 'DESIGNATION' },
      { key: 'role', label: 'ROLE', filter: 'select' },
      { key: 'status', label: 'STATUS', type: 'status', filter: 'select' },
      { key: 'actions', label: 'ACTION' },
    ];
  }

  if (kind === 'report') {
    return [
      { key: 'sr', label: 'S.No.', numeric: true },
      { key: 'owner', label: 'Employee' },
      { key: 'empId', label: 'Employee Code', numeric: true },
      { key: 'client', label: 'Client' },
      { key: 'jobDate', label: 'JobDate' },
      { key: 'department', label: 'Department', filter: 'select' },
      { key: 'division', label: 'Division', filter: 'select' },
      { key: 'total', label: 'Total', numeric: true },
      { key: 'efficiency', label: 'Average Efficiency(%)', numeric: true },
      { key: 'actions', label: 'Action' },
    ];
  }

  if (kind === 'import') {
    return [
      { key: 'id', label: 'Batch ID' },
      { key: 'fileName', label: 'File Name' },
      { key: 'client', label: 'Client' },
      { key: 'owner', label: 'Uploaded By' },
      { key: 'updated', label: 'Upload Date' },
      { key: 'passed', label: 'Passed', numeric: true },
      { key: 'failed', label: 'Failed', numeric: true },
      { key: 'status', label: 'Status', type: 'status', filter: 'select' },
      { key: 'actions', label: 'Action' },
    ];
  }

  return [
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
}

function ModuleControlPanel({ kind, title }) {
  if (kind === 'master') {
    return (
      <div className="card module-control-card">
        <div className="module-control-title">
          <div><strong>{title} Setup</strong><span>Project and master data maintenance</span></div>
          <button className="primary-button"><Save size={15} /> Save</button>
        </div>
        <div className="module-control-grid master-grid">
          <label><span>Project Name</span><select><option>Please Select</option><option>Austin Heart Group</option><option>NorthStar Ortho</option></select></label>
          <label><span>Status</span><select><option>Active</option><option>Inactive</option></select></label>
          <label><span>Search</span><input placeholder={`Search ${title}`} /></label>
          <label><span>Upload File</span><input type="file" /></label>
        </div>
        <p className="module-note">Note: For new project setup, configure client, speciality, practice, payer, provider, CPT, and transition team details.</p>
      </div>
    );
  }

  if (kind === 'report') {
    return (
      <div className="card module-control-card">
        <div className="module-control-title">
          <div><strong>{title} Filters</strong><span>Run report by date, department, manager, supervisor, and user</span></div>
          <button className="primary-button"><Search size={15} /> Search</button>
        </div>
        <div className="module-control-grid report-grid">
          <label><span>From Date</span><input type="date" defaultValue="2026-07-08" /></label>
          <label><span>To Date</span><input type="date" defaultValue="2026-07-08" /></label>
          <label><span>Department</span><select><option>None selected</option><option>AR</option><option>Payment Posting</option><option>Coding</option></select></label>
          <label><span>Type</span><select><option>Select</option><option>Manager</option><option>Supervisor</option></select></label>
          <label><span>Supervisor</span><select><option>None selected</option><option>Priya S</option><option>Rahul M</option></select></label>
          <label><span>User</span><select><option>None selected</option><option>Ananya Iyer</option><option>Meera Nair</option></select></label>
        </div>
        <div className="module-radio-row">
          <label><input type="radio" name={`${title}-metric`} defaultChecked /> Production</label>
          <label><input type="radio" name={`${title}-metric`} /> Efficiency</label>
          <label><input type="radio" name={`${title}-process`} defaultChecked /> Process</label>
          <label><input type="radio" name={`${title}-process`} /> Sub Process</label>
        </div>
      </div>
    );
  }

  return (
    <div className="card module-control-card">
      <div className="module-control-title">
        <div><strong>{title} Filters</strong><span>Use the common work queue controls before loading records</span></div>
        <button className="primary-button"><Filter size={15} /> Filter</button>
      </div>
      <div className="module-control-grid">
        <label><span>Client</span><select><option>None selected</option><option>Austin Heart Group</option></select></label>
        <label><span>Payer</span><select><option>None selected</option><option>UHC Choice Plus</option><option>BCBS of TX</option></select></label>
        <label><span>Priority</span><select><option>All</option><option>P1</option><option>P2</option><option>P3</option></select></label>
        <label><span>Date</span><input type="date" defaultValue="2026-07-08" /></label>
      </div>
    </div>
  );
}

export function ModulePage({ title, group }) {
  const kind = getModuleKind(group, title);
  const rows = buildRows(title, kind);
  const columns = getColumns(kind);
  const addLabel = kind === 'master' ? `New ${title.replace(/ Master$/i, '')}` : kind === 'report' ? 'Run Report' : 'Add Record';

  return (
    <section className="section module-page">
      <div className="module-hero">
        <div>
          <span className="module-kicker">{group}</span>
          <h1>{title}</h1>
          <p>DayClaim.ai workspace with dummy healthcare AR data, filters, exports, activity, approvals, and DataTable controls.</p>
        </div>
        <div className="module-actions">
          <button className="ghost-button"><RefreshCcw size={15} /> Refresh</button>
          <button className="ghost-button"><Download size={15} /> Export</button>
          <button className="primary-button"><Plus size={15} /> {addLabel}</button>
        </div>
      </div>

      <ModuleControlPanel kind={kind} title={title} />

      <div className="grid grid-4 cards-four section">
        <StatCard label={kind === 'report' ? 'Report Rows' : 'Open Records'} value="4,283" delta="+8.4%" />
        <StatCard label={kind === 'report' ? 'Processed Today' : 'Touched Today'} value="912" delta="+12.1%" />
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
          <CalendarDays size={20} />
          <div><strong>Current period</strong><span>07/08/2026 to 07/08/2026 with MTD context.</span></div>
        </div>
      </div>

      <div className="section">
        <DataTable title={`${title} ${kind === 'report' ? 'Result' : 'List'}`} columns={columns} rows={rows} filteredText="1,701" totalText="12,847" />
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
