import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { colors, months } from '../data/adminData.js';

export function InfoIcon() {
  return <span className="card-info">i</span>;
}

export function StatCard({ label, value, delta, tone = 'green', spark }) {
  const sparkData = (spark || [4, 7, 5, 9, 8, 11]).map((v, i) => ({ name: i, v }));
  return (
    <div className="card stat-card">
      <InfoIcon />
      <div className="label">{label}</div>
      <div className="kpi-number tabular">{value}</div>
      {delta && <span className={`pill pill-${tone}`}>{delta}</span>}
      <div style={{ height: 42, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <Area dataKey="v" stroke={colors.primary} fill="#E8E4FF" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DonutCard({ title, data }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={64} paddingAngle={2}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        {data.map((item) => (
          <span className="pill pill-indigo" key={item.name}>
            <span className="legend-dot" style={{ background: item.fill }} /> {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BarTrendCard({ title, values, axis }) {
  const data = months.map((month, index) => ({ month, value: values[index] }));
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 172 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 10 }} label={{ value: axis, angle: -90, position: 'insideLeft', fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill={colors.brand} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HorizontalBars({ title, data, pivots = true }) {
  return (
    <div className="card horizontal-bars">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div className="hbar-list">
        {data.map((item) => (
          <div className="hbar" key={item.name}>
            <span>{item.name}</span>
            <div><i style={{ width: `${item.value}%` }} /></div>
          </div>
        ))}
      </div>
      {pivots && (
        <div className="pivot-stack">
          {['Payer', 'CPT', 'Provider', 'Group Name', 'State', 'Office Key'].map((pivot, index) => (
            <button className={index === 0 ? 'active' : ''} key={pivot}>{pivot}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ComboChart({ data }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">13-Month Charges, Payments & Collection %</p>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="charges" fill={colors.brand} radius={[5, 5, 0, 0]} />
            <Bar dataKey="payments" fill={colors.violet2} radius={[5, 5, 0, 0]} />
            <Line type="monotone" dataKey="collection" stroke={colors.teal} strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StackedBars({ title, data, keys }) {
  const fills = ['#12B76A', '#84CC16', '#F79009', '#FB6514', '#F04438'];
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => <Bar key={key} dataKey={key} stackId="a" fill={fills[index]} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SimpleBarChart({ title, data, xKey, bars }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => <Bar key={bar} dataKey={bar} fill={[colors.brand, colors.primary, colors.teal][index % 3]} radius={[5, 5, 0, 0]} />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
