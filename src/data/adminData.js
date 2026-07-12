export const colors = {
  brand: '#15133C',
  teal: '#44BB8D',
  primary: '#44BB8D',
  violet2: '#69CDA3',
  violet3: '#A8E5C9',
  violet4: '#E7F8F0',
  success: '#12B76A',
  warning: '#F79009',
  danger: '#F04438',
  info: '#2E90FA',
};

// Every item here maps to a real, backend-connected screen (see
// moduleRegistry.jsx) — the much larger placeholder menu (Reports, Masters,
// WFM, Knowledge Base, etc.) was removed until each of those is actually
// built against a real API, rather than shipping fake data as if it were real.
export const menuGroups = [
  { label: 'Dashboard', direct: true },
  { label: 'Rule Engine', direct: true },
  { label: 'Importer', items: ['Importer Setup'] },
  { label: 'Notes', items: ['Scenario Master'] },
  { label: 'Role Management', items: ['User Role Management'] },
  { label: 'Other', items: ['Login Credentials'] },
];

export const months = ['Apr-25', 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26'];

export const payerBars = [
  { name: '12002 BCBS of TX', value: 92 },
  { name: '14400 United Healthcare', value: 86 },
  { name: '10335 Medicare', value: 74 },
  { name: '14200 Cigna', value: 66 },
  { name: '14000 Aetna', value: 52 },
];

export const businessRows = [
  { metric: 'Visit', value: '11,466', trend: [42, 49, 53, 51, 60, 64, 67, 72, 76, 81, 84, 89], progress: 82, axis: 'Visits' },
  { metric: 'Charges', value: '$95,712,646.16', trend: [72, 88, 104, 96, 121, 136, 148, 165, 158, 174, 188, 202], progress: 76, axis: '$M' },
  { metric: 'Payments', value: '$42,864,980.42', trend: [41, 45, 49, 52, 58, 63, 61, 68, 72, 76, 81, 86], progress: 70, axis: '$M' },
  { metric: 'Adjustments', value: '$18,206,412.77', trend: [28, 31, 29, 33, 36, 38, 41, 39, 44, 46, 48, 51], progress: 58, axis: '$M' },
];

export const donutSpeciality = [
  { name: 'AI', value: 32, fill: colors.brand },
  { name: 'GE', value: 24, fill: colors.primary },
  { name: 'NU', value: 18, fill: colors.violet2 },
  { name: 'ID', value: 14, fill: colors.violet3 },
  { name: 'RH', value: 12, fill: colors.violet4 },
];

export const estNew = [
  { name: 'Established', value: 68, fill: colors.brand },
  { name: 'New', value: 32, fill: colors.teal },
];

export const kpiCards = [
  { label: 'Gross Collection Rate', value: '96.2%', delta: '+2.1%', spark: [62, 66, 69, 68, 72, 78, 82] },
  { label: 'Net Collection Rate', value: '94.8%', delta: '+1.4%', spark: [59, 64, 63, 70, 73, 74, 80] },
  { label: 'First Pass Rate', value: '88.4%', delta: '+3.0%', spark: [52, 55, 58, 63, 60, 66, 72] },
  { label: 'Denial Rate', value: '7.2%', delta: '-0.8%', spark: [18, 16, 17, 14, 12, 10, 8], invert: true },
  { label: 'AR Days', value: '34.6', delta: '-1.9', spark: [48, 46, 43, 44, 40, 38, 35], invert: true },
  { label: 'AR > 90 Days', value: '18.3%', delta: '-2.4%', spark: [30, 28, 25, 26, 23, 20, 18], invert: true },
];

export const comboData = months.map((month, index) => ({
  month,
  charges: 86 + index * 7 + (index % 3) * 5,
  payments: 48 + index * 4 + (index % 2) * 6,
  collection: 82 + index * 1.1,
}));

export const kpiClientRows = [
  { client: 'Austin Heart Group', charges: '$12,840,211', payments: '$9,382,441', coll: '96.1%', denial: '6.4%', arDays: 31, trend: 'up' },
  { client: 'NorthStar Ortho', charges: '$9,620,880', payments: '$7,902,144', coll: '94.8%', denial: '7.1%', arDays: 36, trend: 'up' },
  { client: 'Lakeside GI', charges: '$7,118,440', payments: '$5,680,288', coll: '91.5%', denial: '8.9%', arDays: 42, trend: 'down' },
  { client: 'Metro Urology', charges: '$6,842,130', payments: '$5,612,430', coll: '95.4%', denial: '5.8%', arDays: 33, trend: 'up' },
];

export const arBuckets = [
  { bucket: '0-30', value: 6.4, fill: '#12B76A' },
  { bucket: '31-60', value: 4.9, fill: '#84CC16' },
  { bucket: '61-90', value: 3.8, fill: '#F79009' },
  { bucket: '91-120', value: 2.7, fill: '#FB6514' },
  { bucket: '120+', value: 5.6, fill: '#F04438' },
];

export const arTrend = months.map((month, index) => ({
  month,
  '0-30': 4.4 + index * .12,
  '31-60': 3.2 + index * .09,
  '61-90': 2.5 + index * .08,
  '91-120': 1.8 + index * .06,
  '120+': 3.6 - index * .04,
}));

export const arRows = [
  { payer: 'UHC Choice Plus', a: '$1,842,100', b: '$920,420', c: '$642,190', d: '$381,240', e: '$1,124,770', total: '$4,910,720', claims: '8,214' },
  { payer: 'BCBS of TX', a: '$1,420,330', b: '$812,006', c: '$502,884', d: '$274,221', e: '$942,180', total: '$3,951,621', claims: '6,892' },
  { payer: 'Cigna Open Access', a: '$980,214', b: '$601,883', c: '$389,040', d: '$210,980', e: '$602,120', total: '$2,784,237', claims: '4,703' },
  { payer: 'Aetna PPO', a: '$874,020', b: '$522,118', c: '$310,280', d: '$184,118', e: '$498,006', total: '$2,388,542', claims: '4,118' },
  { payer: 'Medicare TX', a: '$721,006', b: '$448,006', c: '$286,440', d: '$168,900', e: '$420,114', total: '$2,044,466', claims: '3,928' },
];

export const agePaymentRows = months.slice(0, 8).map((month, index) => ({
  month,
  zero: `$${(1.8 + index * .2).toFixed(1)}M`,
  thirty: `$${(1.4 + index * .16).toFixed(1)}M`,
  sixty: `$${(1.1 + index * .11).toFixed(1)}M`,
  ninety: `$${(.8 + index * .08).toFixed(1)}M`,
  old: `$${(.5 + index * .06).toFixed(1)}M`,
  total: `$${(5.6 + index * .61).toFixed(1)}M`,
}));

export const allocationRows = [
  { lead: 'Priya S', size: 14, assigned: 1240, completed: 984, pending: 256, completion: 79, time: '7m 18s' },
  { lead: 'Rahul M', size: 12, assigned: 1022, completed: 842, pending: 180, completion: 82, time: '6m 54s' },
  { lead: 'Neha R', size: 16, assigned: 1410, completed: 1026, pending: 384, completion: 73, time: '8m 02s' },
  { lead: 'Amit K', size: 10, assigned: 884, completed: 742, pending: 142, completion: 84, time: '6m 11s' },
];

export const ruleRows = [
  { rule: 'UHC portal no response > 14 days', bucket: 'Calling', priority: 'P1', claims: '4,210', value: '$1,820,440', run: '2026-03-28 02:14', status: 'Active' },
  { rule: 'Denial CO-97 duplicate detected', bucket: 'Review', priority: 'P2', claims: '1,184', value: '$642,190', run: '2026-03-28 02:16', status: 'Active' },
  { rule: 'Balance < $100 auto close candidate', bucket: 'Non-Workable', priority: 'P6', claims: '6,902', value: '$412,870', run: '2026-03-28 02:19', status: 'Paused' },
  { rule: 'Medicare timely filing window', bucket: 'Workable', priority: 'P1', claims: '820', value: '$1,204,128', run: '2026-03-28 02:23', status: 'Active' },
];

export const performanceRows = [
  { rank: 1, employee: 'Ananya Iyer', team: 'Priya S', claims: 482, worked: '$842,180', target: 420, ach: 115, qc: '98.2%', aht: '5m 42s', trend: 'up' },
  { rank: 2, employee: 'Vikram Rao', team: 'Rahul M', claims: 461, worked: '$804,420', target: 410, ach: 112, qc: '97.4%', aht: '5m 58s', trend: 'up' },
  { rank: 3, employee: 'Meera Nair', team: 'Neha R', claims: 438, worked: '$762,190', target: 405, ach: 108, qc: '96.8%', aht: '6m 12s', trend: 'flat' },
  { rank: 4, employee: 'Siddharth Jain', team: 'Amit K', claims: 419, worked: '$710,840', target: 400, ach: 105, qc: '95.9%', aht: '6m 26s', trend: 'up' },
];

export const escalationCards = [
  { id: 'ESC-2026-0142', client: 'Austin Heart Group', severity: 'Critical', age: '6h 18m', assignee: 'Ananya' },
  { id: 'ESC-2026-0148', client: 'Lakeside GI', severity: 'High', age: '1d 4h', assignee: 'Rahul' },
  { id: 'ESC-2026-0151', client: 'Metro Urology', severity: 'Medium', age: '2d 1h', assignee: 'Neha' },
  { id: 'ESC-2026-0159', client: 'NorthStar Ortho', severity: 'Low', age: '4d 3h', assignee: 'Amit' },
];

export const inventoryRows = [
  { client: 'Austin Heart Group', claims: '12,884', open: '$8,420,130', age: 41, old: '17.4%', workable: '72.1%', import: '2026-03-28 06:10', fresh: 'Fresh' },
  { client: 'NorthStar Ortho', claims: '10,442', open: '$6,904,210', age: 46, old: '22.8%', workable: '68.4%', import: '2026-03-27 21:00', fresh: 'Fresh' },
  { client: 'Lakeside GI', claims: '8,214', open: '$5,112,940', age: 53, old: '29.2%', workable: '63.8%', import: '2026-03-26 09:40', fresh: 'Aging' },
  { client: 'Metro Urology', claims: '6,902', open: '$3,984,620', age: 61, old: '34.5%', workable: '57.6%', import: '2026-03-23 18:12', fresh: 'Stale' },
];

export const clientRows = [
  { id: 'CL-1001', code: 'AHG', name: 'Austin Heart Group', pms: 'Epic', cbo: 'Hyderabad', live: '2025-04-01', status: 'Active' },
  { id: 'CL-1002', code: 'NSO', name: 'NorthStar Ortho', pms: 'Athena', cbo: 'Chennai', live: '2025-05-12', status: 'Active' },
  { id: 'CL-1003', code: 'LGI', name: 'Lakeside GI', pms: 'eClinicalWorks', cbo: 'Bengaluru', live: '2025-07-18', status: 'Inactive' },
  { id: 'CL-1004', code: 'MURO', name: 'Metro Urology', pms: 'NextGen', cbo: 'Pune', live: '2025-09-03', status: 'Active' },
];

export const employeeRows = [
  { code: 'EMP-2044', name: 'Ananya Iyer', designation: 'AR Caller', level: 'L2', division: 'RCM', process: 'AR Follow-up', project: 'Austin Heart', manager: 'Priya S', doj: '2024-11-18', status: 'Active' },
  { code: 'EMP-2188', name: 'Rahul Menon', designation: 'Senior Analyst', level: 'L3', division: 'RCM', process: 'Denials', project: 'NorthStar', manager: 'Vikram R', doj: '2023-08-07', status: 'Active' },
  { code: 'EMP-2291', name: 'Meera Nair', designation: 'QA Analyst', level: 'L3', division: 'Quality', process: 'Audit', project: 'Metro Urology', manager: 'Neha R', doj: '2022-02-14', status: 'Active' },
  { code: 'EMP-2334', name: 'Siddharth Jain', designation: 'Trainee', level: 'L1', division: 'RCM', process: 'Payment Posting', project: 'Lakeside GI', manager: 'Amit K', doj: '2025-01-06', status: 'Inactive' },
];

export const userRows = [
  { id: 'USR-1009', username: 'ananya.iyer', employee: 'Ananya Iyer', roles: 'AR Analyst, WFM View', scope: 'Austin Heart', landing: 'Business Metrics', login: '2026-03-28 09:42', locked: 'No', status: 'Active' },
  { id: 'USR-1012', username: 'priya.s', employee: 'Priya S', roles: 'Team Lead, Approver', scope: 'All RCM', landing: 'Allocation Dashboard', login: '2026-03-28 09:36', locked: 'No', status: 'Active' },
  { id: 'USR-1031', username: 'rahul.m', employee: 'Rahul Menon', roles: 'Supervisor', scope: 'NorthStar', landing: 'Performance Dashboard', login: '2026-03-27 18:06', locked: 'Yes', status: 'Active' },
];

export const batchRows = [
  { id: 'BAT-2026-8810', type: 'Ageing', file: 'AHG_ATB_20260328.xlsx', client: 'Austin Heart Group', by: 'Priya S', date: '2026-03-28', rows: '42,180', passed: '41,902', failed: '278', status: 'Pending Approval' },
  { id: 'BAT-2026-8804', type: 'Denial', file: 'NSO_DENIAL_0327.csv', client: 'NorthStar Ortho', by: 'Rahul M', date: '2026-03-27', rows: '8,944', passed: '8,901', failed: '43', status: 'Approved' },
  { id: 'BAT-2026-8792', type: 'Tasking', file: 'LGI_TASK_0326.csv', client: 'Lakeside GI', by: 'Neha R', date: '2026-03-26', rows: '12,640', passed: '12,118', failed: '522', status: 'Rejected' },
];

export const manualClaims = [
  { enc: 'ENC-2026-104382', payer: 'UHC Choice Plus', age: '91-120', priority: 'P1', balance: '$42,180.00', status: 'Unassigned' },
  { enc: 'ENC-2026-104921', payer: 'BCBS of TX', age: '61-90', priority: 'P2', balance: '$18,406.42', status: 'Unassigned' },
  { enc: 'ENC-2026-105022', payer: 'Cigna', age: '31-60', priority: 'P3', balance: '$8,912.18', status: 'Unassigned' },
  { enc: 'ENC-2026-105184', payer: 'Medicare', age: '120+', priority: 'P1', balance: '$21,704.50', status: 'Unassigned' },
];

export const approvalRows = [
  { id: 'REQ-4421', type: 'Manual', by: 'Priya S', team: 'AR East', claims: 128, total: '$412,380', date: '2026-03-28 10:12', age: '42m' },
  { id: 'REQ-4419', type: 'Special', by: 'Rahul M', team: 'Denials', claims: 84, total: '$286,004', date: '2026-03-28 09:18', age: '1h 36m' },
  { id: 'REQ-4414', type: 'Auto Setup', by: 'Neha R', team: 'WFM', claims: 420, total: '$1,104,820', date: '2026-03-27 17:04', age: '17h' },
];

export const scenarioRows = [
  { id: 'SCN-001', name: 'Claim denied - medical necessity', mapping: 'Denied > Appeal > Medical Records', preview: 'Claim {encounter} denied by {payer}. Appeal packet requested...', order: 1, status: 'Active' },
  { id: 'SCN-002', name: 'Payer portal no response', mapping: 'No Status > Call > Follow-up', preview: 'Portal unavailable. Follow-up scheduled for {followup_date}.', order: 2, status: 'Active' },
  { id: 'SCN-003', name: 'CO-97 duplicate denial', mapping: 'Denied > Review > Duplicate', preview: 'CO-97 received. Original claim reference {claim_id}.', order: 3, status: 'Inactive' },
];

export const jobRows = [
  { job: 'Nightly DW Refresh', schedule: 'Daily 2:00 AM', last: '2026-03-28 02:00', duration: '7m 42s', status: 'Success', next: '2026-03-29 02:00' },
  { job: 'Ageing Import BOT', schedule: 'Daily 3:15 AM', last: '2026-03-28 03:15', duration: '4m 10s', status: 'Success', next: '2026-03-29 03:15' },
  { job: 'Rule Engine Run', schedule: 'Every 4 hours', last: '2026-03-28 08:00', duration: '2m 38s', status: 'Running', next: '2026-03-28 12:00' },
  { job: 'QA Sampling', schedule: 'Weekdays 6:30 PM', last: '2026-03-27 18:30', duration: '1m 08s', status: 'Failed', next: '2026-03-28 18:30' },
];

export const notifications = [
  { group: 'Today', title: 'Batch approval pending', text: 'BAT-2026-8810 has 278 validation failures.', time: '12m ago', unread: true },
  { group: 'Today', title: 'Critical escalation', text: 'ESC-2026-0142 breached the 6 hour SLA.', time: '28m ago', unread: true },
  { group: 'Yesterday', title: 'Rule engine completed', text: '12,077 claims routed to calling queues.', time: '1d ago' },
  { group: 'Earlier', title: 'Password policy updated', text: 'Admin password expiry changed to 45 days.', time: '3d ago' },
];
