import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fireApi } from '../api/fireApi';
import type { FireIncident } from '../types';
import RiskBadge from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [incidents, setIncidents] = useState<FireIncident[]>([]);

  useEffect(() => {
    fireApi.getAll().then(setIncidents).catch(() => setIncidents([]));
  }, []);

  const activeCount = incidents.filter((i) => i.status === 'Active').length;
  const extremeCount = incidents.filter((i) => i.riskLevel === 'Extreme').length;

  return (
    <div className="landing">
      <section className="landing__hero">
        <span className="landing__eyebrow">Live risk monitoring</span>
        <h1>
          Know where wildfires are burning <span>before they reach you.</span>
        </h1>
        <p>
          Wildfire Tracker centralizes incident data, risk levels, and location alerts so
          communities and responders can act fast.
        </p>
        <div className="landing__cta">
          {isAuthenticated ? (
            <button className="btn btn--primary" onClick={() => navigate('/dashboard')}>
              Go to dashboard
            </button>
          ) : (
            <>
              <button className="btn btn--primary" onClick={() => navigate('/register')}>
                Get started
              </button>
              <button className="btn btn--ghost" onClick={() => navigate('/login')}>
                Log in
              </button>
            </>
          )}
        </div>
        <div className="landing__stats">
          <div>
            <strong>{incidents.length}</strong>
            <span>Tracked incidents</span>
          </div>
          <div>
            <strong>{activeCount}</strong>
            <span>Currently active</span>
          </div>
          <div>
            <strong>{extremeCount}</strong>
            <span>Extreme risk</span>
          </div>
        </div>
      </section>

      <section className="landing__feed">
        <h2>Recent incidents</h2>
        <div className="landing__feed-list">
          {incidents.slice(0, 5).map((incident) => (
            <div key={incident.id} className="landing__feed-item">
              <div>
                <strong>{incident.locationName}</strong>
                <p>Status: {incident.status}</p>
              </div>
              <RiskBadge level={incident.riskLevel} />
            </div>
          ))}
          {incidents.length === 0 && <p className="landing__feed-empty">No incident data available yet.</p>}
        </div>
      </section>
    </div>
  );
}
