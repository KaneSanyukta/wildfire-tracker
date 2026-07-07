import { useEffect, useState } from 'react';
import { fireApi } from '../api/fireApi';
import type { FireIncident } from '../types';
import FireMap from '../components/FireMap';

export default function MapView() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fireApi
      .getAll()
      .then(setIncidents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Wildfire map</h1>
          <p>Circle size reflects fire intensity; color reflects current risk level.</p>
        </div>
      </div>

      {loading ? <div className="page-loading">Loading map…</div> : <FireMap incidents={incidents} height={620} />}

      <div className="legend">
        <span><i style={{ background: '#4CAF7D' }} /> Low</span>
        <span><i style={{ background: '#FFB627' }} /> Moderate</span>
        <span><i style={{ background: '#FF6B35' }} /> High</span>
        <span><i style={{ background: '#E23E2D' }} /> Extreme</span>
      </div>
    </div>
  );
}
