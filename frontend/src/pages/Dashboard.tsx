import { useEffect, useMemo, useState } from 'react';
import { fireApi } from '../api/fireApi';
import type { FireIncident, RiskLevel, FireStatus } from '../types';
import StatCard from '../components/StatCard';
import FireTable from '../components/FireTable';
import FireMap from '../components/FireMap';
import { useAuth } from '../context/AuthContext';

const riskFilters: (RiskLevel | 'All')[] = ['All', 'Low', 'Moderate', 'High', 'Extreme'];
const statusFilters: (FireStatus | 'All')[] = ['All', 'Active', 'Contained', 'Controlled', 'Extinguished'];

export default function Dashboard() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<FireStatus | 'All'>('All');

  async function loadIncidents() {
    setLoading(true);
    setError(null);
    try {
      const data = await fireApi.getAll({
        search: search || undefined,
        riskLevel: riskFilter !== 'All' ? riskFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setIncidents(data);
    } catch {
      setError('Could not load wildfire data. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFilter, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadIncidents, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stats = useMemo(() => {
    const active = incidents.filter((i) => i.status === 'Active').length;
    const extreme = incidents.filter((i) => i.riskLevel === 'Extreme').length;
    const avgIntensity = incidents.length
      ? incidents.reduce((sum, i) => sum + i.fireIntensity, 0) / incidents.length
      : 0;
    return { active, extreme, avgIntensity, total: incidents.length };
  }, [incidents]);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p>Live overview of tracked wildfire incidents across monitored regions.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Tracked incidents" value={stats.total} accent="default" />
        <StatCard label="Currently active" value={stats.active} accent="ember" />
        <StatCard label="Extreme risk" value={stats.extreme} accent="danger" />
        <StatCard
          label="Avg. intensity"
          value={stats.avgIntensity.toFixed(0)}
          hint="out of 100"
          accent="safe"
        />
      </div>

      <FireMap incidents={incidents} height={360} />

      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="Search by location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'All')}>
          {riskFilters.map((r) => (
            <option key={r} value={r}>
              {r === 'All' ? 'All risk levels' : r}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FireStatus | 'All')}>
          {statusFilters.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All statuses' : s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? <div className="page-loading">Loading incidents…</div> : <FireTable incidents={incidents} />}
    </div>
  );
}
