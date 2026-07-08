import { Check, CloudUpload, Copy, Lock, Play, Search, Send, ShieldCheck, UserPlus, X } from 'lucide-react';
import { DataTable, ProgressCell, StatusPill } from '../components/DataTable.jsx';
import { BarTrendCard, ComboChart, DonutCard, HorizontalBars, InfoIcon, SimpleBarChart, StackedBars, StatCard } from '../components/Charts.jsx';
import { Shell } from '../components/Shell.jsx';
import {
  allocationRows,
  approvalRows,
  arBuckets,
  arRows,
  arTrend,
  batchRows,
  businessRows,
  clientRows,
  colors,
  comboData,
  donutSpeciality,
  employeeRows,
  escalationCards,
  estNew,
  inventoryRows,
  jobRows,
  kpiCards,
  kpiClientRows,
  manualClaims,
  notifications,
  payerBars,
  performanceRows,
  ruleRows,
  scenarioRows,
  userRows,
} from '../data/adminData.js';
import '../components/DashboardWidgets.css';
import './AdminDashboard.css';

const actionColumn = { key: 'actions', label: 'Actions', filter: 'select' };

export function BusinessMetrics() {
  return (
    <section className="section">
      <h1 className="page-title">Business Metrics</h1>
      {businessRows.map((row) => (
        <div className="grid grid-5 metric-row" key={row.metric}>
          <div className="card business-kpi">
            <InfoIcon />
            <div className="label">{row.metric}</div>
            <div className="kpi-number tabular">{row.value} <span className="delta-up">▲</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${row.progress}%` }} /></div>
            <div className="legend"><span className="legend-dot" style={{ background: colors.brand }} /> {row.metric}</div>
            <small className="muted">Analytics Date Range: 04-2025 - 03-2026 (MTD)</small>
          </div>
          <DonutCard title="Speciality" data={donutSpeciality} />
          <DonutCard title="EST. Vs New" data={estNew} />
          <BarTrendCard title="Monthly Trend" values={row.trend} axis={row.axis} />
          <HorizontalBars title={`Top Payers by ${row.metric}`} data={payerBars} />
        </div>
      ))}
    </section>
  );
}

export function KpiMetrics() {
  const columns = [
    { key: 'client', label: 'Client' },
    { key: 'charges', label: 'Charges', numeric: true },
    { key: 'payments', label: 'Payments', numeric: true },
    { key: 'coll', label: 'Coll %', numeric: true },
    { key: 'denial', label: 'Denial %', numeric: true },
    { key: 'arDays', label: 'AR Days', numeric: true },
    { key: 'trend', label: 'Trend', filter: 'select', render: (value) => <span className={`pill pill-${value === 'up' ? 'green' : 'red'}`}>{value === 'up' ? '▲ Up' : '▼ Down'}</span> },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>KPI Metrics Dashboard</h2></div>
      <div className="grid grid-6">
        {kpiCards.map((card) => <StatCard key={card.label} {...card} tone={card.invert ? 'green' : 'green'} />)}
      </div>
      <div className="grid grid-2 section">
        <ComboChart data={comboData} />
        <DataTable title="KPI by Client" columns={columns} rows={kpiClientRows} compact />
      </div>
    </section>
  );
}

export function ArAnalytics() {
  const columns = [
    { key: 'payer', label: 'Payer' },
    { key: 'a', label: '0-30', numeric: true },
    { key: 'b', label: '31-60', numeric: true },
    { key: 'c', label: '61-90', numeric: true },
    { key: 'd', label: '91-120', numeric: true },
    { key: 'e', label: '120+', numeric: true },
    { key: 'total', label: 'Total', numeric: true },
    { key: 'claims', label: 'Claim Count', numeric: true },
  ];
  const payerCategory = [
    { name: 'Commercial', value: 52, fill: colors.brand },
    { name: 'Medicare', value: 24, fill: colors.primary },
    { name: 'Medicaid', value: 14, fill: colors.violet2 },
    { name: 'Self Pay', value: 10, fill: colors.teal },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>AR Analytics Dashboard</h2></div>
      <div className="grid grid-3">
        <div className="card">
          <InfoIcon />
          <div className="label">Total AR</div>
          <div className="kpi-number tabular">$23.4M</div>
          <div className="ageing-stack">
            {arBuckets.map((bucket) => <span key={bucket.bucket} style={{ width: `${bucket.value * 4}%`, background: bucket.fill }}>{bucket.bucket}</span>)}
          </div>
          <div className="legend">{arBuckets.map((b) => <span className="pill pill-indigo" key={b.bucket}><span className="legend-dot" style={{ background: b.fill }} /> {b.bucket}</span>)}</div>
        </div>
        <DonutCard title="AR by Payer Category" data={payerCategory} />
        <HorizontalBars title="Top 10 Payers by Open AR" data={payerBars} pivots={false} />
      </div>
      <div className="grid grid-2 section">
        <StackedBars title="Ageing Trend" data={arTrend} keys={['0-30', '31-60', '61-90', '91-120', '120+']} />
        <DataTable title="Payer Ageing Drilldown" columns={columns} rows={arRows} />
      </div>
    </section>
  );
}

export function PaymentTrend() {
  const trend = ['Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25'].map((month, i) => ({
    month,
    '0-30': 18 + i * 2,
    '31-60': 14 + i,
    '61-90': 10 + i,
    '91-120': 7 + i,
    '120+': 4 + i,
    avgDays: 39 - i,
  }));
  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'zero', label: '0-30', numeric: true },
    { key: 'thirty', label: '31-60', numeric: true },
    { key: 'sixty', label: '61-90', numeric: true },
    { key: 'ninety', label: '91-120', numeric: true },
    { key: 'old', label: '120+', numeric: true },
    { key: 'total', label: 'Total', numeric: true },
  ];
  return (
    <section className="section">
      <div className="section-title">
        <h2>Payment Trend by Age</h2>
        <div className="chip-row"><span className="pill pill-indigo">Payer: UHC, BCBS</span><span className="pill pill-indigo">Facility: 3 selected</span></div>
      </div>
      <SimpleBarChart title="Payments by Claim Age at Payment" data={trend} xKey="month" bars={['0-30', '31-60', '61-90']} />
      <div className="section"><DataTable title="Month x Age Bucket Matrix" columns={columns} rows={trend.map((row, idx) => ({ month: row.month, zero: `$${row['0-30']}0K`, thirty: `$${row['31-60']}0K`, sixty: `$${row['61-90']}0K`, ninety: `$${row['91-120']}0K`, old: `$${row['120+']}0K`, total: `$${56 + idx * 6}0K` }))} /></div>
    </section>
  );
}

export function AllocationDashboard() {
  const columns = [
    { key: 'lead', label: 'Team Leader' },
    { key: 'size', label: 'Team Size', numeric: true },
    { key: 'assigned', label: 'Assigned', numeric: true },
    { key: 'completed', label: 'Completed', numeric: true },
    { key: 'pending', label: 'Pending', numeric: true },
    { key: 'completion', label: 'Completion %', numeric: true, type: 'progress' },
    { key: 'time', label: 'Avg Touch Time', numeric: true },
  ];
  const hourly = Array.from({ length: 12 }, (_, i) => ({ hour: `${i + 7}:00`, Auto: 60 + i * 8, Manual: 32 + i * 4 }));
  return (
    <section className="section">
      <div className="section-title"><h2>Allocation Dashboard (WFM)</h2></div>
      <div className="grid grid-5">
        {[
          ['Total Inventory', '48,213'], ['Allocated Today', '3,914'], ['Unallocated', '6,102'], ['Rolled Back', '87'], ['Live Queue Depth', '412'],
        ].map(([label, value]) => <StatCard key={label} label={label} value={value} />)}
      </div>
      <div className="grid grid-2 section">
        <DonutCard title="Allocation by Type" data={[{ name: 'Auto', value: 44, fill: colors.brand }, { name: 'Manual', value: 28, fill: colors.primary }, { name: 'Special', value: 12, fill: colors.violet2 }, { name: 'Live', value: 10, fill: colors.teal }, { name: 'DM', value: 6, fill: colors.violet3 }]} />
        <SimpleBarChart title="Hourly Allocation" data={hourly} xKey="hour" bars={['Auto', 'Manual']} />
      </div>
      <div className="section"><DataTable title="Per-TL Allocation Performance" columns={columns} rows={allocationRows} /></div>
    </section>
  );
}

export function RuleEngine() {
  const columns = [
    { key: 'rule', label: 'Rule Name' },
    { key: 'bucket', label: 'Bucket', filter: 'select' },
    { key: 'priority', label: 'Priority', type: 'priority', filter: 'select' },
    { key: 'claims', label: 'Matched Claims', numeric: true },
    { key: 'value', label: 'Matched $', numeric: true },
    { key: 'run', label: 'Last Run' },
    { key: 'status', label: 'Status Toggle', type: 'status', filter: 'select' },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>Rule Engine Dashboard</h2></div>
      <div className="grid grid-5">
        {[
          ['Workable', '21,480', '+4.2%'], ['Non-Workable', '9,312', '-1.1%'], ['Calling', '12,077', '+6.8%'], ['Non-Calling', '3,988', '-0.7%'], ['Review', '1,356', '+2.4%'],
        ].map(([label, value, delta]) => <StatCard key={label} label={label} value={value} delta={delta} />)}
      </div>
      <div className="card section">
        <InfoIcon />
        <p className="chart-title">Import to Buckets to P1-P7 Flow</p>
        <div className="flow">
          <span>Import</span><b /> <span>Workable</span><span>Calling</span><span>Review</span><b /> <span>P1</span><span>P2</span><span>P3</span><span>P4</span><span>P5</span><span>P6</span><span>P7</span>
        </div>
      </div>
      <div className="section"><DataTable title="Rule Performance" columns={columns} rows={ruleRows} /></div>
    </section>
  );
}

export function PerformanceDashboard() {
  const columns = [
    { key: 'rank', label: 'Rank', numeric: true },
    { key: 'employee', label: 'Employee', render: (v) => <span className="avatar-name"><i>{v.slice(0, 1)}</i>{v}</span> },
    { key: 'team', label: 'Team' },
    { key: 'claims', label: 'Claims Worked', numeric: true },
    { key: 'worked', label: '$ Worked', numeric: true },
    { key: 'target', label: 'Target', numeric: true },
    { key: 'ach', label: 'Achievement %', numeric: true, render: (v) => <ProgressCell value={v} /> },
    { key: 'qc', label: 'QC Score', numeric: true },
    { key: 'aht', label: 'Avg Handle Time', numeric: true },
    { key: 'trend', label: 'Trend', filter: 'select' },
  ];
  return (
    <section className="section">
      <div className="section-title">
        <h2>Performance Dashboard</h2>
        <div className="chip-row"><span className="pill pill-indigo">Client: All</span><span className="pill pill-indigo">Process: AR</span><span className="pill pill-indigo">Team: 4 selected</span></div>
      </div>
      <div className="right-rail">
        <DataTable title="Leaderboard" columns={columns} rows={performanceRows} />
        <div className="card spotlight">
          <InfoIcon />
          <div className="label">Top Performer</div>
          <h3>Ananya Iyer</h3>
          <p className="muted">482 claims worked, 98.2% QC, $842,180 touched.</p>
          <div className="gauge">115%</div>
          <span className="pill pill-green">Team Achievement</span>
        </div>
      </div>
    </section>
  );
}

export function EscalationDashboard() {
  const columns = ['Open', 'In Progress', 'Resolved', 'Closed'];
  return (
    <section className="section">
      <div className="section-title"><h2>Escalation Dashboard</h2><span className="pill pill-indigo">Toggle: Kanban | DataTable</span></div>
      <div className="grid grid-4 cards-four">
        {[
          ['Open', '34'], ['In Progress', '12'], ['Resolved (MTD)', '156'], ['Critical', '3'],
        ].map(([label, value]) => <StatCard key={label} label={label} value={value} tone={label === 'Critical' ? 'red' : 'green'} />)}
      </div>
      <div className="kanban section">
        {columns.map((column, index) => (
          <div className="kanban-column" key={column}>
            <h4>{column}</h4>
            {escalationCards.slice(index, index + 2).map((card) => (
              <div className="esc-card" key={`${column}-${card.id}`}>
                <strong>{card.id}</strong>
                <span>{card.client}</span>
                <div className="split"><StatusPill value={card.severity} /><span className="muted">{card.age}</span></div>
                <span className="pill pill-indigo">{card.assignee}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function InventoryOverview() {
  const columns = [
    { key: 'client', label: 'Client' },
    { key: 'claims', label: 'Open Claims', numeric: true },
    { key: 'open', label: 'Open $', numeric: true },
    { key: 'age', label: 'Avg Age', numeric: true },
    { key: 'old', label: '120+ %', numeric: true },
    { key: 'workable', label: 'Workable %', numeric: true },
    { key: 'import', label: 'Last Import' },
    { key: 'fresh', label: 'Freshness', type: 'status', filter: 'select' },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>Inventory Overview</h2></div>
      <div className="grid grid-2">
        <HorizontalBars title="Open Inventory by Client" data={[{ name: 'Austin Heart Group', value: 94 }, { name: 'NorthStar Ortho', value: 78 }, { name: 'Lakeside GI', value: 62 }, { name: 'Metro Urology', value: 48 }]} pivots={false} />
        <SimpleBarChart title="Ageing Waterfall" data={[{ bucket: '0-30', value: 640 }, { bucket: '31-60', value: 490 }, { bucket: '61-90', value: 380 }, { bucket: '91-120', value: 270 }, { bucket: '120+', value: 560 }]} xKey="bucket" bars={['value']} />
      </div>
      <div className="section"><DataTable title="Inventory Freshness" columns={columns} rows={inventoryRows} /></div>
    </section>
  );
}

export function ClientMaster() {
  const columns = [
    { key: 'id', label: 'Client ID' },
    { key: 'code', label: 'Client Code' },
    { key: 'name', label: 'Client Name' },
    { key: 'pms', label: 'PMS Software' },
    { key: 'cbo', label: 'CBO' },
    { key: 'live', label: 'Go-Live Date' },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    actionColumn,
  ];
  return (
    <section className="section">
      <div className="section-title">
        <div><span className="muted">Masters / Master 1 /</span><h2>Client Master</h2></div>
        <button className="primary-button">+ Add Client</button>
      </div>
      <div className="right-rail admin-rail">
        <DataTable columns={columns} rows={clientRows} />
        <div className="slide-over">
          <h3>Add Client</h3>
          <div className="form-grid">
            <div className="field"><label>Client Code</label><input defaultValue="AHG" /><span className="field-error">Client Code already exists</span></div>
            <div className="field"><label>Client Name</label><input defaultValue="Austin Heart Group" /></div>
            <div className="field"><label>PMS Software</label><select><option>Epic</option></select></div>
            <div className="field"><label>CBO</label><select><option>Hyderabad</option></select></div>
            <div className="field"><label>Go-Live Date</label><input type="date" defaultValue="2025-04-01" /></div>
            <div className="field"><label>Active</label><select><option>Yes</option></select></div>
          </div>
          <div className="split"><button className="ghost-button">Cancel</button><button className="primary-button">Save Client</button></div>
        </div>
      </div>
    </section>
  );
}

export function EmployeeInfo() {
  const columns = [
    { key: 'code', label: 'Emp Code' },
    { key: 'name', label: 'Name', render: (v) => <span className="avatar-name"><i>{v.slice(0, 1)}</i>{v}</span> },
    { key: 'designation', label: 'Designation' },
    { key: 'level', label: 'Level' },
    { key: 'division', label: 'Division' },
    { key: 'process', label: 'Process' },
    { key: 'project', label: 'Project' },
    { key: 'manager', label: 'Reporting Manager' },
    { key: 'doj', label: 'DOJ' },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    actionColumn,
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>Employee Info</h2><div className="toggle-group"><button className="active">Employee List</button><button>Add / Edit Employee</button></div></div>
      <DataTable columns={columns} rows={employeeRows} />
      <div className="grid grid-3 section">
        {['Personal Details', 'Employment Details', 'Workstation & ODC', 'Education', 'Bank Details', 'Access Notes'].map((title) => (
          <div className="card" key={title}>
            <InfoIcon />
            <h3>{title}</h3>
            <div className="form-grid">
              <div className="field"><label>Primary Field</label><input placeholder={title} /></div>
              <div className="field"><label>Dropdown</label><select><option>Selected</option></select></div>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky-save"><button className="primary-button">Save Employee</button></div>
    </section>
  );
}

export function RoleAccess() {
  const rows = ['WFM', 'Manual Assignment', 'Assignment Approval', 'Special Assignment', 'Allocation Matrix'];
  return (
    <section className="section">
      <div className="section-title"><h2>Role Management - User Role Access</h2></div>
      <div className="two-pane">
        <div className="card">
          <h3>Role Controls</h3>
          <div className="field"><label>Role</label><select><option>Supervisor</option></select></div>
          <div className="toggle-group wide"><button className="active">Role</button><button>User</button></div>
          <button className="ghost-button"><Copy size={15} /> Copy permissions from</button>
        </div>
        <div className="permission-tree">
          <div className="permission-row header"><span>Node</span><span>View</span><span>Add</span><span>Edit</span><span>Delete</span><span>Download</span><span>Approve</span></div>
          {rows.map((row, index) => (
            <div className="permission-row" key={row}>
              <strong>{index === 0 ? '▾ ' : '  '} {row}</strong>
              {['View', 'Add', 'Edit', 'Delete', 'Download', 'Approve'].map((item, i) => <input key={item} type="checkbox" defaultChecked={i < 3 || index === 0} />)}
            </div>
          ))}
          <div className="sticky-save"><span className="muted">27 changes</span><button className="primary-button"><ShieldCheck size={15} /> Save Permissions</button></div>
        </div>
      </div>
    </section>
  );
}

export function UserRoleManagement() {
  const columns = [
    { key: 'id', label: 'User ID' },
    { key: 'username', label: 'Username' },
    { key: 'employee', label: 'Employee' },
    { key: 'roles', label: 'Role(s)', render: (v) => <span className="pill pill-indigo">{v}</span> },
    { key: 'scope', label: 'Client Scope' },
    { key: 'landing', label: 'Landing Page' },
    { key: 'login', label: 'Last Login' },
    { key: 'locked', label: 'Locked', filter: 'select' },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    actionColumn,
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>User Role Management</h2><button className="primary-button"><UserPlus size={15} /> Add User</button></div>
      <div className="right-rail admin-rail">
        <DataTable columns={columns} rows={userRows} />
        <div className="slide-over">
          <h3>Add User</h3>
          {['Employee Search', 'Role Multi-select', 'Client Multi-select', 'Landing Page'].map((label) => <div className="field" key={label}><label>{label}</label><input placeholder={label} /></div>)}
          <button className="ghost-button"><Lock size={15} /> Generate Password</button>
        </div>
      </div>
    </section>
  );
}

export function ImporterUpload() {
  const columns = [
    { key: 'id', label: 'Batch ID' },
    { key: 'type', label: 'Type', filter: 'select' },
    { key: 'file', label: 'File Name' },
    { key: 'client', label: 'Client' },
    { key: 'by', label: 'Uploaded By' },
    { key: 'date', label: 'Date' },
    { key: 'rows', label: 'Total Rows', numeric: true },
    { key: 'passed', label: 'Passed', numeric: true, render: (v) => <span className="pill pill-green">{v}</span> },
    { key: 'failed', label: 'Failed', numeric: true, render: (v) => <span className="pill pill-red">{v}</span> },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    { key: 'actions', label: 'Actions', render: () => <div className="row-actions"><button title="Approve"><Check size={14} /></button><button title="Reject"><X size={14} /></button><button title="Errors"><Search size={14} /></button></div> },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>Importer - File Upload & Batch Approval</h2></div>
      <div className="grid grid-2">
        <div className="card">
          <div className="upload-zone"><CloudUpload size={36} /> Drag ageing, denial, tasking, TFL or AFL files here</div>
          <div className="form-grid section">
            <div className="field"><label>Importer Type</label><select><option>Ageing</option></select></div>
            <div className="field"><label>Client</label><select><option>Austin Heart Group</option></select></div>
          </div>
          <button className="primary-button section">Validate & Upload</button>
        </div>
        <div className="card">
          <div className="warning-banner">Warning: Approved batches cannot be rolled back.</div>
          <div className="section"><DataTable title="Validation Errors" columns={[{ key: 'row', label: 'Row #' }, { key: 'column', label: 'Column' }, { key: 'error', label: 'Error' }]} rows={[{ row: 42, column: 'Payer Code', error: 'Unknown payer code 10335X' }, { row: 108, column: 'Balance', error: 'Negative balance not allowed' }]} compact /></div>
        </div>
      </div>
      <div className="section"><DataTable title="Batches" columns={columns} rows={batchRows} /></div>
    </section>
  );
}

export function ManualAssignment() {
  const columns = [
    { key: 'enc', label: 'Encounter #' },
    { key: 'payer', label: 'Payer' },
    { key: 'age', label: 'Ageing Bucket', filter: 'select', render: (v) => <span className="pill pill-amber">{v}</span> },
    { key: 'priority', label: 'Priority', type: 'priority', filter: 'select' },
    { key: 'balance', label: 'Balance', numeric: true },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>WFM - Manual Assignment</h2></div>
      <div className="manual-layout">
        <div className="card">
          <h3>Filters</h3>
          {['Client', 'Payer Category', 'Ageing Bucket', 'Priority'].map((label) => <div className="field" key={label}><label>{label}</label><select><option>All</option></select></div>)}
          <div className="field"><label>Balance Range</label><input type="range" defaultValue="72" /></div>
          <span className="pill pill-indigo">Unassigned only: On</span>
        </div>
        <DataTable title="128 selected - $412,380" columns={columns} rows={manualClaims} />
        <div className="card">
          <h3>Assign To</h3>
          {['Priya S - 42 open', 'Rahul M - 17 open', 'Neha R - 64 open', 'Amit K - 38 open'].map((user, index) => (
            <div className="assignee" key={user}><span>{user}</span><ProgressCell value={[42, 17, 64, 38][index]} /></div>
          ))}
          <div className="field"><label>Supervisor</label><select><option>Vikram Rao</option></select></div>
          <span className="pill pill-indigo">Equal distribute: On</span>
          <button className="primary-button">Assign Selected</button>
          <small className="muted">Sent to Manual Assignment Approval</small>
        </div>
      </div>
    </section>
  );
}

export function AssignmentApproval() {
  const columns = [
    { key: 'id', label: 'Request ID' },
    { key: 'type', label: 'Type', filter: 'select' },
    { key: 'by', label: 'Requested By' },
    { key: 'team', label: 'Team' },
    { key: 'claims', label: 'Claims #', numeric: true },
    { key: 'total', label: 'Total $', numeric: true },
    { key: 'date', label: 'Requested Date' },
    { key: 'age', label: 'Aging Timer', render: (v) => <span className="pill pill-amber">{v}</span> },
    { key: 'actions', label: 'Actions', render: () => <div className="row-actions"><button><Check size={14} /></button><button><X size={14} /></button></div> },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>WFM - Assignment Approval</h2></div>
      <DataTable columns={columns} rows={approvalRows} />
      <div className="modal-card">
        <h3>Reject Request REQ-4421</h3>
        <div className="field"><label>Reason</label><textarea defaultValue="Workload distribution exceeds Rahul M threshold. Please rebalance." /></div>
        <div className="split"><button className="ghost-button">Cancel</button><button className="primary-button">Reject with Reason</button></div>
      </div>
    </section>
  );
}

export function ScenarioMaster() {
  const columns = [
    { key: 'id', label: 'Scenario ID' },
    { key: 'name', label: 'Scenario Name' },
    { key: 'mapping', label: 'Status > Action > Sub-Action', render: (v) => <span className="pill pill-indigo">{v}</span> },
    { key: 'preview', label: 'Note Template Preview' },
    { key: 'order', label: 'Display Order', numeric: true },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    actionColumn,
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>Scenario Master</h2></div>
      <div className="right-rail admin-rail">
        <DataTable columns={columns} rows={scenarioRows} />
        <div className="slide-over">
          <h3>Edit Scenario</h3>
          <div className="field"><label>Template</label><textarea rows="8" defaultValue="Claim {encounter} denied by {payer}. Appeal due by {followup_date}." /></div>
          <div className="legend"><span className="pill pill-blue">{'{encounter}'}</span><span className="pill pill-blue">{'{payer}'}</span><span className="pill pill-blue">{'{followup_date}'}</span></div>
        </div>
      </div>
    </section>
  );
}

export function AiJobs() {
  const columns = [
    { key: 'job', label: 'Job Name' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'last', label: 'Last Run' },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    { key: 'next', label: 'Next Run' },
    { key: 'actions', label: 'Actions', render: () => <div className="row-actions"><button><Play size={14} /></button><button>H</button><button>E</button></div> },
  ];
  return (
    <section className="section">
      <div className="section-title"><h2>AI Assistance - Jobs Dashboard</h2></div>
      <div className="grid grid-3">
        <StatCard label="Jobs Today" value="14" />
        <StatCard label="Failed" value="1" tone="red" />
        <StatCard label="Avg Duration" value="4m 12s" />
      </div>
      <div className="section"><DataTable columns={columns} rows={jobRows} /></div>
    </section>
  );
}

export function NotificationsCenter() {
  return (
    <section className="section">
      <div className="section-title"><h2>Notifications Center</h2></div>
      <div className="grid grid-2">
        <div className="card notification-feed">
          {['Today', 'Yesterday', 'Earlier'].map((group) => (
            <div key={group}>
              <div className="label">{group}</div>
              {notifications.filter((item) => item.group === group).map((item) => (
                <div className={`notification-item ${item.unread ? 'unread' : ''}`} key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                  <small className="muted">{item.time}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="card">
          <InfoIcon />
          <h3>Send Broadcast</h3>
          {['To: Role or User', 'Title', 'Message', 'Link'].map((label) => <div className="field" key={label}><label>{label}</label>{label === 'Message' ? <textarea rows="5" /> : <input />}</div>)}
          <button className="primary-button"><Send size={15} /> Send</button>
        </div>
      </div>
    </section>
  );
}

export function AdminDashboard() {
  return (
    <Shell>
      <main className="content">
        <BusinessMetrics />
        <KpiMetrics />
        <ArAnalytics />
        <PaymentTrend />
        <AllocationDashboard />
        <RuleEngine />
        <PerformanceDashboard />
        <EscalationDashboard />
        <InventoryOverview />
        <ClientMaster />
        <EmployeeInfo />
        <RoleAccess />
        <UserRoleManagement />
        <ImporterUpload />
        <ManualAssignment />
        <AssignmentApproval />
        <ScenarioMaster />
        <AiJobs />
        <NotificationsCenter />
      </main>
    </Shell>
  );
}
