import { useEffect, useState } from 'react';
import { fireApi } from '../api/fireApi';
import { useAuth } from '../context/AuthContext';
import type { FireIncident } from '../types';
import RiskBadge from '../components/RiskBadge';
import { timeAgo } from '../utils/riskStyles';

const REGIONS = [
  'California', 'Oregon', 'Washington', 'Arizona', 'Colorado',
  'Nevada', 'New Mexico', 'Texas', 'Idaho', 'Montana',
];

export default function Alerts() {
  const { user, updatePreferredRegion } = useAuth();
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [region, setRegion] = useState(user?.preferredRegion ?? REGIONS[0]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fireApi
      .getAll()
      .then(setIncidents)
      .finally(() => setLoading(false));
  }, []);

  const matches = incidents.filter(
    (i) =>
      i.locationName.toLowerCase().includes(region.toLowerCase()) &&
      (i.riskLevel === 'High' || i.riskLevel === 'Extreme') &&
      i.status === 'Active'
  );

  async function handleSave() {
    setSaving(true);
    try {
      await updatePreferredRegion(region);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Alerts</h1>
          <p>Choose a region to watch. We'll flag active high and extreme risk fires near it.</p>
        </div>
      </div>

      <div className="alert-settings">
        <label>
          Watching region
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save preference'}
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Checking for alerts…</div>
      ) : matches.length === 0 ? (
        <div className="empty-state empty-state--safe">
          <p>No high or extreme risk fires detected near {region} right now.</p>
          <span>We'll keep watching — check back or widen your region.</span>
        </div>
      ) : (
        <div className="alert-list">
          {matches.map((incident) => (
            <div key={incident.id} className="alert-card">
              <div className="alert-card__icon" aria-hidden>⚠️</div>
              <div className="alert-card__body">
                <div className="alert-card__top">
                  <strong>High wildfire risk detected near {region}</strong>
                  <RiskBadge level={incident.riskLevel} />
                </div>
                <p>{incident.locationName} · intensity {incident.fireIntensity.toFixed(0)}/100</p>
                <span>{timeAgo(incident.detectedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
